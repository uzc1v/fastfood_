// Mijoz ma'lumotlarini tekshirish (Express'siz ham test qilish mumkin).

const NAME_RE = /^[\p{L}][\p{L}\p{M}'’ʻʼ`\- ]*$/u;

/** Telefonni +998XXXXXXXXX ko'rinishiga keltiradi. Yaroqsiz bo'lsa null qaytaradi. */
export function normalizePhone(input) {
  const digits = String(input ?? '').replace(/\D/g, '');
  let national = digits;
  if (digits.length === 12 && digits.startsWith('998')) national = digits.slice(3);
  if (national.length !== 9) return null;
  return `+998${national}`;
}

function cleanName(value) {
  return String(value ?? '').trim().replace(/\s+/g, ' ');
}

/** { ok: true, value } yoki { ok: false, message } qaytaradi. */
export function validateVisitor(body = {}) {
  const firstName = cleanName(body.firstName);
  const lastName = cleanName(body.lastName);

  if (!firstName || !lastName || !body.phone) {
    return { ok: false, message: 'Ism, familiya va telefon raqamini kiriting.' };
  }
  if (firstName.length < 2 || firstName.length > 40 || !NAME_RE.test(firstName)) {
    return { ok: false, message: "Ismni to'g'ri kiriting (kamida 2 ta harf)." };
  }
  if (lastName.length < 2 || lastName.length > 40 || !NAME_RE.test(lastName)) {
    return { ok: false, message: "Familiyani to'g'ri kiriting (kamida 2 ta harf)." };
  }
  const phone = normalizePhone(body.phone);
  if (!phone) {
    return { ok: false, message: "Telefon raqami noto'g'ri. Format: +998 90 123-45-67" };
  }
  return { ok: true, value: { firstName, lastName, phone } };
}
