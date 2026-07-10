export default defineEventHandler(async (event) => {
  const activityId = getRouterParam(event, "id")
  const accessToken = await getStravaAccessToken()
  return await fetchStravaActivityById(accessToken, activityId)
})
