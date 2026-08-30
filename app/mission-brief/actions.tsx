'use client';

import { useState } from 'react';

export default function MissionBriefActions({ mailto, brief }: { mailto: string; brief: string }) {
  const [copied,setCopied] = useState(false);

  async function copy(){
    await navigator.clipboard.writeText(brief);
    setCopied(true);
    window.setTimeout(()=>setCopied(false),1600);
  }

  return <div className="mission-brief-actions">
    <a href={mailto}>EMAIL THIS MISSION →</a>
    <button type="button" onClick={copy}>{copied?'BRIEF COPIED ✓':'COPY MISSION BRIEF'}</button>
  </div>;
}
