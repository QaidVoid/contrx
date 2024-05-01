export function getCookie(key: string) {
  const cookies = document.cookie.split(';')

  for (let cookie of cookies) {
    cookie = cookie.trim()
    if (cookie.startsWith(`${key}=`)) {
      return cookie.substring(key.length + 1, cookie.length)
    }
  }
  return null
}

export function setCookie(key: string, value: string, expiresAt: number, session = false) {
  if (!session) {
    const date = new Date()
    date.setTime(date.getTime() + expiresAt * 1000)
    document.cookie = `${key}=${value}; expires=${date.toUTCString()}; path=/; SameSite=Lax; Secure;`
  } else {
    document.cookie = `${key}=${value}; path=/; SameSite=Lax; Secure;`
  }
}