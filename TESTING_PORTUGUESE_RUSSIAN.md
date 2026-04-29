# 🧪 Testing Guide - Portuguese & Russian Translations

## Quick Test Checklist

### Step 1: Access Website
Open: https://fixturerb2b.top

### Step 2: Hard Refresh Browser
```
Windows/Linux: Ctrl + Shift + R
Mac: Cmd + Shift + R
Or use Incognito/Private mode
```

---

## 🇧🇷 Portuguese (Português) Test

### Navigation Test:
1. Click language selector in top right
2. Select "Português" or "PT"
3. Verify these menu items appear in Portuguese:
   - ✅ Soluções (Solutions)
   - ✅ Produtos (Products)
   - ✅ Casos (Cases)
   - ✅ Recursos (Resources)
   - ✅ Sobre Nós (About)
   - ✅ Contato (Contact)
   - ✅ Consultoria Gratuita (Free Consultation)

### Hero Section Test:
Check these elements display in Portuguese:
- ✅ Title: "Fabricação de Mobiliário Comercial."
- ✅ Subtitle mentions "detalhes do desenho"
- ✅ Trust statement shows arrows (→) with Portuguese text
- ✅ Buttons: "Explorar Soluções", "Contatar Especialista"

### Product Names Test:
Verify product names in Portuguese:
- ✅ Sistema Modular de Cabides
- ✅ Prateleira de Exibição Boutique
- ✅ Unidade de Exibição de Parede
- ✅ Mesa de Exibição Central
- ✅ Sistema de Trilho de Roupas
- ✅ Parede de Exibição de Sapatos

### Business Hours Card Test:
On Contact page (/contact):
- ✅ Title: "Horário de Suporte (Equipe Humana)"
- ✅ Shows: "Segunda–Sexta: 9:00 – 18:00 (GMT+8)"
- ✅ Shows: "Sábado: 9:00 – 12:00 (GMT+8)"
- ✅ Shows: "Domingo e feriados: Fechado"
- ✅ AI card title: "Fora Desses Horários?"
- ✅ AI description mentions "24/7"

### Special Characters Test:
Verify these render correctly:
- ✅ ã (Soluções, não)
- ✅ õ (Corpo, órgão)
- ✅ á, é, í, ó, ú (acentos agudos)
- ✅ ç (coração, ação)

---

## 🇷🇺 Russian (Русский) Test

### Navigation Test:
1. Click language selector
2. Select "Русский" or "RU"
3. Verify these menu items appear in Russian:
   - ✅ Решения (Solutions)
   - ✅ Продукты (Products)
   - ✅ Кейсы (Cases)
   - ✅ Ресурсы (Resources)
   - ✅ О нас (About)
   - ✅ Контакты (Contact)
   - ✅ Бесплатная консультация (Free Consultation)

### Hero Section Test:
Check these elements display in Russian:
- ✅ Title: "Производство коммерческой мебели."
- ✅ Subtitle mentions "детали чертежа"
- ✅ Trust statement shows arrows (→) with Russian text
- ✅ Buttons: "Изучить решения", "Связаться с экспертом"

### Product Names Test:
Verify product names in Russian:
- ✅ Модульная система вешалок для одежды
- ✅ Бутик-полка для отображения
- ✅ Розничный настенный блок отображения
- ✅ Центральный островной стол для отображения
- ✅ Система рельсов для одежды
- ✅ Стена для отображения обуви

### Business Hours Card Test:
On Contact page (/contact):
- ✅ Title: "Часы поддержки (человеческая команда)"
- ✅ Shows: "Понедельник–Пятница: 9:00 – 18:00 (GMT+8)"
- ✅ Shows: "Суббота: 9:00 – 12:00 (GMT+8)"
- ✅ Shows: "Воскресенье и праздники: Закрыто"
- ✅ AI card title: "Вне этих часов?"
- ✅ AI description mentions "24/7"

### Cyrillic Characters Test:
Verify Russian characters render correctly:
- ✅ Производство коммерческой мебели
- ✅ Модульная система вешалок
- ✅ Часы поддержки
- ✅ Здравствуйте (Hello - if appears anywhere)

---

## 🔍 Common Issues to Check

### Issue 1: Mixed Languages
**Problem:** Some sections show English while others show Portuguese/Russian  
**Cause:** Incomplete translation or fallback triggered  
**Fix:** Should not happen - all sections are complete  

### Issue 2: Special Characters Display as Boxes/Squares
**Problem:** ã, õ, ç or Cyrillic show as □□□  
**Cause:** Font doesn't support those characters  
**Fix:** Usually browser cache issue - hard refresh again  

### Issue 3: Text Overflow or Layout Breaks
**Problem:** Russian words too long for buttons/cards  
**Cause:** Russian compound words can be very long  
**Status:** Should be handled by responsive design  

### Issue 4: Language Switcher Not Working
**Problem:** Clicking language does nothing  
**Cause:** JavaScript error or caching  
**Fix:** Clear cache completely, try incognito mode  

---

## 📱 Mobile Testing

### Test on Mobile Devices:
1. Open on iPhone/Android
2. Switch to Portuguese
3. Verify:
   - ✅ Menu collapses to hamburger
   - ✅ Text readable (not too small)
   - ✅ No horizontal scrolling
   - ✅ Buttons clickable
   - ✅ Forms work properly

4. Repeat for Russian

---

## 🌐 Cross-Browser Testing

### Browsers to Test:
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)
- [ ] Mobile Safari (iOS)
- [ ] Chrome Mobile (Android)

### What to Check in Each Browser:
- [ ] Language switcher works
- [ ] All text displays correctly
- [ ] Special characters render
- [ ] Layout is responsive
- [ ] No console errors (F12 → Console tab)

---

## ⚡ Performance Testing

### Page Load Speed:
```bash
# Test homepage load time
curl -sL -o /dev/null -w "Time: %{time_total}s\n" https://fixturerb2b.top

# Expected: < 2 seconds on good connection
```

### Translation Loading:
- First load: ~50-100ms extra (translations in bundle)
- Subsequent loads: Instant (cached)
- No network requests for translations (bundled approach)

---

## 🎯 Functional Testing

### Contact Form Test (Portuguese):
1. Go to /contact
2. Switch to Portuguese
3. Fill out form:
   - Name: Nome de teste
   - Email: teste@exemplo.com
   - Message: Mensagem de teste
4. Submit
5. Verify success message in Portuguese:
   - ✅ "Obrigado! Responderemos dentro de 24 horas."

### Contact Form Test (Russian):
1. Go to /contact
2. Switch to Russian
3. Fill out form
4. Submit
5. Verify success message in Russian:
   - ✅ "Спасибо! Мы ответим в течение 24 часов."

---

## 📊 SEO Verification

### Meta Tags Test:
View page source (Ctrl+U) and check:

**For Portuguese:**
```html
<html lang="pt">
<meta name="description" content="...Portuguese text..." />
```

**For Russian:**
```html
<html lang="ru">
<meta name="description" content="...Russian text..." />
```

---

## ✅ Success Criteria

All of the following should be true:

### Portuguese:
- [ ] All navigation items in Portuguese
- [ ] Hero section fully translated
- [ ] All 6 products have Portuguese names
- [ ] Business hours card shows Portuguese times
- [ ] AI support card in Portuguese
- [ ] Contact form labels in Portuguese
- [ ] Special characters (ã, õ, ç, accents) display correctly
- [ ] No English text mixed in (except brand names)

### Russian:
- [ ] All navigation items in Russian
- [ ] Hero section fully translated
- [ ] All 6 products have Russian names
- [ ] Business hours card shows Russian times
- [ ] AI support card in Russian
- [ ] Contact form labels in Russian
- [ ] Cyrillic characters display correctly
- [ ] No English text mixed in (except brand names)

### General:
- [ ] Language switcher works smoothly
- [ ] No console errors
- [ ] Pages load quickly (<2s)
- [ ] Mobile responsive
- [ ] Google Analytics tracking active
- [ ] No layout breaks

---

## 🐛 Troubleshooting

### If Portuguese/Russian Still Shows English:

**Step 1:** Clear browser cache completely
```
Chrome: Settings > Privacy > Clear browsing data > Cached images/files
Firefox: Options > Privacy > Clear Data
Safari: Develop > Empty Caches
```

**Step 2:** Try incognito/private mode
```
Chrome: Ctrl+Shift+N
Firefox: Ctrl+Shift+P
Safari: Cmd+Shift+N
```

**Step 3:** Check browser console for errors
```
Press F12 > Console tab
Look for red error messages
```

**Step 4:** Verify deployment worked
```bash
ssh root@fixturerb2b.top "ls -lh /var/www/fixturerb2b.top/assets/js/index-*.js"
# Should show: index-D-TTslio.js modified Apr 23 02:00
```

**Step 5:** Check translations file on server
```bash
ssh root@fixturerb2b.top "grep -c 'pt:' /var/www/fixturerb2b.top/assets/js/index-*.js"
# Should return: 1 (found)

ssh root@fixturerb2b.top "grep -c 'ru:' /var/www/fixturerb2b.top/assets/js/index-*.js"
# Should return: 1 (found)
```

---

## 📞 Support

If you find any issues:

1. **Screenshot the problem**
2. **Note which language** (Portuguese or Russian)
3. **Note which page** (homepage, contact, products, etc.)
4. **Note your browser** (Chrome, Firefox, Safari, etc.)
5. **Report back** with this information

Common issues I can fix quickly:
- Missing translations
- Incorrect translations
- Layout problems
- Character encoding issues
- Mobile responsiveness

---

## 🎉 Completion Checklist

After testing, verify:

- [ ] Tested Portuguese on desktop
- [ ] Tested Portuguese on mobile
- [ ] Tested Russian on desktop
- [ ] Tested Russian on mobile
- [ ] Checked special characters
- [ ] Verified business hours cards
- [ ] Tested contact form
- [ ] No console errors found
- [ ] Page load speed acceptable
- [ ] All sections translated

**If all boxes checked = SUCCESS!** 🎊

---

*Testing Guide Created: 2026-04-23 02:05 UTC*  
*Languages Added: Portuguese (pt), Russian (ru)*  
*Total Languages Supported: 9/10*
