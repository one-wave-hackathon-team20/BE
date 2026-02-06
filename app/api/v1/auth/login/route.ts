import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/server';
import { comparePassword } from '@/lib/auth/password';
import { generateAccessToken, generateRefreshToken } from '@/lib/auth/jwt';
import { successResponse, errorResponse } from '@/lib/api/response';
import type { AuthRequest, AuthResponse } from '@/lib/api/types';

export async function POST(request: NextRequest) {
  try {
    const body: AuthRequest = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        errorResponse('Email and password are required', 'VALIDATION_ERROR'),
        { status: 400 }
      );
    }

    // 사용자 조회
    const { data: user, error: userError } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (userError || !user) {
      return NextResponse.json(
        errorResponse('Invalid email or password', 'AUTH_ERROR'),
        { status: 401 }
      );
    }

    // 비밀번호 확인
    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json(
        errorResponse('Invalid email or password', 'AUTH_ERROR'),
        { status: 401 }
      );
    }

    // JWT 토큰 생성
    const accessToken = generateAccessToken({
      userId: user.id,
      email: user.email,
    });
    const refreshToken = generateRefreshToken({
      userId: user.id,
      email: user.email,
    });

    const authResponse: AuthResponse = {
      userId: user.id,
      accessToken,
      refreshToken,
    };

    return NextResponse.json(successResponse(authResponse, 'Login successful'));
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      errorResponse('Internal server error', 'INTERNAL_ERROR'),
      { status: 500 }
    );
  }
}
