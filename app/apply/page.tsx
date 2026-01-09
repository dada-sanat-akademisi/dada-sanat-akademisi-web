import { Metadata } from 'next';
import { generateMetadata as generateSEOMetadata } from '@/lib/seo/metadata';
import { StructuredData } from '@/components/seo/StructuredData';
import type { BreadcrumbItem } from '@/components/seo/StructuredData';

export const metadata: Metadata = generateSEOMetadata({
  title: 'Başvuru',
  description: 'Dada Sanat Akademisi kurslarına başvurun. En kısa sürede size dönüş yapacağız.',
  canonicalUrl: '/apply',
  keywords: ['kurs başvurusu', 'sanat kursu başvuru', 'dada sanat akademisi başvuru'],
});

export default function ApplyPage() {
  const breadcrumbs: BreadcrumbItem[] = [
    { name: 'Ana Sayfa', url: '/' },
    { name: 'Başvuru', url: '/apply' },
  ];

  return (
    <div className="pt-24 min-h-screen bg-ivory">
      <StructuredData type="breadcrumb" data={breadcrumbs} />
      <section className="container mx-auto px-6 py-16 max-w-2xl">
        <h1 className="text-5xl md:text-6xl font-serif font-medium mb-6 text-center text-charcoal">
          Başvuru Formu
        </h1>
        <p className="text-xl text-charcoal/70 text-center mb-12">
          Kurslarımıza başvurmak için formu doldurun. En kısa sürede size
          dönüş yapacağız.
        </p>

        <form className="space-y-6 glass rounded-lg p-8">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium mb-2 text-charcoal"
            >
              Ad Soyad
            </label>
            <input
              type="text"
              id="name"
              name="name"
              required
              className="w-full px-4 py-3 bg-white border border-charcoal/20 rounded-md text-charcoal focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent"
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium mb-2 text-charcoal"
            >
              E-posta
            </label>
            <input
              type="email"
              id="email"
              name="email"
              required
              className="w-full px-4 py-3 bg-white border border-charcoal/20 rounded-md text-charcoal focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent"
            />
          </div>

          <div>
            <label
              htmlFor="course"
              className="block text-sm font-medium mb-2 text-charcoal"
            >
              İlgilendiğiniz Kurs
            </label>
            <select
              id="course"
              name="course"
              required
              className="w-full px-4 py-3 bg-white border border-charcoal/20 rounded-md text-charcoal focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent"
            >
              <option value="">Seçiniz</option>
              <option value="music">Müzik Kursları</option>
              <option value="visual-arts">Görsel Sanatlar</option>
              <option value="photography">Fotoğrafçılık</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="message"
              className="block text-sm font-medium mb-2 text-charcoal"
            >
              Mesaj
            </label>
            <textarea
              id="message"
              name="message"
              rows={5}
              className="w-full px-4 py-3 bg-white border border-charcoal/20 rounded-md text-charcoal focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent resize-none"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-gold text-charcoal font-medium py-3 px-8 rounded-md hover:bg-gold-100 transition-beat shadow-md hover:shadow-lg"
          >
            Başvuruyu Gönder
          </button>
        </form>
      </section>
    </div>
  );
}

