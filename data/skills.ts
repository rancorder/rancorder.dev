// data/skills.ts - EY想定版（"Used for" 形式）

// ✅ 型定義をファイル内に追加
export interface SkillGroup {
  category: string;
  items: string[];
}

export const skills: SkillGroup[] = [
  {
    category: 'Decision Design & Project Execution',
    items: [
      'Used for: Designing requirements that can be incrementally solidified under ambiguity (phased confirmation, ambiguity tolerance)',
      'Used for: Multi-stakeholder coordination and consensus building (5+ companies in parallel)',
      'Used for: Priority and scope design (trade-off judgment under constraints)',
      'Used for: Designing quality/risk/change impact (3-tier evaluation methodology)',
      'Used for: Multi-product management (maximum 21 SKUs simultaneous launch)',
    ],
  },
  {
    category: 'Product & Operations Perspective',
    items: [
      'Used for: Phase-appropriate judgment (0→1 / Enhancement / Operations phase design)',
      'Used for: Trade-off design (Speed × Quality × Cost)',
      'Used for: Failure impact scope limitation and recovery design',
      'Used for: Production-focused design reviews (operational burden and failure cost evaluation)',
      'Used for: Balancing manufacturing precision (0.01mm) × technology speed (24/7 operations)',
    ],
  },
  {
    category: 'Technical Skills (Understanding for Decision-Making)',
    items: [
      'Used for: Designing failure-tolerant automation systems (Python/FastAPI)',
      'Used for: Building controllers that remove human decision points (systemd/cron)',
      'Used for: Operating long-running production jobs (11+ months continuous operation)',
      'Used for: Production-grade monitoring and observability (Prometheus/Grafana)',
      'Used for: Quality assurance through automated testing (pytest/k6)',
    ],
  },
];
