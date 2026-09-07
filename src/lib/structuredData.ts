import type { Post } from '@/lib/posts'

const baseUrl = 'https://vianaconsultancy.com'

export function organizationJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'LegalService',
    name: 'Patrícia Viana Law Firm',
    url: baseUrl,
    logo: `${baseUrl}/images/logo.png`,
    image: `${baseUrl}/images/hero-banner.webp`,
    telephone: '+351960174940',
    email: 'enquiries@vianaconsultancy.com',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Av. António Augusto Aguiar, 24, 1st floor right',
      postalCode: '1050-016',
      addressLocality: 'Lisbon',
      addressCountry: 'PT',
    },
    sameAs: [
      'https://www.facebook.com/profile.php?id=100087269040601',
      'https://www.instagram.com/patricia_viana_lawyer/',
    ],
  }
}

export function articleJsonLd(post: Post) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.excerpt,
    datePublished: post.date,
    dateModified: post.date,
    author: {
      '@type': 'Person',
      name: post.author,
    },
    publisher: {
      '@type': 'Organization',
      name: 'Patrícia Viana Law Firm',
      logo: {
        '@type': 'ImageObject',
        url: `${baseUrl}/images/logo.png`,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${baseUrl}/blog/${post.slug}`,
    },
  }
}

type FaqItem = { question: string; answer: string }

/**
 * Scans raw MDX for <FAQItem q="..">answer</FAQItem> blocks (the pattern used
 * by src/components/blog/FAQ.tsx) to build an optional FAQPage schema.
 */
export function extractFaqItems(content: string): FaqItem[] {
  const items: FaqItem[] = []
  const regex = /<FAQItem\s+q=["']([^"']+)["']\s*>([\s\S]*?)<\/FAQItem>/g
  let match: RegExpExecArray | null
  while ((match = regex.exec(content)) !== null) {
    const answer = match[2]
      .replace(/<[^>]+>/g, ' ')
      .replace(/[#*_`]/g, '')
      .replace(/\s+/g, ' ')
      .trim()
    if (answer) items.push({ question: match[1], answer })
  }
  return items
}

export function faqPageJsonLd(items: FaqItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map(item => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  }
}
