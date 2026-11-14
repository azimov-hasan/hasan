// Hologramma ekranlari. Yangi ekran qo'shish: massivga bitta obyekt qo'shing, boshqa kod kerak emas.
// Maydonlar: id, title, description (kartada), icon, order, visible, kind ("hero" yoki oddiy),
// content (batafsil matn, abzaclar "\n\n" bilan), highlights (ro'yxat), media (rasmlar), links (havolalar).
// Icon: user | cap | people | briefcase
window.PORTFOLIO_SCREENS = [
  {
    id: "about", order: 1, visible: true, icon: "user",
    title: "MEN HAQIMDA", category: "shaxsiy",
    description: "Men kimman va qayerdan keldim",
    content:
      "Men Hasan Azimboyev, texnologiya va marketing kesishmasida ishlaydigan tadbirkorman. 2020-yildan beri startaplarni boshqaraman, milliy darajadagi tanlovlarda qatnashaman va yoshlarga mahsulot yaratishda mentorlik qilaman.\n\nKompyuter injiniringi bo'yicha TATU'da o'qiganman, shuning uchun g'oyani ham dizayn, ham texnik tomondan baholay olaman.",
    highlights: [
      "TATU, Kompyuter injiniringi (2021–2025)",
      "Tillar: o'zbek (ona tili), rus (yaxshi), ingliz (o'rta)"
    ]
  },
  {
    id: "students", order: 2, visible: true, icon: "cap",
    title: "O'QUVCHILARIM", category: "ta'lim",
    description: "Mentorlik va ta'lim tajribasi",
    content:
      "50 dan ortiq yosh tadbirkorga g'oyani tekshirish, MVP yaratish va marketing bo'yicha mentorlik qilganman.\n\nO'quvchilar natijalari va loyihalari tez orada shu yerga qo'shiladi."
  },
  {
    id: "hero", order: 3, visible: true, kind: "hero",
    eyebrow: "SALOM,", title: "Men Hasan", category: "kirish",
    description: "Marketing menejeri · Dasturchi · Tadbirkor",
    content:
      "G'oyani mahsulotga, mahsulotni brendga aylantiraman. Atrofdagi ekranlarni surib, men haqimda bilib oling.",
    links: [
      { label: "Telegram", url: "https://t.me/Azimboyev_h" },
      { label: "Instagram", url: "https://instagram.com/hasan.az1mov" }
    ]
  },
  {
    id: "partners", order: 4, visible: true, icon: "people",
    title: "HAMKORLARIM", category: "tarmoq",
    description: "Kompaniyalar va jamoa",
    content:
      "Hamkor kompaniyalar va birgalikdagi loyihalar ro'yxati tez orada shu yerga qo'shiladi."
  },
  {
    id: "experience", order: 5, visible: true, icon: "briefcase",
    title: "TAJRIBAM", category: "karyera",
    description: "Loyihalar va yutuqlar",
    content:
      "Startap qurish, marketing va dizayn: uchala yo'nalishda amaliy tajriba.",
    highlights: [
      "Insayr (2022 — hozir): turizm texnologiyasi platformasi, asoschi va marketing menejeri",
      "TEZOL (2023 — hozir): yetkazib berish va logistika startapi, asoschi",
      "Freelance marketing va dizayn (2022 — hozir)",
      "Asboblar: Figma, Canva, After Effects, Blender"
    ]
  }
  // Keyin qo'shish uchun namuna:
  // { id: "skills", order: 6, visible: true, icon: "user", title: "KO'NIKMALAR", description: "...", content: "..." }
];
