export function localeStrToLocale(str: string) {
  if (str.startsWith('en')) {
    return 'en';
  }
  return 'is';
}
