/* eslint-disable @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-assignment */
import { useState } from 'react'
import NextLink from 'next/link'
// import { SkuSelector } from '@faststore/ui'
import SkuSelector from './SkuSelector'
import type { ServerProductQueryQuery } from '@generated/graphql'

import SizeGuideModal from '../SizeGuideModal/SizeGuideModal'
import RulerIcon from '../Icons/General/RulerIcon'
import { useScroll } from '../../hooks/useScroll'
import { getSpec } from '../../utils/productData'

import styles from './ProductSkuSelector.module.scss'

export const VARIATIONS_TO_RENDER = ['Size', 'Color', 'Material', 'Unit Count']

type ProductSkuSelectorProps = {
  product: ServerProductQueryQuery['product']
}
type FullVariantList = ServerProductQueryQuery["product"]["isVariantOf"]["fullVariantList"]
type SkuVariants = ServerProductQueryQuery["product"]["isVariantOf"]["skuVariants"]

function buildAvailableVariations(fullVariantList: FullVariantList, skuVariants: SkuVariants) {
  if(!skuVariants) {
    return {}
  }

  const builded = fullVariantList.map(item => {
    return item.additionalProperty.filter(prop => VARIATIONS_TO_RENDER.includes(prop.name))
  })

  return VARIATIONS_TO_RENDER.reduce((acc, variationKey) => {
    if (!skuVariants.availableVariations[variationKey]) {
      return acc
    }

    return {
      ...acc,
      [variationKey]: skuVariants.availableVariations[variationKey]?.map((variation: any) => {
        const res = Object.fromEntries(
          Object
            .entries(skuVariants.activeVariations)
            .filter(([key]) => VARIATIONS_TO_RENDER.includes(key))
            .map(([key, value]) => (key === variationKey) ?
              [key, variation.value] :
              [key, value]
            )
        )

        const exists = builded.some(vars =>
          vars.every(vari => {
            const currentKeyIndex = VARIATIONS_TO_RENDER.indexOf(variationKey)
            const combinationKeyIndex = VARIATIONS_TO_RENDER.indexOf(vari.name)

            return currentKeyIndex < combinationKeyIndex || res[vari.name] === vari.value
          })
        )

        return {...variation, disabled: !exists}
      })
    }
  }, {})
}

const ProductSkuSelector = ({ product }: ProductSkuSelectorProps) => {
  const { blockScroll, allowScroll } = useScroll()
  const [sizeGuideModalIsOpen, setSizeGuideModalIsOpen] = useState(false)
  const isShoes = getSpec(product.additionalProperty, 'Format') === 'Shoes'

  const {
    isVariantOf: { skuVariants, fullVariantList },
  } = product

  if (!skuVariants?.availableVariations) {
    return null
  }

  const availableVariations = buildAvailableVariations(fullVariantList, skuVariants)

  const toggleSizeGuideModalIsOpen = () => {
    setSizeGuideModalIsOpen((prev) => !prev)
    !sizeGuideModalIsOpen ? blockScroll() : allowScroll()
  }

  return (
    <>
      {Object.keys(skuVariants.availableVariations).map((variation) => {
        const showVariation = VARIATIONS_TO_RENDER.find(
          (item) => item === variation
        )

        if (!showVariation) {
          return null
        }

        return (
          <div
            key={variation}
            className={styles.variantSectionWrapper}
            data-variation={variation}
          >
            <SkuSelector
              variant="label"
              key={variation}
              skuPropertyName={variation}
              availableVariations={availableVariations}
              activeVariations={skuVariants.activeVariations}
              slugsMap={skuVariants.slugsMap}
              linkProps={{ as: NextLink, legacyBehavior: false, scroll: false }}
            />

            {isShoes && variation === 'Size' && (
              <>
                <button
                  aria-pressed={sizeGuideModalIsOpen}
                  className={styles.sizeGuideButton}
                  onClick={toggleSizeGuideModalIsOpen}
                  type="button"
                >
                  <RulerIcon /> Size Guide
                </button>

                {sizeGuideModalIsOpen && (
                  <SizeGuideModal toggleOpen={toggleSizeGuideModalIsOpen} />
                )}
              </>
            )}
          </div>
        )
      })}
    </>
  )
}

export default ProductSkuSelector
