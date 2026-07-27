import type { BlogPostDataFragment } from "#gql"
import type { Block, Text, Inline } from "@contentful/rich-text-types"

export interface AssetBlock {
  sys: { id: string }
  url: string
  title: string
  description?: string
  width?: number
  height?: number
}

export interface EntryBlock {
  __typename: string
  sys: { id: string }
  title: string
  activityId: string
}

export type RichTextNode = Block | Inline | Text

export type HyperlinkNode = Inline & {
  data?: {
    uri?: string
  }
  content?: RichTextNode[]
}

export type BodyDescriptionType = {
  links?: {
    assets?: {
      block?: AssetBlock[]
    }
    entries?: {
      block?: EntryBlock[]
    }
  } | null
} & BlogPostDataFragment["bodyDescription"]
