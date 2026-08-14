export const formattedPace = (averageSpeed: number) => {
  if (!averageSpeed || averageSpeed === 0) return "0:00"
  const paceSeconds = 1000 / averageSpeed
  const m = Math.floor(paceSeconds / 60)
  const s = Math.floor(paceSeconds % 60)
  return `${m}:${s.toString().padStart(2, "0")}`
}

export const formattedMovingTime = (movingTime: number) => {
  const seconds = movingTime
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = seconds % 60
  return h > 0
    ? `${h}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`
    : `${m}:${s.toString().padStart(2, "0")}`
}

export const formattedDistance = (distance: number) => (distance / 1000).toFixed(2)
