import { HeroSection } from '@/components/sections/HeroSection';
import { BentoGrid } from '@/components/sections/BentoGrid';
import { Metadata } from 'next';
import { generateMetadata as generateSEOMetadata } from '@/lib/seo/metadata';
import { StructuredData } from '@/components/seo/StructuredData';

export const metadata: Metadata = generateSEOMetadata({
  title: 'Ana Sayfa',
  description: 'Dada Sanat Akademisi - Müzik ve Görsel Sanatlar eğitimi. Kontrollü kaos ve disiplinle buluşan sanat.',
  canonicalUrl: '/',
  keywords: ['sanat akademisi', 'müzik eğitimi', 'görsel sanatlar', 'dada', 'sanat kursu'],
});

export default function HomePage() {
  // Organization structured data for homepage
  const organizationData = {
    name: 'Dada Sanat Akademisi',
    description: 'Müzik & Görsel Sanatlar Akademisi',
    location: 'İstanbul',
    socialLinks: [], // Add social links when available
  };

  return (
    <>
      <StructuredData type="organization" data={organizationData} />
      <HeroSection />
      <BentoGrid />
    </>
  );
}

