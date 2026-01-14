/**
 * Newsletter Subscription API
 * Phase 1: Email collection with Supabase
 */
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

interface SubscribeRequest {
  email: string;
}

interface SubscribeResponse {
  success: boolean;
  message: string;
  error?: string;
}

/**
 * POST /api/newsletter/subscribe
 * メールアドレスを購読者リストに追加
 */
export async function POST(request: NextRequest): Promise<NextResponse<SubscribeResponse>> {
  try {
    // 環境変数確認
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_KEY) {
      console.error('[ERROR] Supabase environment variables not set');
      return NextResponse.json(
        {
          success: false,
          message: 'Service configuration error',
          error: 'ENV_NOT_SET',
        },
        { status: 500 }
      );
    }

    // リクエストボディ取得
    const body: SubscribeRequest = await request.json();
    const { email } = body;

    // バリデーション: メールアドレス必須
    if (!email) {
      return NextResponse.json(
        {
          success: false,
          message: 'Email address is required',
          error: 'MISSING_EMAIL',
        },
        { status: 400 }
      );
    }

    // バリデーション: メール形式チェック
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        {
          success: false,
          message: 'Invalid email format',
          error: 'INVALID_FORMAT',
        },
        { status: 400 }
      );
    }

    // メールアドレスを小文字に正規化
    const normalizedEmail = email.toLowerCase().trim();

    // 重複チェック
    const { data: existing, error: checkError } = await supabase
      .from('subscribers')
      .select('email, status')
      .eq('email', normalizedEmail)
      .single();

    if (checkError && checkError.code !== 'PGRST116') {
      // PGRST116 = Not Found（正常）
      console.error('[ERROR] Database check failed:', checkError);
      throw checkError;
    }

    // 既に登録済み
    if (existing) {
      if (existing.status === 'active') {
        return NextResponse.json(
          {
            success: false,
            message: 'This email is already subscribed',
            error: 'ALREADY_SUBSCRIBED',
          },
          { status: 409 }
        );
      } else {
        // 購読解除済みの場合は再登録
        const { error: updateError } = await supabase
          .from('subscribers')
          .update({ status: 'active' })
          .eq('email', normalizedEmail);

        if (updateError) {
          console.error('[ERROR] Re-subscription failed:', updateError);
          throw updateError;
        }

        console.log(`[SUCCESS] Re-subscribed: ${normalizedEmail}`);
        return NextResponse.json({
          success: true,
          message: 'Successfully re-subscribed to newsletter',
        });
      }
    }

    // 新規登録
    const { error: insertError } = await supabase
      .from('subscribers')
      .insert({
        email: normalizedEmail,
        status: 'active',
      });

    if (insertError) {
      console.error('[ERROR] Insert failed:', insertError);
      throw insertError;
    }

    console.log(`[SUCCESS] New subscriber: ${normalizedEmail}`);

    return NextResponse.json({
      success: true,
      message: 'Successfully subscribed to newsletter',
    });

  } catch (error: any) {
    console.error('[ERROR] Newsletter subscription failed:', {
      error: error.message,
      code: error.code,
      details: error.details,
    });

    return NextResponse.json(
      {
        success: false,
        message: 'Failed to subscribe. Please try again.',
        error: error.code || 'UNKNOWN_ERROR',
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/newsletter/subscribe
 * ヘルスチェック
 */
export async function GET(request: NextRequest): Promise<NextResponse> {
  return NextResponse.json({
    status: 'ok',
    message: 'Newsletter subscription API is running',
    service: 'Supabase',
  });
}

/**
 * GET /api/newsletter/subscribe
 * ヘルスチェック
 */
export async function GET(request: NextRequest): Promise<NextResponse> {
  return NextResponse.json({
    status: 'ok',
    message: 'Newsletter subscription API is running',
    service: 'Supabase',
  });
}

// Trigger rebuild
```

4. Commit message: `fix: trigger clean rebuild`
5. **Commit changes**
