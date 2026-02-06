import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/server';
import { authenticateRequest } from '@/lib/api/middleware';
import { analyzeUserRoute } from '@/lib/ai/gemini';
import { successResponse, errorResponse } from '@/lib/api/response';
import type { AnalysisResponse, UserDetailsDto, RouteResponse } from '@/lib/api/types';

export async function POST(request: NextRequest) {
  try {
    const auth = await authenticateRequest(request);
    if (!auth) {
      return NextResponse.json(
        errorResponse('Unauthorized', 'UNAUTHORIZED'),
        { status: 401 }
      );
    }

    // user_details 조회
    const { data: userDetails, error: userDetailsError } = await supabaseAdmin
      .from('user_details')
      .select('*')
      .eq('user_id', auth.userId)
      .single();

    if (userDetailsError || !userDetails) {
      return NextResponse.json(
        errorResponse('User details not found. Please complete onboarding first.', 'NOT_FOUND'),
        { status: 404 }
      );
    }

    // 모든 routes 조회
    const { data: routes, error: routesError } = await supabaseAdmin
      .from('routes')
      .select('*');

    if (routesError || !routes || routes.length === 0) {
      return NextResponse.json(
        errorResponse('No routes found', 'NOT_FOUND'),
        { status: 404 }
      );
    }

    // 각 route의 route_steps 조회
    const routeIds = routes.map((r) => r.id);
    const { data: routeSteps, error: stepsError } = await supabaseAdmin
      .from('route_steps')
      .select('*')
      .in('route_id', routeIds)
      .order('step_order', { ascending: true });

    if (stepsError) {
      console.error('Get route_steps error:', stepsError);
    }

    // RouteResponse 형식으로 변환
    const routeResponses: RouteResponse[] = routes.map((route) => {
      const steps = (routeSteps || [])
        .filter((step) => step.route_id === route.id)
        .map((step) => ({
          id: step.id,
          stepOrder: step.step_order,
          title: step.title,
          description: step.description || '',
          duration: step.duration || '',
          tips: step.tips || '',
        }))
        .sort((a, b) => a.stepOrder - b.stepOrder);

      return {
        id: route.id,
        job: route.job,
        background: route.background,
        finalCompanySize: route.final_company_size,
        skills: route.skills ? route.skills.split(',') : [],
        projects: route.projects,
        intern: route.intern ?? false,
        bootcamp: route.bootcamp ?? false,
        awards: route.awards ?? false,
        summary: route.summary || '',
        routeSteps: steps,
      };
    });

    // UserDetailsDto 형식으로 변환
    const userDetailsDto: UserDetailsDto = {
      id: userDetails.id,
      job: userDetails.job,
      background: userDetails.background,
      companySizes: userDetails.company_sizes ? userDetails.company_sizes.split(',') : [],
      skills: userDetails.skills ? userDetails.skills.split(',') : [],
      projects: userDetails.projects,
      intern: userDetails.intern ?? false,
      bootcamp: userDetails.bootcamp ?? false,
      awards: userDetails.awards ?? false,
    };

    // AI 분석 수행
    const analysisResult = await analyzeUserRoute(userDetailsDto, routeResponses);

    // analysis_history에 저장
    const { data: analysisHistory, error: historyError } = await supabaseAdmin
      .from('analysis_history')
      .insert({
        user_id: auth.userId,
        matched_route_id: analysisResult.matchedRouteId,
        similarity: analysisResult.similarity,
        reason: analysisResult.reason,
        strengths: JSON.stringify(analysisResult.strengths),
        weaknesses: JSON.stringify(analysisResult.weaknesses),
        recommendations: JSON.stringify(analysisResult.recommendations),
      })
      .select()
      .single();

    if (historyError || !analysisHistory) {
      console.error('Save analysis history error:', historyError);
      // 분석은 성공했지만 저장 실패한 경우에도 결과 반환
    }

    const analysisResponse: AnalysisResponse = {
      id: analysisHistory?.id || 0,
      matchedRouteId: analysisResult.matchedRouteId,
      similarity: analysisResult.similarity,
      reason: analysisResult.reason,
      strengths: analysisResult.strengths,
      weaknesses: analysisResult.weaknesses,
      recommendations: analysisResult.recommendations,
      createdAt: analysisHistory?.created_at || new Date().toISOString(),
    };

    return NextResponse.json(successResponse(analysisResponse, 'Analysis completed successfully'));
  } catch (error) {
    console.error('Analysis error:', error);
    return NextResponse.json(
      errorResponse(error instanceof Error ? error.message : 'Internal server error', 'INTERNAL_ERROR'),
      { status: 500 }
    );
  }
}
