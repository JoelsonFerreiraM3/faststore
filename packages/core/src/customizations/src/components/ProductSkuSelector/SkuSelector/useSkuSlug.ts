import { useCallback } from 'react'
import { SkuOption } from './SkuSelector'
import { VARIATIONS_TO_RENDER } from '../ProductSkuSelector';

function getSkuSlug(
  slugsMap: Record<string, string>,
  selectedVariations: Record<string, string>,
  dominantVariation: string
) {
  const slugsMapKey = Object.entries(selectedVariations).flat().join('-')

  if (slugsMapKey in slugsMap) {
    return slugsMap[slugsMapKey]
  }

  const possibleVariants = Object.keys(slugsMap)

  const dominantVariationKeyValue = `${dominantVariation}-${selectedVariations[dominantVariation]}`

  const slugVariationsForDominantValue = possibleVariants.filter((slug) =>
    slug.includes(dominantVariationKeyValue)
  )

  const firstVariationForDominantValue =
    slugVariationsForDominantValue.length > 1
      ? getBestMatchVariation(
          slugVariationsForDominantValue,
          dominantVariationKeyValue,
          selectedVariations
        )
      : slugVariationsForDominantValue[0]

  return slugsMap[firstVariationForDominantValue ?? possibleVariants[0]]
}

/**
 * This function transforms a slug string into a record object.
 * e.g. 'Color-Red-Size-40' => { Color: 'Red', Size: '40' }
 * @param slug
 * @returns the record object
 */
function transformSkuVariationsSlugToRecord(slug: string) {
  const obj = {} as Record<string, string>
  const parts = slug.split('-')

  for (let i = 0; i < parts.length; i += 2) {
    const key = parts[i].trim()
    const value = parts[i + 1] ? parts[i + 1].trim() : ''
    obj[key] = value
  }
  return obj
}

/**
 * This function receives a list of slug variations and a dominant variation key-value pair.
 * It returns the exact match variation value for the dominant value.
 * This happens when there are multiple variations filtered by the includes function (e.g. 7 is included in 7 and in 7.5).
 *
 *
 * e.g. given the following params:
 * slugVariationsForDominantValue = ['Color-Red-Size-7.5', 'Color-Blue-Size-7'],
 * dominantVariationKeyValue = 'Size-7'.
 *
 * The function will return 'Color-Blue-Size-7'.
 *
 * @param slugVariationsForDominantValue
 * @param dominantVariationKeyValue
 * @returns the best match variation
 */
function getBestMatchVariation(
  slugVariationsForDominantValue: string[],
  dominantVariationKeyValue: string,
  selectedVariations: Record<string, string>,
) {
  const [dominantKey, dominantValue] = dominantVariationKeyValue.split('-')
  selectedVariations[dominantKey] = dominantValue

  return slugVariationsForDominantValue.find((slug) => {
    const slugRecord = transformSkuVariationsSlugToRecord(slug)

    return matches(selectedVariations, slugRecord)
  })
}

const matches = (obj: Record<string, string>, source: Record<string, string>,) =>
  Object.keys(source).every(
    key => !VARIATIONS_TO_RENDER.includes(key) || obj.hasOwnProperty(key) && obj[key] === source[key]
  );

export const useSkuSlug = (
  activeVariations: Record<string, string>,
  slugsMap: Record<string, string>,
  skuPropertyName: string,
  getItemHrefProp?: (option: SkuOption) => string
) => {
  const getItemHref = useCallback(
    (option: SkuOption) => {
      if (getItemHrefProp) {
        return { getItemHrefProp }
      }

      const currentItemHref = `/${getSkuSlug(
        slugsMap,
        {
          ...activeVariations,
          [skuPropertyName]: option.value,
        },
        skuPropertyName
      )}/p`
      return currentItemHref
    },
    [activeVariations, getItemHrefProp, slugsMap, skuPropertyName]
  )
  return { getItemHref }
}
