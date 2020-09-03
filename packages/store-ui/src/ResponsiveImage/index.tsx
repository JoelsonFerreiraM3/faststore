/* eslint-disable jsx-a11y/alt-text */
/** @jsx jsx */
import { FC } from 'react'
import { jsx } from 'theme-ui'

export interface IResponsiveImageSource {
  srcSet: string
  sizes?: string
  media?: string
}

export interface IResponsiveImage {
  sources: [IResponsiveImageSource, IResponsiveImageSource]
  heights: [string, string]
  src?: string
  alt: string
  height: string
  width: string
}

interface Props extends IResponsiveImage {
  loading: 'eager' | 'lazy'
  variant?: string
}

export const ResponsiveImage: FC<Props> = ({
  sources,
  heights,
  variant,
  ...imgProps
}) => (
  <picture>
    <source {...sources[0]} media={sources[0].media || '(max-width: 500px)'} />
    <source {...sources[1]} media={sources[1].media || '(min-width: 501px)'} />
    <img
      {...imgProps}
      sx={{
        variant: variant ? `${variant}.img` : 'img',
        height: heights,
        width: '100%',
      }}
    />
  </picture>
)
