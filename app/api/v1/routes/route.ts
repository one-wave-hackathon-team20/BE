import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/server';
import { successResponse, errorResponse } from '@/lib/api/response';
import type { RouteResponse, RouteStepResponse, Job, Background } from '@/lib/api/types';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const job = searchParams.get('job') as Job | null;
    const background = searchParams.get('background') as Background | null;

    // 필터링 쿼리 구성
    let query = supabaseAdmin.from('routes').select('*');

    if (job) {
      query = query.eq('job', job);
    }
    if (background) {
      query = query.eq('background', background);
    }

    const { data: routes, error: routesError } = await query;

    if (routesError) {
      console.error('Get routes error:', routesError);
      return NextResponse.json(
        errorResponse('Failed to fetch routes', 'DATABASE_ERROR'),
        { status: 500 }
      );
    }

    if (!routes || routes.length === 0) {
      return NextResponse.json(successResponse([]));
    }

    // 각 route에 대한 route_steps 조회
    const routeIds = routes.map((r) => r.id);
    const { data: routeSteps, error: stepsError } = await supabaseAdmin
      .from('route_steps')
      .select('*')
      .in('route_id', routeIds)
      .order('step_order', { ascending: true });

    if (stepsError) {
      console.error('Get route_steps error:', stepsError);
      return NextResponse.json(
        errorResponse('Failed to fetch route steps', 'DATABASE_ERROR'),
        { status: 500 }
      );
    }

    // routes와 route_steps 결합
    const routeResponses: RouteResponse[] = routes.map((route) => {
      const steps: RouteStepResponse[] = (routeSteps || [])
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

    return NextResponse.json(successResponse(routeResponses));
  } catch (error) {
    console.error('Get routes error:', error);
    return NextResponse.json(
      errorResponse('Internal server error', 'INTERNAL_ERROR'),
      { status: 500 }
    );
  }
}
