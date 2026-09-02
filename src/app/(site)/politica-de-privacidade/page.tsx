import type { Metadata } from 'next'

export const revalidate = 3600

export const metadata: Metadata = {
  title: 'Privacy Policy — Patrícia Viana Law Firm',
  description: 'How Patrícia Viana Law Firm collects, uses, and protects your personal data, in line with the EU General Data Protection Regulation (GDPR).',
  alternates: { canonical: '/politica-de-privacidade' },
}

const lastUpdated = 'July 20, 2026'

export default function PrivacyPolicyPage() {
  return (
    <section className="section section--white" style={{ paddingTop: 120 }}>
      <div className="container" style={{ maxWidth: 760 }}>
        <div className="section-tag">Legal</div>
        <h1 style={{ fontFamily: 'Marcellus, serif', fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)', color: 'var(--navy)', lineHeight: 1.2, marginBottom: 16 }}>
          Privacy Policy
        </h1>
        <p style={{ fontSize: 13, color: 'var(--text)', marginBottom: 40 }}>Last updated: {lastUpdated}</p>

        <div className="post-content">
          <p>
            Patrícia Viana Law Firm (&quot;we&quot;, &quot;us&quot;, &quot;our&quot;) is committed to protecting your
            privacy and personal data in accordance with Regulation (EU) 2016/679 (the General Data Protection
            Regulation, &quot;GDPR&quot;) and applicable Portuguese data protection law. This Privacy Policy explains
            what personal data we collect through vianaconsultancy.com (the &quot;Site&quot;), why we collect it, how
            we use it, and what rights you have.
          </p>

          <h2>1. Who we are</h2>
          <p>
            The data controller responsible for your personal data is:
          </p>
          <p>
            <strong>Patrícia Viana Law Firm</strong><br />
            Av. António Augusto Aguiar, 24, 1st floor right, 1050-016, Lisbon, Portugal<br />
            Email: <a href="mailto:enquiries@vianaconsultancy.com">enquiries@vianaconsultancy.com</a><br />
            Phone: <a href="tel:+351960174940">+351 960 174 940</a>
          </p>

          <h2>2. What personal data we collect</h2>
          <p><strong>Data you provide directly.</strong> When you use our contact form, we collect your name, phone number, email address, subject, and message content.</p>
          <p><strong>Data collected automatically.</strong> When you browse the Site, and only if you consent via our cookie banner, we use Google Analytics 4 to collect usage data such as pages visited, time spent on the Site, approximate location, device and browser type, and referral source.</p>

          <h2>3. Why we use your data and our legal basis</h2>
          <ul>
            <li><strong>Responding to your enquiry</strong> — to answer your message and provide information about our legal services. Legal basis: your consent in submitting the form, and our legitimate interest in responding to prospective clients (Article 6(1)(a) and (f) GDPR), as well as steps taken at your request prior to entering into a service agreement (Article 6(1)(b) GDPR).</li>
            <li><strong>Website analytics</strong> — to understand how visitors use the Site and improve it. Legal basis: your consent (Article 6(1)(a) GDPR), given when you click &quot;Accept&quot; on our cookie banner. Analytics cookies are not set unless and until you consent.</li>
          </ul>

          <h2>4. Cookies</h2>
          <p>
            The Site uses only strictly necessary cookies by default (for example, to remember your cookie
            preference). Analytics cookies from Google Analytics are only activated after you accept them via the
            cookie banner shown on your first visit. You can withdraw your consent at any time by clearing your
            browser&apos;s cookies for this Site or by contacting us at the email address above.
          </p>

          <h2>5. Who we share your data with</h2>
          <p>Contact form submissions are processed through our workflow-automation provider solely to route your enquiry to our team; the message content is not shared beyond that purpose. Where you have consented to analytics, usage data is processed by Google Ireland Limited (Google Analytics). Our website is hosted by Netlify, Inc., which processes data as necessary to operate the Site. We do not sell your personal data to third parties.</p>

          <h2>6. International data transfers</h2>
          <p>Some of our service providers (such as Google) may process data outside the European Economic Area. Where this occurs, we rely on appropriate safeguards recognized under GDPR, such as Standard Contractual Clauses or an adequacy framework such as the EU-U.S. Data Privacy Framework, where applicable to that provider.</p>

          <h2>7. How long we keep your data</h2>
          <p>We retain contact form submissions only for as long as necessary to respond to and manage your enquiry, and afterwards for as long as required to comply with our professional and legal obligations as a Portuguese law firm. Analytics data is retained according to Google Analytics&apos; standard retention settings.</p>

          <h2>8. Your rights under the GDPR</h2>
          <p>Subject to the conditions set out in the GDPR, you have the right to:</p>
          <ul>
            <li>Request access to the personal data we hold about you;</li>
            <li>Request rectification of inaccurate or incomplete data;</li>
            <li>Request erasure of your data;</li>
            <li>Request restriction of, or object to, our processing of your data;</li>
            <li>Request portability of your data;</li>
            <li>Withdraw consent at any time, without affecting the lawfulness of processing carried out before withdrawal; and</li>
            <li>Lodge a complaint with the Portuguese supervisory authority, the Comissão Nacional de Proteção de Dados (CNPD), or with the supervisory authority of your own EU member state.</li>
          </ul>
          <p>To exercise any of these rights, contact us at <a href="mailto:enquiries@vianaconsultancy.com">enquiries@vianaconsultancy.com</a>.</p>

          <h2>9. Children&apos;s privacy</h2>
          <p>The Site is not directed at children, and we do not knowingly collect personal data from anyone under 16 years of age.</p>

          <h2>10. Security</h2>
          <p>We take reasonable technical and organizational measures to protect your personal data against unauthorized access, loss, or misuse.</p>

          <h2>11. Changes to this policy</h2>
          <p>We may update this Privacy Policy from time to time. The &quot;Last updated&quot; date at the top of this page reflects the most recent revision.</p>

          <h2>12. Contact us</h2>
          <p>If you have any questions about this Privacy Policy or how we handle your personal data, please contact us at <a href="mailto:enquiries@vianaconsultancy.com">enquiries@vianaconsultancy.com</a> or <a href="tel:+351960174940">+351 960 174 940</a>.</p>
        </div>
      </div>
    </section>
  )
}
