import { Metadata } from 'next';
import { generateMetadata as generateSEOMetadata } from '@/lib/seo/metadata';
import { StructuredData } from '@/components/seo/StructuredData';
import type { BreadcrumbItem } from '@/components/seo/StructuredData';

export const metadata: Metadata = generateSEOMetadata({
  title: 'Koro',
  description: 'DADA Sanat Akademisi çok sesli koro programı. Kolektif üretim ve topluluk deneyimi.',
  canonicalUrl: '/koro',
  keywords: ['koro', 'çok sesli koro', 'koro eğitimi', 'müzik topluluğu'],
});

export default function ChoirPage() {
  const breadcrumbs: BreadcrumbItem[] = [
    { name: 'Ana Sayfa', url: '/' },
    { name: 'Koro', url: '/koro' },
  ];

  return (
    <div className="min-h-screen bg-ivory">
      <StructuredData type="breadcrumb" data={breadcrumbs} />

      {/* Page Header */}
      <section className="py-20 md:py-32 px-6">
        <div className="container mx-auto max-w-4xl">
          <h1 className="text-5xl md:text-6xl font-serif font-medium mb-6 text-center text-charcoal">
            Çok Sesli Koro
          </h1>
        </div>
      </section>

      {/* Main Content */}
      <article className="container mx-auto max-w-4xl px-6 pb-24">
        <div className="prose prose-lg max-w-none">
          <div className="space-y-8 text-charcoal/80 leading-relaxed">
            <p className="text-xl text-charcoal/70">
              Tek ses değil, bir bütün. Koroda kendi sesini bulurken, kolektif gücü
              deneyimlersin.
            </p>

            <div className="space-y-6">
              <h2 className="text-3xl font-serif font-medium text-charcoal mt-12 mb-6">
                Koro Nedir
              </h2>

              <p>
                Koro, bireysel seslerin bir araya gelerek tek bir bütün oluşturduğu
                kolektif bir deneyimdir. Her ses, kendi rengini korurken, diğer seslerle
                uyum içinde çalışır. Bu uyum, hem teknik bir beceri hem de derin bir
                topluluk deneyimidir.
              </p>

              <p>
                DADA'da koro, sadece şarkı söylemek değil; dinlemek, uyum sağlamak,
                birlikte nefes almak demektir. Her provada, hem kendi sesini hem de
                topluluğun sesini keşfedersin.
              </p>

              <h2 className="text-3xl font-serif font-medium text-charcoal mt-12 mb-6">
                Neden Kolektif Üretim
              </h2>

              <p>
                Sanat, bazen yalnız bir yolculuktur. Ama bazen de, başkalarıyla birlikte
                üretmek, paylaşmak, bir şeyler yaratmak gerekir. Koro, bu kolektif
                üretimin en güçlü örneklerinden biridir.
              </p>

              <p>
                Koroda, sadece kendi sesini değil; başkalarının seslerini de duyarsın.
                Birlikte çalışırken, hem teknik hem de duygusal bir bağ kurarsın. Bu bağ,
                sadece sahnede değil; provalarda, çalışmalarda, günlük hayatta da devam eder.
              </p>

              <h2 className="text-3xl font-serif font-medium text-charcoal mt-12 mb-6">
                Kimler İçin
              </h2>

              <p>
                Koro, herkes içindir. Daha önce hiç şarkı söylememiş olabilirsin; önemli
                değil. Önemli olan, birlikte üretmek, paylaşmak, topluluk içinde yer almak
                isteğindir.
              </p>

              <p>
                Klasik müzikle ilgileniyorsan, çağdaş eserlerle çalışmak istiyorsan,
                sadece birlikte şarkı söylemenin keyfini yaşamak istiyorsan—koro senin
                için. Ses seviyesi, teknik yetenek, geçmiş deneyim—hiçbiri engel değil.
              </p>

              <h2 className="text-3xl font-serif font-medium text-charcoal mt-12 mb-6">
                Eğitim Yaklaşımı
              </h2>

              <p>
                Koro eğitimi, hem bireysel hem de kolektif çalışmayı içerir. Teknik
                temelleri öğrenirken, aynı zamanda dinleme, uyum sağlama, birlikte nefes
                alma becerilerini geliştirirsin.
              </p>

              <p>
                Repertuvar, klasik eserlerden çağdaş bestelere kadar geniş bir yelpazeyi
                kapsar. Her eser, hem teknik bir çalışma hem de duygusal bir yolculuk
                haline gelir. Sahne performansları, bu yolculuğun doğal bir parçasıdır.
              </p>
            </div>
          </div>
        </div>
      </article>
    </div>
  );
}

