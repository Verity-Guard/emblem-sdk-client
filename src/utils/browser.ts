export function isIOSSafari() {
  if (typeof window !== 'undefined' && typeof window.navigator !== 'undefined') {
    const userAgent = window.navigator.userAgent;
    return /iP(ad|hone|od).+Safari/i.test(userAgent) && !(window as any).MSStream;
  }
  return false;
}
