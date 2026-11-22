/**
 * کتابخانه مرکزی تصاویر هنربازار — همه تصاویر دست‌چین و بصری بررسی‌شده‌اند.
 * px(): نسخه برش‌خورده و بهینه از Pexels با ابعاد دلخواه
 */
export function px(id: number, w = 800, h = 800): string {
  return `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=${w}&h=${h}`;
}

/** تصاویر هیرو (عریض) */
export const HERO = {
  bazaar: px(38528781, 1600, 640), // مغازه پارچه و صنایع‌دستی قزوین
  pottery: px(36738895, 1600, 640), // دستان سفالگر روی چرخ
  carpet: px(28438629, 1600, 640), // قالیچه‌های شیراز
  lighting: px(32381748, 1600, 640), // بازار فانوس‌های موزائیک
  painting: px(16484131, 1600, 640), // بافت رنگ روغن
  calligraphy: px(11135543, 1600, 640), // خوشنویسی فارسی
  batik: px(37853658, 1600, 640), // باتیک درخشان
  copper: px(15390906, 1600, 640), // کارگاه قلمزنی مس
};

/** تصویر شاخص هر دسته‌بندی (مربعی) */
export const CATEGORY_IMAGES: Record<string, string> = {
  carpet: px(34157887, 400, 400),
  pottery: px(7674563, 400, 400),
  textile: px(35251793, 400, 400),
  leather: px(21326994, 400, 400),
  painting: px(11135840, 400, 400),
  jewelry: px(12133443, 400, 400),
  wood: px(39365353, 400, 400),
  metal: px(32638010, 400, 400),
  decor: px(28438629, 400, 400),
  pattern: px(4610857, 400, 400),
  felt: px(39847406, 400, 400),
  lighting: px(32980208, 400, 400),
};

/** بنر عریض صفحه هر دسته‌بندی */
export const CATEGORY_BANNERS: Record<string, string> = {
  carpet: px(28438629, 1600, 400),
  pottery: px(36738895, 1600, 400),
  textile: px(35251793, 1600, 400),
  leather: px(21326994, 1600, 400),
  painting: px(11135543, 1600, 400),
  jewelry: px(12133443, 1600, 400),
  wood: px(39365357, 1600, 400),
  metal: px(15390906, 1600, 400),
  decor: px(38528781, 1600, 400),
  pattern: px(4566670, 1600, 400),
  felt: px(12024998, 1600, 400),
  lighting: px(32381748, 1600, 400),
};

/** کاور هر فروشگاه هنرمند */
export const SHOP_COVERS: Record<string, string> = {
  "laljin-pottery": px(36738895, 1200, 500),
  "kordestan-carpet": px(34084601, 1200, 500),
  "baluch-handcraft": px(35251793, 1200, 500),
  "mizan-leather": px(21326994, 1200, 500),
  "negarestan-art": px(11135543, 1200, 500),
  "firouzeh-koub": px(12133443, 1200, 500),
  "khatam-isfahan": px(39365357, 1200, 500),
  "ghalamzani-isfahan": px(15390906, 1200, 500),
  "shiraz-souvenirs": px(28438629, 1200, 500),
  "taranj-pattern": px(37853658, 1200, 500),
  "nemadineh-felt": px(12024998, 1200, 500),
  "cheraghchi-lighting": px(32381748, 1200, 500),
};

const FALLBACK_COVERS = [HERO.bazaar, HERO.pottery, HERO.carpet, HERO.lighting];

export function shopCover(slug: string): string {
  if (SHOP_COVERS[slug]) return SHOP_COVERS[slug];
  let h = 0;
  for (const ch of slug) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
  return FALLBACK_COVERS[h % FALLBACK_COVERS.length];
}
