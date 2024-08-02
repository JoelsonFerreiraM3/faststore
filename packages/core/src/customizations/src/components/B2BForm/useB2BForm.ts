import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { gql } from '@generated/gql'
import { useUI } from '@faststore/ui'
import { request } from 'src/sdk/graphql/request'
import { validateSession } from 'src/sdk/session'
import type {
  CostCenterByOrgIdQuery,
  CostCenterByOrgIdQueryVariables,
  CreateOrganizationErpMutation,
  CreateOrganizationErpMutationVariables,
  CreateOrganizationRequestMutation,
} from '@generated/graphql'

import type { B2BSchema } from './schema'
import storeConfig from '../../../faststore.config'

const createOrganizationMutation = gql(`
  mutation CreateOrganizationRequest($input: OrganizationInput!, $notifyUsers: Boolean) {
    createOrganizationRequest(input: $input, notifyUsers: $notifyUsers) @context(provider: "vtex.b2b-organizations-graphql") {
      id
      href
      status
    }
  }
`)

const createOrganizationERPMutation = gql(`
  mutation CreateOrganizationERP($input: CreateOrganizationERPInput) {
    createOrganizationERP(input: $input) {
      message
      requestId
    }
  }
`)

const queryCostCenter = gql(`
  query CostCenterByOrgId($id: ID) {
    getCostCentersByOrganizationId(id: $id) {
      data {
        id
      }
    }
  }
`)

type Person = {
  id: string
  email: string
  givenName: string
  familyName: string
}

function useIsAuth(
  cb?: (person: Person | null) => void,
  dependecies: unknown[] = []
) {
  const [person, setPerson] = useState<Person | null>()

  useEffect(() => {
    void validateSession(storeConfig.session).then((s) => {
      if (s) {
        setPerson(s.person)
        cb?.(s.person)
      }
    })
  }, dependecies)

  return person
}

function mapFormToOrganizationRequest(data: B2BSchema, person: Person) {
  const billingCostCenter = data.billing
  const shippingCostCenter = data.address

  return {
    name: data.account.name,
    tradeName: data.account.name,
    b2bCustomerAdmin: {
      email: person.email,
      firstName: person.givenName,
      lastName: person.familyName,
    },
    defaultCostCenter: {
      name: data.billing.hasBilling
        ? billingCostCenter.name
        : data.account.name,
      phoneNumber: data.account.phone,
      businessDocument: '',
      stateRegistration: data.billing.hasBilling
        ? billingCostCenter.state
        : shippingCostCenter.state,
      address: {
        addressId: '0',
        addressType: '',
        addressQuery: '',
        country: data.billing.hasBilling
          ? billingCostCenter.country
          : shippingCostCenter.country,
        postalCode: data.billing.hasBilling
          ? billingCostCenter.postalCode
          : shippingCostCenter.postalCode,
        street: data.billing.hasBilling
          ? billingCostCenter.street
          : shippingCostCenter.street,
        city: data.billing.hasBilling
          ? billingCostCenter.city
          : shippingCostCenter.city,
        state: data.billing.hasBilling
          ? billingCostCenter.state
          : shippingCostCenter.state,
        receiverName: data.billing.hasBilling
          ? billingCostCenter.attention
          : data.account.attention,
        complement: data.billing.hasBilling
          ? billingCostCenter.complement
          : shippingCostCenter.complement,
        neighborhood: '',
        number: '',
        reference: '',
        geoCoordinates: [],
      },
    },
  }
}

function mapFormToErpSHIPOrganizationRequest(data: B2BSchema) {
  const shippingCostCenter = data.address

  const shippingCostCenterAddress =
    shippingCostCenter?.street && shippingCostCenter?.complement
      ? `${shippingCostCenter.street} ${shippingCostCenter.complement}`
      : shippingCostCenter?.street

  return {
    ACCOUNT_NAME: data.account.name,
    ATTENTION: data.account.attention,
    ADDRESS: shippingCostCenterAddress ?? '',
    CITY: shippingCostCenter.city,
    COUNTRY: shippingCostCenter.country,
    POSTAL_CODE: shippingCostCenter.postalCode,
    STATE_PROVINCE: shippingCostCenter.state,
    CUSTOMER_CLASSIFICATION: data.account.classification,
    ORGANIZATION_DETAIL: data.account.classification,
    CUSTOMER_ROLE: data.account.role ?? '',
    PHONE_NUMBER: data.account.phone,
  }
}

function mapFormToErpBILLOrganizationRequest(data: B2BSchema) {
  const billingCostCenter = data.billing

  const billingCostCenterAddress =
    billingCostCenter?.street && billingCostCenter?.complement
      ? `${billingCostCenter.street} ${billingCostCenter.complement}`
      : billingCostCenter?.street

  return {
    ACCOUNT_NAME: billingCostCenter.name ?? '',
    ATTENTION: billingCostCenter.attention ?? '',
    ADDRESS: billingCostCenterAddress ?? '',
    CITY: billingCostCenter.city ?? '',
    COUNTRY: billingCostCenter.country ?? '',
    POSTAL_CODE: billingCostCenter.postalCode ?? '',
    STATE_PROVINCE: billingCostCenter.state ?? '',
    CUSTOMER_CLASSIFICATION: billingCostCenter.classification ?? '',
    ORGANIZATION_DETAIL: data.account.detail ?? '',
    CUSTOMER_ROLE: data.account.role ?? '',
    PHONE_NUMBER: billingCostCenter.phone ?? '',
  }
}

export function useB2BForm() {
  const { pushToast } = useUI()
  const { push, query } = useRouter()
  const { returnUrl } = query

  const person = useIsAuth(
    (_person) => {
      if (!_person) {
        void push('/login')
      }
    },
    [push]
  )

  const createOrganization = async (
    data: B2BSchema,
    setLoading: React.Dispatch<
      React.SetStateAction<{
        isLoading: boolean
        message: undefined | string
      }>
    >
  ) => {
    try {
      if (!person) {
        setLoading({ isLoading: false, message: 'You must be logged' })

        return
      }

      const billingCostCenter = data.billing

      const { createOrganizationRequest } =
        await request<CreateOrganizationRequestMutation>(
          createOrganizationMutation,
          {
            input: mapFormToOrganizationRequest(data, person),
            notifyUsers: false,
          }
        )

      const organizationId = createOrganizationRequest?.id

      if (!organizationId) {
        setLoading({
          isLoading: false,
          message: 'Unable to find your organization!',
        })

        return
      }

      const payload = mapFormToErpSHIPOrganizationRequest(data)

      const { createOrganizationERP } = await request<
        CreateOrganizationErpMutation,
        CreateOrganizationErpMutationVariables
      >(createOrganizationERPMutation, {
        input: {
          PARENT_ID: '0',
          ACCOUNT_TYPE: 'SHIP',
          VTEX_ID: organizationId,
          ...payload,
        },
      })

      if (!createOrganizationERP) {
        setLoading({
          isLoading: false,
          message: 'Failed to create organization in ERP!',
        })

        return
      }

      const { getCostCentersByOrganizationId } = await request<
        CostCenterByOrgIdQuery,
        CostCenterByOrgIdQueryVariables
      >(queryCostCenter, { id: organizationId })

      if (!getCostCentersByOrganizationId?.data?.[0]) {
        setLoading({
          isLoading: false,
          message: 'Failed to get organization',
        })

        return
      }

      const billPayload = billingCostCenter.hasBilling
        ? mapFormToErpBILLOrganizationRequest(data)
        : payload

      await request<
        CreateOrganizationErpMutation,
        CreateOrganizationErpMutationVariables
      >(createOrganizationERPMutation, {
        input: {
          PARENT_ID: createOrganizationERP.requestId,
          ACCOUNT_TYPE: 'BILL',
          VTEX_ID: getCostCentersByOrganizationId.data[0].id,
          ...billPayload,
        },
      })

      pushToast({
        message: 'Your request has been sent.',
        status: 'INFO',
      })

      await push(typeof returnUrl === 'string' ? returnUrl : '/')
    } catch (error) {
      setLoading({
        isLoading: false,
        message: 'Failed to submit data, please try again later!',
      })
    }
  }

  return { createOrganization }
}
