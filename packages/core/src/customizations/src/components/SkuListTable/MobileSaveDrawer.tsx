import { useState } from 'react'
import classNames from 'classnames'

import MobileDrawerSkuDetails from './MobileDrawerSkuDetails'
import SaveIcon from '../Icons/General/SaveIcon'
import MobileDrawer from '../MobileDrawer/MobileDrawer'
import styles from './SkuListItem.module.scss'
import { useScroll } from '../../hooks/useScroll'
import type { SkuDetailsFormatted } from '../../typings/sku'

type MobileSaveDrawerProps = {
  skuDetails: SkuDetailsFormatted
  productTitle: string
}

const MobileSaveDrawer = ({
  skuDetails,
  productTitle,
}: MobileSaveDrawerProps) => {
  const { blockScroll, allowScroll } = useScroll()
  const [drawerIsOpen, setDrawerIsOpen] = useState(false)

  const handleDrawerOpen = () => {
    setDrawerIsOpen(true)
    blockScroll()
  }

  const handleDrawerClose = () => {
    setDrawerIsOpen(false)
    allowScroll()
  }

  return (
    <>
      <button
        className={classNames(
          styles.mobileControlIconButton,
          styles.mobileSaveButton
        )}
        onClick={handleDrawerOpen}
        type="button"
      >
        <SaveIcon />
        <span className={styles.mobileControlButtonText}>Save</span>
      </button>

      {drawerIsOpen && (
        <MobileDrawer
          drawerIsOpen={drawerIsOpen}
          bodyContent={
            <>
              <MobileDrawerSkuDetails skuDetails={skuDetails} />
              [Save Sku UI]
            </>
          }
          footerContent={<>[Footer Actions]</>}
          handleDrawerClose={handleDrawerClose}
          headerText={productTitle}
        />
      )}
    </>
  )
}

export default MobileSaveDrawer
