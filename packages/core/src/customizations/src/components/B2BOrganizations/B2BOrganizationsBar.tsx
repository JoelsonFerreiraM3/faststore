import { useState } from 'react'
import { Link } from '@faststore/ui'

import OrganizationAutcompleteInput from './components/OrganizationAutcompleteInput'
import CostCenterAutcompleteInput from './components/CostCenterAutcompleteInput'
import B2BOrganizationsModal from './B2BOrganizationsModal'
import useB2BOrganizations from './hooks/useB2BOrganizations'
import styles from './B2BOrganizationsBar.module.scss'
import Action from '../Action/Action'

const B2BOrganizationsBar = () => {
  const {
    isAuthenticated,
    organizationByIdStorefront,
    checkUserPermission,
    costCenterByIdStorefront,
    organizationsByEmail,
    organizationsState,
    b2BSettings,
    setCurrentOrganization,
    setOrganizationsState,
  } = useB2BOrganizations()

  const showModal = b2BSettings?.uiSettings?.showModal

  const [loadingState, setLoadingState] = useState(false)
  const [errorOrganization, setErrorOrganization] = useState(false)

  const handleSetCurrentOrganization = async () => {
    setLoadingState(true)
    try {
      if (
        organizationsState.currentOrganization &&
        organizationsState.currentCostCenter
      ) {
        await setCurrentOrganization({
          orgId: organizationsState.currentOrganization,
          costId: organizationsState.currentCostCenter,
        })
      }
    } catch (error) {
      setErrorOrganization(true)
    } finally {
      setLoadingState(false)
    }
  }

  if (
    !isAuthenticated ||
    !checkUserPermission ||
    !organizationByIdStorefront ||
    !costCenterByIdStorefront ||
    !organizationsByEmail
  ) {
    return null
  }

  return (
    <div
      className={styles.b2BOrganizationsBarContainer}
      data-fs-organizataion-modal={showModal}
    >
      {showModal ? (
        <>
          <p>
            <strong>Organization:</strong> {organizationByIdStorefront?.name}
          </p>
          <p>
            <strong>Billing Account:</strong> {costCenterByIdStorefront?.name}
          </p>

          <div>
            {organizationsByEmail?.length &&
              organizationsByEmail?.length > 1 && <B2BOrganizationsModal />}
          </div>
        </>
      ) : (
        <>
          <div>
            <OrganizationAutcompleteInput
              organizationsState={organizationsState}
              setOrganizationsState={setOrganizationsState}
              organizationsByEmail={organizationsByEmail}
            />
          </div>
          <div>
            <CostCenterAutcompleteInput
              organizationsState={organizationsState}
              setOrganizationsState={setOrganizationsState}
            />
          </div>
          <div>
            <Action
              as="button"
              color="important"
              size="small"
              type="submit"
              disabled={
                organizationsState.currentCostCenter ===
                  costCenterByIdStorefront?.id || loadingState
              }
              onClick={() => {
                void handleSetCurrentOrganization()
              }}
            >
              Set current organization
            </Action>
            {errorOrganization && (
              <div>
                Error setting current organization. See console for details.
              </div>
            )}
          </div>
          <div>Role: {organizationsState.currentRoleName}</div>
          <div>
            <Link href="/account#/organization">Manage Organization</Link>
          </div>
        </>
      )}
    </div>
  )
}

export default B2BOrganizationsBar
