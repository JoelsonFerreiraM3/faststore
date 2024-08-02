import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/router'
import { IconButton, Icon as UIIcon } from '@faststore/ui'

import type { UtilityNavigationLinks } from '../../@generated/cms/Header'
import styles from './HeaderMobileNav.module.scss'
import MobileMenu from '../MobileMenu/MobileMenu'
import { useScroll } from '../../hooks/useScroll'

type HeaderMobileNavProps = {
  utilityNavLinks: UtilityNavigationLinks
}

export default function HeaderMobileNav({
  utilityNavLinks,
}: HeaderMobileNavProps) {
  const router = useRouter()
  const [showNav, setShowNav] = useState(false)
  const { blockScroll, allowScroll, scrollToTop } = useScroll()
  const closeRef = useRef<HTMLButtonElement>(null)

  const openMenu = () => {
    scrollToTop()
    setShowNav(true)
    blockScroll()
  }

  const closeMenu = () => {
    setShowNav(false)
    allowScroll()
  }

  const toggleOpen = () => {
    showNav ? closeMenu() : openMenu()
  }

  useEffect(() => {
    router.events.on('routeChangeComplete', closeMenu)

    return () => {
      router.events.off('routeChangeComplete', closeMenu)
    }
  }, [router])

  return (
    <>
      <div className={styles.mobileNav}>
        <IconButton
          data-fs-navbar-button-menu
          className={styles.mobileNavButton}
          icon={
            showNav ? (
              <UIIcon name="X" width={32} height={32} />
            ) : (
              <UIIcon name="List" width={32} height={32} />
            )
          }
          aria-label="Open Navigation"
          aria-expanded={showNav}
          onClick={toggleOpen}
          ref={closeRef}
        />
      </div>

      {showNav && (
        <MobileMenu utilityNavLinks={utilityNavLinks} closeRef={closeRef} />
      )}
    </>
  )
}
