/**
 * Generates an SVG shimmer effect with the specified width and height.
 *
 * @param {number | string} [w='100%'] - The width of the SVG.
 * @param {number | string} [h='100%'] - The height of the SVG.
 * @returns {string} - The SVG string representing the shimmer effect.
 */
const shimmer = (w: number | string = "100%", h: number | string = "100%") => `
<svg width="${w}" height="${h}" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
  <defs>
    <linearGradient id="g">
      <stop stop-color="#0f172a" offset="20%" />
      <stop stop-color="#1e293b" offset="50%" />
      <stop stop-color="#0f172a" offset="70%" />
    </linearGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="#0f172a" />
  <rect id="r" width="${w}" height="${h}" fill="url(#g)" />
  <animate xlink:href="#r" attributeName="x" from="-${w}" to="${w}" dur="1s" repeatCount="indefinite"  />
</svg>`

/**
 * Converts a string to its Base64 representation.
 *
 * @param {string} str - The string to convert.
 * @returns {string} - The Base64 encoded string.
 */
const toBase64 = (str: string) =>
  typeof window === "undefined"
    ? Buffer.from(str).toString("base64")
    : window.btoa(str)

export { toBase64, shimmer }
