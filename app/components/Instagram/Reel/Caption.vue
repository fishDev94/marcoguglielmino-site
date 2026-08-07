<script lang="ts">
import { defineComponent, h, type VNodeChild } from "vue"

/**
 * Renders a reel caption with highlighted hashtags using render functions.
 * Avoids v-html and XSS risks.
 */
export default defineComponent({
  props: {
    text: {
      type: String,
      default: ""
    }
  },
  setup(props) {
    const renderCaption = (): VNodeChild[] => {
      if (!props.text) return []

      // Split text by hashtag pattern, keeping the hashtags in the result
      const parts = props.text.split(/(#\w+)/g)

      return parts.map((part) => {
        if (part.match(/^#\w+$/)) {
          return h("span", { class: "mg-reel-hashtag" }, part)
        }
        return part
      })
    }

    return () => h("p", renderCaption())
  }
})
</script>
