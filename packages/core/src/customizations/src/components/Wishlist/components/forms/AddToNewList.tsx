import { useState, type FormEvent } from 'react'
import { Button, Label, TextArea, Input, useUI } from '@faststore/ui'
import { useProductsQuery } from '@faststore/core'

import { useWishlist } from '../../../../hooks/useWishlist'
import styles from './ListForm.module.scss'
import { SkuItem } from '../../AddToWishlistButton'

type AddToNewWishlistFormProps = { skuItems: SkuItem[]; onSubmit?: () => void }

const AddToNewWishlistForm = ({
  skuItems,
  onSubmit,
}: AddToNewWishlistFormProps) => {
  const { createList } = useWishlist()
  const { pushToast } = useUI()
  const [isSubmiting, setIsSubmiting] = useState(false)
  const skuIds = skuItems.map((item) => item.skuId)

  const term = `sku:${skuIds.join(';')}`

  const productQuery = useProductsQuery({
    term,
  })

  const skus = productQuery?.search.products.edges.flatMap((edge) => {
    const filteredVariants = edge.node.isVariantOf.fullVariantList.filter(
      (variant) => {
        return skuItems.some((item) => item.skuId === variant.sku)
      }
    )

    return filteredVariants.map((variant) => {
      const skuItem = skuItems.find((item) => item.skuId === variant.sku)
      const quantity = skuItem ? skuItem.quantity : 1 // Default to 1 if quantity not found

      return {
        ...variant,
        quantityProduct: quantity,
      }
    })
  })

  const handleCreateNewList = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    event.stopPropagation()

    setIsSubmiting(true)

    try {
      const data = new FormData(event.currentTarget)

      const name = data.get('wishlist-name')?.toString()
      const notes = data.get('wishlist-item-notes')?.toString()

      if (name && skus) {
        await createList(
          name,
          skus.map((sku) => ({
            ID: Number(sku?.sku ?? ''),
            Image: sku?.image[0].url ?? '',
            linkProduct: `/${sku?.slug ?? ''}/p`,
            nameProduct: sku?.name ?? '',
            quantityProduct: sku.quantityProduct,
            skuCodeReference: sku?.gtin ?? '',
            department: '',
            bundle: 1,
            notes: notes ?? '',
          }))
        )

        pushToast({
          message: 'You created a new Wishlist and your product was added',
          status: 'INFO',
        })
      }

      if (onSubmit) {
        onSubmit()
      }
    } finally {
      setIsSubmiting(false)
    }
  }

  return (
    <form
      className={styles.formContainer}
      onSubmit={(event) => {
        void handleCreateNewList(event)
      }}
    >
      <div data-fs-input-container>
        <Label htmlFor="wishlist-name">List Name</Label>
        <Input data-fs-custom-input id="wishlist-name" name="wishlist-name" />
      </div>

      {skuItems.length === 1 && (
        <div data-fs-input-container>
          <Label htmlFor="wishlist-item-notes">
            Add a Note to this item (optional)
          </Label>
          <TextArea
            data-fs-custom-textarea
            id="wishlist-item-notes"
            name="wishlist-item-notes"
          />
        </div>
      )}

      <Button
        variant="primary"
        type="submit"
        loading={isSubmiting}
        disabled={isSubmiting}
      >
        Create List & Add
      </Button>
    </form>
  )
}

export default AddToNewWishlistForm
