export default defineEventHandler(async (event) => {
  let query: Record<string, unknown> = {}

  try {
    query = getQuery(event) as Record<string, unknown>
  } catch (err) {
    console.warn("[GET Strava Activities with Query]: ", err)
  }

  const accessToken = await getStravaAccessToken()
  return await fetchStravaActivities(accessToken, query)
})
