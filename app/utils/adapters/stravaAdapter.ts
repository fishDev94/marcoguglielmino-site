import type { StravaActivityBase } from "~~/types/strava"
import type { Activity, ActivitySportType } from "~~/types/activity"

/**
 * Maps Strava sport types to our generic sport types.
 */
const mapStravaSportType = (type: string): ActivitySportType => {
  const mapping: Record<string, ActivitySportType> = {
    Run: "run",
    TrailRun: "trail_run",
    VirtualRun: "run",
    WeightTraining: "weight_training",
    Ride: "cycling",
    VirtualRide: "cycling",
    Swim: "swimming",
    Hike: "hiking"
  }
  return mapping[type] || "other"
}

/**
 * Converts a Strava activity to our generic Activity interface.
 */
export const stravaToActivity = (strava: StravaActivityBase): Activity => {
  return {
    id: String(strava.id),
    name: strava.name,
    sportType: mapStravaSportType(strava.type),
    startDate: strava.start_date_local,
    movingTime: strava.moving_time,
    distance: strava.distance,
    elevationGain: strava.total_elevation_gain,
    averageSpeed: strava.average_speed,
    maxSpeed: strava.max_speed,
    averageHeartrate: strava.average_heartrate,
    maxHeartrate: strava.max_heartrate,
    calories: strava.calories,
    sufferScore: strava.suffer_score,
    prCount: strava.pr_count,
    map: strava.map?.summary_polyline
      ? { summaryPolyline: strava.map.summary_polyline }
      : undefined,
    source: "strava",
    externalUrl: `https://www.strava.com/activities/${strava.id}`
  }
}
