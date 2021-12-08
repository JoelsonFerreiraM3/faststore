import type { HTMLAttributes, AriaAttributes } from 'react'
import React, { forwardRef } from 'react'

export interface ProductCardInfoProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * ID to find this component in testing tools (e.g.: cypress, testing library, and jest).
   */
  testId?: string
  /**
   * Defines a string value that labels the current element.
   */
  'aria-label'?: AriaAttributes['aria-label']
}

const ProductCardInfo = forwardRef<HTMLDivElement, ProductCardInfoProps>(
  function ProductCardInfo(
    {
      testId = 'store-product-card-info',
      'aria-label': ariaLabel = 'Product info',
      children,
      ...otherProps
    },
    ref
  ) {
    return (
      <div
        ref={ref}
        role="region"
        aria-label={ariaLabel}
        data-store-product-card-info
        data-testid={testId}
        {...otherProps}
      >
        {children}
      </div>
    )
  }
)

export default ProductCardInfo
