import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/server';
import { hashPassword } from '@/lib/auth/password';
import { generateAccessToken, generateRefreshToken } from '@/lib/auth/jwt';
import { successResponse, errorResponse } from '@/lib/api/response';
import type { AuthRequest, AuthResponse } from '@/lib/api/types';

export async function POST(request: NextRequest) {
  try {
    const body: AuthRequest = await request.json();
    const { email, password, nickname } = body;

    if (!email || !password) {
      return NextResponse.json(
        errorResponse('Email and password are required', 'VALIDATION_ERROR'),
        { status: 400 }
      );
    }

    // 이메일 중복 확인 (PGRST002 에러는 스키마 캐시 문제이므로 재시도)
    let existingUser = null;
    let checkError = null;
    
    for (let i = 0; i < 3; i++) {
      const result = await supabaseAdmin
        .from('users')
        .select('id')
        .eq('email', email)
        .maybeSingle();
      
      existingUser = result.data;
      checkError = result.error;
      
      // PGRST002 에러가 아니거나, 재시도 횟수를 초과한 경우 루프 종료
      if (!checkError || checkError.code !== 'PGRST002' || i === 2) {
        break;
      }
      
      // 재시도 전 대기
      await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
    }

    // 에러가 있고, 에러가 "not found"가 아닌 경우에만 에러 처리
    if (checkError && checkError.code !== 'PGRST116' && checkError.code !== 'PGRST002') {
      console.error('Email check error:', checkError);
      return NextResponse.json(
        errorResponse(`Failed to check email: ${checkError.message}`, 'DATABASE_ERROR'),
        { status: 500 }
      );
    }

    if (existingUser) {
      return NextResponse.json(
        errorResponse('Email already exists', 'DUPLICATE_EMAIL'),
        { status: 409 }
      );
    }

    // 비밀번호 해싱
    const hashedPassword = await hashPassword(password);

    // 사용자 생성 (PGRST002 에러 재시도)
    let newUser = null;
    let userError = null;
    
    for (let i = 0; i < 3; i++) {
      const result = await supabaseAdmin
        .from('users')
        .insert({
          email,
          password: hashedPassword,
          nickname: nickname || email.split('@')[0],
          onboarding_completed: false,
        })
        .select()
        .single();
      
      newUser = result.data;
      userError = result.error;
      
      // 성공하거나, PGRST002 에러가 아니거나, 재시도 횟수를 초과한 경우 루프 종료
      if (!userError || userError.code !== 'PGRST002' || i === 2) {
        break;
      }
      
      // 재시도 전 대기
      await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
    }

    if (userError || !newUser) {
      console.error('User creation error:', userError);
      return NextResponse.json(
        errorResponse(`Failed to create user: ${userError?.message || 'Unknown error'}`, 'DATABASE_ERROR'),
        { status: 500 }
      );
    }

    // JWT 토큰 생성
    const accessToken = generateAccessToken({
      userId: newUser.id,
      email: newUser.email,
    });
    const refreshToken = generateRefreshToken({
      userId: newUser.id,
      email: newUser.email,
    });

    const authResponse: AuthResponse = {
      userId: newUser.id,
      accessToken,
      refreshToken,
    };

    return NextResponse.json(successResponse(authResponse, 'Signup successful'));
  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json(
      errorResponse('Internal server error', 'INTERNAL_ERROR'),
      { status: 500 }
    );
  }
}
