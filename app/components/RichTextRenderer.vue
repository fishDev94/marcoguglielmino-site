<template>
  <component :is="renderedContent" />
</template>

<script setup lang="ts">
import { computed, h, type VNodeChild } from "vue"
import { BLOCKS, INLINES, MARKS, type Document, type Block, type Text } from "@contentful/rich-text-types"
import { NuxtLinkLocale, NuxtImg, StravaActivityWidget } from "#components"
import type { AssetBlock, EntryBlock, RichTextNode, HyperlinkNode } from "@@/types/contentful"

const props = defineProps<{
  customRichTextJson?: Document | null
  links?: {
    assets?: {
      block?: AssetBlock[]
    }
    entries?: {
      block?: EntryBlock[]
    }
  } | null
}>()

// Regex pattern to detect email addresses
const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/

// Helper: Converts email characters into decimal HTML entities for text node protection
const encodeEmailToEntities = (email: string) => {
  return email
    .split("")
    .map(char => `&#${char.charCodeAt(0)};`)
    .join("")
}

// Handler: Safely opens the mail client on user click without revealing the email in href SSR
const handleProtectedEmailClick = (event: MouseEvent, email: string) => {
  event.preventDefault()
  window.location.href = `mailto:${email}`
}

const renderTextNode = (node: Text): VNodeChild => {
  if (!node.value) return ""

  // 1. If a raw text node contains an email address (without being wrapped in a Contentful Hyperlink)
  if (emailRegex.test(node.value)) {
    const rawEmail = node.value.match(emailRegex)?.[0] || node.value
    const safeEmailEntities = encodeEmailToEntities(rawEmail)

    return h("a", {
      href: "#",
      class: "text-blue-600 hover:underline cursor-pointer",
      innerHTML: safeEmailEntities,
      onClick: (e: MouseEvent) => handleProtectedEmailClick(e, rawEmail)
    })
  }

  // 2. Standard text node rendering with marks (bold, code, italic, etc.)
  if (!node.marks?.length) {
    return node.value
  }

  return node.marks.reduce<VNodeChild>((content, mark) => {
    switch (mark.type) {
      case MARKS.BOLD:
        return h("strong", [content])
      case MARKS.ITALIC:
        return h("em", [content])
      case MARKS.UNDERLINE:
        return h("u", [content])
      case MARKS.CODE:
        return h("code", [content])
      default:
        return content
    }
  }, node.value)
}

const renderNodes = (nodes: RichTextNode[] | undefined): VNodeChild[] => {
  if (!nodes?.length) {
    return []
  }

  return nodes.map((node, index) => renderNode(node, index))
}

const renderNode = (node: RichTextNode, index: number): VNodeChild => {
  switch (node.nodeType) {
    case BLOCKS.DOCUMENT:
      return h("div", renderNodes((node as Document).content))
    case BLOCKS.PARAGRAPH:
      return h("p", { class: "mg-richtext__text" }, renderNodes((node as Block).content))
    case BLOCKS.HEADING_1:
      return h("h1", { class: "mg-richtext__heading-1" }, renderNodes((node as Block).content))
    case BLOCKS.HEADING_2:
      return h("h2", { class: "mg-richtext__heading-2" }, renderNodes((node as Block).content))
    case BLOCKS.HEADING_3:
      return h("h3", { class: "mg-richtext__heading-3" }, renderNodes((node as Block).content))
    case BLOCKS.UL_LIST:
      return h("ul", { class: "mg-richtext__ul" }, renderNodes((node as Block).content))
    case BLOCKS.OL_LIST:
      return h("ol", { class: "mg-richtext__ol" }, renderNodes((node as Block).content))
    case BLOCKS.LIST_ITEM:
      return h("li", { class: "mg-richtext__li" }, renderNodes((node as Block).content))
    case BLOCKS.EMBEDDED_ASSET: {
      const embeddedAssetNode = node
      const targetId = embeddedAssetNode.data?.target?.sys?.id
      const assetList = props.links?.assets?.block ?? []
      const matchedAsset = assetList.find(asset => asset.sys.id === targetId)

      if (!matchedAsset?.url) return null

      const formattedUrl = matchedAsset.url.startsWith("//")
        ? `https:${matchedAsset.url}`
        : matchedAsset.url

      return h(
        NuxtImg as Component,
        {
          key: index,
          src: formattedUrl,
          provider: "contentful",
          alt: matchedAsset.title || "",
          width: matchedAsset.width,
          height: matchedAsset.height,
          sizes: "xs:100vw md:100vw xl:1400px",
          densities: "x1 x2",
          format: "webp",
          quality: "80",
          loading: "lazy",
          class: "mg-richtext__img my-6 rounded-lg w-full object-cover"
        }
      )
    }
    case BLOCKS.EMBEDDED_ENTRY: {
      const embeddedEntryNode = node
      const targetId = embeddedEntryNode.data?.target?.sys?.id
      const entryList = props.links?.entries?.block ?? []
      const matchedEntry = entryList.find(entry => entry.sys.id === targetId)

      if (!matchedEntry) return null

      if (matchedEntry.__typename === "StravaActivity") {
        return h(StravaActivityWidget, { key: index, activityId: matchedEntry.activityId, class: "mg-richtext__strava-card" })
      }

      return null
    }
    case BLOCKS.QUOTE:
      return h("blockquote", { class: "border-l-4 pl-4 italic mb-4" }, renderNodes((node as Block).content))
    case INLINES.HYPERLINK: {
      const hyperlinkNode = node as HyperlinkNode
      const uri = hyperlinkNode.data?.uri ?? "#"

      // Extract text content from children nodes to check if it contains an email
      const firstChild = hyperlinkNode.content?.[0] as Text | undefined
      const nodeText = firstChild?.value || ""

      const containsEmail = emailRegex.test(uri) || emailRegex.test(nodeText)

      if (containsEmail) {
        const rawEmail = uri.replace("mailto:", "").match(emailRegex)?.[0]
          || nodeText.match(emailRegex)?.[0]
          || ""

        if (rawEmail) {
          const safeEmailEntities = encodeEmailToEntities(rawEmail)

          return h("a", {
            key: index,
            href: "#",
            class: "text-blue-600 hover:underline cursor-pointer",
            innerHTML: safeEmailEntities,
            onClick: (e: MouseEvent) => handleProtectedEmailClick(e, rawEmail)
          })
        }
      }

      return h(
        NuxtLinkLocale,
        {
          key: index,
          to: uri,
          class: "text-blue-600 hover:underline"
        },
        {
          default: () => renderNodes(hyperlinkNode.content)
        }
      )
    }
    case "text":
      return renderTextNode(node as Text)
    default:
      return h("div", renderNodes((node as Block).content))
  }
}

const renderedContent = computed(() => {
  if (!props.customRichTextJson) {
    return h("div")
  }

  return h("div", { class: "prose max-w-none" }, renderNodes(props.customRichTextJson.content))
})
</script>

<style lang="scss" scoped>
.mg-richtext {
  &__text {
    @include body(1);

    margin-bottom: 16px;

    &:last-child {
      margin-bottom: 0;
    }

    strong {
      font-weight: 700;
    }

    em {
      font-style: italic;
    }
  }

  &__heading-1 {
    @include heading(1);
  }

  &__heading-2 {
    @include heading(2);
  }

  &__heading-3 {
    @include heading(3);

    margin-bottom: 12px;
  }

  &__img {
    margin-top: 8px;
    margin-bottom: 32px;
  }

  &__strava-card {
    margin-top: 8px;
    margin-bottom: 32px !important;
  }

  &__ul {
    display: block;
    list-style: disc outside none;
    margin-bottom: 24px;
    padding: 0 0 0 28px;
  }
}
</style>
