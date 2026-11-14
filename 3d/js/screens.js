// Hologramma ekranlari va pastdagi "Barcha ma'lumotlar" sahifasi shu bitta ro'yxatdan chiziladi.
// Yangi ekran qo'shish: massivga bitta obyekt qo'shing, boshqa kod kerak emas.
// Maydonlar: id, title, description (kartada), icon, order, visible, kind ("hero" yoki oddiy),
// content (abzaclar "\n\n" bilan), highlights (ro'yxat), chips (qisqa belgilar), media (rasm/video), links (havolalar).
// Icon: user | cap | people | briefcase
window.PORTFOLIO_SCREENS = [
  {
    id: "about", order: 1, visible: true, icon: "user",
    title: "MEN HAQIMDA", category: "shaxsiy",
    description: "Men kimman va qayerdan keldim",
    content:
      "Men Hasan Azimboyev, texnologiya va marketing sohasida faol tadbirkorman. 2020-yildan beri startaplarni boshqaraman, yirik tanlovlarda g'olib bo'lganman va yoshlarga innovatsion loyihalar yaratishda mentorlik qilaman.",
    highlights: [
      "Xorazm viloyati, O'zbekiston",
      "TATU, Kompyuter injiniringi bakalavri (2021–2025)",
      "Tillar: o'zbek (ona tili), rus (yaxshi), ingliz (o'rta)"
    ],
    chips: [
      "Marketing menejeri", "Raqamli marketing", "Startap mentorligi", "Kreativlik",
      "Tanqidiy fikrlash", "Liderlik", "Kompyuter fanlari",
      "Project Manager", "Blender", "After Effects", "Notion", "UX/UI dizayn", "Canva"
    ]
  },
  {
    id: "students", order: 2, visible: true, icon: "cap",
    title: "O'QUVCHILARIM", category: "ta'lim",
    description: "Mentorlik va ta'lim tajribasi",
    content:
      "50 dan ortiq yosh startap ishqibozlariga g'oyani tekshirish, MVP yaratish va marketing bo'yicha mentorlik qilganman.\n\nO'quvchilar natijalari va loyihalari tez orada shu yerga qo'shiladi.",
    chips: ["G'oyani tekshirish", "MVP yaratish", "Marketing"]
  },
  {
    id: "hero", order: 3, visible: true, kind: "hero",
    eyebrow: "SALOM,", title: "Men Hasan", category: "kirish",
    description: "Marketing menejeri · Dasturchi · Tadbirkor",
    content: "G'oyani mahsulotga, mahsulotni brendga aylantiraman.",
    links: [
      { label: "Telegram", url: "https://t.me/Azimboyev_h" },
      { label: "Instagram", url: "https://instagram.com/hasan.az1mov" },
      { label: "Blender portfolio", url: "https://t.me/Blender_3D1" }
    ]
  },
  {
    id: "partners", order: 4, visible: true, icon: "people",
    title: "HAMKORLARIM", category: "tarmoq",
    description: "Kompaniyalar va mijozlar",
    content:
      "Insayr rivojlanishi davomida mahalliy biznes hamkorliklarini yo'lga qo'yganman.\n\nHamkor kompaniyalar ro'yxati tez orada shu yerga qo'shiladi.",
    highlights: [
      "Freelance mijozlar sohalari: texnologiya, ta'lim va e-commerce"
    ]
  },
  {
    id: "experience", order: 5, visible: true, icon: "briefcase",
    title: "TAJRIBAM", category: "karyera",
    description: "Loyihalar va yutuqlar",
    content: "Startap qurish, marketing va dizayn: uchala yo'nalishda amaliy tajriba.",
    highlights: [
      "Startap mentori va tadbirkor (2021 — hozir): President Tech Awards, Mirzo Ulug'bek innovatsiya forumi, Hack Unicorn lageri va InnoWeek kabi yirik tadbirlarda qatnashgan; milliy tanlovlarda $35 000 dan ortiq grant yutgan; 50+ yoshga mentorlik qilgan",
      "Insayr, asoschi va marketing menejeri (2022 — hozir): turizm texnologiyasi platformasini yaratib ishga tushirgan; kontent strategiyasi, brend kimligi va raqamli marketingni boshqargan; foydalanuvchilar bazasini o'stirgan va mahalliy biznes hamkorliklarini yo'lga qo'ygan",
      "TEZOL, asoschi (2023 — hozir): yetkazib berish va logistika startapini ishlab chiqqan; mahsulot rivoji va operatsiyalarni boshqargan; bozorga chiqish strategiyasi va pitch deck tayyorlagan",
      "Freelancer, raqamli marketing va dizayn (2022 — hozir): brending, ijtimoiy tarmoq dizayni va UI/UX xizmatlari; asboblar: Figma, Canva, After Effects Pro, Blender"
    ]
  }
  // Keyin qo'shish uchun namuna:
  // { id: "skills", order: 6, visible: true, icon: "user", title: "KO'NIKMALAR", description: "...", content: "..." }
];
