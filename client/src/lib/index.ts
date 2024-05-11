export function getCookie(key: string) {
  const cookies = document.cookie.split(";");

  for (let cookie of cookies) {
    cookie = cookie.trim();
    if (cookie.startsWith(`${key}=`)) {
      return cookie.substring(key.length + 1, cookie.length);
    }
  }
  return null;
}

export function setCookie(key: string, value: string, expiresAt: number, session = false) {
  if (!session) {
    const date = new Date();
    date.setTime(date.getTime() + expiresAt * 1000);
    document.cookie = `${key}=${value}; expires=${date.toUTCString()}; path=/; SameSite=Lax; Secure;`;
  } else {
    document.cookie = `${key}=${value}; path=/; SameSite=Lax; Secure;`;
  }
}

export function parseDate(timestamp: number[]) {
  const [year, dayOfYear, hour, minute, second, nanosecond] = timestamp;

  const date = new Date(year, 0);
  date.setDate(dayOfYear);

  const milliseconds = Math.floor(nanosecond / 1000000);

  date.setHours(hour);
  date.setMinutes(minute);
  date.setSeconds(second);
  date.setMilliseconds(milliseconds);

  return date;
}

function getDayOfYear(date: Date) {
    const start = new Date(date.getFullYear(), 0, 0);
    const diff = date - start;
    const oneDay = 1000 * 60 * 60 * 24;
    return Math.floor(diff / oneDay);
}

export function dateToOffset(date: Date) {
    const year = date.getFullYear();
    const dayOfYear = getDayOfYear(date);
    const hour = date.getUTCHours();
    const minute = date.getUTCMinutes();
    const second = date.getUTCSeconds();
    const millisecond = date.getUTCMilliseconds();
    const nanosecond = millisecond * 1000000;

    const timestamp = [year, dayOfYear, hour, minute, second, nanosecond, 0, 0, 0];
    return timestamp;
}
