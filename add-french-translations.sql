-- Add some French translations to test lazy loading
INSERT INTO translations (language, key, value, namespace) VALUES
('fr', 'nav.solutions', 'Solutions', 'common'),
('fr', 'nav.products', 'Produits', 'common'),
('fr', 'nav.cases', 'Cas', 'common'),
('fr', 'nav.resources', 'Ressources', 'common'),
('fr', 'nav.about', 'À propos', 'common'),
('fr', 'nav.contact', 'Contact', 'common'),
('fr', 'hero.title', 'Fabrication de Meubles Commerciaux.', 'common'),
('fr', 'hero.subtitle', 'Vous fournissez les exigences, nous vérifions ensemble les détails du dessin.', 'common'),
('fr', 'capabilities.title', 'Que pouvons-nous faire?', 'common'),
('fr', 'products.title', 'Nos Systèmes d''Affichage', 'common');

-- Add some German translations too
INSERT INTO translations (language, key, value, namespace) VALUES
('de', 'nav.solutions', 'Lösungen', 'common'),
('de', 'nav.products', 'Produkte', 'common'),
('de', 'nav.cases', 'Fälle', 'common'),
('de', 'hero.title', 'Kommerzielle Möbelherstellung.', 'common'),
('de', 'capabilities.title', 'Was können wir tun?', 'common');
