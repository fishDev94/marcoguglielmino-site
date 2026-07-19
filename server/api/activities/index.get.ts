export default defineEventHandler(async (event) => {
  const queryString = (event.path || "").split("?")[1] || ""
  const query = Object.fromEntries(new URLSearchParams(queryString))

  const accessToken = await getStravaAccessToken()
  return await fetchStravaActivities(accessToken, query)
})
