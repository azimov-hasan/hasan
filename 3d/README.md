# Hasan — interaktiv portfolio

Qora studiya sahnasi, kirish videosi, divanlar aylanishi va shaffof hologramma ekranlari karuseli.
Oddiy HTML/CSS/JS: kutubxona, API va quruvchi kerak emas. `index.html` ni brauzerda ochsangiz ishlaydi.

## Oqim

`loading` → `intro` → `ready` → `rotating` → `dropping` → `carousel` ⇄ `detail`

1. **Yuklanish**: haqiqiy resurslar bo'yicha foiz, tayyor bo'lgach KIRISH tugmasi.
2. **Intro**: 1-video (yoki vaqtincha rasm). "Introni o'tkazib yuborish" tugmasi bor.
3. **Tugma**: MEN SIZ HAQINGIZDA BILMOQCHI EDIM faqat intro tugagach chiqadi.
4. **Aylanish**: 2-video. Tugma bosilgach qayta bosish bloklanadi.
5. **Ekranlar tushishi**: markaz birinchi, keyin atrofga.
6. **Karusel**: sichqoncha/barmoq bilan suring, o'qlar yoki klaviatura (← →). Markaziy ekranni bosing: kattalashadi. Esc yoki "EKRANLARGA QAYTISH".

## Blender videolarini ulash

1. Videolarni `assets/video/` ga qo'ying: `intro.mp4`, `rotate.mp4`.
2. `js/config.js` da `useVideo: true` qiling.

Renderga talablar:

| Talab | Qiymat |
|---|---|
| Kamera | Ikkala videoda **bir xil** va qimirlamaydi |
| 2-video boshi | 1-video oxirgi kadri bilan bir xil bo'lsin (uzluksiz o'tish uchun) |
| O'lcham | 1920×1080, 24–30 kadr/soniya |
| Ekranlar | Renderda **bo'lmasin**, ular kodda chiziladi |
| Hajm | Har biri imkon qadar 10 MB gacha (H.264, `-crf 24`) |

Siqish namunasi: `ffmpeg -i in.mp4 -c:v libx264 -crf 24 -preset slow -an -movflags +faststart intro.mp4`

## Yangi ekran qo'shish

`js/screens.js` ichidagi massivga bitta obyekt qo'shing. Karusel soni va tartibini o'zi hisoblaydi.

## Joylashtirish

Statik sayt: Vercel, Netlify yoki GitHub Pages. Maxfiy repozitoriydan Vercel/Netlify ishlaydi.
