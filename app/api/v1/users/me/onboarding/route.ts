import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/server';
import { authenticateRequest } from '@/lib/api/middleware';
import { successResponse, errorResponse } from '@/lib/api/response';
import type { UserOnboardingRequest } from '@/lib/api/types';

export async function POST(request: NextRequest) {
  try {
    const auth = await authenticateRequest(request);
    if (!auth) {
      return NextResponse.json(
        errorResponse('Unauthorized', 'UNAUTHORIZED'),
        { status: 401 }
      );
    }

    const body: UserOnboardingRequest = await request.json();
    const { job, background, companySizes, skills, projects, intern, bootcamp, awards } = body;

    if (!job || !background || projects === undefined) {
      return NextResponse.json(
        errorResponse('job, background, and projects are required', 'VALIDATION_ERROR'),
        { status: 400 }
      );
    }

    // user_details 생성 또는 업데이트
    const { data: existingDetails } = await supabaseAdmin
      .from('user_details')
      .select('id')
      .eq('user_id', auth.userId)
      .single();

    const userDetailsData = {
      user_id: auth.userId,
      job,
      background,
      company_sizes: companySizes ? companySizes.join(',') : null,
      skills: skills ? skills.join(',') : null,
      projects,
      intern: intern ?? false,
      bootcamp: bootcamp ?? false,
      awards: awards ?? false,
    };

    if (existingDetails) {
      // 업데이트
      const { error: updateError } = await supabaseAdmin
        .from('user_details')
        .update(userDetailsData)
        .eq('id', existingDetails.id);

      if (updateError) {
        console.error('Update user_details error:', updateError);
        return NextResponse.json(
          errorResponse('Failed to update user details', 'DATABASE_ERROR'),
          { status: 500 }
        );
      }
    } else {
      // 생성
      const { error: insertError } = await supabaseAdmin
        .from('user_details')
        .insert(userDetailsData);

      if (insertError) {
        console.error('Insert user_details error:', insertError);
        return NextResponse.json(
          errorResponse('Failed to create user details', 'DATABASE_ERROR'),
          { status: 500 }
        );
      }
    }

    // onboarding_completed 업데이트
    const { error: userUpdateError } = await supabaseAdmin
      .from('users')
      .update({ onboarding_completed: true })
      .eq('id', auth.userId);

    if (userUpdateError) {
      console.error('Update user error:', userUpdateError);
      return NextResponse.json(
        errorResponse('Failed to update user', 'DATABASE_ERROR'),
        { status: 500 }
      );
    }

    return NextResponse.json(successResponse(null, 'Onboarding completed successfully'));
  } catch (error) {
    console.error('Onboarding error:', error);
    return NextResponse.json(
      errorResponse('Internal server error', 'INTERNAL_ERROR'),
      { status: 500 }
    );
  }
}
