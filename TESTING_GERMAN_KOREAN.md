# 🧪 Testing Guide - German & Korean Translations

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

## 🇩🇪 German (Deutsch) Test

### Navigation Test:
1. Click language selector in top right
2. Select "Deutsch" or "DE"
3. Verify these menu items appear in German:
   - ✅ Lösungen (Solutions)
   - ✅ Produkte (Products)
   - ✅ Referenzen (Cases)
   - ✅ Ressourcen (Resources)
   - ✅ Über uns (About)
   - ✅ Kontakt (Contact)
   - ✅ Kostenlose Beratung (Free Consultation)

### Hero Section Test:
Check these elements display in German:
- ✅ Title: "Herstellung von Geschäftsmöbeln."
- ✅ Subtitle mentions "Zeichnungsdetails"
- ✅ Trust statement shows arrows (→) with German text
- ✅ Buttons: "Lösungen entdecken", "Experten kontaktieren"

### Product Names Test:
Verify product names in German:
- ✅ Modulares Kleiderständersystem
- ✅ Boutique-Display-Regal
- ✅ Einzelhandels-Wanddisplay
- ✅ Zentrale Insel-Display-Tisch
- ✅ Kleiderstangensystem
- ✅ Schuh-Display-Wand

### Business Hours Card Test:
On Contact page (/contact):
- ✅ Title: "Support-Zeiten (Human Team)"
- ✅ Shows: "Montag–Freitag: 9:00–18:00 Uhr (GMT+8)"
- ✅ Shows: "Samstag: 9:00–12:00 Uhr (GMT+8)"
- ✅ Shows: "Sonntag & Feiertage: Geschlossen"
- ✅ AI card title: "Außerhalb dieser Zeiten?"
- ✅ AI description mentions "24/7"

### Special Characters Test:
Verify these render correctly:
- ✅ ä (Geschäftsmöbeln)
- ✅ ö (Größen)
- ✅ ü (Führung)
- ✅ ß (Fuß, Maße)

---

## 🇰🇷 Korean (한국어) Test

### Navigation Test:
1. Click language selector
2. Select "한국어" or "KO"
3. Verify these menu items appear in Korean:
   - ✅ 솔루션 (Solutions)
   - ✅ 제품 (Products)
   - ✅ 사례 (Cases)
   - ✅ 리소스 (Resources)
   - ✅ 회사 소개 (About)
   - ✅ 연락처 (Contact)
   - ✅ 무료 매장 상담 (Free Store Consultation)

### Hero Section Test:
Check these elements display in Korean:
- ✅ Title: "상업용 가구 제조."
- ✅ Subtitle mentions "도면 세부사항"
- ✅ Trust statement shows arrows (→) with Korean text
- ✅ Buttons: "솔루션 탐색", "전문가 연락"

### Product Names Test:
Verify product names in Korean:
- ✅ 모듈식 의류 걸이 시스템
- ✅ 부티크 디스플레이 선반
- ✅ 소매 벽면 디스플레이 유닛
- ✅ 중앙 아일랜드 디스플레이 테이블
- ✅ 의류 레일 시스템
- ✅ 신발 디스플레이 월

### Business Hours Card Test:
On Contact page (/contact):
- ✅ Title: "지원 시간 (인간 팀)"
- ✅ Shows: "월요일–금요일: 오전 9:00 – 오후 6:00 (GMT+8)"
- ✅ Shows: "토요일: 오전 9:00 – 오후 12:00 (GMT+8)"
- ✅ Shows: "일요일 및 공휴일: 휴무"
- ✅ AI card title: "이 시간 외에?"
- ✅ AI description mentions "24/7"

### Hangul Characters Test:
Verify Korean characters render correctly:
- ✅ 상업용 가구 제조 (Commercial furniture manufacturing)
- ✅ 모듈식 의류 걸이 (Modular clothing rack)
- ✅ 지원 시간 (Support hours)
- ✅ 안녕하세요 (Hello - if appears anywhere)

---

## 🔍 Common Issues to Check

### Issue 1: Mixed Languages
**Problem:** Some sections show English while others show German/Korean  
**Cause:** Incomplete translation or fallback triggered  
**Fix:** Should not happen - all sections are complete  

### Issue 2: Special Characters Display as Boxes/Squares
**Problem:** ä, ö, ü, ß, or 한글 show as □□□  
**Cause:** Font doesn't support those characters  
**Fix:** Usually browser cache issue - hard refresh again  

### Issue 3: Text Overflow or Layout Breaks
**Problem:** German words too long for buttons/cards  
**Cause:** German compound words can be very long  
**Status:** Should be handled by responsive design  

### Issue 4: Language Switcher Not Working
**Problem:** Clicking language does nothing  
**Cause:** JavaScript error or caching  
**Fix:** Clear cache completely, try incognito mode  

---

## 📱 Mobile Testing

### Test on Mobile Devices:
1. Open on iPhone/Android
2. Switch to German
3. Verify:
   - ✅ Menu collapses to hamburger
   - ✅ Text readable (not too small)
   - ✅ No horizontal scrolling
   - ✅ Buttons clickable
   - ✅ Forms work properly

4. Repeat for Korean

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

### Contact Form Test (German):
1. Go to /contact
2. Switch to German
3. Fill out form:
   - Name: Test Name
   - Email: test@example.com
   - Message: Test message
4. Submit
5. Verify success message in German:
   - ✅ "Danke! Wir werden innerhalb von 24 Stunden antworten."

### Contact Form Test (Korean):
1. Go to /contact
2. Switch to Korean
3. Fill out form
4. Submit
5. Verify success message in Korean:
   - ✅ "감사합니다! 24시간 이내에 답변드리겠습니다."

---

## 📊 SEO Verification

### Meta Tags Test:
View page source (Ctrl+U) and check:

**For German:**
```html
<html lang="de">
<meta name="description" content="...German text..." />
```

**For Korean:**
```html
<html lang="ko">
<meta name="description" content="...Korean text..." />
```

---

## ✅ Success Criteria

All of the following should be true:

### German:
- [ ] All navigation items in German
- [ ] Hero section fully translated
- [ ] All 6 products have German names
- [ ] Business hours card shows German times
- [ ] AI support card in German
- [ ] Contact form labels in German
- [ ] Special characters (ä, ö, ü, ß) display correctly
- [ ] No English text mixed in (except brand names)

### Korean:
- [ ] All navigation items in Korean
- [ ] Hero section fully translated
- [ ] All 6 products have Korean names
- [ ] Business hours card shows Korean times
- [ ] AI support card in Korean
- [ ] Contact form labels in Korean
- [ ] Hangul characters display correctly
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

### If German/Korean Still Shows English:

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
# Should show: index-DNFc1VEI.js modified Apr 23 01:51
```

**Step 5:** Check translations file on server
```bash
ssh root@fixturerb2b.top "grep -c 'de:' /var/www/fixturerb2b.top/assets/js/index-*.js"
# Should return: 1 (found)
```

---

## 📞 Support

If you find any issues:

1. **Screenshot the problem**
2. **Note which language** (German or Korean)
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

- [ ] Tested German on desktop
- [ ] Tested German on mobile
- [ ] Tested Korean on desktop
- [ ] Tested Korean on mobile
- [ ] Checked special characters
- [ ] Verified business hours cards
- [ ] Tested contact form
- [ ] No console errors found
- [ ] Page load speed acceptable
- [ ] All sections translated

**If all boxes checked = SUCCESS!** 🎊

---

*Testing Guide Created: 2026-04-23 01:55 UTC*  
*Languages Added: German (de), Korean (ko)*  
*Total Languages Supported: 7/10*
