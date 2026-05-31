export const WHITELIST_LIMITS = Object.freeze({
  full_name: 120,
  discord_username: 120,
  ageMin: 16,
  ageMax: 100,
  rp_experience: 120,
  online_time: 120,
  source: 120,
  short_description: 80,
  why_join: 2000,
  backstoryMinWords: 300,
  backstoryMaxWords: 2000
});

export function normalizeSpaces(value = '') {
  return String(value ?? '').trim().replace(/\s+/g, ' ');
}

export function countWords(text = '') {
  return normalizeSpaces(text).split(/\s+/).filter(Boolean).length;
}

export function validateDefault(text) {
  const words = countWords(text);
  if (words < WHITELIST_LIMITS.backstoryMinWords) return `Tối thiểu ${WHITELIST_LIMITS.backstoryMinWords} chữ`;
  if (words > WHITELIST_LIMITS.backstoryMaxWords) return `Tối đa ${WHITELIST_LIMITS.backstoryMaxWords} chữ`;
  return '';
}

export function validateReason(text) {
  const words = countWords(text);
  if (words < 30) return 'Tối thiểu 30 chữ';
  if (words > 200) return 'Tối đa 200 chữ';
  return '';
}

export function validateWhitelistPayload(input = {}) {
  const required = ['full_name', 'age', 'rp_experience', 'online_time', 'source', 'short_description', 'backstory', 'why_join'];
  for (const field of required) {
    if (!normalizeSpaces(input[field])) return { ok: false, error: `Thiếu thông tin: ${field}` };
  }

  const data = {
    full_name: normalizeSpaces(input.full_name),
    age: Number(normalizeSpaces(input.age)),
    rp_experience: normalizeSpaces(input.rp_experience),
    online_time: normalizeSpaces(input.online_time),
    source: normalizeSpaces(input.source) || 'Kiểm Soát Chất Lượng',
    short_description: normalizeSpaces(input.short_description),
    backstory: String(input.backstory || '').trim(),
    why_join: String(input.why_join || '').trim()
  };

  const maxChecks = [
    ['full_name', 'Họ và tên'],
    ['rp_experience', 'Giới tính'],
    ['online_time', 'Khung giờ online'],
    ['source', 'Nguồn whitelist'],
    ['short_description', 'Tên nhân vật']
  ];

  for (const [field, label] of maxChecks) {
    if (data[field].length > WHITELIST_LIMITS[field]) {
      return { ok: false, error: `${label} tối đa ${WHITELIST_LIMITS[field]} ký tự.` };
    }
  }

  if (data.why_join.length > WHITELIST_LIMITS.why_join) {
    return { ok: false, error: `Cam kết luật server tối đa ${WHITELIST_LIMITS.why_join} ký tự.` };
  }

  if (!/^[\p{L}\s]+$/u.test(data.full_name)) {
    return { ok: false, error: 'Họ và tên chỉ được ghi chữ, có thể dùng dấu tiếng Việt, không dùng số/ký tự đặc biệt.' };
  }

  if (!/^[\p{L}\s]+$/u.test(data.rp_experience)) {
    return { ok: false, error: 'Giới tính chỉ được ghi bằng chữ, không dùng số/ký tự đặc biệt.' };
  }

  if (!/^[\p{L}\s0-9/:.,\-]+$/u.test(data.online_time)) {
    return { ok: false, error: 'Khung giờ online chỉ được dùng chữ, số, khoảng trắng và các ký tự / : . , -' };
  }

  if (!Number.isInteger(data.age) || data.age < WHITELIST_LIMITS.ageMin || data.age > WHITELIST_LIMITS.ageMax) {
    return { ok: false, error: `Tuổi phải là số hợp lệ từ ${WHITELIST_LIMITS.ageMin} đến ${WHITELIST_LIMITS.ageMax}.` };
  }

  const backstoryWords = countWords(data.backstory);
  if (backstoryWords < WHITELIST_LIMITS.backstoryMinWords || backstoryWords > WHITELIST_LIMITS.backstoryMaxWords) {
    return { ok: false, error: `Tiểu sử nhân vật phải từ ${WHITELIST_LIMITS.backstoryMinWords} đến ${WHITELIST_LIMITS.backstoryMaxWords} chữ.` };
  }

  if (!/^[a-zA-Z\s]+$/.test(data.short_description)) {
    return { ok: false, error: 'Tên nhân vật chỉ được dùng chữ không dấu và không dùng số/ký tự đặc biệt.' };
  }

  if (!/^\S+\s+\S+/.test(data.short_description)) {
    return { ok: false, error: 'Tên nhân vật phải bao gồm Họ và Tên rõ ràng.' };
  }

  return { ok: true, data };
}
