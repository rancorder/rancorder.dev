'use client';

import { useState } from 'react';

export default function ShareButton({ url, score, status }: { url: string; score: number; status: string }) {
  const [copied, setCopied] = useState(false);

  async function share() {
    const text = `PoC Survival Test — Production Readiness ${score}% / ${status}`;
    try {
      if (navigator.share) {
        await navigator.share({ title: 'PoC Survival Test', text, url });
        return;
      }
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      // User cancelled share sheet.
    }
  }

  return <button type="button" className="result-share" onClick={share}>
    {copied ? 'URL COPIED ✓' : 'SHARE RESULT ↗'}
  </button>;
}
