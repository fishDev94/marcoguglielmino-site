export interface StravaTokenResponse {
  token_type: string
  access_token: string
  expires_at: number
  expires_in: number
  refresh_token: string
  athlete: StravaAthlete
}

export interface StravaAthlete {
  id: number
  username: string | null
  resource_state: number
  firstname: string
  lastname: string
  city: string | null
  state: string | null
  country: string | null
  sex: string | null
  premium: boolean
  summit: boolean
  created_at: string
  updated_at: string
}

export interface StravaActivityReference {
  id: number
  id_str: string
  resource_state: number
  visibility?: string
}

export interface StravaActivityBase {
  resource_state: number
  athlete: StravaAthleteReference
  name: string
  distance: number
  moving_time: number
  elapsed_time: number
  total_elevation_gain: number
  type: string
  sport_type: string
  workout_type: number | null
  device_name: string
  id: number
  id_str: string
  start_date: string
  start_date_local: string
  timezone: string
  utc_offset: number
  location_city: string | null
  location_state: string | null
  location_country: string | null
  achievement_count: number
  kudos_count: number
  comment_count: number
  athlete_count: number
  photo_count: number
  map: StravaMapSummary
  trainer: boolean
  commute: boolean
  manual: boolean
  private: boolean
  visibility: string
  flagged: boolean
  gear_id: string
  start_latlng?: [number, number]
  end_latlng?: [number, number]
  average_speed: number
  max_speed: number
  average_cadence?: number
  average_temp?: number
  average_watts?: number
  max_watts?: number
  weighted_average_watts?: number
  device_watts: boolean
  kilojoules?: number
  has_heartrate: boolean
  average_heartrate?: number
  max_heartrate?: number
  heartrate_opt_out?: boolean
  display_hide_heartrate_option?: boolean
  elev_high?: number
  elev_low?: number
  upload_id?: number
  upload_id_str?: string
  external_id?: string
  from_accepted_tag?: boolean
  pr_count?: number
  total_photo_count?: number
  has_kudoed?: boolean
  suffer_score?: number
  calories?: number
  description?: string | null
  perceived_exertion?: number | null
  prefer_perceived_exertion?: boolean | null
  segment_efforts?: StravaSegmentEffort[]
  splits_metric?: StravaSplit[]
  splits_standard?: StravaSplit[]
  laps?: StravaLap[]
  best_efforts?: StravaBestEffort[]
  gear?: StravaGear
  photos?: StravaPhotos
  stats_visibility?: StravaStatsVisibility[]
  hide_from_home?: boolean
  sport_image_visibility?: string
  embed_token?: string
  similar_activities?: StravaSimilarActivities
  available_zones?: string[]
}

export interface StravaActivitySummary extends StravaActivityBase {
  resource_state: 2
}

export interface StravaActivityDetail extends StravaActivityBase {
  resource_state: 3
  map: StravaMapDetail
  calories: number
  description: string | null
  perceived_exertion: number | null
  prefer_perceived_exertion: boolean | null
  segment_efforts: StravaSegmentEffort[]
  splits_metric: StravaSplit[]
  splits_standard: StravaSplit[]
  laps: StravaLap[]
  best_efforts: StravaBestEffort[]
  gear: StravaGear
  photos: StravaPhotos
  stats_visibility: StravaStatsVisibility[]
  hide_from_home: boolean
  sport_image_visibility: string
  embed_token: string
  similar_activities: StravaSimilarActivities
  available_zones: string[]
}

export type StravaActivity = StravaActivitySummary

export interface StravaActivitiesPage<T extends StravaActivity = StravaActivity> {
  items: T[]
  page: number
  perPage: number
  hasNextPage: boolean
}

export interface StravaAthleteReference {
  id: number
  id_str: string
  resource_state: number
  visibility?: string
}

export interface StravaMapSummary {
  id: string
  resource_state: number
  summary_polyline: string
}

export interface StravaMapDetail extends StravaMapSummary {
  polyline: string
}

export interface StravaSplit {
  distance: number
  elapsed_time: number
  elevation_difference: number
  moving_time: number
  split: number
  average_speed: number
  average_grade_adjusted_speed: number
  average_heartrate: number
  pace_zone: number
}

export interface StravaSegmentEffort {
  id: number
  resource_state: number
  name: string
  activity: StravaActivityReference
  athlete: StravaAthleteReference
  elapsed_time: number
  moving_time: number
  start_date: string
  start_date_local: string
  distance: number
  start_index: number
  end_index: number
  average_cadence?: number
  device_watts: boolean
  average_watts?: number
  average_heartrate?: number
  max_heartrate?: number
  segment: StravaSegment
  pr_rank?: number | null
  achievements: unknown[]
  visibility: string
  kom_rank?: number | null
  hidden: boolean
}

export interface StravaSegment {
  id: number
  resource_state: number
  name: string
  activity_type: string
  distance: number
  average_grade: number
  maximum_grade: number
  elevation_high: number
  elevation_low: number
  start_latlng: [number, number]
  end_latlng: [number, number]
  elevation_profile?: unknown | null
  elevation_profiles?: unknown | null
  climb_category: number
  city: string
  state: string
  country: string
  private: boolean
  hazardous: boolean
  starred: boolean
}

export interface StravaLap {
  id: number
  resource_state: number
  name: string
  activity: StravaActivityReference
  athlete: StravaAthleteReference
  elapsed_time: number
  moving_time: number
  start_date: string
  start_date_local: string
  distance: number
  average_speed: number
  max_speed: number
  lap_index: number
  split: number
  start_index: number
  end_index: number
  total_elevation_gain: number
  average_cadence?: number
  device_watts: boolean
  average_watts?: number
  average_heartrate?: number
  max_heartrate?: number
  pace_zone: number
}

export interface StravaBestEffort {
  id: number
  resource_state: number
  name: string
  activity: StravaActivityReference
  athlete: StravaAthleteReference
  elapsed_time: number
  moving_time: number
  start_date: string
  start_date_local: string
  distance: number
  pr_rank?: number | null
  achievements: unknown[]
  start_index: number
  end_index: number
}

export interface StravaGear {
  id: string
  primary: boolean
  name: string
  nickname: string | null
  resource_state: number
  retired: boolean
  distance: number
  converted_distance: number
}

export interface StravaPhotos {
  primary: null
  count: number
}

export interface StravaStatsVisibility {
  type: string
  visibility: string
}

export interface StravaSimilarActivities {
  effort_count: number
  average_speed: number
  min_average_speed: number
  mid_average_speed: number
  max_average_speed: number
  pr_rank?: number | null
  frequency_milestone?: unknown | null
  trend: StravaSimilarActivitiesTrend
  resource_state: number
}

export interface StravaSimilarActivitiesTrend {
  speeds: number[]
  current_activity_index: number
  min_speed: number
  mid_speed: number
  max_speed: number
  direction: number
}
