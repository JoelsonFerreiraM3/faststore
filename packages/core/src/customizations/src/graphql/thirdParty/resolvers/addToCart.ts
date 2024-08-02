import type { MutationAddToCartArgs } from '@generated/graphql'

import { getSessionFromContext } from './sessionToken'
import { account } from '../../../../faststore.config'
import { getOrderFormIdFromContext } from './orderForm'
import type { Context } from './context'

type UpstreamResponse =
  | {
      data: {
        addToCart?: {
          id: string
        }
      }
    }
  | {
      data: null
      errors: Array<{
        message: string
      }>
    }

// Proxy to checkout-graphql addToCart
export async function addToCart(
  _: unknown,
  args: MutationAddToCartArgs,
  context: Context
) {
  const token = getSessionFromContext(context)
  const orderFormId = getOrderFormIdFromContext(context)

  if (!token) {
    throw new Error('Unauthorized')
  }

  const response = await fetch(
    `https://${account}.myvtex.com/_v/private/graphql/v1`,
    {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        cookie: `vtex_session=${token}`,
      },
      body: JSON.stringify({
        operationName: 'addToCart',
        query: `
          mutation addToCart($orderFormId: ID!, $items: [ItemInput!]) {
            addToCart(orderFormId: $orderFormId, items: $items)
              @context(provider: "vtex.checkout-graphql") {
              id
            }
          }
        `,
        variables: {
          orderFormId,
          items: args.items,
        },
      }),
    }
  )

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const json: UpstreamResponse = await response.json()

  return json.data?.addToCart?.id
}
