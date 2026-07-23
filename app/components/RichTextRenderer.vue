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

const renderTextNode = (node: Text): VNodeChild => {
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
          alt: matchedAsset.title || "",
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
      return h(
        NuxtLinkLocale,
        {
          key: index,
          to: hyperlinkNode.data?.uri ?? "#",
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
    margin-bottom: 32px;
  }

  &__ul {
    display: block;
    list-style: disc outside none;
    margin-bottom: 24px;
    padding: 0 0 0 28px;
  }
}
</style>
