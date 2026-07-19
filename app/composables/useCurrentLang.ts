export default function useCurrentLang() {
  const { locale } = useI18n()

  return locale.value
}
