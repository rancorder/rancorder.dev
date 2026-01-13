'use client';

import { useState, FormEvent } from 'react';
import styles from './DownloadLinkForm.module.css';

interface DownloadLinkFormProps {
  downloadUrl: string;
  fileName?: string;
}

export default function DownloadLinkForm({ downloadUrl, fileName }: DownloadLinkFormProps) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const response = await fetch('/api/send-download-link', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          download_url: downloadUrl,
          file_name: fileName,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setMessage({
          type: 'success',
          text: `✅ Email sent successfully to ${email}!`,
        });
        setEmail('');
      } else {
        setMessage({
          type: 'error',
          text: `❌ Failed to send email: ${data.message}`,
        });
      }
    } catch (error) {
      setMessage({
        type: 'error',
        text: '❌ Network error. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <h3 className={styles.title}>📧 Get Download Link via Email</h3>
      <p className={styles.description}>
        Enter your email address to receive the download link for {fileName || 'this file'}.
      </p>

      <form onSubmit={handleSubmit} className={styles.form}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your-email@example.com"
          required
          disabled={loading}
          className={styles.input}
        />

        <button type="submit" disabled={loading} className={styles.button}>
          {loading ? (
            <>
              <span className={styles.spinner}></span>
              Sending...
            </>
          ) : (
            'Send Download Link'
          )}
        </button>
      </form>

      {message && (
        <div className={`${styles.message} ${styles[message.type]}`}>
          {message.text}
        </div>
      )}
    </div>
  );
}
