import type { Activity, ActivitySportType, ActivityCoordinate } from "~~/types/activity"

/**
 * Polar exercise data from AccessLink API (GET /v3/exercises/{exerciseId})
 */
export interface PolarExercise {
  id: string
  upload_time: string
  device: string
  device_id: string
  start_time: string
  start_time_utc_offset: number
  duration: string // ISO 8601 duration, e.g. "PT2H44M"
  calories: number
  distance: number // meters
  heart_rate?: {
    average: number
    maximum: number
  }
  training_load?: number
  sport: string
  has_route: boolean
  detailed_sport_info?: string
  running_index?: number
  fat_percentage?: number
  carbohydrate_percentage?: number
  protein_percentage?: number
  route?: PolarRoutePoint[]
  training_load_pro?: {
    date: string
    "cardio-load": number
    "muscle-load": number
    "perceived-load": number
    "cardio-load-interpretation": string
    "muscle-load-interpretation": string
    "perceived-load-interpretation": string
    "user-rpe": string
  }
}

export interface PolarRoutePoint {
  latitude: number
  longitude: number
  time: string // ISO 8601 duration from start, e.g. "PT210.026S"
  satellites?: number
  fix?: number
}

/**
 * Maps Polar sport types to our generic sport types.
 */
const mapPolarSportType = (sport: string, detailedSportInfo?: string): ActivitySportType => {
  const detailed = detailedSportInfo?.toUpperCase() || ""

  if (detailed.includes("TRAIL")) return "trail_run"
  if (detailed.includes("TRACK_AND_FIELD")) return "track_run"
  if (detailed.includes("RUNNING") || detailed.includes("JOGGING")) return "run"
  if (detailed.includes("CYCLING") || detailed.includes("BIKING")) return "cycling"
  if (detailed.includes("SWIMMING")) return "swimming"
  if (detailed.includes("HIKING")) return "hiking"
  if (detailed.includes("STRENGTH") || detailed.includes("WEIGHT")) return "weight_training"

  // Fallback by generic sport field
  const sportUpper = sport?.toUpperCase() || ""
  if (sportUpper === "RUNNING") return "run"
  if (sportUpper === "CYCLING") return "cycling"
  if (sportUpper === "SWIMMING") return "swimming"
  if (sportUpper === "OTHER") return "other"

  return "other"
}

/**
 * Parses ISO 8601 duration string to seconds.
 * E.g. "PT2H44M45S" → 9885
 */
const parseDurationToSeconds = (duration: string): number => {
  const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+(?:\.\d+)?)S)?/)
  if (!match) return 0

  const hours = Number.parseInt(match[1] || "0", 10)
  const minutes = Number.parseInt(match[2] || "0", 10)
  const seconds = Number.parseFloat(match[3] || "0")

  return hours * 3600 + minutes * 60 + Math.round(seconds)
}

/**
 * Generates a human-readable name from Polar sport type + date.
 */
const generateActivityName = (sport: string, detailedSportInfo: string | undefined, startTime: string): string => {
  const sportNames: Record<string, string> = {
    RUNNING: "Corsa",
    TRAIL_RUNNING: "Trail Run",
    TRACK_AND_FIELD_RUNNING: "Pista",
    STRENGTH_TRAINING: "Forza",
    CYCLING: "Ciclismo",
    ROAD_BIKING: "Ciclismo strada",
    MOUNTAIN_BIKING: "MTB",
    SWIMMING: "Nuoto",
    HIKING: "Escursione",
    OTHER: "Allenamento"
  }

  const key = detailedSportInfo?.toUpperCase() || sport?.toUpperCase() || "OTHER"
  const sportName = sportNames[key] || sportNames[sport?.toUpperCase()] || "Allenamento"

  const date = new Date(startTime)
  const dayMonth = new Intl.DateTimeFormat("it-IT", { day: "numeric", month: "short" }).format(date)

  return `${sportName} - ${dayMonth}`
}

/**
 * Converts a Polar exercise to our generic Activity interface.
 */
export const polarToActivity = (polar: PolarExercise): Activity => {
  const movingTime = parseDurationToSeconds(polar.duration)
  const averageSpeed = movingTime > 0 ? polar.distance / movingTime : 0

  const coordinates: ActivityCoordinate[] | undefined = polar.route?.map(point => ({
    latitude: point.latitude,
    longitude: point.longitude,
    time: point.time
  }))

  return {
    id: polar.id,
    name: generateActivityName(polar.sport, polar.detailed_sport_info, polar.start_time),
    sportType: mapPolarSportType(polar.sport, polar.detailed_sport_info),
    startDate: polar.start_time,
    movingTime,
    distance: polar.distance,
    averageSpeed,
    averageHeartrate: polar.heart_rate?.average,
    maxHeartrate: polar.heart_rate?.maximum,
    calories: polar.calories,
    sufferScore: polar.training_load,
    map: coordinates?.length
      ? { coordinates }
      : undefined,
    source: "polar",
    externalUrl: undefined // Polar Flow non ha URL pubbliche per attività
  }
}
