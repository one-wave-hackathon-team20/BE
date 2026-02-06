import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/server';
import { successResponse, errorResponse } from '@/lib/api/response';
import type { RouteResponse, RouteStepResponse } from '@/lib/api/types';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    const resolvedParams = await Promise.resolve(params);
    const routeId = parseInt(resolvedParams.id);

    if (isNaN(routeId)) {
      return NextResponse.json(
        errorResponse('Invalid route ID', 'VALIDATION_ERROR'),
        { status: 400 }
      );
    }

    // route 조회
    const { data: route, error: routeError } = await supabaseAdmin
      .from('routes')
      .select('*')
      .eq('id', routeId)
      .single();

    if (routeError || !route) {
      return NextResponse.json(
        errorResponse('Route not found', 'NOT_FOUND'),
        { status: 404 }
      );
    }

    // route_steps 조회
    const { data: routeSteps, error: stepsError } = await supabaseAdmin
      .from('route_steps')
      .select('*')
      .eq('route_id', routeId)
      .order('step_order', { ascending: true });

    if (stepsError) {
      console.error('Get route_steps error:', stepsError);
      return NextResponse.json(
        errorResponse('Failed to fetch route steps', 'DATABASE_ERROR'),
        { status: 500 }
      );
    }

    const steps: RouteStepResponse[] = (routeSteps || []).map((step) => ({
      id: step.id,
      stepOrder: step.step_order,
      title: step.title,
      description: step.description || '',
      duration: step.duration || '',
      tips: step.tips || '',
    }));

    const routeResponse: RouteResponse = {
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

    return NextResponse.json(successResponse(routeResponse));
  } catch (error) {
    console.error('Get route by ID error:', error);
    return NextResponse.json(
      errorResponse('Internal server error', 'INTERNAL_ERROR'),
      { status: 500 }
    );
  }
}
