export function isSafari(): boolean {
  if (typeof navigator === 'undefined') {
    return false;
  }

  const { userAgent } = navigator;
  return userAgent.includes('AppleWebKit') && !userAgent.includes('Chrome');
}