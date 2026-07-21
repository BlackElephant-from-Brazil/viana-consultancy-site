import type { Metadata } from 'next'

export const revalidate = 3600

export const metadata: Metadata = {
  title: 'Terms & Conditions — Patrícia Viana Law Firm',
  description: 'The terms and conditions governing your use of the Patrícia Viana Law Firm website.',
  alternates: { canonical: '/terms-conditions' },
}

const lastUpdated = 'July 20, 2026'

export default function TermsConditionsPage() {
  return (
    <section className="section section--white" style={{ paddingTop: 120 }}>
      <div className="container" style={{ maxWidth: 760 }}>
        <div className="section-tag">Legal</div>
        <h1 style={{ fontFamily: 'Marcellus, serif', fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)', color: 'var(--navy)', lineHeight: 1.2, marginBottom: 16 }}>
          Terms &amp; Conditions
        </h1>
        <p style={{ fontSize: 13, color: 'var(--text)', marginBottom: 40 }}>Last updated: {lastUpdated}</p>

        <div className="post-content">
          <p>
            These Terms &amp; Conditions (&quot;Terms&quot;) govern your use of vianaconsultancy.com (the
            &quot;Site&quot;), operated by Patrícia Viana Law Firm (&quot;we&quot;, &quot;us&quot;, &quot;our&quot;). By
            accessing or using the Site, you agree to these Terms. If you do not agree, please do not use the Site.
          </p>

          <h2>1. No attorney-client relationship</h2>
          <p>
            The content published on this Site, including blog articles, is provided for general informational
            purposes only and does not constitute legal advice. Reading or interacting with this Site does not
            create an attorney-client relationship between you and Patrícia Viana Law Firm. An attorney-client
            relationship is only formed once we have expressly agreed to represent you, typically through a signed
            engagement letter.
          </p>

          <h2>2. No guaranteed outcomes</h2>
          <p>
            Immigration, tax, and litigation matters depend on the specific facts of each case and on the decisions
            of third-party authorities and courts. Nothing on this Site should be understood as a promise, warranty,
            or guarantee of any particular outcome in any legal matter.
          </p>

          <h2>3. Intellectual property</h2>
          <p>
            The text, graphics, logos, and other content on this Site are the property of Patrícia Viana Law Firm or
            its licensors and are protected by copyright and other intellectual property laws. You may view and
            share content from the Site for personal, non-commercial purposes, provided you do not modify it and you
            credit the source.
          </p>

          <h2>4. Use of the contact form</h2>
          <p>
            When you submit the contact form, you agree to provide accurate information and not to use the form for
            any unlawful, abusive, or fraudulent purpose. Submitting the form does not, by itself, create any
            contractual or professional obligation on our part.
          </p>

          <h2>5. Third-party links</h2>
          <p>
            The Site may contain links to third-party websites, including trusted partners such as Alttavia
            Relocation, for your convenience. We are not responsible for the content, accuracy, or practices of any
            third-party website, and linking to it does not imply endorsement of everything on that site.
          </p>

          <h2>6. Limitation of liability</h2>
          <p>
            To the fullest extent permitted by applicable law, Patrícia Viana Law Firm shall not be liable for any
            indirect, incidental, or consequential damages arising from your use of, or inability to use, the Site.
          </p>

          <h2>7. Governing law</h2>
          <p>
            These Terms are governed by the laws of Portugal. Any dispute arising from these Terms or your use of
            the Site shall be subject to the exclusive jurisdiction of the courts of Portugal.
          </p>

          <h2>8. Changes to these Terms</h2>
          <p>
            We may update these Terms from time to time. The &quot;Last updated&quot; date at the top of this page
            reflects the most recent revision. Continued use of the Site after changes take effect constitutes
            acceptance of the revised Terms.
          </p>

          <h2>9. Contact us</h2>
          <p>
            If you have any questions about these Terms, please contact us at{' '}
            <a href="mailto:enquiries@vianaconsultancy.com">enquiries@vianaconsultancy.com</a> or{' '}
            <a href="tel:+351960174940">+351 960 174 940</a>.
          </p>
        </div>
      </div>
    </section>
  )
}
