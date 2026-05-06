import type { TodayItem, Contact } from '../types';

interface BuildArgs {
  items: TodayItem[];
  globalNote?: string;
  lang: 'fr' | 'ar';
}

export function buildWhatsAppMessage({ items, globalNote, lang }: BuildArgs): string {
  const today = new Date().toLocaleDateString(lang === 'ar' ? 'ar-MA' : 'fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  const header =
    lang === 'ar'
      ? `📋 قائمة التموين ليوم ${today}`
      : `📋 Liste réapprovisionnement du ${today}`;

  const lines = items.map((it) => {
    const fr = it.product?.name ?? '?';
    const ar = it.product?.name_ar;
    const name = ar ? `${fr} / ${ar}` : fr;
    const note = it.note ? ` (${it.note})` : '';
    return `• ${name} x${it.qty}${note}`;
  });

  const noteLine = globalNote
    ? `\n\n${lang === 'ar' ? 'ملاحظة' : 'Remarque'} : ${globalNote}`
    : '';

  return `${header}\n\n${lines.join('\n')}${noteLine}`;
}

export function buildWhatsAppLink(contact: Contact, message: string): string {
  const phone = contact.phone.replace(/[^\d]/g, '');
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}
