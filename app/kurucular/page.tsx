import { Metadata } from 'next';
import { generateMetadata as generateSEOMetadata } from '@/lib/seo/metadata';
import { StructuredData } from '@/components/seo/StructuredData';
import type { BreadcrumbItem } from '@/components/seo/StructuredData';

export const metadata: Metadata = generateSEOMetadata({
  title: 'Kurucular',
  description: 'DADA Sanat Akademisi kurucuları. Sanat eğitimine farklı bir yaklaşım getiren eğitmenler.',
  canonicalUrl: '/kurucular',
  keywords: ['sanat akademisi kurucular', 'sanat eğitmenleri', 'dada sanat akademisi'],
});

export default function FoundersPage() {
  const breadcrumbs: BreadcrumbItem[] = [
    { name: 'Ana Sayfa', url: '/' },
    { name: 'Kurucular', url: '/kurucular' },
  ];

  return (
    <div className="min-h-screen bg-ivory">
      <StructuredData type="breadcrumb" data={breadcrumbs} />

      {/* Page Header */}
      <section className="py-20 md:py-32 px-6">
        <div className="container mx-auto max-w-4xl">
          <h1 className="text-5xl md:text-6xl font-serif font-medium mb-6 text-center text-charcoal">
            Kurucular
          </h1>
        </div>
      </section>

      {/* Main Content */}
      <article className="container mx-auto max-w-4xl px-6 pb-24">
        <div className="prose prose-lg max-w-none">
          <div className="space-y-8 text-charcoal/80 leading-relaxed">
            <p className="text-xl text-charcoal/70">
              DADA, sanat eğitiminin farklı olması gerektiğine inanan bir grup eğitmen
              tarafından kuruldu. Amacımız basit: Sanatı keşfetmek isteyenlere alan açmak.
            </p>

            <div className="space-y-6">
              <h2 className="text-3xl font-serif font-medium text-charcoal mt-12 mb-6">
                Neden DADA
              </h2>

              <p>
                Yıllarca farklı kurumlarda eğitim verdik. Gördük ki, çoğu yerde sanat,
                müfredat ve sertifika odaklı bir süreç haline gelmiş. Öğrenci, sıraya
                konmuş, tek tip bir yol izlemeye zorlanmış.
              </p>

              <p>
                Oysa sanat, böyle öğrenilmez. Her öğrencinin kendi ritmi, kendi sesi,
                kendi yolu var. DADA, bu çeşitliliği kucaklayan bir alan olarak doğdu.
              </p>

              <h2 className="text-3xl font-serif font-medium text-charcoal mt-12 mb-6">
                Yaklaşım
              </h2>

              <p>
                Biz, öğretmen değiliz; rehberiz. Öğrencinin önünde yürümüyoruz; yanında
                yürüyoruz. Teknik temelleri sağlam atıyoruz, ama her öğrencinin bireysel
                müzikal kimliğini keşfetmesine yardımcı oluyoruz.
              </p>

              <p>
                Disiplinle özgürlüğü bir arada tutuyoruz. Çünkü gerçek yaratıcılık, bu
                ikisinin buluştuğu yerde doğar. Kuralları öğretiyoruz, ama onları yıkma
                cesaretini de veriyoruz.
              </p>

              <h2 className="text-3xl font-serif font-medium text-charcoal mt-12 mb-6">
                Topluluk
              </h2>

              <p>
                DADA, sadece bir eğitim kurumu değil; bir topluluk. Öğrenciler, sadece
                ders almak için değil; sanatla ilgili konuşmak, paylaşmak, birlikte
                üretmek için burada.
              </p>

              <p>
                Bu topluluğun bir parçası olmak istersen, seni de aramızda görmekten
                mutluluk duyarız.
              </p>
            </div>
          </div>
        </div>
      </article>
    </div>
  );
}

