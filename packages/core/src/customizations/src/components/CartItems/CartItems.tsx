import { useState, useEffect } from 'react'
import { gql } from '@generated/gql'
import { useCart, cartStore } from 'src/sdk/cart'
import { useQuery } from 'src/sdk/graphql/useQuery'
import type { GetOrderFormQuery } from '@generated/graphql'
import type { CartItem as CartItemProp } from 'src/sdk/cart/index'

import CartItem from './CartItem'
import { parseJson } from '../../utils/parseJson'
import { getCustomDataFields } from '../../utils/orderForm'
import type {
  CustomDataOpenExtraParts,
  CustomDataFolderImprinting,
} from '../../typings/orderForm'
import { getLatestItems } from '../../utils/productData'
import { useUpdateMinQuantity } from '../../hooks/useUpdateMinQuantity'

const GET_ORDER_FORM = gql(`
  query getOrderForm($id: String!) {
    orderForm(id: $id) {
      orderFormId
      customData {
        customApps {
          id
          major
          fields {
            key
            value
          }
        }
      }
    }
  }
`)

type CartItemsProps = {
  isCartPage?: boolean
}

export const removeImprintingItems = (
  items: CartItemProp[]
): CartItemProp[] => {
  return items.filter((item) => !/FIM|FIU|FIL/.test(item.itemOffered.gtin))
}

export const getTotalQuantity = (items: CartItemProp[]): number => {
  const filteredItems = removeImprintingItems(items)

  return filteredItems.reduce((n, { quantity }) => n + quantity, 0)
}

const CartItems = ({ isCartPage = false }: CartItemsProps) => {
  useUpdateMinQuantity()
  let { items } = useCart()

  items = removeImprintingItems(items)
  const latestItems = getLatestItems(items)
  const cart = cartStore.read()
  const [openExtraParts, setOpenExtraParts] =
    useState<CustomDataOpenExtraParts>()

  const [folderImprinting, setFolderImprinting] =
    useState<CustomDataFolderImprinting>()

  const [validateImprinting, setValidateImprinting] = useState(false)

  const { data } = useQuery<GetOrderFormQuery>(GET_ORDER_FORM, {
    id: cart.id,
  })

  useEffect(() => {
    if (!data) {
      return
    }

    const openExtraPartsString = getCustomDataFields({
      orderForm: data,
      appId: 'extraparts',
    })?.[0].value

    const folderImprintingString = getCustomDataFields({
      orderForm: data,
      appId: 'folderimprinting',
    })?.[0].value

    if (openExtraPartsString) {
      setOpenExtraParts(
        parseJson<CustomDataOpenExtraParts>(openExtraPartsString)
      )
    }

    if (folderImprintingString) {
      setFolderImprinting(
        parseJson<CustomDataFolderImprinting>(folderImprintingString)
      )
    }
  }, [data])

  const cartItems = isCartPage ? items : latestItems

  return (
    <>
      {cartItems.map((item) => (
        <CartItem
          key={item.id}
          item={item}
          isCartPage={isCartPage}
          openExtraParts={openExtraParts?.[item.itemOffered.gtin]}
          folderImprinting={folderImprinting?.[item.itemOffered.gtin]}
          validateImprinting={validateImprinting}
          setValidateImprinting={setValidateImprinting}
        />
      ))}
    </>
  )
}

export default CartItems
