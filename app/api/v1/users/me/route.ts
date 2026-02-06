import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/server';
import { authenticateRequest } from '@/lib/api/middleware';
import { successResponse, errorResponse } from '@/lib/api/response';
import type { UserUpdateRequest, UserResponse, UserDetailsDto } from '@/lib/api/types';

export async function GET(request: NextRequest) {
  try {
    const auth = await authenticateRequest(request);
    if (!auth) {
      return NextResponse.json(
        errorResponse('Unauthorized', 'UNAUTHORIZED'),
        { status: 401 }
      );
    }

    // 사용자 정보 조회
    const { data: user, error: userError } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('id', auth.userId)
      .single();

    if (userError || !user) {
      return NextResponse.json(
        errorResponse('User not found', 'NOT_FOUND'),
        { status: 404 }
      );
    }

    // user_details 조회
    const { data: userDetails } = await supabaseAdmin
      .from('user_details')
      .select('*')
      .eq('user_id', auth.userId)
      .single();

    let userDetailsDto: UserDetailsDto | undefined;
    if (userDetails) {
      userDetailsDto = {
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
    }

    const userResponse: UserResponse = {
      id: user.id,
      email: user.email,
      nickname: user.nickname,
      onboardingCompleted: user.onboarding_completed,
      userDetails: userDetailsDto,
    };

    return NextResponse.json(successResponse(userResponse));
  } catch (error) {
    console.error('Get user info error:', error);
    return NextResponse.json(
      errorResponse('Internal server error', 'INTERNAL_ERROR'),
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const auth = await authenticateRequest(request);
    if (!auth) {
      return NextResponse.json(
        errorResponse('Unauthorized', 'UNAUTHORIZED'),
        { status: 401 }
      );
    }

    const body: UserUpdateRequest = await request.json();

    // users 테이블 업데이트 (nickname)
    if (body.nickname !== undefined) {
      const { error: userUpdateError } = await supabaseAdmin
        .from('users')
        .update({ nickname: body.nickname })
        .eq('id', auth.userId);

      if (userUpdateError) {
        console.error('Update user error:', userUpdateError);
        return NextResponse.json(
          errorResponse('Failed to update user', 'DATABASE_ERROR'),
          { status: 500 }
        );
      }
    }

    // user_details 업데이트
    const { data: existingDetails } = await supabaseAdmin
      .from('user_details')
      .select('id')
      .eq('user_id', auth.userId)
      .single();

    if (existingDetails) {
      const updateData: any = {};
      if (body.job !== undefined) updateData.job = body.job;
      if (body.background !== undefined) updateData.background = body.background;
      if (body.companySizes !== undefined) {
        updateData.company_sizes = body.companySizes.length > 0 ? body.companySizes.join(',') : null;
      }
      if (body.skills !== undefined) {
        updateData.skills = body.skills.length > 0 ? body.skills.join(',') : null;
      }
      if (body.projects !== undefined) updateData.projects = body.projects;
      if (body.intern !== undefined) updateData.intern = body.intern;
      if (body.bootcamp !== undefined) updateData.bootcamp = body.bootcamp;
      if (body.awards !== undefined) updateData.awards = body.awards;

      if (Object.keys(updateData).length > 0) {
        const { error: updateError } = await supabaseAdmin
          .from('user_details')
          .update(updateData)
          .eq('id', existingDetails.id);

        if (updateError) {
          console.error('Update user_details error:', updateError);
          return NextResponse.json(
            errorResponse('Failed to update user details', 'DATABASE_ERROR'),
            { status: 500 }
          );
        }

        // 스펙 수정 시 분석 결과 무효화 (analysis_history에서 해당 사용자의 기록 삭제)
        await supabaseAdmin
          .from('analysis_history')
          .delete()
          .eq('user_id', auth.userId);
      }
    }

    return NextResponse.json(successResponse(null, 'User updated successfully'));
  } catch (error) {
    console.error('Update user error:', error);
    return NextResponse.json(
      errorResponse('Internal server error', 'INTERNAL_ERROR'),
      { status: 500 }
    );
  }
}
