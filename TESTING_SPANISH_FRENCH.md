# 🧪 Spanish & French Translation Testing Guide

## Quick Test Steps

### 1. Open Website
```
https://fixturerb2b.top
```

### 2. Clear Browser Cache (IMPORTANT!)
```
Windows/Linux: Ctrl + Shift + R
Mac: Cmd + Shift + R
Or use Incognito/Private mode
```

---

## 🇪🇸 Testing Spanish (Español)

### Step 1: Switch to Spanish
1. Look for language selector in top navigation (usually shows "EN" or globe icon)
2. Click and select "Español" or "ES"
3. Page should reload with Spanish text

### Step 2: Verify Key Sections

**Navigation Menu:**
- [ ] "Soluciones" (Solutions)
- [ ] "Productos" (Products)
- [ ] "Casos" (Cases)
- [ ] "Contacto" (Contact)

**Hero Section:**
- [ ] Title: "Fabricación de Mobiliario Comercial."
- [ ] Subtitle mentions "requisitos" and "plano"
- [ ] Buttons: "Explorar Soluciones" and "Contactar Experto"

**Products Section:**
- [ ] "Nuestros Sistemas de Exhibición"
- [ ] Product names like "Sistema Modular de Percheros"
- [ ] "Ver Todos los Productos" button

**Contact Page:**
- [ ] "Contáctenos" title
- [ ] Form labels: "Nombre", "Correo Electrónico", "Teléfono"
- [ ] Two business hours cards visible

**Business Hours Cards:**
- [ ] 👥 Card shows: "Horario de Atención (Equipo Humano)"
- [ ] Times: "Lunes–Viernes: 9:00 AM – 6:00 PM (GMT+8)"
- [ ] 🤖 Card shows: "¿Fuera de Estas Horas?"
- [ ] Mentions "24/7" and "asistente de IA"

**Footer:**
- [ ] "Enlaces Rápidos"
- [ ] "Boletín" (Newsletter)
- [ ] "Suscribirse" button

---

## 🇫🇷 Testing French (Français)

### Step 1: Switch to French
1. Click language selector
2. Select "Français" or "FR"
3. Page should reload with French text

### Step 2: Verify Key Sections

**Navigation Menu:**
- [ ] "Solutions"
- [ ] "Produits" (Products)
- [ ] "Études de Cas" (Cases)
- [ ] "Contact"

**Hero Section:**
- [ ] Title: "Fabrication de Mobilier Commercial."
- [ ] Subtitle mentions "exigences" and "plan"
- [ ] Buttons: "Explorer les Solutions" and "Contacter un Expert"

**Products Section:**
- [ ] "Nos Systèmes d'Affichage"
- [ ] Product names like "Système Modulaire de Portants"
- [ ] "Voir Tous les Produits" button

**Contact Page:**
- [ ] "Contactez-Nous" title
- [ ] Form labels: "Nom", "E-mail", "Téléphone"
- [ ] Two business hours cards visible

**Business Hours Cards:**
- [ ] 👥 Card shows: "Heures d'Assistance (Équipe Humaine)"
- [ ] Times: "Lundi–Vendredi : 9h00 – 18h00 (GMT+8)"
- [ ] 🤖 Card shows: "En Dehors de Ces Heures ?"
- [ ] Mentions "24h/24 et 7j/7" and "assistant IA"

**Footer:**
- [ ] "Liens Rapides"
- [ ] "Bulletin" (Newsletter)
- [ ] "S'abonner" button

---

## 🔍 Special Character Verification

### Spanish Characters:
Check these render correctly:
- [ ] ñ (eñe) - "año", "señal"
- [ ] á, é, í, ó, ú (accents) - "solución", "teléfono"
- [ ] ¿ (inverted question mark) - "¿Fuera de Estas Horas?"
- [ ] ¡ (inverted exclamation) - if used

### French Characters:
Check these render correctly:
- [ ] é, è, ê (e with accents) - "étiquetage", "très"
- [ ] à, â (a with accents) - "à propos", "français"
- [ ] ô, û (circumflex) - "hôtel", "sûr"
- [ ] ç (cedilla) - "français", "garçon"
- [ ] œ (ligature) - if used

---

## ⚠️ Common Issues & Solutions

### Issue: Still seeing English text
**Solution:** 
- Hard refresh browser (Ctrl+Shift+R)
- Clear browser cache completely
- Try incognito/private mode
- Check if language selector actually changed

### Issue: Special characters show as "?" or boxes
**Solution:**
- Ensure browser supports UTF-8 encoding (all modern browsers do)
- Check font supports these characters
- This is likely a display issue, not a translation issue

### Issue: Language switcher not working
**Solution:**
- Check browser console for errors (F12)
- Verify JavaScript loaded correctly
- Try different browser

### Issue: Mixed languages on page
**Solution:**
- This shouldn't happen with complete translations
- Report specific sections showing wrong language
- Refresh page

### Issue: Business hours cards not showing
**Solution:**
- Navigate to Contact page specifically
- Scroll down to contact information section
- Should see two cards below email/phone/address

---

## 📱 Mobile Testing

### Test on Phone:
1. Open https://fixturerb2b.top on mobile device
2. Switch to Spanish
3. Verify:
   - [ ] Text readable (not too small)
   - [ ] No horizontal scrolling
   - [ ] Language selector accessible
   - [ ] Business hours cards stack vertically
   - [ ] Forms usable on touch screen

4. Switch to French
5. Verify same points above

---

## 🌐 Browser Compatibility

Test in multiple browsers:
- [ ] Chrome/Edge
- [ ] Firefox
- [ ] Safari (Mac/iOS)
- [ ] Samsung Internet (Android)

Verify:
- Special characters render correctly
- Layout consistent across browsers
- Language switching works
- No console errors

---

## 🎯 Success Criteria

### ✅ Test PASSED if:
- Spanish displays completely (no English fallback)
- French displays completely (no English fallback)
- All special characters render correctly
- Business hours cards show in correct language
- Navigation, products, contact all translated
- No console errors
- Mobile responsive maintained
- Can switch between languages smoothly

### ❌ Test FAILED if:
- Any sections still in English (except for incomplete languages)
- Special characters broken or missing
- Layout broken after language switch
- Console shows red errors
- Cannot switch back to English
- Business hours cards missing or wrong language

---

## 📸 Screenshot Checklist

Take screenshots of:
1. Homepage in Spanish
2. Homepage in French
3. Contact page in Spanish (showing business hours cards)
4. Contact page in French (showing business hours cards)
5. Products page in both languages
6. Any issues found

---

## 🐛 Bug Reporting Template

If you find issues, report:

```
Language: [Spanish/French]
Page: [Homepage/Contact/Products/etc.]
Issue: [Description of problem]
Expected: [What should show]
Actual: [What actually shows]
Browser: [Chrome/Firefox/Safari/etc.]
Device: [Desktop/Mobile/Tablet]
Screenshot: [Attach if possible]
```

**Example:**
```
Language: Spanish
Page: Contact
Issue: Business hours card shows English text
Expected: "Horario de Atención (Equipo Humano)"
Actual: "Live Support Hours (Human Team)"
Browser: Chrome 120
Device: Desktop Windows
```

---

## 🔧 Developer Console Checks

Open Developer Tools (F12) → Console tab

**Expected Messages (OK):**
```
[i18n] Loading translations for: es
[i18n] Using bundled translations for: es
[i18n] Loading translations for: fr
[i18n] Using bundled translations for: fr
```

**Warning Messages (Also OK):**
```
[i18n] de is incomplete, using English fallback
[i18n] ko is incomplete, using English fallback
```

**Error Messages (PROBLEM):**
```
Failed to load translations
TypeError: Cannot read property...
Network error
```

If you see errors, take screenshot and report.

---

## 📊 Performance Check

After switching languages:
- [ ] Page loads within 2 seconds
- [ ] No noticeable lag when switching
- [ ] Images load properly
- [ ] Smooth scrolling
- [ ] Forms respond quickly

---

## ✅ Final Checklist

Before marking test complete:

### Spanish:
- [ ] Navigation menu fully translated
- [ ] Hero section in Spanish
- [ ] Products list in Spanish
- [ ] Contact form labels in Spanish
- [ ] Business hours cards in Spanish
- [ ] Footer in Spanish
- [ ] Special characters (ñ, á, é, etc.) display correctly
- [ ] No English text remaining (except brand names)

### French:
- [ ] Navigation menu fully translated
- [ ] Hero section in French
- [ ] Products list in French
- [ ] Contact form labels in French
- [ ] Business hours cards in French
- [ ] Footer in French
- [ ] Special characters (é, è, ê, ç, etc.) display correctly
- [ ] No English text remaining (except brand names)

### General:
- [ ] Language switcher works smoothly
- [ ] Can switch between EN ↔ ES ↔ FR ↔ ZH ↔ JA
- [ ] No page crashes or errors
- [ ] Mobile responsive maintained
- [ ] Console clean (no red errors)

---

## 🎉 Test Complete!

Once all checks pass:
1. Note any minor issues found
2. Take celebratory screenshot 😊
3. Report results
4. Share feedback on translation quality

---

*Testing Guide Created: 2026-04-23 00:27 UTC*  
*Languages Added: Spanish (es), French (fr)*  
*Live URL: https://fixturerb2b.top*
