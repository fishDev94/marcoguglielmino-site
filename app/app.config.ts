export default defineAppConfig({
  ui: {
    button: {
      slots: {
        base: "rounded-none cursor-pointer"
      },

      variants: {
        outline: {
          base: "rounded-none",
          color: "outline-secondary"
        }
      }
    },
    footerColumns: {
      slots: {
        center: "grid grid-cols-2 gap-8 mb-12 lg:gap-32 lg:mb-6",
        label: "text-sm font-semibold text-(--mg-btn-text-primary) uppercase lg:hidden"
      }
    },
    separator: {
      variants: {
        color: {
          info: {
            border: "border-(--mg-color-on-surface-variant)"
          }
        }
      }
    }
  }
})
