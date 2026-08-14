export const onWindowResize = (callback: () => void) => {
  onMounted(() => {
    window.addEventListener("resize", callback)
  })

  onBeforeRouteLeave((_1, _2) => {
    window.removeEventListener("resize", callback)
  })
}
