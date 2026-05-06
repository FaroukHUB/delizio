import type { TodayItem, Contact } from '../types';

export type DeliveryDay =
  | 'now'
  | 'tomorrow'
  | 'monday'
  | 'tuesday'
  | 'wednesday'
  | 'thursday'
  | 'friday'
  | 'saturday'
  | 'sunday';

export const DELIVERY_DAYS: DeliveryDay[] = [
  'now', 'tomorrow', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'
];

const DAY_FR: Record<Exclude<DeliveryDay, 'now'>, string> = {
  tomorrow: 'demain',
  monday: 'lundi',
  tuesday: 'mardi',
  wednesday: 'mercredi',
  thursday: 'jeudi',
  friday: 'vendredi',
  saturday: 'samedi',
  sunday: 'dimanche'
};

const DAY_AR: Record<Exclude<DeliveryDay, 'now'>, string> = {
  tomorrow: 'غداً',
  monday: 'الإثنين',
  tuesday: 'الثلاثاء',
  wednesday: 'الأربعاء',
  thursday: 'الخميس',
  friday: 'الجمعة',
  saturday: 'السبت',
  sunday: 'الأحد'
};

interface BuildArgs {
  items: TodayItem[];
  globalNote?: string;
  lang: 'fr' | 'ar';
  deliveryDay?: DeliveryDay;
}

function buildHeader(lang: 'fr' | 'ar', day: DeliveryDay): string {
  if (lang === 'ar') {
    if (day === 'now') return 'السلام ✋، أرسل لك الطلبية:';
    return `السلام ✋، أرسل لك الطلبية ليوم ${DAY_AR[day]}:`;
  }
  if (day === 'now') return "Salam ✋, je t'envoie la commande :";
  return `Salam ✋, je t'envoie la commande pour ${DAY_FR[day]} :`;
}

export function buildWhatsAppMessage({ items, globalNote, lang, deliveryDay = 'now' }: BuildArgs): string {
  const header = buildHeader(lang, deliveryDay);

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
