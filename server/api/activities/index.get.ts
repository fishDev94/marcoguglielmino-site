export default defineEventHandler(async (event) => {
  const query = getQuery(event)

  const accessToken = await getStravaAccessToken()
  return await fetchStravaActivities(accessToken, query)
})
