import type { Metadata } from 'next'
import ContactForm from './_components/ContactForm'

export const metadata: Metadata = {
  title: 'Contact — Patrícia Viana Law Firm',
  description: 'Get in touch with Patrícia Viana Law Firm to book a consultation on Portuguese immigration, residency permits, and visas.',
  alternates: { canonical: '/contact' },
  openGraph: {
    title: 'Contact — Patrícia Viana Law Firm',
    description: 'Get in touch with Patrícia Viana Law Firm to book a consultation on Portuguese immigration, residency permits, and visas.',
    url: '/contact',
  },
}

export default function ContactPage() {
  return <ContactForm />
}
