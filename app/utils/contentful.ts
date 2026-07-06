import type { HomepageQuery } from "#gql"

export const getHomePageData = (data: HomepageQuery) => {
  const homepageData = data?.homepageCollection?.items[0]
  if (!homepageData) {
    throw new Error("Homepage data not found")
  }
  return homepageData
}
