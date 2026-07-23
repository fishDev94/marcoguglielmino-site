export const formatDate = (dateString: string, lang: string) => {
  if (!dateString) return ""

  const date = new Date(dateString)

  return new Intl.DateTimeFormat(lang, {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC"
  }).format(date)
}
