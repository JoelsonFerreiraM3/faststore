/* eslint-disable */
/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run json-schema-to-typescript to regenerate this file.
 */

export type NameOfState = string
export type URL = string
/**
 * @maxItems 50
 */
export type States = StatesInformation[]

/**
 * State & Festival List page
 */
export interface StateFestivalLists {
  states: States
  [k: string]: unknown
}
export interface StatesInformation {
  name: NameOfState
  url: URL
  [k: string]: unknown
}
