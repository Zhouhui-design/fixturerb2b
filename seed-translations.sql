-- Seed translations for testing lazy loading
-- This adds French, German, and Korean translations to test dynamic loading

-- French translations
INSERT INTO translations (language, key, value, namespace) VALUES
('fr', 'nav.solutions', 'Solutions', 'common'),
('fr', 'nav.products', 'Produits', 'common'),
('fr', 'nav.cases', 'Cas', 'common'),
('fr', 'nav.resources', 'Ressources', 'common'),
('fr', 'nav.about', 'À propos', 'common'),
('fr', 'nav.contact', 'Contact', 'common'),
('fr', 'nav.consultation', 'Consultation Gratuite', 'common'),
('fr', 'hero.title', 'Fabrication de Meubles Commerciaux.', 'common'),
('fr', 'hero.subtitle', 'Vous fournissez les exigences, nous vérifions ensemble les détails du dessin.', 'common'),
('fr', 'hero.trustStatement', 'Acceptation des exigences → Vérification des dessins → Réponse rapide', 'common'),
('fr', 'hero.exploreSolutions', 'Explorer les Solutions', 'common'),
('fr', 'hero.contactExpert', 'Contacter un Expert', 'common'),
('fr', 'capabilities.title', 'Que pouvons-nous faire?', 'common'),
('fr', 'capabilities.reqToDrawings', 'Exigences → Dessins', 'common'),
('fr', 'capabilities.drawingsToReality', 'Dessins → Réalité', 'common'),
('fr', 'products.title', 'Nos Systèmes d''Affichage', 'common'),
('fr', 'products.subtitle', 'Accessoires de qualité commerciale pour environnements de vente au détail professionnels', 'common'),
('fr', 'products.viewAll', 'Voir Tous les Produits', 'common'),
('fr', 'contact.title', 'Contactez-nous', 'common'),
('fr', 'contact.sendInquiry', 'Envoyer la Demande', 'common');

-- German translations
INSERT INTO translations (language, key, value, namespace) VALUES
('de', 'nav.solutions', 'Lösungen', 'common'),
('de', 'nav.products', 'Produkte', 'common'),
('de', 'nav.cases', 'Fälle', 'common'),
('de', 'nav.resources', 'Ressourcen', 'common'),
('de', 'nav.about', 'Über uns', 'common'),
('de', 'nav.contact', 'Kontakt', 'common'),
('de', 'nav.consultation', 'Kostenlose Beratung', 'common'),
('de', 'hero.title', 'Kommerzielle Möbelherstellung.', 'common'),
('de', 'hero.subtitle', 'Sie liefern die Anforderungen, wir überprüfen gemeinsam die Zeichnungsdetails.', 'common'),
('de', 'hero.trustStatement', 'Anforderungen akzeptieren → Zeichnungen überprüfen → Schnelle Antwort', 'common'),
('de', 'hero.exploreSolutions', 'Lösungen entdecken', 'common'),
('de', 'hero.contactExpert', 'Experten kontaktieren', 'common'),
('de', 'capabilities.title', 'Was können wir tun?', 'common'),
('de', 'capabilities.reqToDrawings', 'Anforderungen → Zeichnungen', 'common'),
('de', 'capabilities.drawingsToReality', 'Zeichnungen → Realität', 'common'),
('de', 'products.title', 'Unsere Anzeigesysteme', 'common'),
('de', 'products.subtitle', 'Handelsübliche Ausstattung für professionelle Einzelhandelsumgebungen', 'common'),
('de', 'products.viewAll', 'Alle Produkte anzeigen', 'common'),
('de', 'contact.title', 'Kontaktieren Sie uns', 'common'),
('de', 'contact.sendInquiry', 'Anfrage senden', 'common');

-- Korean translations
INSERT INTO translations (language, key, value, namespace) VALUES
('ko', 'nav.solutions', '솔루션', 'common'),
('ko', 'nav.products', '제품', 'common'),
('ko', 'nav.cases', '사례', 'common'),
('ko', 'nav.resources', '리소스', 'common'),
('ko', 'nav.about', '회사 소개', 'common'),
('ko', 'nav.contact', '연락처', 'common'),
('ko', 'nav.consultation', '무료 상담', 'common'),
('ko', 'hero.title', '상업용 가구 제조.', 'common'),
('ko', 'hero.subtitle', '고객님이 요구사항을 제공하시면, 함께 도면 세부사항을 확인합니다.', 'common'),
('ko', 'hero.trustStatement', '요구사항 수락 → 도면 확인 → 빠른 응답', 'common'),
('ko', 'hero.exploreSolutions', '솔루션 탐색', 'common'),
('ko', 'hero.contactExpert', '전문가 문의', 'common'),
('ko', 'capabilities.title', '우리가 할 수 있는 일?', 'common'),
('ko', 'capabilities.reqToDrawings', '요구사항 → 도면', 'common'),
('ko', 'capabilities.drawingsToReality', '도면 → 현실', 'common'),
('ko', 'products.title', '우리의 디스플레이 시스템', 'common'),
('ko', 'products.subtitle', '전문 소매 환경을 위한 상업용 등급 비품', 'common'),
('ko', 'products.viewAll', '모든 제품 보기', 'common'),
('ko', 'contact.title', '문의하기', 'common'),
('ko', 'contact.sendInquiry', '문의 보내기', 'common');
