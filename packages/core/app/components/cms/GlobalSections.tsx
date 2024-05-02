import { Section } from '@vtex/client-cms'
import type { ComponentType } from 'react'
import { PropsWithChildren, lazy } from 'react'
import CUSTOM_COMPONENTS from 'src/customizations/src/components'

import Toast from 'app/components/common/Toast'
import RenderSections from './RenderSections'

import { OverriddenDefaultAlert as Alert } from 'app/components/sections/Alert/OverriddenDefaultAlert'
import Footer from 'app/components/sections/Footer'
import { OverriddenDefaultNavbar as Navbar } from 'app/components/sections/Navbar/OverriddenDefaultNavbar'
import { OverriddenDefaultRegionBar as RegionBar } from 'app/components/sections/RegionBar/OverriddenDefaultRegionBar'

const RegionModal = lazy(() => import('app/components/region/RegionModal'))
const CartSidebar = lazy(() => import('app/components/cart/CartSidebar'))

export const GLOBAL_SECTIONS_CONTENT_TYPE = 'globalSections'

export type GlobalSectionsData = {
  sections: Section[]
}

/* A list of components that can be used in the CMS. */
const COMPONENTS: Record<string, ComponentType<any>> = {
  Alert,
  Navbar,
  RegionBar,
  RegionModal,
  CartSidebar,
  Footer,
  ...CUSTOM_COMPONENTS,
}

function GlobalSections({
  children,
  ...otherProps
}: PropsWithChildren<GlobalSectionsData>) {
  return (
    <RenderSections components={COMPONENTS} {...otherProps}>
      <Toast />

      <main>{children}</main>
    </RenderSections>
  )
}

export default GlobalSections
