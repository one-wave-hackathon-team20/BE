import { GoogleGenerativeAI } from '@google/generative-ai';
import type { UserDetailsDto, RouteResponse } from '../api/types';

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  console.warn('GEMINI_API_KEY is not set. AI analysis will not work.');
}

const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

/**
 * Lists available models for the API key using REST API
 */
async function listAvailableModels(): Promise<string[]> {
  if (!genAI || !apiKey) {
    return [];
  }
  
  try {
    // Use v1 API instead of v1beta for better compatibility
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1/models?key=${apiKey}`
    );
    
    if (!response.ok) {
      // Try v1beta as fallback
      const v1betaResponse = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`
      );
      
      if (!v1betaResponse.ok) {
        console.warn('Failed to list models from both v1 and v1beta');
        return [];
      }
      
      const data = await v1betaResponse.json();
      const modelNames = (data.models || [])
        .filter((model: any) => 
          model.supportedGenerationMethods?.includes('generateContent')
        )
        .map((model: any) => {
          const name = model.name || '';
          return name.replace('models/', '');
        })
        .filter((name: string) => name && name.startsWith('gemini'));
      
      return modelNames;
    }
    
    const data = await response.json();
    const modelNames = (data.models || [])
      .filter((model: any) => 
        model.supportedGenerationMethods?.includes('generateContent')
      )
      .map((model: any) => {
        const name = model.name || '';
        return name.replace('models/', '');
      })
      .filter((name: string) => name && name.startsWith('gemini'));
    
    return modelNames;
  } catch (error) {
    console.warn('Error listing models:', error);
    return [];
  }
}

export interface AnalysisResult {
  matchedRouteId: number;
  similarity: number;
  reason: string;
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
}

export async function analyzeUserRoute(
  userDetails: UserDetailsDto,
  routes: RouteResponse[]
): Promise<AnalysisResult> {
  if (!genAI) {
    throw new Error('Gemini API is not configured. Please set GEMINI_API_KEY environment variable.');
  }
  
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not set. Please configure your API key.');
  }

  // 프롬프트 생성
  const prompt = `당신은 IT 채용 데이터 분석 전문가입니다.

사용자의 스펙:
- 직무: ${userDetails.job}
- 전공 여부: ${userDetails.background}
- 선호 기업 규모: ${userDetails.companySizes.join(', ') || '없음'}
- 보유 기술 스택: ${userDetails.skills.join(', ') || '없음'}
- 프로젝트 수: ${userDetails.projects}
- 인턴 경험: ${userDetails.intern ? '있음' : '없음'}
- 부트캠프 수료: ${userDetails.bootcamp ? '있음' : '없음'}
- 수상 경력: ${userDetails.awards ? '있음' : '없음'}

합격자 사례 데이터:
${routes.map((route, idx) => `
[사례 ${idx + 1}]
- ID: ${route.id}
- 직무: ${route.job}
- 전공 여부: ${route.background}
- 최종 합격 기업 규모: ${route.finalCompanySize}
- 보유 스택: ${route.skills.join(', ')}
- 프로젝트 수: ${route.projects}
- 인턴: ${route.intern ? '있음' : '없음'}
- 부트캠프: ${route.bootcamp ? '있음' : '없음'}
- 수상: ${route.awards ? '있음' : '없음'}
- 요약: ${route.summary}
`).join('\n')}

위 사용자 스펙과 가장 유사한 합격자 사례를 찾아서 다음 JSON 형식으로 응답해주세요:
{
  "matchedRouteId": 숫자,
  "similarity": 0-100 사이의 유사도 점수,
  "reason": "매칭 이유 설명",
  "strengths": ["강점1", "강점2", ...],
  "weaknesses": ["약점1", "약점2", ...],
  "recommendations": ["제안1", "제안2", ...]
}

반드시 JSON 형식으로만 응답하고, 다른 설명은 포함하지 마세요.`;

  // 먼저 사용 가능한 모델 목록을 가져옵니다 (비동기이지만 실패해도 계속 진행)
  let availableModels: string[] = [];
  try {
    availableModels = await Promise.race([
      listAvailableModels(),
      new Promise<string[]>((resolve) => setTimeout(() => resolve([]), 2000)) // 2초 타임아웃
    ]);
    if (availableModels.length > 0) {
      console.log('Available models from API:', availableModels);
    }
  } catch (error) {
    console.warn('Could not fetch available models, using defaults:', error);
  }
  
  // 우선순위에 따라 모델 목록 구성
  // 가장 일반적으로 사용 가능한 모델부터 시도
  const defaultModels = [
    'gemini-1.5-flash',        // 가장 널리 사용 가능한 모델
    'gemini-1.5-pro',          // Pro 버전
    'gemini-1.5-flash-latest', // Latest 버전
    'gemini-1.5-pro-latest',   // Pro Latest 버전
    'gemini-pro',              // 레거시 (fallback)
  ];
  
  // 사용 가능한 모델이 있으면 그것을 우선 사용, 없으면 기본 목록 사용
  const modelsToTry = availableModels.length > 0 
    ? [...new Set([...availableModels, ...defaultModels])]
    : defaultModels;
  
  console.log('Models to try:', modelsToTry);
  
  let lastError: Error | null = null;

  for (const modelName of modelsToTry) {
    try {
      const model = genAI.getGenerativeModel({ model: modelName });
      console.log(`Attempting to use model: ${modelName}`);
      
      // 실제 API 호출 시도
      const result = await model.generateContent(prompt);
      const response = result.response;
      const text = response.text();
      
      console.log(`Successfully used model: ${modelName}`);
      
      // JSON 추출 (마크다운 코드 블록 제거)
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('Failed to parse AI response');
      }
      
      const analysis = JSON.parse(jsonMatch[0]) as AnalysisResult;
      
      // 유효성 검사
      if (!analysis.matchedRouteId || typeof analysis.similarity !== 'number') {
        throw new Error('Invalid AI response format');
      }
      
      return analysis;
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      console.warn(`Model ${modelName} failed:`, error instanceof Error ? error.message : String(error));
      // 다음 모델 시도
      continue;
    }
  }

  // 모든 모델 시도 실패
  const errorMessage = `No available Gemini model found. 
Tried models: ${modelsToTry.join(', ')}
Last error: ${lastError?.message || 'Unknown error'}

Possible solutions:
1. Verify your GEMINI_API_KEY has access to Gemini models in Google Cloud Console
2. Check that the API key has the "Generative Language API" enabled
3. Ensure your API key has not been restricted to specific models
4. Try updating @google/generative-ai package: npm install @google/generative-ai@latest
5. Visit https://ai.google.dev/gemini-api/docs/models to see available models`;

  throw new Error(errorMessage);
}
