export const onWindowResize = (callback: () => void) => {
  onMounted(() => {
    window.addEventListener("resize", callback)
  })

  onBeforeRouteLeave((_1, _2, next) => {
    window.removeEventListener("resize", callback)

    next()
  })
}
