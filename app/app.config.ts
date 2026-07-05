export default defineAppConfig({
  ui: {
    button: {
      slots: {
        base: 'rounded-none cursor-pointer'
      },

      variants: {
        outline: {
          base: 'rounded-none',
          color: 'outline-secondary'
        }
      }
    }
  }
})
