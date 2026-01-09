import { Metadata } from 'next';
import { generateMetadata as generateSEOMetadata } from '@/lib/seo/metadata';
import { StructuredData } from '@/components/seo/StructuredData';
import type { BreadcrumbItem } from '@/components/seo/StructuredData';

export const metadata: Metadata = generateSEOMetadata({
  title: 'Akademi',
  description: 'DADA Sanat Akademisi felsefesi ve eğitim yaklaşımı. Disiplinle özgürlüğün buluştuğu sanat eğitimi.',
  canonicalUrl: '/academy',
  keywords: ['sanat akademisi', 'sanat eğitimi', 'müzik eğitimi', 'görsel sanatlar eğitimi'],
});

export default function AcademyPage() {
  const breadcrumbs: BreadcrumbItem[] = [
    { name: 'Ana Sayfa', url: '/' },
    { name: 'Akademi', url: '/academy' },
  ];

  return (
    <div className="min-h-screen bg-ivory">
      <StructuredData type="breadcrumb" data={breadcrumbs} />

      {/* Page Header */}
      <section className="py-20 md:py-32 px-6">
        <div className="container mx-auto max-w-4xl">
          <h1 className="text-5xl md:text-6xl font-serif font-medium mb-6 text-center text-charcoal">
            Akademi
          </h1>
        </div>
      </section>

      {/* Main Content */}
      <article className="container mx-auto max-w-4xl px-6 pb-24">
        <div className="prose prose-lg max-w-none">
          <div className="space-y-8 text-charcoal/80 leading-relaxed">
            <p className="text-xl text-charcoal/70">
              DADA, sanatın öğretilemez olduğuna inanır. Burada teknik öğrenmezsin;
              kendi sesini bulursun.
            </p>

            <div className="space-y-6">
              <h2 className="text-3xl font-serif font-medium text-charcoal mt-12 mb-6">
                Felsefe
              </h2>

              <p>
                Sanat, disiplinle özgürlüğün buluştuğu yerdir. Teknik mükemmellik,
                yaratıcı cesareti kısıtlamaz; tam tersine, onu güçlendirir. Her öğrenci,
                kendi sanatsal yolculuğunun kahramanıdır. Biz, sadece rehberiz.
              </p>

              <p>
                DADA’da öğrenci, boş bir kap değildir. Herkesin içinde zaten bir sanatçı var.
                Bizim işimiz, o sanatçıyı uyandırmak, cesaretlendirmek ve kendi sesini
                bulmasına yardımcı olmak.
              </p>

              <h2 className="text-3xl font-serif font-medium text-charcoal mt-12 mb-6">
                Eğitim Yaklaşımı
              </h2>

              <p>
                Müzik, resim, dans, heykel—hepsi aynı dilin farklı lehçeleri. DADA, tek bir
                dalda uzmanlaşmayı değil, sanatın farklı dillerini konuşabilmeyi önemser.
                Çünkü gerçek yaratıcılık, sınırların ötesinde doğar.
              </p>

              <p>
                Sahne, atölye, stüdyo—bunlar DADA’nın gerçek sınıflarıdır. Sertifika değil,
                eser üretmek. Teori değil, pratik. İzlemek değil, yapmak. Her öğrenci,
                eğitim sürecinde gerçek izleyicilerle, gerçek eserlerle buluşur.
              </p>

              <h2 className="text-3xl font-serif font-medium text-charcoal mt-12 mb-6">
                Kimler İçin
              </h2>

              <p>
                Yaş, seviye, geçmiş—hiçbiri önemli değil. Önemli olan, sanatla kurmak
                istediğin ilişki. Müziğe ilk adımını atanlar, görsel sanatlarla derin bir
                bağ kurmak isteyenler, kendi bestelerini yapmak isteyenler, konservatuvar
                hazırlığı yapanlar, sanatı ciddi bir hobi olarak görenler—hepsi DADA’da
                yerini bulur.
              </p>

              <p>
                Herkesin sanatla ilişkisi farklıdır. DADA, seni başkalarıyla karşılaştırmaz;
                kendi ritmini bulman için alan açar.
              </p>
            </div>
          </div>
        </div>
      </article>
    </div>
  );
}

