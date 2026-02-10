'use client';

import { useState, FormEvent } from 'react';
import styles from './ContactForm.module.css';

interface ContactFormProps {
  language?: 'en' | 'ja';
  servicePreset?: string; // サービスページから来た場合は事前選択
}

export default function ContactForm({ language = 'en', servicePreset }: ContactFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    service: servicePreset || '',
    message: '',
  });
  
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const isJa = language === 'ja';

  const serviceOptions = isJa
    ? [
        '選択してください',
        'PoC→本番移行支援',
        'レガシーシステム刷新PM',
        '技術顧問（週1-2h）',
        '負荷試験・品質改善支援',
        'その他',
      ]
    : [
        'Please select',
        'PoC → Production Migration Support',
        'Legacy System Renewal PM',
        'Technical Advisory (1-2h/week)',
        'Load Testing & Quality Improvement',
        'Other',
      ];

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setMessage({
          type: 'success',
          text: isJa
            ? '✅ お問い合わせありがとうございます！1-2営業日以内にご返信いたします。'
            : '✅ Thank you! Your inquiry has been sent successfully. We\'ll respond within 1-2 business days.',
        });
        // フォームリセット
        setFormData({
          name: '',
          email: '',
          company: '',
          service: '',
          message: '',
        });
      } else {
        setMessage({
          type: 'error',
          text: isJa
            ? `❌ 送信に失敗しました: ${data.message}`
            : `❌ Failed to send: ${data.message}`,
        });
      }
    } catch (error) {
      setMessage({
        type: 'error',
        text: isJa
          ? '❌ ネットワークエラーが発生しました。もう一度お試しください。'
          : '❌ Network error. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <h3 className={styles.title}>
        {isJa ? '📧 お問い合わせ' : '📧 Contact Form'}
      </h3>
      <p className={styles.description}>
        {isJa
          ? 'プロジェクトの状況をお聞かせください。まずは状況の整理からでもお話しできます。'
          : 'Tell us about your project. We can start with just organizing the situation.'}
      </p>

      <form onSubmit={handleSubmit} className={styles.form}>
        {/* 名前 */}
        <div className={styles.field}>
          <label htmlFor="name" className={styles.label}>
            {isJa ? 'お名前' : 'Name'} <span className={styles.required}>*</span>
          </label>
          <input
            type="text"
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder={isJa ? '山田 太郎' : 'John Doe'}
            required
            disabled={loading}
            className={styles.input}
          />
        </div>

        {/* メールアドレス */}
        <div className={styles.field}>
          <label htmlFor="email" className={styles.label}>
            {isJa ? 'メールアドレス' : 'Email'} <span className={styles.required}>*</span>
          </label>
          <input
            type="email"
            id="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            placeholder={isJa ? 'your-email@example.com' : 'your-email@example.com'}
            required
            disabled={loading}
            className={styles.input}
          />
        </div>

        {/* 会社名（任意） */}
        <div className={styles.field}>
          <label htmlFor="company" className={styles.label}>
            {isJa ? '会社名' : 'Company'} {isJa ? '（任意）' : '(Optional)'}
          </label>
          <input
            type="text"
            id="company"
            value={formData.company}
            onChange={(e) => setFormData({ ...formData, company: e.target.value })}
            placeholder={isJa ? '株式会社〇〇' : 'Your Company Inc.'}
            disabled={loading}
            className={styles.input}
          />
        </div>

        {/* 興味のあるサービス */}
        <div className={styles.field}>
          <label htmlFor="service" className={styles.label}>
            {isJa ? '興味のあるサービス' : 'Service of Interest'} {isJa ? '（任意）' : '(Optional)'}
          </label>
          <select
            id="service"
            value={formData.service}
            onChange={(e) => setFormData({ ...formData, service: e.target.value })}
            disabled={loading}
            className={styles.select}
          >
            {serviceOptions.map((option, index) => (
              <option key={index} value={index === 0 ? '' : option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        {/* メッセージ */}
        <div className={styles.field}>
          <label htmlFor="message" className={styles.label}>
            {isJa ? 'メッセージ' : 'Message'} <span className={styles.required}>*</span>
          </label>
          <textarea
            id="message"
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            placeholder={
              isJa
                ? 'プロジェクトの状況、課題、期待することなどをざっくりお聞かせください。'
                : 'Tell us about your project, challenges, and expectations.'
            }
            required
            disabled={loading}
            rows={6}
            className={styles.textarea}
          />
        </div>

        {/* 送信ボタン */}
        <button type="submit" disabled={loading} className={styles.button}>
          {loading ? (
            <>
              <span className={styles.spinner}></span>
              {isJa ? '送信中...' : 'Sending...'}
            </>
          ) : (
            <>{isJa ? '送信する' : 'Send Message'}</>
          )}
        </button>
      </form>

      {/* メッセージ表示 */}
      {message && (
        <div className={`${styles.message} ${styles[message.type]}`}>
          {message.text}
        </div>
      )}
    </div>
  );
}
