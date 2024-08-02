import { useRef, useState } from 'react'
import classNames from 'classnames'
import { usePDP } from '@faststore/core'

import styles from './CustomProductDetails.module.scss'
import MediaGallery from '../MediaGallery/MediaGallery'
import ProductAccordion from '../ProductAccordion/ProductAccordion'
import SkuListTable from '../SkuListTable/SkuListTable'
import ProductSummaryDefault from '../ProductSummary/ProductSummaryDefault'
import ProductSummarySheetMusic from '../ProductSummary/ProductSummarySheetMusic'
import ProductOptionsForm from '../ProductOptionsForm/ProductOptionsForm'
import FolderImprinting from '../FolderImprinting/FolderImprinting'
import Prop65 from '../Prop65/Prop65'
import {
  isSheetMusic,
  isImprintable,
  formattedMediaImages,
  getSpec,
} from '../../utils/productData'
import type { TrustPilotWidgetProps } from '../TrustPilot/TrustPilotWidget'
import type { TrustPilotStarsConfig } from '../../@generated/cms/CustomProductDetails'

interface CustomProductDetailsProps {
  trustPilotPdpConfig: {
    stars: TrustPilotStarsConfig
    accordion: TrustPilotWidgetProps
  }
}

const CustomProductDetails = ({
  trustPilotPdpConfig,
}: CustomProductDetailsProps) => {
  const context = usePDP()
  const product = context?.data?.product
  const [scrollDetected, setScrollDetected] = useState(0)
  const scrollToRef = useRef<HTMLDivElement>(null)

  if (!product) {
    return null
  }

  const isSheetMusicProduct = isSheetMusic(product)
  const isImprintableProduct = isImprintable(product)

  const prop65 = getSpec(product.additionalProperty, 'Prop65')

  const scrollToDescription = () => {
    setScrollDetected((prev) => prev + 1)
    scrollToRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div className={styles.section}>
      <div className={styles.row}>
        <div className={styles.container}>
          <div className={styles.summary}>
            <div className={styles.summaryMedia}>
              <MediaGallery
                isSheetMusic={isSheetMusicProduct}
                images={formattedMediaImages(product)}
              />
            </div>
            <div className={styles.summaryDetails}>
              {isSheetMusicProduct ? (
                <ProductSummarySheetMusic
                  product={product}
                  trustPilotStarsConfig={trustPilotPdpConfig.stars}
                  scrollToDescription={scrollToDescription}
                />
              ) : (
                <>
                  <ProductSummaryDefault
                    product={product}
                    trustPilotStarsConfig={trustPilotPdpConfig.stars}
                    scrollToDescription={scrollToDescription}
                  />
                  {isImprintableProduct ? (
                    <FolderImprinting product={product} />
                  ) : (
                    <ProductOptionsForm product={product} />
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {isSheetMusicProduct && (
        <div className={styles.row}>
          <div className={styles.container}>
            <SkuListTable product={product} />
          </div>
        </div>
      )}

      <div className={classNames(styles.row, styles.rowDark)} ref={scrollToRef}>
        <div className={styles.container}>
          <ProductAccordion
            product={product}
            scrollDetected={scrollDetected}
            trustPilotAccordionConfig={trustPilotPdpConfig.accordion}
          />
        </div>
      </div>

      {prop65 === 'Yes' && (
        <div className={styles.row}>
          <div className={styles.container}>
            <Prop65 />
          </div>
        </div>
      )}
    </div>
  )
}

export default CustomProductDetails
