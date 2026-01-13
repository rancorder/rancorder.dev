'use client';

import { useState } from 'react';

export default function TestPage() {
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const testEmail = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/send-download-link', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'your-email@example.com',  // ← あなたのメールアドレスに変更
          download_url: 'https://example.com/test.pdf',
          file_name: 'Test.pdf'
        })
      });
      
      const data = await response.json();
      setResult(JSON.stringify(data, null, 2));
    } catch (error: any) {
      setResult('Error: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '50px', maxWidth: '800px', margin: '0 auto' }}>
      <h1>📧 メール送信テスト</h1>
      <p>ボタンをクリックしてメール送信をテストします</p>
      
      <button 
        onClick={testEmail}
        disabled={loading}
        style={{
          padding: '15px 30px',
          fontSize: '16px',
          background: loading ? '#ccc' : '#667eea',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          cursor: loading ? 'not-allowed' : 'pointer',
          marginTop: '20px'
        }}
      >
        {loading ? '送信中...' : '✉️ テストメール送信'}
      </button>
      
      {result && (
        <div>
          <h2 style={{ marginTop: '30px' }}>結果:</h2>
          <pre style={{
            marginTop: '10px',
            padding: '20px',
            background: '#f5f5f5',
            borderRadius: '8px',
            overflow: 'auto',
            fontSize: '14px'
          }}>
            {result}
          </pre>
        </div>
      )}
    </div>
  );
}
