/** @jsx jsx */
import { Category } from '@vtex/gatsby-source-vtex'
import { FC } from 'react'
import { Flex, Heading, jsx } from 'theme-ui'

import Container from '../Container'
import ProductList from './ProductList'

interface Props {
  category: Category
}

const SyncCategoryTemplate: FC<Props> = ({ category }) => (
  <Container>
    <Flex sx={{ flexDirection: 'column' }} my={4}>
      <Heading as="h2">{category.name}</Heading>
      <ProductList category={category} />
    </Flex>
  </Container>
)

export default SyncCategoryTemplate
