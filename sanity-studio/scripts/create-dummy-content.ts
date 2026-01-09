/**
 * Script to create dummy content in Sanity
 * 
 * Run this after setting up environment variables:
 * npm run create-dummy-content
 * 
 * Requires:
 * - SANITY_STUDIO_PROJECT_ID or NEXT_PUBLIC_SANITY_PROJECT_ID
 * - SANITY_API_TOKEN (with write permissions)
 */

import { createClient } from '@sanity/client';

const projectId = process.env.SANITY_STUDIO_PROJECT_ID || process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '';
const dataset = process.env.SANITY_STUDIO_DATASET || process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';
const token = process.env.SANITY_API_TOKEN || '';

if (!projectId) {
  console.error('❌ Missing SANITY_STUDIO_PROJECT_ID or NEXT_PUBLIC_SANITY_PROJECT_ID');
  process.exit(1);
}

if (!token) {
  console.error('❌ Missing SANITY_API_TOKEN');
  console.error('Please create a token with write permissions at: https://www.sanity.io/manage/personal');
  process.exit(1);
}

const client = createClient({
  projectId,
  dataset,
  apiVersion: '2024-01-01',
  useCdn: false,
  token,
});

async function createDummyContent() {
  console.log('🚀 Creating dummy content...\n');

  try {
    // 1. Create Instructor first (required for course)
    console.log('1️⃣ Creating Instructor: Ahmet Yılmaz...');
    const instructor = await client.create({
      _type: 'instructor',
      name: 'Ahmet Yılmaz',
      slug: {
        _type: 'slug',
        current: 'ahmet-yilmaz',
      },
      specialization: 'Piyano',
      bio: [
        {
          _type: 'block',
          _key: 'bio1',
          style: 'normal',
          children: [
            {
              _type: 'span',
              _key: 'span1',
              text: 'Ahmet Yılmaz, 15 yıldan fazla deneyime sahip profesyonel bir piyano eğitmenidir. İstanbul Üniversitesi Devlet Konservatuvarı mezunu olan Yılmaz, klasik müzik alanında uzmanlaşmıştır. Öğrencilerine teknik mükemmellik ve müzikal ifade becerisi kazandırmayı hedeflemektedir.',
              marks: [],
            },
          ],
          markDefs: [],
        },
      ],
      image: {
        _type: 'image',
        asset: {
          _type: 'reference',
          _ref: 'image-placeholder', // Placeholder - you'll need to upload a real image
        },
      },
      'image.alt': 'Ahmet Yılmaz, Piyano Eğitmeni',
      experience: 15,
      studentCount: 150,
    });
    console.log('✅ Instructor created:', instructor._id);
    console.log(`   Slug: ${instructor.slug.current}\n`);

    // 2. Create Course
    console.log('2️⃣ Creating Course: Yeni Başlayanlar İçin Piyano...');
    const course = await client.create({
      _type: 'course',
      title: 'Yeni Başlayanlar İçin Piyano',
      slug: {
        _type: 'slug',
        current: 'yeni-baslayanlar-icin-piyano',
      },
      description: 'Piyanoya sıfırdan başlayanlar için temel eğitim. Nota okuma, temel teknikler ve basit eserler.',
      longDescription: [
        {
          _type: 'block',
          _key: 'desc1',
          style: 'normal',
          children: [
            {
              _type: 'span',
              _key: 'span1',
              text: 'Bu kurs, piyanoya hiç dokunmamış olanlar için tasarlanmıştır. Temel nota bilgisi, parmak teknikleri ve doğru duruş pozisyonları üzerinde durulacaktır.',
              marks: [],
            },
          ],
          markDefs: [],
        },
        {
          _type: 'block',
          _key: 'desc2',
          style: 'normal',
          children: [
            {
              _type: 'span',
              _key: 'span2',
              text: 'Kurs süresince öğrenciler basit melodiler çalmayı öğrenecek ve müzik teorisinin temellerini kavrayacaklardır. Dersler haftada bir kez, 60 dakika sürmektedir.',
              marks: [],
            },
          ],
          markDefs: [],
        },
        {
          _type: 'block',
          _key: 'desc3',
          style: 'h2',
          children: [
            {
              _type: 'span',
              _key: 'span3',
              text: 'Kurs İçeriği',
              marks: [],
            },
          ],
          markDefs: [],
        },
        {
          _type: 'block',
          _key: 'desc4',
          style: 'normal',
          children: [
            {
              _type: 'span',
              _key: 'span4',
              text: 'İlk haftalarda temel nota bilgisi ve piyano klavyesi tanıtımı yapılacaktır. Ardından basit parmak egzersizleri ve ilk eserler çalışılacaktır.',
              marks: [],
            },
          ],
          markDefs: [],
        },
      ],
      category: 'music',
      level: 'beginner',
      image: {
        _type: 'image',
        asset: {
          _type: 'reference',
          _ref: 'image-placeholder', // Placeholder - you'll need to upload a real image
        },
      },
      'image.alt': 'Yeni Başlayanlar İçin Piyano Kursu',
      instructor: {
        _type: 'reference',
        _ref: instructor._id,
      },
      price: 2000,
      duration: '12 hafta',
      rating: 4.8,
      reviewCount: 24,
      spotsAvailable: 8,
      locale: 'tr',
    });
    console.log('✅ Course created:', course._id);
    console.log(`   Slug: ${course.slug.current}\n`);

    // 3. Create Blog Article
    console.log('3️⃣ Creating Blog Article: Piyanoya Başlamadan Önce Bilinmesi Gerekenler...');
    const blogArticle = await client.create({
      _type: 'blogArticle',
      title: 'Piyanoya Başlamadan Önce Bilinmesi Gerekenler',
      slug: {
        _type: 'slug',
        current: 'piyanoya-baslamadan-once-bilinmesi-gerekenler',
      },
      excerpt: 'Piyano öğrenmeye başlamadan önce bilmeniz gereken temel bilgiler ve ipuçları. Doğru başlangıç için rehber.',
      content: [
        {
          _type: 'block',
          _key: 'content1',
          style: 'normal',
          children: [
            {
              _type: 'span',
              _key: 'span1',
              text: 'Piyano öğrenmek, hem teknik hem de müzikal bir yolculuktur. Bu yazıda, piyanoya başlamadan önce bilmeniz gereken temel noktaları ele alacağız.',
              marks: [],
            },
          ],
          markDefs: [],
        },
        {
          _type: 'block',
          _key: 'content2',
          style: 'h2',
          children: [
            {
              _type: 'span',
              _key: 'span2',
              text: 'Doğru Piyano Seçimi',
              marks: [],
            },
          ],
          markDefs: [],
        },
        {
          _type: 'block',
          _key: 'content3',
          style: 'normal',
          children: [
            {
              _type: 'span',
              _key: 'span3',
              text: 'Başlangıç seviyesi için dijital piyano veya akustik piyano tercih edilebilir. Dijital piyanolar daha uygun fiyatlı ve bakım gerektirmez. Akustik piyanolar ise daha zengin bir ses kalitesi sunar.',
              marks: [],
            },
          ],
          markDefs: [],
        },
        {
          _type: 'block',
          _key: 'content4',
          style: 'h2',
          children: [
            {
              _type: 'span',
              _key: 'span4',
              text: 'Temel Müzik Teorisi',
              marks: [],
            },
          ],
          markDefs: [],
        },
        {
          _type: 'block',
          _key: 'content5',
          style: 'normal',
          children: [
            {
              _type: 'span',
              _key: 'span5',
              text: 'Piyano çalmadan önce temel nota bilgisine sahip olmak çok önemlidir. Notaları okumayı, ritimleri anlamayı ve temel müzik terimlerini öğrenmek, ilerlemenizi hızlandıracaktır.',
              marks: [],
            },
          ],
          markDefs: [],
        },
        {
          _type: 'block',
          _key: 'content6',
          style: 'normal',
          children: [
            {
              _type: 'span',
              _key: 'span6',
              text: 'Düzenli pratik yapmak ve sabırlı olmak, piyano öğrenme sürecinin en önemli parçalarıdır. Her gün en az 30 dakika pratik yaparak, kısa sürede ilerleme kaydedebilirsiniz.',
              marks: [],
            },
          ],
          markDefs: [],
        },
      ],
      category: 'education',
      featuredImage: {
        _type: 'image',
        asset: {
          _type: 'reference',
          _ref: 'image-placeholder', // Placeholder - you'll need to upload a real image
        },
      },
      'featuredImage.alt': 'Piyano öğrenmek için temel bilgiler',
      publishedAt: new Date().toISOString(),
      readTime: 5,
      viewCount: 0,
    });
    console.log('✅ Blog Article created:', blogArticle._id);
    console.log(`   Slug: ${blogArticle.slug.current}\n`);

    console.log('✅ All dummy content created successfully!');
    console.log('\n📋 Summary:');
    console.log(`   - Instructor: ${instructor.name} (${instructor.slug.current})`);
    console.log(`   - Course: ${course.title} (${course.slug.current})`);
    console.log(`   - Blog Article: ${blogArticle.title} (${blogArticle.slug.current})`);
    console.log('\n⚠️  Note: You may need to upload real images via Sanity Studio UI.');
    console.log('   Images are currently set to placeholders.');

  } catch (error: any) {
    console.error('❌ Error creating content:', error.message);
    if (error.details) {
      console.error('Details:', error.details);
    }
    process.exit(1);
  }
}

createDummyContent();

