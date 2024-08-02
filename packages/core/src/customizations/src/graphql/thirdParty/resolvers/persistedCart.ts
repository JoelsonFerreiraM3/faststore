import type {
  MutationSyncPersistedCartArgs,
  CartV2,
  Maybe,
} from '@generated/graphql'

import type { Context } from './context'
import {
  createOrUpdateMasterDataDocument,
  masterDataSearch,
} from '../../clients/vtex/masterData'
import { getOrderFormIdFromContext } from './orderForm'

export type PersistedCart = {
  id: string
  email: string
  cart: CartV2
  cartId: string
  revision: number
}

export const getPersistedCart = async ({
  mdResponse,
  cart,
  cartId,
  email,
  revision,
}: {
  mdResponse: PersistedCart
  cart: CartV2
  cartId: Maybe<string>
  email: string
  revision: Maybe<number>
}) => {
  const persistedCart = mdResponse.cart

  let finalCart: Maybe<CartV2> = persistedCart
  let finalRevision: Maybe<number> = mdResponse.revision

  if (cartId === mdResponse.cartId && (revision ?? 0) >= mdResponse.revision) {
    await createOrUpdateMasterDataDocument(
      'ClientCartOwnership',
      'cl-cart-ownership-schema-v1',
      { email, cartId, cart, revision },
      {},
      mdResponse.id
    )

    finalCart = cart
    finalRevision = revision
  }

  if ((revision ?? 0) < mdResponse.revision) {
    finalRevision = mdResponse.revision
  }

  if (mdResponse.revision === -1) {
    finalRevision = 1
    finalCart = persistedCart
  }

  return {
    finalCart,
    finalRevision,
  }
}

const persistedCartResolvers = {
  Mutation: {
    syncPersistedCart: async (
      _: unknown,
      args: MutationSyncPersistedCartArgs,
      context: Context
    ) => {
      const orderFormId = getOrderFormIdFromContext(context) ?? ''
      const { email, revision } = args

      const cartId = (args.cartId?.length ?? 0) > 0 ? args.cartId : orderFormId
      const { cart } = args

      if (cart && (cart?.id?.length ?? 0) === 0) {
        cart.id = cartId
      }

      if (!email) {
        return
      }

      const mdResponse = (
        await masterDataSearch<PersistedCart[]>(
          'ClientCartOwnership',
          'cl-cart-ownership-schema-v1',
          {
            _where: `(email=${email})`,
            _fields: 'id,email,cartId,cart,revision',
          }
        )
      ).find((d) => d.email)

      if (!mdResponse && cartId) {
        await createOrUpdateMasterDataDocument(
          'ClientCartOwnership',
          'cl-cart-ownership-schema-v1',
          { email, cartId, cart, revision: 0 }
        )
      }

      if (mdResponse) {
        const { finalCart, finalRevision } = await getPersistedCart({
          mdResponse,
          cart: cart as CartV2,
          cartId,
          email,
          revision,
        })

        return {
          cart: finalCart,
          revision: finalRevision,
        }
      }

      return {
        cart,
        revision: null,
      }
    },
  },
}

export default persistedCartResolvers
