/** 9 ta raqamni "90 123-45-67" ko'rinishida chiqaradi (kiritish paytida ham ishlaydi). */
export function formatPhoneLocal(value) {
  let d = String(value || '').replace(/\D/g, '');
  if (d.startsWith('998') && d.length > 9) d = d.slice(3);
  d = d.slice(0, 9);
  const parts = [d.slice(0, 2), d.slice(2, 5), d.slice(5, 7), d.slice(7, 9)].filter(Boolean);
  if (parts.length <= 2) return parts.join(' ');
  return `${parts[0]} ${parts[1]}${parts[2] ? '-' + parts[2] : ''}${parts[3] ? '-' + parts[3] : ''}`;
}

/** "+998901234567" -> "+998 90 123-45-67" */
export function formatPhoneFull(phone) {
  const d = String(phone || '').replace(/\D/g, '');
  if (d.length !== 12) return phone || '';
  return `+998 ${formatPhoneLocal(d.slice(3))}`;
}

export function formatDateTime(iso) {
  if (!iso) return '';
  return new Date(iso).toLocaleString('uz-UZ', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function formatPrice(price) {
  return new Intl.NumberFormat('uz-UZ').format(Number(price || 0)) + " so'm";
}