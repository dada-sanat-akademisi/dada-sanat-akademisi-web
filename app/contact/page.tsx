import { Metadata } from 'next';
import { generateMetadata as generateSEOMetadata } from '@/lib/seo/metadata';
import { StructuredData } from '@/components/seo/StructuredData';
import type { BreadcrumbItem } from '@/components/seo/StructuredData';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export const metadata: Metadata = generateSEOMetadata({
  title: 'İletişim',
  description: 'DADA Sanat Akademisi iletişim bilgileri. Sorularınız için bize ulaşın.',
  canonicalUrl: '/contact',
  keywords: ['iletişim', 'sanat akademisi iletişim', 'dada sanat akademisi'],
});

export default function ContactPage() {
  const breadcrumbs: BreadcrumbItem[] = [
    { name: 'Ana Sayfa', url: '/' },
    { name: 'İletişim', url: '/contact' },
  ];

  return (
    <div className="min-h-screen bg-ivory">
      <StructuredData type="breadcrumb" data={breadcrumbs} />

      {/* Page Header */}
      <section className="py-20 md:py-32 px-6">
        <div className="container mx-auto max-w-4xl">
          <h1 className="text-5xl md:text-6xl font-serif font-medium mb-6 text-center text-charcoal">
            İletişim
          </h1>
          <p className="text-xl text-charcoal/70 text-center max-w-2xl mx-auto">
            Soruların mı var? Merak ettiklerin mi? Bize ulaş, konuşalım.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <article className="container mx-auto max-w-4xl px-6 pb-24">
        <div className="prose prose-lg max-w-none">
          <div className="space-y-8 text-charcoal/80 leading-relaxed">
            <div className="space-y-6">
              <p>
                DADA'ya gelmek, bir kursa kaydolmak, eğitim yaklaşımımız hakkında daha
                fazla bilgi almak istiyorsan—seni dinlemek isteriz.
              </p>

              <p>
                Form doldurmak istemiyorsan, doğrudan e-posta gönderebilir veya telefon
                edebilirsin. Resmi bir süreç yok; sadece konuşmak, tanışmak, birlikte
                karar vermek var.
              </p>

              <div className="mt-12 space-y-6">
                <div>
                  <h2 className="text-2xl font-serif font-medium text-charcoal mb-4">
                    E-posta
                  </h2>
                  <p className="text-charcoal/70">
                    <a
                      href="mailto:info@dadasanatakademisi.com"
                      className="text-gold hover:text-gold-100 underline underline-offset-2"
                    >
                      info@dadasanatakademisi.com
                    </a>
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl font-serif font-medium text-charcoal mb-4">
                    Telefon
                  </h2>
                  <p className="text-charcoal/70">
                    <a
                      href="tel:+902121234567"
                      className="text-gold hover:text-gold-100 underline underline-offset-2"
                    >
                      +90 (212) 123 45 67
                    </a>
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl font-serif font-medium text-charcoal mb-4">
                    Adres
                  </h2>
                  <p className="text-charcoal/70">
                    İstanbul, Türkiye
                    <br />
                    Detaylı adres bilgisi için lütfen iletişime geçin.
                  </p>
                </div>
              </div>

              <div className="mt-12 pt-8 border-t border-charcoal/10">
                <p className="mb-6">
                  Başvuru formunu doldurmak istersen, aşağıdaki butona tıklayabilirsin.
                </p>
                <Button asChild size="lg">
                  <Link href="/apply">Başvuru Formu</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </article>
    </div>
  );
}

