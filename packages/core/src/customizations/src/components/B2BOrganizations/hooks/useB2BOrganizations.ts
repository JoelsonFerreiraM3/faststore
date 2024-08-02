import { useEffect, useState } from 'react'
import { useSession, validateSession } from 'src/sdk/session'
import { request } from 'src/sdk/graphql/request'
import { useQuery } from 'src/sdk/graphql/useQuery'
import type {
  GetB2BSettingsQuery,
  GetOrganizationsByEmailQuery,
  GetOrganizationByIdStorefrontQuery,
  GetCostCenterByIdStorefrontQuery,
  MutationSetCurrentOrganizationArgs,
  CheckUserPermissionQuery,
  SetCurrentOrganizationMutation,
  SetCurrentOrganizationMutationVariables,
} from '@generated/graphql'

import {
  CheckUserPermission,
  GetB2BSettings,
  GetCostCenterByIdStorefront,
  GetOrganizationByIdStorefront,
  GetOrganizationsByEmail,
  SetCurrentOrganization,
  defaultOrganization,
} from '../utils/constants'
import { sortOrganizations } from '../utils/sortOrganizations'
import type { OrganizationsState } from '../utils/types'

export default function useB2BOrganizations() {
  const { isValidating: _, ...session } = useSession()

  const { person } = session

  const isAuthenticated = !!person?.id
  const email = person?.email ?? null
  const id = null

  const { data: organizationsByEmail, mutate: mutateOrganizationsByEmail } =
    useQuery<GetOrganizationsByEmailQuery>(GetOrganizationsByEmail, {
      email,
      session,
    })

  const { data: checkUserPermission } = useQuery<CheckUserPermissionQuery>(
    CheckUserPermission,
    { session }
  )

  const {
    data: organizationByIdStorefront,
    mutate: mutateOrganizationByIdStorefront,
  } = useQuery<GetOrganizationByIdStorefrontQuery>(
    GetOrganizationByIdStorefront,
    { id, session }
  )

  const {
    data: costCenterByIdStorefront,
    mutate: mutateCostCenterByIdStorefront,
  } = useQuery<GetCostCenterByIdStorefrontQuery>(GetCostCenterByIdStorefront, {
    id,
    session,
  })

  const { data: b2BSettings } = useQuery<GetB2BSettingsQuery>(GetB2BSettings, {
    session,
  })

  const setCurrentOrganization = async (
    args?: MutationSetCurrentOrganizationArgs
  ) => {
    await request<
      SetCurrentOrganizationMutation,
      SetCurrentOrganizationMutationVariables | undefined
    >(SetCurrentOrganization, args)

    await validateSession(session)

    await Promise.all([
      mutateOrganizationsByEmail(),
      mutateOrganizationByIdStorefront(),
      mutateCostCenterByIdStorefront(),
    ])
  }

  const [organizationsState, setOrganizationsState] =
    useState<OrganizationsState>(defaultOrganization)

  useEffect(() => {
    const currentOrganization =
      organizationByIdStorefront?.getOrganizationByIdStorefront?.id

    const currentCostCenter =
      costCenterByIdStorefront?.getCostCenterByIdStorefront?.id

    setOrganizationsState({
      ...organizationsState,
      costCenterInput:
        costCenterByIdStorefront?.getCostCenterByIdStorefront?.name,
      organizationInput:
        organizationByIdStorefront?.getOrganizationByIdStorefront?.name,
      organizationOptions: organizationsByEmail?.getOrganizationsByEmail
        ?.slice(0, 15)
        .map((organization) => ({
          value: organization?.orgId,
          label: organization?.organizationName,
          status: organization?.organizationStatus,
        })),
      currentRoleName: organizationsByEmail?.getOrganizationsByEmail?.find(
        (organizations) => organizations?.costId === currentCostCenter
      )?.role?.name,
      costCenterOptions: organizationsByEmail?.getOrganizationsByEmail
        ?.filter((organization) => organization?.orgId === currentOrganization)
        .map((organization) => ({
          value: organization?.costId,
          label: organization?.costCenterName,
        })),
      currentOrganization,
      currentCostCenter,
      dataList:
        organizationsByEmail?.getOrganizationsByEmail?.sort(sortOrganizations),
      totalDataList: organizationsByEmail?.getOrganizationsByEmail?.length,
      currentOrganizationStatus:
        organizationByIdStorefront?.getOrganizationByIdStorefront?.status,
    })
  }, [
    organizationByIdStorefront,
    costCenterByIdStorefront,
    organizationByIdStorefront,
    organizationsByEmail,
    organizationByIdStorefront,
  ])

  return {
    isAuthenticated,
    organizationsByEmail: organizationsByEmail?.getOrganizationsByEmail,
    checkUserPermission: checkUserPermission?.checkUserPermission,
    organizationByIdStorefront:
      organizationByIdStorefront?.getOrganizationByIdStorefront,
    costCenterByIdStorefront:
      costCenterByIdStorefront?.getCostCenterByIdStorefront,
    b2BSettings: b2BSettings?.getB2BSettings,
    setCurrentOrganization,
    organizationsState,
    setOrganizationsState,
  }
}
