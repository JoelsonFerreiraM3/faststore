import { loginUrl, storeUrl } from '../../faststore.config'

export const getLoginUrlWithReturn = (
  returnUrl: string,
  isFastStorePath = true
) => {
  const returnParam = encodeURIComponent(
    isFastStorePath ? `${storeUrl}/${returnUrl}` : returnUrl
  )

  return `${loginUrl}?returnUrl=${returnParam}`
}
