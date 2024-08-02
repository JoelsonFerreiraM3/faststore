import Link from 'next/link'
import { Dropdown, DropdownMenu, DropdownButton } from '@faststore/ui'
import { useSession } from 'src/sdk/session'
import { useCart } from 'src/sdk/cart'
import { useRouter } from 'next/router'

import CartIcon from '../Icons/General/CartIcon'
import AccountIcon from '../Icons/General/AccountIcon'
import styles from './HeaderUserActions.module.scss'
import { getTotalQuantity } from '../CartItems/CartItems'
import type { Header as HeaderProps } from '../../@generated/cms/Header'
import { accountUrl } from '../../../faststore.config'
import { getLoginUrlWithReturn } from '../../utils/urls'

type HeaderUserActionsProps = {
  accountDropdown: HeaderProps['accountDropdown']
  cartUrl: string
}

const HeaderUserActions = ({
  accountDropdown,
  cartUrl,
}: HeaderUserActionsProps) => {
  const { asPath } = useRouter()
  const { person } = useSession()
  const { items } = useCart()
  const totalQuantity = getTotalQuantity(items)
  const loginUrl = getLoginUrlWithReturn(asPath)

  return (
    <div className={styles.userActions}>
      {person?.id && accountDropdown ? (
        <Dropdown>
          <DropdownButton className={styles.accountLink}>
            <AccountIcon className={styles.accountLinkIcon} />
            <span className={styles.accountLinkText}>My Account</span>
            <div className={styles.dropdownArrow}></div>
          </DropdownButton>

          <DropdownMenu
            className={styles.dropdownMenu}
            aria-label="Account Links"
          >
            {accountDropdown.map((link) => {
              return (
                <Link
                  key={link.text}
                  href={link.url}
                  className={styles.dropdownItem}
                >
                  {link.text}
                </Link>
              )
            })}
          </DropdownMenu>
        </Dropdown>
      ) : (
        <Link
          data-fs-button-signin-link
          className={styles.accountLink}
          href={person?.id ? accountUrl : loginUrl}
        >
          <AccountIcon className={styles.accountLinkIcon} />
          <span className={styles.accountLinkText}>
            {person?.id ? 'My Account' : 'Log In / Sign Up'}
          </span>
        </Link>
      )}

      <Link
        aria-label={`Open cart containing ${totalQuantity} items`}
        className={styles.cartButton}
        data-fs-cart-toggle
        href={cartUrl}
      >
        <CartIcon className={styles.cartButtonIcon} />
        <span className={styles.cartButtonBadge}>{totalQuantity}</span>
      </Link>
    </div>
  )
}

export default HeaderUserActions
