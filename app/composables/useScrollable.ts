import { DEBOUNCE_TIME, INIT_REF_NUMBER } from "@/constants"
import type { ShallowRef } from "vue"

interface WindowGlobal extends Window {
  scrollEndTimer: ReturnType<typeof setTimeout>
}
export const useScrollable = <T extends HTMLElement>(
  element: ShallowRef<T | null>,
  scrollMove: Ref<number> | number
) => {
  const maxScrollLeft = ref(INIT_REF_NUMBER)
  const scrollLeft = ref(INIT_REF_NUMBER)

  const scrollMoveRef = isRef(scrollMove) ? scrollMove : ref(scrollMove)

  const isNextDisabled = computed(
    () => maxScrollLeft.value - scrollLeft.value <= 1
  )
  const isPrevDisabled = computed(() => scrollLeft.value <= INIT_REF_NUMBER)
  const shouldShowArrows = computed(
    () => maxScrollLeft.value > INIT_REF_NUMBER
  )

  const handleScroll = (side?: "right") => {
    const moveAmount = scrollMoveRef.value

    if (element.value) {
      if (side == "right") {
        element.value.scroll({
          top: INIT_REF_NUMBER,
          left: element.value.scrollLeft + moveAmount,
          behavior: "smooth"
        })

        return
      }

      element.value.scroll({
        top: INIT_REF_NUMBER,
        left: element.value.scrollLeft - moveAmount,
        behavior: "smooth"
      })
    }
  }

  const updateScrollValue = () => {
    if (element.value) {
      scrollLeft.value = Math.trunc(element.value.scrollLeft)
      maxScrollLeft.value
        = element.value.scrollWidth - element.value.offsetWidth
    }
  }

  const scrollEnd = () => {
    clearTimeout((window as unknown as WindowGlobal).scrollEndTimer);
    (window as unknown as WindowGlobal).scrollEndTimer = setTimeout(
      updateScrollValue,
      DEBOUNCE_TIME
    )
  }

  onMounted(() => {
    updateScrollValue()

    if (element.value) {
      if ("onscrollend" in window) {
        element.value.addEventListener("scrollend", updateScrollValue)
      } else {
        element.value.addEventListener("scroll", scrollEnd)
      }
    }
  })

  onUpdated(() => {
    updateScrollValue()
  })

  onWindowResize(() => {
    updateScrollValue()
  })

  onBeforeRouteLeave((_1, _2) => {
    if (element.value) {
      if ("onscrollend" in window) {
        element.value.removeEventListener("scrollend", updateScrollValue)
      } else {
        element.value.removeEventListener("scroll", scrollEnd)
      }
    }
  })

  return { isNextDisabled, isPrevDisabled, shouldShowArrows, handleScroll }
}
