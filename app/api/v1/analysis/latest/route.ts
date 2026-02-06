import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/server';
import { authenticateRequest } from '@/lib/api/middleware';
import { successResponse, errorResponse } from '@/lib/api/response';
import type { AnalysisResponse } from '@/lib/api/types';

export async function GET(request: NextRequest) {
  try {
    const auth = await authenticateRequest(request);
    if (!auth) {
      return NextResponse.json(
        errorResponse('Unauthorized', 'UNAUTHORIZED'),
        { status: 401 }
      );
    }

    // 가장 최근 분석 결과 조회
    const { data: analysisHistory, error: historyError } = await supabaseAdmin
      .from('analysis_history')
      .select('*')
      .eq('user_id', auth.userId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (historyError || !analysisHistory) {
      return NextResponse.json(
        errorResponse('No analysis history found', 'NOT_FOUND'),
        { status: 404 }
      );
    }

    const analysisResponse: AnalysisResponse = {
      id: analysisHistory.id,
      matchedRouteId: analysisHistory.matched_route_id,
      similarity: analysisHistory.similarity,
      reason: analysisHistory.reason || '',
      strengths: analysisHistory.strengths ? JSON.parse(analysisHistory.strengths) : [],
      weaknesses: analysisHistory.weaknesses ? JSON.parse(analysisHistory.weaknesses) : [],
      recommendations: analysisHistory.recommendations ? JSON.parse(analysisHistory.recommendations) : [],
      createdAt: analysisHistory.created_at,
    };

    return NextResponse.json(successResponse(analysisResponse));
  } catch (error) {
    console.error('Get latest analysis error:', error);
    return NextResponse.json(
      errorResponse('Internal server error', 'INTERNAL_ERROR'),
      { status: 500 }
    );
  }
}
