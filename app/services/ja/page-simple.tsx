'use client';

import { motion } from 'framer-motion';

/**
 * エラーが出る場合の簡易版サービスページ
 * ContactFormを使わず、直接メールリンクを表示
 * 
 * 使い方: ContactFormのインポートでエラーが出る場合、
 * このファイルを一時的に使って動作確認
 */

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

export default function ServicesPageJaSimple() {
  const services = [
    {
      id: 'poc-to-production',
      icon: '🚀',
      title: 'PoC→本番移行支援',
      tagline: '「動いた」を「出せる」に変える',
      challenge: [
        'PoCは成功したが本番に進められない',
        '運用設計・責任設計が曖昧で判断できない',
        '技術負債が怖くて手が出せない',
      ],
      deliverables: [
        '本番移行判断チェックリスト',
        '運用手順書（障害対応含む）',
        'アーキテクチャレビュー・リスク評価',
      ],
      timeline: '2-4週間',
      pricing: '要相談',
    },
    {
      id: 'legacy-renewal',
      icon: '🔧',
      title: 'レガシーシステム刷新PM',
      tagline: '「触れない」を「安全に変えられる」に',
      challenge: [
        '古いシステムを触れる人がいない',
        'リプレイス計画が何度も頓挫している',
        '段階的移行の設計ができない',
      ],
      deliverables: [
        '移行ロードマップ',
        'リスク管理計画',
        '技術選定・アーキテクチャ設計',
      ],
      timeline: '1-3ヶ月',
      pricing: '要相談',
    },
    {
      id: 'technical-advisory',
      icon: '💡',
      title: '技術顧問（週1-2h）',
      tagline: 'CTO・VPoEの意思決定支援',
      challenge: [
        'Go/No-Goの判断ができない',
        'チーム外の視点が欲しい',
        '技術戦略の壁打ち相手が欲しい',
      ],
      deliverables: [
        '週次での意思決定セッション',
        'アーキテクチャ・技術選定アドバイス',
        '本番運用設計支援',
      ],
      timeline: '月額契約（3-6ヶ月推奨）',
      pricing: '要相談',
    },
    {
      id: 'load-testing',
      icon: '⚡',
      title: '負荷試験・品質改善支援',
      tagline: '「たぶん大丈夫」を「証明済み」に',
      challenge: [
        'システムの限界値が分からない',
        '本番前に品質を担保できない',
        'テスト戦略を一から設計する必要がある',
      ],
      deliverables: [
        '負荷試験設計・実行（k6）',
        'テスト導入・品質ベースライン設定（pytest）',
        'パフォーマンス・ボトルネック分析・改善提案',
      ],
      timeline: '2-4週間',
      pricing: '要相談',
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
          <a href="/portfolio/ja" style={{ fontSize: '20px', fontWeight: 700, color: 'rgba(255, 255, 255, 0.92)' }}>
            H・M
          </a>
          <nav style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
            <a href="/portfolio/ja#projects" style={{ color: 'rgba(255, 255, 255, 0.68)' }}>
              実績
            </a>
            <a href="/blog" style={{ color: 'rgba(255, 255, 255, 0.68)' }}>
              ブログ
            </a>
            <a href="/services/en" style={{ color: '#7c3aed', fontWeight: 600 }}>
              EN
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
              IT × PM 領域で依頼できること
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
              サービス内容
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
              エンタープライズPM、意思決定設計、本番運用。「動く」を「出せる」に変える支援をします。
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
                    解決する課題：
                  </div>
                  <ul style={{ margin: 0, paddingLeft: '20px', color: 'rgba(255, 255, 255, 0.68)', fontSize: '14px', lineHeight: 1.8 }}>
                    {service.challenge.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <div style={{ fontSize: '13px', fontWeight: 600, color: 'rgba(255, 255, 255, 0.68)', marginBottom: '8px' }}>
                    成果物：
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
                  <span>期間: {service.timeline}</span>
                  <span>費用: {service.pricing}</span>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Contact Section - シンプル版（メールリンク直接） */}
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
              お問い合わせ
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
              プロジェクトの状況をお聞かせください。まずは状況の整理からでもお話しできます。
            </motion.p>

            {/* シンプルなメールボタン */}
            <motion.div variants={fadeUp} style={{ textAlign: 'center' }}>
              <a
                href="mailto:xzengbu@gmail.com?subject=お問い合わせ&body=お名前：%0D%0A会社名：%0D%0A興味のあるサービス：%0D%0Aメッセージ：%0D%0A"
                style={{
                  display: 'inline-block',
                  padding: '16px 40px',
                  background: 'linear-gradient(135deg, #7c3aed, #22c55e)',
                  color: 'white',
                  borderRadius: '12px',
                  fontSize: '16px',
                  fontWeight: 700,
                  textDecoration: 'none',
                  boxShadow: '0 4px 12px rgba(124, 58, 237, 0.3)',
                  transition: 'all 0.3s ease',
                }}
              >
                📧 メールで相談する
              </a>
              <p style={{ marginTop: '20px', fontSize: '14px', color: 'rgba(255, 255, 255, 0.55)' }}>
                xzengbu@gmail.com
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ padding: '40px 24px', textAlign: 'center', borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
        <div style={{ color: 'rgba(255, 255, 255, 0.55)', fontSize: '14px' }}>
          © {new Date().getFullYear()} H・M | <a href="/blog" style={{ color: '#7c3aed' }}>ブログ</a> |{' '}
          <a href="https://github.com/rancorder" target="_blank" rel="noreferrer" style={{ color: '#7c3aed' }}>
            GitHub
          </a>
        </div>
      </footer>
    </main>
  );
}
