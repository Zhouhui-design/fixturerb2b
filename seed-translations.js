#!/usr/bin/env node

// Seed script to add test translations to Supabase
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://yaumblbimxrunltqadsq.supabase.co'
const supabaseKey = 'sb_publishable_bz-UdtzBNgA_ckTh--Hrig_bbSh8prW'
const supabase = createClient(supabaseUrl, supabaseKey)

const frenchTranslations = [
  { language: 'fr', key: 'nav.solutions', value: 'Solutions', namespace: 'common' },
  { language: 'fr', key: 'nav.products', value: 'Produits', namespace: 'common' },
  { language: 'fr', key: 'nav.cases', value: 'Cas', namespace: 'common' },
  { language: 'fr', key: 'hero.title', value: 'Fabrication de Meubles Commerciaux.', namespace: 'common' },
  { language: 'fr', key: 'hero.subtitle', value: 'Vous fournissez les exigences, nous vérifions ensemble.', namespace: 'common' },
  { language: 'fr', key: 'capabilities.title', value: 'Que pouvons-nous faire?', namespace: 'common' },
  { language: 'fr', key: 'products.title', value: 'Nos Systèmes d\'Affichage', namespace: 'common' },
  { language: 'fr', key: 'contact.title', value: 'Contactez-nous', namespace: 'common' },
]

const germanTranslations = [
  { language: 'de', key: 'nav.solutions', value: 'Lösungen', namespace: 'common' },
  { language: 'de', key: 'nav.products', value: 'Produkte', namespace: 'common' },
  { language: 'de', key: 'nav.cases', value: 'Fälle', namespace: 'common' },
  { language: 'de', key: 'hero.title', value: 'Kommerzielle Möbelherstellung.', namespace: 'common' },
  { language: 'de', key: 'hero.subtitle', value: 'Sie liefern die Anforderungen, wir überprüfen gemeinsam.', namespace: 'common' },
  { language: 'de', key: 'capabilities.title', value: 'Was können wir tun?', namespace: 'common' },
  { language: 'de', key: 'products.title', value: 'Unsere Anzeigesysteme', namespace: 'common' },
  { language: 'de', key: 'contact.title', value: 'Kontaktieren Sie uns', namespace: 'common' },
]

const koreanTranslations = [
  { language: 'ko', key: 'nav.solutions', value: '솔루션', namespace: 'common' },
  { language: 'ko', key: 'nav.products', value: '제품', namespace: 'common' },
  { language: 'ko', key: 'nav.cases', value: '사례', namespace: 'common' },
  { language: 'ko', key: 'hero.title', value: '상업용 가구 제조.', namespace: 'common' },
  { language: 'ko', key: 'hero.subtitle', value: '고객님이 요구사항을 제공하시면 함께 확인합니다.', namespace: 'common' },
  { language: 'ko', key: 'capabilities.title', value: '우리가 할 수 있는 일?', namespace: 'common' },
  { language: 'ko', key: 'products.title', value: '우리의 디스플레이 시스템', namespace: 'common' },
  { language: 'ko', key: 'contact.title', value: '문의하기', namespace: 'common' },
]

async function seedDatabase() {
  console.log('🌱 Starting database seeding...\n')
  
  // Insert French translations
  console.log('🇫🇷 Inserting French translations...')
  const { data: frData, error: frError } = await supabase
    .from('translations')
    .upsert(frenchTranslations, { onConflict: 'language,key' })
  
  if (frError) {
    console.error('❌ Error inserting French:', frError.message)
  } else {
    console.log('✅ French translations added successfully\n')
  }
  
  // Insert German translations
  console.log('🇩🇪 Inserting German translations...')
  const { data: deData, error: deError } = await supabase
    .from('translations')
    .upsert(germanTranslations, { onConflict: 'language,key' })
  
  if (deError) {
    console.error('❌ Error inserting German:', deError.message)
  } else {
    console.log('✅ German translations added successfully\n')
  }
  
  // Insert Korean translations
  console.log('🇰🇷 Inserting Korean translations...')
  const { data: koData, error: koError } = await supabase
    .from('translations')
    .upsert(koreanTranslations, { onConflict: 'language,key' })
  
  if (koError) {
    console.error('❌ Error inserting Korean:', koError.message)
  } else {
    console.log('✅ Korean translations added successfully\n')
  }
  
  // Verify
  console.log('📊 Verifying data...')
  const { count, error: countError } = await supabase
    .from('translations')
    .select('*', { count: 'exact', head: true })
  
  if (countError) {
    console.error('❌ Error counting:', countError.message)
  } else {
    console.log(`✅ Total translations in database: ${count}\n`)
  }
  
  // Show sample data
  console.log('📋 Sample data:')
  const { data: sample } = await supabase
    .from('translations')
    .select('*')
    .limit(5)
  
  if (sample) {
    sample.forEach(row => {
      console.log(`  ${row.language}: ${row.key} = ${row.value}`)
    })
  }
  
  console.log('\n✨ Database seeding complete!')
  console.log('\n💡 Now refresh your app and try switching to French, German, or Korean')
  console.log('   You should see network requests in Firefox DevTools → Network tab')
}

seedDatabase().catch(console.error)
