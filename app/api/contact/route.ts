/**
 * Contact Form API - Send inquiry via email
 * Using Resend for email delivery
 */
import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

interface ContactRequestBody {
  name: string;
  email: string;
  company?: string;
  message: string;
  service?: string; // どのサービスに興味があるか
}

interface ContactResponse {
  success: boolean;
  message: string;
}

/**
 * GET - Health check
 */
export async function GET(request: NextRequest): Promise<NextResponse> {
  return NextResponse.json(
    {
      status: 'ok',
      message: 'Contact API is running',
      service: 'Resend',
    },
    { status: 200 }
  );
}

/**
 * POST - Send contact inquiry
 */
export async function POST(request: NextRequest): Promise<NextResponse<ContactResponse>> {
  try {
    // 環境変数確認
    if (!process.env.RESEND_API_KEY) {
      console.error('[ERROR] RESEND_API_KEY is not set');
      return NextResponse.json(
        {
          success: false,
          message: 'Email service not configured',
        },
        { status: 500 }
      );
    }

    // リクエストボディ取得
    const body: ContactRequestBody = await request.json();
    const { name, email, company, message, service } = body;

    // バリデーション
    if (!name || !email || !message) {
      return NextResponse.json(
        {
          success: false,
          message: 'Name, email, and message are required',
        },
        { status: 400 }
      );
    }

    // メールアドレス形式チェック
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        {
          success: false,
          message: 'Invalid email format',
        },
        { status: 400 }
      );
    }

    // HTMLメールコンテンツ（あなた宛）
    const htmlToYou = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.6;
            color: #333;
            margin: 0;
            padding: 0;
            background-color: #f4f4f4;
          }
          .container {
            max-width: 600px;
            margin: 40px auto;
            background: white;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          }
          .header {
            background: linear-gradient(135deg, #7c3aed 0%, #22c55e 100%);
            color: white;
            padding: 40px 30px;
            text-align: center;
          }
          .header h1 {
            margin: 0;
            font-size: 24px;
            font-weight: 700;
          }
          .content {
            padding: 40px 30px;
          }
          .field {
            margin-bottom: 20px;
            padding-bottom: 20px;
            border-bottom: 1px solid #eee;
          }
          .field:last-child {
            border-bottom: none;
          }
          .label {
            font-weight: 600;
            color: #7c3aed;
            margin-bottom: 8px;
            display: block;
          }
          .value {
            color: #333;
            white-space: pre-wrap;
          }
          .footer {
            text-align: center;
            padding: 30px;
            color: #999;
            font-size: 12px;
            border-top: 1px solid #eee;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>📧 新しいお問い合わせ</h1>
          </div>
          <div class="content">
            <div class="field">
              <span class="label">名前</span>
              <div class="value">${name}</div>
            </div>
            
            <div class="field">
              <span class="label">メールアドレス</span>
              <div class="value">${email}</div>
            </div>
            
            ${company ? `
            <div class="field">
              <span class="label">会社名</span>
              <div class="value">${company}</div>
            </div>
            ` : ''}
            
            ${service ? `
            <div class="field">
              <span class="label">興味のあるサービス</span>
              <div class="value">${service}</div>
            </div>
            ` : ''}
            
            <div class="field">
              <span class="label">メッセージ</span>
              <div class="value">${message}</div>
            </div>
          </div>
          <div class="footer">
            <p>© ${new Date().getFullYear()} rancorder.dev - お問い合わせ通知</p>
          </div>
        </div>
      </body>
      </html>
    `;

    // 自動返信メール（相手宛）
    const htmlToSender = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.6;
            color: #333;
            margin: 0;
            padding: 0;
            background-color: #f4f4f4;
          }
          .container {
            max-width: 600px;
            margin: 40px auto;
            background: white;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          }
          .header {
            background: linear-gradient(135deg, #7c3aed 0%, #22c55e 100%);
            color: white;
            padding: 40px 30px;
            text-align: center;
          }
          .content {
            padding: 40px 30px;
          }
          .content p {
            margin: 0 0 15px;
          }
          .footer {
            text-align: center;
            padding: 30px;
            color: #999;
            font-size: 12px;
            border-top: 1px solid #eee;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Thank you for contacting us</h1>
          </div>
          <div class="content">
            <p>Dear ${name},</p>
            
            <p>Thank you for reaching out. We've received your inquiry and will respond within 1-2 business days.</p>
            
            <p>In the meantime, feel free to check out our <a href="https://rancorder.vercel.app/blog" style="color: #7c3aed;">blog</a> for insights on enterprise PM, decision-making design, and production systems.</p>
            
            <p>Best regards,<br>
            rancorder.dev</p>
          </div>
          <div class="footer">
            <p>© ${new Date().getFullYear()} rancorder.dev</p>
          </div>
        </div>
      </body>
      </html>
    `;

    // 1. あなた宛にメール送信
    const { data: dataToYou, error: errorToYou } = await resend.emails.send({
      from: 'Contact Form <onboarding@resend.dev>',
      to: 'xzengbu@gmail.com', // あなたのメールアドレス
      reply_to: email, // 返信先を問い合わせ者のメールに設定
      subject: `【お問い合わせ】${name}様より - ${service || '一般問い合わせ'}`,
      html: htmlToYou,
    });

    if (errorToYou) {
      throw new Error(errorToYou.message);
    }

    // 2. 問い合わせ者に自動返信
    const { data: dataToSender, error: errorToSender } = await resend.emails.send({
      from: 'rancorder.dev <onboarding@resend.dev>',
      to: email,
      subject: 'Thank you for contacting us - rancorder.dev',
      html: htmlToSender,
    });

    if (errorToSender) {
      console.warn('[WARN] Auto-reply failed:', errorToSender.message);
      // 自動返信失敗しても、本体は成功扱い
    }

    console.log(`[SUCCESS] Contact received from: ${email} | Service: ${service || 'N/A'} | Your ID: ${dataToYou?.id}`);

    return NextResponse.json(
      {
        success: true,
        message: 'Thank you! Your inquiry has been sent successfully.',
      },
      { status: 200 }
    );

  } catch (error: any) {
    console.error('[ERROR] Failed to send contact email:', {
      error: error.message,
      name: error.name,
    });

    return NextResponse.json(
      {
        success: false,
        message: `Failed to send inquiry: ${error.message}`,
      },
      { status: 500 }
    );
  }
}

/**
 * OPTIONS - CORS preflight
 */
export async function OPTIONS(request: NextRequest): Promise<NextResponse> {
  return NextResponse.json(
    {},
    {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    }
  );
}
