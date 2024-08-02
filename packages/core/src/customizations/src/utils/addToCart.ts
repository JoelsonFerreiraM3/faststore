import { CartItem, cartStore } from 'src/sdk/cart'

import type { Product, ProductFullVariantList } from '../typings/product'

export type AddToCart = {
  sku: Product | ProductFullVariantList[0]
  isVariantOf: Product['isVariantOf']
  brand: Product['brand']
  quantity: number
  timestamp: number
}

export const addToCart = ({
  sku,
  isVariantOf,
  brand,
  quantity = 1,
  timestamp,
}: AddToCart) => {
  const {
    sku: skuID,
    gtin,
    name,
    image,
    additionalProperty,

    offers: {
      offers: [{ price, listPrice, seller }],
    },
  } = sku

  const item: Omit<CartItem, 'id'> = {
    price,
    listPrice,
    seller,
    quantity,
    priceWithTaxes: price,
    listPriceWithTaxes: listPrice,
    itemOffered: {
      sku: skuID,
      name,
      gtin,
      image,
      brand,
      isVariantOf,
      additionalProperty,
      unitMultiplier: null,
    },
  }

  cartStore.addItem(item)
}
