import { useCallback, useRef, useState } from 'react'

import { Icon as UIIcon, useScrollDirection, useUI } from '@faststore/ui'

import { mark } from 'app/sdk/tests/mark'

import CartToggle from 'app/components/cart/CartToggle'
import NavbarLinks from 'app/components/navigation/NavbarLinks'
import NavbarSlider from 'app/components/navigation/NavbarSlider'
import type { SearchInputRef } from 'app/components/search/SearchInput'
import SearchInput from 'app/components/search/SearchInput'
import { ButtonSignIn } from 'app/components/ui/Button'
import Link from 'app/components/ui/Link'
import Logo from 'app/components/ui/Logo'
import { useOverrideComponents } from 'app/sdk/overrides/OverrideContext'

import type { NavbarProps as SectionNavbarProps } from '../../sections/Navbar'

export interface NavbarProps {
  /**
   * Logo props.
   */
  logo: SectionNavbarProps['logo']
  /**
   * Search Input props.
   */
  searchInput: SectionNavbarProps['searchInput']
  /**
   * Cart props.
   */
  cart: SectionNavbarProps['cartIcon']
  /**
   * Sign In props.
   */
  signIn: {
    button: SectionNavbarProps['signInButton']
  }
  /**
   * Region props.
   */
  region: {
    icon: string
    label: string
    shouldDisplayRegion: boolean
  }
  /**
   * Page links.
   */
  links: SectionNavbarProps['navigation']['pageLinks']
  /**
   * Home props.
   */
  home: SectionNavbarProps['navigation']['home']
  /**
   * Menu props.
   */
  menu: SectionNavbarProps['navigation']['menu']
}

function Navbar({
  cart,
  logo,
  searchInput,
  home,
  links,
  signIn,
  region,
  home: { label: homeLabel },
  signIn: { button: signInButton },
  menu: {
    icon: { icon: menuIcon, alt: menuIconAlt },
  },
}: NavbarProps) {
  const {
    Navbar: NavbarWrapper,
    NavbarHeader,
    NavbarRow,
    NavbarButtons,
    IconButton,
  } = useOverrideComponents<'Navbar'>()
  const scrollDirection = useScrollDirection()
  const { openNavbar, navbar: displayNavbar } = useUI()
  const searchMobileRef = useRef<SearchInputRef>(null)
  const [searchExpanded, setSearchExpanded] = useState(false)

  const handlerExpandSearch = useCallback(() => {
    setSearchExpanded(true)
    searchMobileRef.current?.inputRef?.focus()
  }, [])

  const handleCollapseSearch = useCallback(() => {
    setSearchExpanded(false)
    searchMobileRef.current?.resetSearchInput()
  }, [])

  return (
    <NavbarWrapper.Component
      scrollDirection={scrollDirection}
      {...NavbarWrapper.props}
    >
      <NavbarHeader.Component {...NavbarHeader.props}>
        <NavbarRow.Component {...NavbarRow.props}>
          {!searchExpanded && (
            <>
              <IconButton.Component
                data-fs-navbar-button-menu
                onClick={openNavbar}
                icon={<UIIcon name={menuIcon} width={32} height={32} />}
                {...IconButton.props}
                aria-label={menuIconAlt ?? IconButton.props['aria-label']}
              />
              <Link
                data-fs-navbar-logo
                href={logo.link ? logo.link.url : '/'}
                title={logo.link ? logo.link.title : homeLabel}
                prefetch={false}
              >
                <Logo src={logo.src} alt={logo.alt} />
              </Link>
            </>
          )}

          <SearchInput sort={searchInput?.sort} />

          <NavbarButtons.Component
            searchExpanded={searchExpanded}
            {...NavbarButtons.props}
          >
            {searchExpanded && (
              <IconButton.Component
                data-fs-button-collapse
                aria-label="Collapse search bar"
                icon={<UIIcon name="CaretLeft" width={32} height={32} />}
                {...IconButton.props}
                // Dynamic props, shouldn't be overridable
                // This decision can be reviewed later if needed
                onClick={handleCollapseSearch}
              />
            )}

            <SearchInput
              placeholder=""
              ref={searchMobileRef}
              testId="store-input-mobile"
              buttonTestId="store-input-mobile-button"
              onSearchClick={handlerExpandSearch}
              sort={searchInput?.sort}
              hidden={!searchExpanded}
              aria-hidden={!searchExpanded}
            />

            <ButtonSignIn {...signInButton} />

            <CartToggle {...cart} />
          </NavbarButtons.Component>
        </NavbarRow.Component>
      </NavbarHeader.Component>

      <NavbarLinks links={links} region={region} className="hidden-mobile" />

      {displayNavbar && (
        <NavbarSlider
          home={home}
          logo={logo}
          links={links}
          signIn={signIn}
          region={region}
        />
      )}
    </NavbarWrapper.Component>
  )
}

Navbar.displayName = 'Navbar'
export default mark(Navbar)
