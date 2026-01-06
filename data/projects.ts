// data/projects.ts - EY想定版（代表3ケース + Additional）
import { Project } from '@/types';

export const projects: Project[] = [
  // ========================================
  // 🔥 TOP 3 REPRESENTATIVE CASES（EY向け最適化）
  // ========================================
  
  // Case 1: Manufacturing B2B System (PoC → Production)
  {
    id: 'case1-manufacturing-b2b',
    title: 'Case 1: Manufacturing B2B System (21 SKUs, Simultaneous Launch)',
    description:
      'Large-scale product launch PM for enterprise medical device manufacturer. Managed 21 SKUs simultaneously under extremely high failure cost constraints. Balanced delivery deadlines with quality assurance through requirement definition, quality baseline design, and multi-department coordination.',
    category: 'enterprise',
    technologies: [
      'Requirement Definition',
      'Stakeholder Coordination',
      'Quality Baseline Design',
      'Risk Management',
      'Schedule Management',
    ],
    highlights: [
      'Managed 21 SKUs simultaneously (largest scale in 17-year career)',
      'Reduced specification change requests by 30% (initial risk mitigation through priority design)',
      'Maintained 100% on-time delivery rate for 17 months (zero delays)',
    ],
    pmDecisions: [
      'Adopted "Phased Confirmation" for requirements to suppress initial failure costs (ambiguity tolerance)',
      'Categorized quality baseline into 3 levels (Required/Recommended/Ideal) to localize impact scope',
      'Unified coordination window across 5 stakeholder companies, accelerating decision-making speed by 3x',
      'Evaluated change impact in 3 tiers (Immediate/1-week/1-month), clarifying acceptance criteria',
    ],
  },

  // Case 2: Automation Platform with Integrated Monitoring
  {
    id: 'case2-automation-platform',
    title: 'Case 2: Automation Platform (54 Sites, 24/7 Operation for 11 Months)',
    description:
      'Integrated scraping platform collecting new product listings from 54 EC sites with differential detection and notifications. Designed with production operation in mind, prioritizing failure recovery and impact isolation. Achieved annual labor cost reduction of over 1,000 hours.',
    category: 'product',
    technologies: ['Python', 'SQLite(WAL)', 'systemd', 'cron', 'VPS', 'Chatwork API'],
    highlights: [
      '54 sites integrated / 96 monitored URLs / 100K+ monthly processing',
      '99.8% uptime / <0.1% error rate for 11 months continuous operation',
      '1,000+ hours annual labor reduction (equivalent to ¥720K monthly cost savings)',
    ],
    pmDecisions: [
      'Adopted "loose coupling, staged expansion" assuming requirement volatility (minimized per-site addition cost)',
      'Prioritized recovery speed and operational burden; chose SQLite(WAL) for robust operation (avoided adding complexity)',
      'Localized failure impact scope in architecture to control failure costs',
      'Defined quality baseline as "tolerate false negatives, minimize false positives" rather than "perfect detection"',
    ],
    links: {
      github: 'https://github.com/rancorder/master_controller',
    },
  },

  // Case 3: Multi-stakeholder Enterprise Project (Decision Deadlock Resolution)
  {
    id: 'case3-multi-stakeholder',
    title: 'Case 3: Multi-stakeholder Home Appliance Product Specification PM',
    description:
      'Specification definition PM for home appliance product involving multiple departments. Incrementally solidified ambiguous requirements, analyzed change impact, and facilitated consensus. Minimized cost increase from design changes while maintaining stakeholder satisfaction.',
    category: 'enterprise',
    technologies: [
      'Specification Definition',
      'Consensus Building',
      'Scope Management',
      'Change Impact Analysis',
      'Cross-department Coordination',
    ],
    highlights: [
      'Zero delays from specification changes for 14 months (thorough change management)',
      'Stakeholder satisfaction 85%+ (consistently achieved in quarterly evaluations)',
      '60% reduction in design change costs (impact analysis and priority design)',
    ],
    pmDecisions: [
      'Classified ambiguous requirements into "Decide Now" vs "Defer Later" (eliminated wasteful discussions)',
      '3-tier change impact evaluation (Minor/Moderate/Critical), clarifying acceptance criteria',
      'Abolished weekly reviews, narrowing decision points to 5 occasions to accelerate decision-making',
      'Managed scope in 3 tiers (Must/Important/Nice-to-have), reducing coordination costs',
    ],
  },

  // ========================================
  // 💎 ADDITIONAL CASES（折りたたみ推奨）
  // ========================================

  // Additional: Bicycle Parts Mass Production Transition
  {
    id: 'additional-bicycle-quality',
    title: 'Additional: Bicycle Parts Manufacturer Mass Production Transition PM',
    description:
      'Handled mass production transition phase for high-precision parts. Conducted quality design, inspection standard definition, and supply chain coordination. Defined "acceptable failure quality" rather than "perfect quality," designing cost-quality trade-offs.',
    category: 'enterprise',
    technologies: [
      'Quality Design',
      'Mass Production Transition',
      'Inspection Standard Definition',
      'Supply Chain Coordination',
      'Cost Optimization',
    ],
    highlights: [
      'Maintained <0.01% defect rate for 12 consecutive months (far exceeding 0.05% target)',
      '40% reduction in mass production transition period (6 months → 3.6 months)',
      '50% reduction in inspection labor (efficiency through baseline optimization)',
    ],
    pmDecisions: [
      'Defined "acceptable failure rate" instead of "zero defects" (realistic quality design)',
      'Categorized inspection baseline into 3 tiers (Full/Sampling/Omit) to balance cost and quality',
      'Reduced supplier coordination frequency from weekly to monthly (eliminated wasteful coordination)',
      'Classified quality issue impact scope into 3 tiers (Immediate Stop/Continue Monitoring/Tolerate)',
    ],
  },

  // Additional: Load Testing & Performance Validation
  {
    id: 'additional-load-testing',
    title: 'Additional: VPS Load Testing (k6 Performance Validation under 4GB Constraint)',
    description:
      'Performance validation project testing parallel processing limits under VPS 4GB memory constraint. Used k6 to systematically verify theoretical vs actual capacity for 43-site concurrent scraping operations. Achieved stable operation at 95.1% memory utilization.',
    category: 'infrastructure',
    technologies: ['k6', 'FastAPI', 'Docker', 'VPS', 'Performance Testing'],
    highlights: [
      'Validated 43-site parallel processing limit through staged load testing',
      'Achieved stable operation at 95.1% memory utilization (4GB constraint)',
      'Established baseline metrics for production capacity planning',
    ],
    pmDecisions: [
      'Prioritized "real-world constraint validation" over theoretical performance maximization',
      'Designed load test scenarios to match actual production usage patterns',
      'Established monitoring thresholds based on empirical failure points',
    ],
    links: {
      github: 'https://github.com/rancorder/scraping-load-test',
    },
  },

  // Additional: Quality Improvement (pytest introduction)
  {
    id: 'additional-pytest-hardening',
    title: 'Additional: Quality Improvement (Retrofitting pytest for Safe Change Enablement)',
    description:
      'Retrofitted pytest to code without tests (~1,400 lines). Designed minimum-cost, maximum-impact tests to reduce changeability and regression risk. Incrementally elevated quality definition from "works" to "safely changeable."',
    category: 'technical',
    technologies: ['Python', 'pytest', 'mypy(strict)', 'coverage'],
    highlights: [
      '30 tests implemented / 26% coverage',
      'Improved type safety (mypy strict mode applied)',
      'Regression bug detection time reduced from days → minutes',
    ],
    pmDecisions: [
      'Prioritized high-risk paths rather than full coverage for "minimum effective net"',
      'Incrementally elevated quality definition from "works" to "safely changeable"',
      'Set coverage target at 30% instead of 100% (practical quality baseline)',
    ],
    links: {
      github: 'https://github.com/rancorder/pytest',
    },
  },

  // Additional: Reliability Engineering Demo
  {
    id: 'additional-reliability-engineering',
    title: 'Additional: Reliability Engineering Demo (Production-grade Multi-service System)',
    description:
      'Multi-service demonstration system using FastAPI, Redis, PostgreSQL. Validated production-grade reliability through load testing, monitoring, and fault injection. Design philosophy prioritizes "observability" over raw performance metrics.',
    category: 'infrastructure',
    technologies: ['FastAPI', 'Redis', 'PostgreSQL', 'k6', 'Prometheus', 'Grafana', 'Docker'],
    highlights: [
      'Average response 1.69ms (P95: 2.37ms)',
      '13,060 requests processed / 0% error rate',
      'Fault injection recovery procedure validation completed',
    ],
    pmDecisions: [
      'Prioritized "observability" over "performance" in architecture design',
      'Validated failure assumptions through fault injection rather than perfect uptime pursuit',
      'Classified monitoring metrics into 3 tiers (Immediate Response/Next-day Check/Record Only)',
    ],
    links: {
      github: 'https://github.com/rancorder/reliability-engineering-demo',
    },
  },

  // Additional: Reservation System PoC
  {
    id: 'additional-reservation-system',
    title: 'Additional: Reservation System PoC (Rapid Enterprise-grade Implementation)',
    description:
      'Full-featured reservation system implemented in 1 hour. Production-level implementation including inventory management, double-booking prevention, and Redis caching. Demonstrates ability to rapidly deliver enterprise-grade solutions under time constraints.',
    category: 'technical',
    technologies: ['FastAPI', 'Redis', 'PostgreSQL', 'Docker'],
    highlights: [
      'Implemented in 1 hour (full feature set)',
      'Production-grade inventory management and concurrency control',
      'Enterprise-level architecture with caching layer',
    ],
    pmDecisions: [
      'Prioritized "critical path features" over comprehensive functionality (time-boxed delivery)',
      'Designed for production from the start rather than treating as throwaway PoC',
      'Applied proven patterns (Redis caching, DB transactions) to minimize implementation risk',
    ],
    links: {
      github: 'https://github.com/rancorder/reservation-system-poc',
    },
  },
];
