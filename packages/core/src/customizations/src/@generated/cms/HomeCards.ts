/* eslint-disable */
/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run json-schema-to-typescript to regenerate this file.
 */

export type HeadingText = string
export type Text = string
export type URL = string
export type Color =
  | 'default'
  | 'neutralDark'
  | 'neutralLight'
  | 'naked'
  | 'important'
export type Size = 'small' | 'medium' | 'large'
export type ShowTheImageOnMobileView = boolean
/**
 * @minItems 3
 * @maxItems 4
 */
export type ItemsArray = [Card, Card, Card] | [Card, Card, Card, Card]
export type Image1 = string
export type AlternativeText = string
export type Image2 = string
export type AlternativeText1 = string
export type Heading = string
export type Copy = string
export type URL1 = string
/**
 * Select "Eager" when this section appears above the fold.
 */
export type ImageLoadingStrategy = 'lazy' | 'eager'

export interface HomeCards {
  header: Header
  showImagesOnMobile?: ShowTheImageOnMobileView
  cards: ItemsArray
  imageLoadingStrategy: ImageLoadingStrategy
  [k: string]: unknown
}
export interface Header {
  headingText?: HeadingText
  cta: CallToAction
  [k: string]: unknown
}
export interface CallToAction {
  text?: Text
  url?: URL
  color: Color
  size: Size
  [k: string]: unknown
}
export interface Card {
  image: Image
  icon: Icon
  heading?: Heading
  copy?: Copy
  url: URL1
  [k: string]: unknown
}
export interface Image {
  src?: Image1
  alt?: AlternativeText
  [k: string]: unknown
}
export interface Icon {
  src?: Image2
  alt?: AlternativeText1
  [k: string]: unknown
}
