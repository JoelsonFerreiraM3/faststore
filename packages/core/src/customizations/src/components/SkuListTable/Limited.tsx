import type { ClientProductQueryQuery } from '@generated/graphql'

import type { Product, ProductFullVariantList } from '../../typings/product'
import { physicalWarehouses } from '../../../faststore.config'

const INVENTORY_THRESHOLD = 10

type LimitedProps = {
  sku: Product | ProductFullVariantList[0] | ClientProductQueryQuery['product']
}

const Limited = ({ sku }: LimitedProps) => {
  const warehouses = sku.inventory.filter(({ warehouse }) =>
    physicalWarehouses.includes(warehouse.id)
  )

  const physicalInventory = warehouses.reduce(
    (acc, { availableQuantity }) => acc + availableQuantity,
    0
  )

  return physicalInventory < INVENTORY_THRESHOLD ? <p>Limited</p> : null
}

export default Limited
