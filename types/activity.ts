/**
 * Generic Activity interface - agnostic from data source (Strava, Polar, etc.)
 * Used by all activity UI components (ActivityCard, Map, MetricsGrid, Header).
 */
export interface Activity {
  id: string
  name: string
  sportType: ActivitySportType
  startDate: string // ISO 8601
  movingTime: number // seconds
  distance: number // meters
  elevationGain?: number // meters
  averageSpeed?: number // m/s
  maxSpeed?: number // m/s
  averageHeartrate?: number // bpm
  maxHeartrate?: number // bpm
  calories?: number
  sufferScore?: number // Strava relative effort / Polar training_load
  prCount?: number
  map?: ActivityMap
  source: "strava" | "polar"
  externalUrl?: string // link to source (Strava activity page, Polar Flow, etc.)
}

export interface ActivityMap {
  /** Encoded polyline string (Strava format) */
  summaryPolyline?: string
  /** Raw coordinates array (Polar format) */
  coordinates?: ActivityCoordinate[]
}

export interface ActivityCoordinate {
  latitude: number
  longitude: number
  time?: string // ISO 8601 duration from start
}

export type ActivitySportType
  = | "run"
    | "trail_run"
    | "track_run"
    | "weight_training"
    | "cycling"
    | "swimming"
    | "hiking"
    | "other"
