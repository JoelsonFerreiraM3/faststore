/* eslint-disable */
/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run json-schema-to-typescript to regenerate this file.
 */

export type Heading = string
export type URL = string
export type Text = string

/**
 * Adds page tag links.
 */
export interface PageTags {
  heading: Heading
  /**
   * @minItems 1
   */
  tags: [Tag, ...Tag[]]
  [k: string]: unknown
}
export interface Tag {
  url: URL
  text: Text
  [k: string]: unknown
}
