<template>
  <component :is="renderedContent" />
</template>

<script setup lang="ts">
import { computed, h, type VNodeChild } from "vue"
import { BLOCKS, INLINES, MARKS, type Document, type Block, type Inline, type Text } from "@contentful/rich-text-types"
import { NuxtLinkLocale, NuxtImg, StravaActivityWidget } from "#components"

interface AssetBlock {
  sys: { id: string }
  url: string
  title: string
}

interface EntryBlock {
  __typename: string
  sys: { id: string }
  title: string
  activityId: string
}

const props = defineProps<{
  customRichTextJson?: Document | null
  links?: {
    assets?: {
      block?: AssetBlock[]
    }
    entries?: {
      block?: EntryBlock[]
    }
  }
}>()

type RichTextNode = Block | Inline | Text

type HyperlinkNode = Inline & {
  data?: {
    uri?: string
  }
  content?: RichTextNode[]
}

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
      return h("p", { class: "mg-body__text" }, renderNodes((node as Block).content))
    case BLOCKS.HEADING_1:
      return h("h1", { class: "text-3xl font-semibold mb-4" }, renderNodes((node as Block).content))
    case BLOCKS.HEADING_2:
      return h("h2", { class: "text-2xl font-semibold mb-4" }, renderNodes((node as Block).content))
    case BLOCKS.HEADING_3:
      return h("h3", { class: "text-xl font-semibold mb-4" }, renderNodes((node as Block).content))
    case BLOCKS.UL_LIST:
      return h("ul", { class: "list-disc pl-6 mb-4" }, renderNodes((node as Block).content))
    case BLOCKS.OL_LIST:
      return h("ol", { class: "list-decimal pl-6 mb-4" }, renderNodes((node as Block).content))
    case BLOCKS.LIST_ITEM:
      return h("li", renderNodes((node as Block).content))
    case BLOCKS.EMBEDDED_ASSET: {
      const embeddedAssetNode = node
      const targetId = embeddedAssetNode.data?.target?.sys?.id

      // Cerca l'asset corrispondente dentro l'array dei links scaricati via GraphQL
      const assetList = props.links?.assets?.block ?? []
      const matchedAsset = assetList.find(asset => asset.sys.id === targetId)

      if (!matchedAsset?.url) return null

      // Formatta l'URL nel caso inizi con //
      const formattedUrl = matchedAsset.url.startsWith("//")
        ? `https:${matchedAsset.url}`
        : matchedAsset.url

      return h(
        NuxtImg as Component,
        {
          key: index,
          src: formattedUrl,
          alt: matchedAsset.title || "",
          class: "my-6 rounded-lg w-full object-cover" // Puoi aggiungere le tue classi CSS qui
        }
      )
    }
    case BLOCKS.EMBEDDED_ENTRY: {
      const embeddedEntryNode = node
      const targetId = embeddedEntryNode.data?.target?.sys?.id

      // Cerchiamo la entry completa nei links passati dalle props
      const entryList = props.links?.entries?.block ?? []
      const matchedEntry = entryList.find(entry => entry.sys.id === targetId)

      // LOG dei dati completi restituiti da GraphQL!
      console.log("Nodo JSON (solo ID):", embeddedEntryNode)
      console.log("Entry Completa da GraphQL:", matchedEntry)

      if (!matchedEntry) return null

      // Esempio se è StravaActivity:
      if (matchedEntry.__typename === "StravaActivity") {
        return h(StravaActivityWidget, { key: index, activityId: matchedEntry.activityId })
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
.mg-body {
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
}
</style>
