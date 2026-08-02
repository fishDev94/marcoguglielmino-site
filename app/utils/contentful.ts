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

export function parseMonthDay(dateString: string) {
  const d = new Date(dateString)
  if (isNaN(d.getTime())) return { month: "---", day: "--", year: "" }
  const month = d.toLocaleString("en-US", { month: "short" }).toUpperCase()
  const day = d.getDate().toString().padStart(2, "0")
  const year = d.getFullYear().toString().slice(-2)
  return { month, day, year }
}

export function parseTimeToSeconds(timeString: string): number {
  const parts = timeString.trim().split(":")
  if (parts.length === 2) {
    const minutes = parseInt(parts[0] || "0")
    const seconds = parseFloat(parts[1] || "0")
    return minutes * 60 + seconds
  } else if (parts.length === 3) {
    const hours = parseInt(parts[0] || "0")
    const minutes = parseInt(parts[1] || "0")
    const seconds = parseFloat(parts[2] || "0")
    return hours * 3600 + minutes * 60 + seconds
  }
  return 0
}

export function formatTimeDifference(diffSeconds: number): string {
  const sign = diffSeconds < 0 ? "-" : "+"
  const absDiff = Math.abs(diffSeconds)

  if (absDiff >= 60) {
    const minutes = Math.floor(absDiff / 60)
    const seconds = absDiff % 60
    const formatted = `${minutes}:${seconds.toFixed(2).padStart(5, "0")}`
    return `${sign}${formatted}`
  }

  const formatted = absDiff.toFixed(2).replace(/\.?0+$/, "")
  return `${sign}${formatted}s`
}
