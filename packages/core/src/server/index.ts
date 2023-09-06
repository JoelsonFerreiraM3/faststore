/* eslint-disable react-hooks/rules-of-hooks */
import type { FormatErrorHandler } from '@envelop/core'
import {
  envelop,
  useSchema,
  useExtendContext,
  useMaskedErrors,
} from '@envelop/core'
import { useGraphQlJit } from '@envelop/graphql-jit'
import { useParserCache } from '@envelop/parser-cache'
import { useValidationCache } from '@envelop/validation-cache'
import type { CacheControl, Maybe } from '@faststore/api'
import {
  getContextFactory,
  getResolvers,
  isFastStoreError,
} from '@faststore/api'
import { GraphQLError } from 'graphql'
import path from 'path'

import persisted from '../../@generated/graphql/persisted.json'
import { loadFilesSync } from '@graphql-tools/load-files'

import { apiOptions } from './options'
import { makeExecutableSchema } from '@graphql-tools/schema'

import vtexExtensionsResolvers from '../customizations/graphql/vtex/resolvers'
import thirdPartyResolvers from '../customizations/graphql/thirdParty/resolvers'

const finalApiSchema = makeExecutableSchema({
  typeDefs: loadFilesSync(path.join(process.cwd(), '@generated', 'graphql'), {
    extensions: ['graphql'],
  }),
  resolvers: [
    getResolvers(apiOptions),
    vtexExtensionsResolvers,
    thirdPartyResolvers,
  ],
})

interface ExecuteOptions<V = Record<string, unknown>> {
  operationName: string
  variables: V
  query?: string | null
}

const persistedQueries = new Map(Object.entries(persisted))

const apiContextFactory = getContextFactory(apiOptions)

const formatError: FormatErrorHandler = (err) => {
  if (err instanceof GraphQLError && isFastStoreError(err.originalError)) {
    return err
  }

  console.error(err)

  return new GraphQLError('Sorry, something went wrong.')
}

export const getEnvelop = async () =>
  envelop({
    plugins: [
      useSchema(finalApiSchema),
      useExtendContext(apiContextFactory),
      useMaskedErrors({ formatError }),
      useGraphQlJit(),
      useValidationCache(),
      useParserCache(),
    ],
  })

const envelopPromise = getEnvelop()

export const execute = async <V extends Maybe<{ [key: string]: unknown }>, D>(
  options: ExecuteOptions<V>,
  envelopContext = { headers: {} }
): Promise<{
  data: D
  errors: unknown[]
  extensions: { cacheControl?: CacheControl }
}> => {
  const { operationName, variables, query: maybeQuery } = options
  const query = maybeQuery ?? persistedQueries.get(operationName)

  if (query == null) {
    throw new Error(`No query found for operationName: ${operationName}`)
  }

  const enveloped = await envelopPromise
  const {
    parse,
    contextFactory,
    execute: run,
    schema,
  } = enveloped(envelopContext)

  const contextValue = await contextFactory(envelopContext)

  const { data, errors } = (await run({
    schema,
    document: parse(query),
    variableValues: variables,
    contextValue,
    operationName,
  })) as { data: D; errors: unknown[] }

  return {
    data,
    errors,
    extensions: { cacheControl: contextValue.cacheControl },
  }
}
