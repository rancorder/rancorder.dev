'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import dynamic from 'next/dynamic';

// Dynamic import で遅延読み込み（エラーハンドリング付き）
const ContactForm = dynamic(() => import('@/app/components/ContactForm'), {
  loading: () => <div style={{ textAlign: 'center', padding: '40px' }}>Loading...</div>,
  ssr: false,
});

// アニメーション設定（既存ページから流用）
const stagger = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
};

export default function ServicesPageEn() {
  const [selectedService, setSelectedService] = useState<string>('');

  const services = [
    {
      id: 'poc-to-production',
      icon: '🚀',
      title: 'PoC → Production Migration Support',
      tagline: 'Turn "it works" into "it ships"',
      challenge: [
        'PoC succeeded but can\'t move to production',
        'Operational design and responsibility design unclear',
        'Fear of technical debt prevents action',
      ],
      deliverables: [
        'Production migration decision checklist',
        'Operational procedures (including incident response)',
        'Architecture review and risk assessment',
      ],
      timeline: '2-4 weeks',
      pricing: 'Consultation required',
    },
    {
      id: 'legacy-renewal',
      icon: '🔧',
      title: 'Legacy System Renewal PM',
      tagline: 'From "can\'t touch" to "safe to change"',
      challenge: [
        'No one can touch the old system',
        'Replacement plans repeatedly fail',
        'Can\'t design phased migration',
      ],
      deliverables: [
        'Migration roadmap',
        'Risk management plan',
        'Technology selection & architecture design',
      ],
      timeline: '1-3 months',
      pricing: 'Consultation required',
    },
    {
      id: 'technical-advisory',
      icon: '💡',
      title: 'Technical Advisory (1-2h/week)',
      tagline: 'Decision support for CTOs and VPoEs',
      challenge: [
        'Can\'t determine go/no-go decisions',
        'Need perspective from outside the team',
        'Want a sounding board for technical strategy',
      ],
      deliverables: [
        'Weekly decision-making sessions',
        'Architecture and technology selection advice',
        'Production operation design support',
      ],
      timeline: 'Monthly contract (3-6 months recommended)',
      pricing: 'Consultation required',
    },
    {
      id: 'load-testing',
      icon: '⚡',
      title: 'Load Testing & Quality Improvement',
      tagline: 'From "probably works" to "proven capacity"',
      challenge: [
        'Don\'t know the system\'s capacity limits',
        'Can\'t ensure quality before production',
        'Need to design test strategy from scratch',
      ],
      deliverables: [
        'Load test design and execution (k6)',
        'Test introduction and quality baseline (pytest)',
        'Performance bottleneck analysis and improvement proposals',
      ],
      timeline: '2-4 weeks',
      pricing: 'Consultation required',
    },
  ];

  return (
    <main style={{ background: '#05070f', minHeight: '100vh' }}>
      {/* Background Gradient */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: -1,
          background:
            'radial-gradient(1200px 800px at 15% 10%, rgba(124, 58, 237, 0.22), transparent 60%), radial-gradient(900px 700px at 80% 25%, rgba(34, 197, 94, 0.16), transparent 55%)',
        }}
      />

      {/* Navigation */}
      <header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 20,
          background: 'rgba(5, 7, 15, 0.9)',
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        }}
      >
        <div
          style={{
            maxWidth: '1200px',
            margin: '0 auto',
            padding: '16px 24px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <a href="/portfolio/en" style={{ fontSize: '20px', fontWeight: 700, color: 'rgba(255, 255, 255, 0.92)' }}>
            H・M
          </a>
          <nav style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
            <a href="/portfolio/en#projects" style={{ color: 'rgba(255, 255, 255, 0.68)' }}>
              Projects
            </a>
            <a href="/blog" style={{ color: 'rgba(255, 255, 255, 0.68)' }}>
              Blog
            </a>
            <a href="/services/ja" style={{ color: '#7c3aed', fontWeight: 600 }}>
              JA
            </a>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section style={{ padding: '80px 24px 60px', textAlign: 'center' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <motion.div initial="hidden" animate="visible" variants={stagger}>
            <motion.p
              variants={fadeUp}
              style={{
                color: '#7c3aed',
                fontWeight: 700,
                fontSize: '14px',
                textTransform: 'uppercase',
                letterSpacing: '1.5px',
                marginBottom: '16px',
              }}
            >
              Services for IT × PM
            </motion.p>

            <motion.h1
              variants={fadeUp}
              style={{
                fontSize: 'clamp(32px, 5vw, 56px)',
                fontWeight: 800,
                lineHeight: 1.2,
                marginBottom: '24px',
                background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.92), rgba(255, 255, 255, 0.68))',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              What You Can Request
            </motion.h1>

            <motion.p
              variants={fadeUp}
              style={{
                fontSize: '18px',
                lineHeight: 1.7,
                color: 'rgba(255, 255, 255, 0.68)',
                maxWidth: '700px',
                margin: '0 auto',
              }}
            >
              Enterprise PM, decision-making design, production operations. We support the transition from "working" to
              "production-ready."
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Services Grid */}
      <section style={{ padding: '40px 24px 80px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            variants={stagger}
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '32px',
            }}
          >
            {services.map((service) => (
              <motion.div
                key={service.id}
                variants={fadeUp}
                whileHover={{ y: -8, scale: 1.02 }}
                style={{
                  background: 'rgba(255, 255, 255, 0.06)',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  borderRadius: '16px',
                  padding: '32px',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer',
                }}
                onClick={() => {
                  setSelectedService(service.title);
                  document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>{service.icon}</div>
                <h3 style={{ fontSize: '22px', fontWeight: 700, marginBottom: '8px', color: 'rgba(255, 255, 255, 0.92)' }}>
                  {service.title}
                </h3>
                <p style={{ fontSize: '14px', color: '#7c3aed', fontWeight: 600, marginBottom: '20px' }}>
                  {service.tagline}
                </p>

                <div style={{ marginBottom: '20px' }}>
                  <div style={{ fontSize: '13px', fontWeight: 600, color: 'rgba(255, 255, 255, 0.68)', marginBottom: '8px' }}>
                    Challenges We Solve:
                  </div>
                  <ul style={{ margin: 0, paddingLeft: '20px', color: 'rgba(255, 255, 255, 0.68)', fontSize: '14px', lineHeight: 1.8 }}>
                    {service.challenge.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <div style={{ fontSize: '13px', fontWeight: 600, color: 'rgba(255, 255, 255, 0.68)', marginBottom: '8px' }}>
                    Deliverables:
                  </div>
                  <ul style={{ margin: 0, paddingLeft: '20px', color: 'rgba(255, 255, 255, 0.68)', fontSize: '14px', lineHeight: 1.8 }}>
                    {service.deliverables.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                </div>

                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    paddingTop: '16px',
                    borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                    fontSize: '13px',
                    color: 'rgba(255, 255, 255, 0.55)',
                  }}
                >
                  <span>Timeline: {service.timeline}</span>
                  <span>Pricing: {service.pricing}</span>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Contact Form */}
      <section id="contact" style={{ padding: '80px 24px', background: 'rgba(15, 23, 42, 0.3)' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }} variants={stagger}>
            <motion.h2
              variants={fadeUp}
              style={{
                fontSize: 'clamp(28px, 4vw, 42px)',
                fontWeight: 800,
                textAlign: 'center',
                marginBottom: '16px',
                color: 'rgba(255, 255, 255, 0.92)',
              }}
            >
              Get in Touch
            </motion.h2>
            <motion.p
              variants={fadeUp}
              style={{
                textAlign: 'center',
                fontSize: '16px',
                color: 'rgba(255, 255, 255, 0.68)',
                marginBottom: '40px',
              }}
            >
              Let's discuss your project. We can start with just organizing the situation.
            </motion.p>

            <motion.div variants={fadeUp}>
              <ContactForm language="en" servicePreset={selectedService} />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ padding: '40px 24px', textAlign: 'center', borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
        <div style={{ color: 'rgba(255, 255, 255, 0.55)', fontSize: '14px' }}>
          © {new Date().getFullYear()} H・M | <a href="/blog" style={{ color: '#7c3aed' }}>Blog</a> |{' '}
          <a href="https://github.com/rancorder" target="_blank" rel="noreferrer" style={{ color: '#7c3aed' }}>
            GitHub
          </a>
        </div>
      </footer>
    </main>
  );
}
