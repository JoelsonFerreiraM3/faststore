interface SearchOptions {
  sc?: number
}

interface FilterOptions {
  fullText?: string
  categoryIds?: string[]
  specification?: {
    id: string
    value: string
  }
  price?: {
    from: number
    to: number
  }
  collectionId?: string
  productId?: string
  skuId?: string
  referenceId?: string
  sellerId?: string
  ean13?: string
  from?: number
  to?: number
}

const DEFAULT_SEARCH_OPTIONS = {
  sc: 1,
}

const SEARCH_ROOT = `/api/catalog_system/pub/products/search`

const searchByFilters = (
  {
    fullText,
    categoryIds,
    specification: spec,
    price,
    collectionId,
    productId,
    skuId,
    referenceId,
    sellerId,
    ean13,
    from,
    to,
  }: FilterOptions,
  { sc = 1 }: SearchOptions = DEFAULT_SEARCH_OPTIONS
) => {
  const querystring = [
    ['ft=', fullText],
    [
      'fq=C:',
      categoryIds && categoryIds.length > 0
        ? `/${categoryIds?.join('/')}/`
        : null,
    ],
    ['fq=specificationFilter_', spec && `${spec.id}:${spec.value}`],
    ['fq=P:', price && `[{${price.from}} TO {${price.to}}]`],
    ['fq=productClusterIds:', collectionId],
    ['fq=productId:', productId],
    ['fq=skuId:', skuId],
    ['fq=alternateIds_RefId:', referenceId],
    ['fq=alternateIds_Ean:', ean13],
    ['sc=', sc],
    ['fq=sellerId:', sellerId],
    ['_from=', from],
    ['_to=', to],
  ].reduce((acc, [label, val]) => {
    if (val == null) {
      return acc
    }
    const element = `${label}${val}`
    if (acc.length === 0) {
      return element
    }
    return `${acc}&${element}`
  }, '')

  if (querystring.length === 0) {
    return SEARCH_ROOT
  }

  return `${SEARCH_ROOT}?${querystring}`
}

export const api = {
  search: {
    byTerm: (
      term: string,
      { sc = 1 }: SearchOptions = DEFAULT_SEARCH_OPTIONS
    ) => `${SEARCH_ROOT}/${term}?sc=${sc}`,
    bySlug: (
      slug: string,
      { sc = 1 }: SearchOptions = DEFAULT_SEARCH_OPTIONS
    ) => `${SEARCH_ROOT}/${slug}/p?sc=${sc}`,
    byFilters: searchByFilters,
  },
  catalog: {
    category: {
      tree: (depth: number) => `/api/catalog_system/pub/category/tree/${depth}`,
    },
  },
  sessions: {
    segment: `/api/segments`,
  },
  tenants: {
    tenant: (tennant: string) => `/api/tenant/tenants?q=${tennant}`,
  },
}
