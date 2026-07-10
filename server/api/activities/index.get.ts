export default defineEventHandler(async () => {
  const accessToken = await getStravaAccessToken()
  return await fetchStravaActivities(accessToken)
})
