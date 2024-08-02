import { gql } from '@generated/gql'
import type {
  AddToListMutation,
  CreateListMutation,
  ListByIdQuery,
  ListByIdQueryVariables,
  UpdateListItemMutation,
  UpdateListMutation,
  ViewListsQuery,
  ViewListsQueryVariables,
} from '@generated/graphql'
import { request } from 'src/sdk/graphql/request'
import { useQuery } from 'src/sdk/graphql/useQuery'
import { useSession } from 'src/sdk/session'

export const viewListQuery = gql(`
  query ViewLists {
    getWishlistsByEmail {
      id
      email
      wishlistType
      products {
        ID
        Image
        linkProduct
        nameProduct
        quantityProduct
        skuCodeReference
        department
        bundle
        notes
      }
      isPublic
      fieldsConfig {
        department
        description
      }
      createdIn
    }
  }
`)

export const listByIdQuery = gql(`
  query listById($id: ID!) {
    getWishlist(id: $id) {
       id
      email
      wishlistType
      products {
        ID
        Image
        linkProduct
        nameProduct
        quantityProduct
        skuCodeReference
        department
        bundle
        notes
      }
      isPublic
      fieldsConfig {
        department
        description
      }
      createdIn
    }
  }
`)

export const createListMutation = gql(`
  mutation CreateList($wishlist: WishlistInput!) {
    createWishlist(wishlist: $wishlist) {
      Id
    }
  }
`)

export const addListMutation = gql(`
  mutation AddToList($wishlist: WishlistInput) {
    updateWishlist(wishlist: $wishlist) {
      id
    }
  }
`)

export const updateListItemMutation = gql(`
  mutation UpdateListItem($wishlist: WishlistInput) {
    updateWishlist(wishlist: $wishlist) {
      id
    }
  }
`)

export const updateListMutation = gql(`
  mutation UpdateList($wishlist: WishlistInput) {
    updateWishlist(wishlist: $wishlist) {
      id
    }
  }
`)

export type Wishlist = {
  id: string | null
  email: string | null
  wishlistType: string | null
  isPublic: boolean | null
  createdIn: string | null
  products: Array<{ ID: number | null; notes: string | null } | null> | null
  fieldsConfig: {
    department: string | null
    description: string | null
  } | null
}

export type WishlistProduct = {
  ID: number
  Image: string
  linkProduct: string
  nameProduct: string
  quantityProduct: number
  skuCodeReference: string
  department: string
  bundle: number
  notes: string
}

export function useWishlist() {
  const { person } = useSession()

  const {
    data: lists,
    mutate,
    isValidating,
  } = useQuery<ViewListsQuery, ViewListsQueryVariables>(
    viewListQuery,
    {},
    {
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      doNotRun: !person?.id,
    }
  )

  const createList = async (name: string, products: WishlistProduct[] = []) => {
    const { createWishlist: list } = await request<CreateListMutation>(
      createListMutation,
      {
        wishlist: {
          wishlistType: name.replace(' ', '_'),
          products,
          isPublic: false,
        },
      }
    )

    await mutate()

    return list
  }

  const addToList = async (listId: string, product: WishlistProduct[]) => {
    const { getWishlist: wishlist } = await request<
      ListByIdQuery,
      ListByIdQueryVariables
    >(listByIdQuery, { id: listId })

    if (!wishlist) {
      throw new Error('Wishlist not found')
    }

    const { updateWishlist: list } = await request<AddToListMutation>(
      addListMutation,
      {
        wishlist: {
          id: wishlist.id,
          products: [...(wishlist.products ?? []), ...product],
          wishlistType: wishlist.wishlistType,
          isPublic: wishlist.isPublic,
          fieldsConfig: wishlist.fieldsConfig,
        },
      }
    )

    await mutate()

    return list
  }

  const removeFromList = async (listId: string, skuIds: string[]) => {
    const { getWishlist: wishlist } = await request<
      ListByIdQuery,
      ListByIdQueryVariables
    >(listByIdQuery, { id: listId })

    if (!wishlist || !wishlist?.products?.length) {
      throw new Error('Wishlist not found')
    }

    const newWishlistProducts = wishlist.products.filter(
      (product) => product?.ID && !skuIds.includes(product?.ID?.toString())
    )

    const { updateWishlist: list } = await request<UpdateListItemMutation>(
      updateListItemMutation,
      {
        wishlist: {
          id: wishlist.id,
          products: newWishlistProducts,
          wishlistType: wishlist.wishlistType,
          isPublic: wishlist.isPublic,
          fieldsConfig: wishlist.fieldsConfig,
        },
      }
    )

    await mutate()

    return list
  }

  const updateListItem = async (listId: string, skuId: string, notes = '') => {
    const { getWishlist: wishlist } = await request<
      ListByIdQuery,
      ListByIdQueryVariables
    >(listByIdQuery, { id: listId })

    if (!wishlist || !wishlist.products?.length) {
      throw new Error('Wishlist not found')
    }

    const updatedProduct = {
      ...wishlist.products.find(
        (product) => product?.ID && product?.ID.toString() === skuId
      ),
      notes,
    }
    const index = wishlist.products.findIndex(
      (prod) => prod?.ID?.toString() === skuId
    )

    if (index !== -1) {
      wishlist?.products?.splice(index, 1)
    }

    const { updateWishlist: list } = await request<UpdateListItemMutation>(
      updateListItemMutation,
      {
        wishlist: {
          id: listId,
          products: [...wishlist.products, updatedProduct],
          wishlistType: wishlist.wishlistType,
          isPublic: wishlist.isPublic,
          fieldsConfig: wishlist.fieldsConfig,
        },
      }
    )

    await mutate()

    return list
  }

  const updateList = async (listId: string, name?: string, notes?: string) => {
    const wishlist = lists?.getWishlistsByEmail?.find(
      (listItem) => listItem?.id === listId
    )

    if (!wishlist) {
      throw new Error('Wishlist not found')
    }

    const { updateWishlist: list } = await request<UpdateListMutation>(
      updateListMutation,
      {
        wishlist: {
          id: wishlist.id,
          wishlistType: name?.replace(' ', '_'),
          fieldsConfig: {
            ...wishlist.fieldsConfig,
            description: notes,
          },
          products: wishlist.products,
          isPublic: wishlist.isPublic,
        },
      }
    )

    await mutate()

    return list
  }

  return {
    lists: lists?.getWishlistsByEmail ?? [],
    addToList,
    removeFromList,
    createList,
    updateListItem,
    updateList,
    revalidate: mutate,
    loading: isValidating || !person?.id,
  }
}
