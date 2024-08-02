// We need mutable exports to only expose values on the server
/* eslint-disable import/no-mutable-exports */

import { envConfig, environment } from '../../../faststore.config'

let STORE_URL: string
let APP_KEY: string
let APP_TOKEN: string

// Ensure this is on the server
if (typeof window === 'undefined') {
  const configs = {
    production: {
      APP_KEY: 'vtexappkey-jwpepper-LRWBQZ',
      APP_TOKEN:
        'ZDUZDPKXHACJEGEVSNLTNPJJCWKFZTUBAZKPNVLSXJMZYTTFPEPOIENQUFMXKNFNXKUWZNKIVPZDUIXPPLMUPZBWOWLGAUTPIICAHYYCXMOFLVLYMQSPQVTQJOPCVMOR',
    },
    development: {
      APP_KEY: 'vtexappkey-jwpepperdev-XVNJXR',
      APP_TOKEN:
        'FJJLRJPNKCMFGDSOVRZUPGTJFOWUGGTCHFWQYLRQVKSONPIGQLQPZTGACVXKYNKOXLYSZWSWZJQHWBYCXCBYYCRDQDNHBNVIGICATMQQALLBFKPGTPMGGLDQCCDHPHOK',
    },
  }

  STORE_URL = `https://${envConfig.account}.vtexcommercestable.com.br`

  APP_KEY = configs[environment].APP_KEY
  APP_TOKEN = configs[environment].APP_TOKEN
} else {
  throw new Error('This file must only be used on the server')
}

export { APP_KEY, APP_TOKEN, STORE_URL }
