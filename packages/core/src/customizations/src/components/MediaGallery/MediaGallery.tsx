import ImageGallery from 'react-image-gallery'

import ImageModal from './ImageModal'
import { useDeviceInfo } from '../../hooks/useDeviceInfo'
import styles from './MediaGallery.module.scss'

type MediaGalleryImage = {
  original: string
  thumbnail: string
  thumbnailClass?: string
  originalAlt: string
  thumbnailAlt: string
  originalTitle?: string
  thumbnailTitle?: string
  thumbnailLabel?: string
  srcSet?: string
  sizes?: string
  originalHeight?: number
  originalWidth?: number
}

type MediaGalleryProps = {
  isSheetMusic?: boolean
  images: MediaGalleryImage[]
}

type ImageProp = {
  original: string
  originalAlt: string
  thumbnail: string
  thumbnailAlt: string
  loading: 'lazy' | 'eager'
}

const MediaGallery = ({ isSheetMusic, images }: MediaGalleryProps) => {
  const { device } = useDeviceInfo()

  const renderItem = (image: ImageProp) => {
    return <ImageModal isSheetMusic={isSheetMusic} image={image} />
  }

  return (
    <div className={styles.gallery}>
      <ImageGallery
        items={images.map((image) => ({
          ...image,
          originalClass: styles.slide,
        }))}
        showNav={false}
        showFullscreenButton={false}
        thumbnailPosition="left"
        showPlayButton={false}
        showBullets={device !== 'desktop' && images.length > 1}
        showThumbnails={device === 'desktop'}
        additionalClass={
          isSheetMusic ? styles.sheetMusic : styles.defaultProduct
        }
        renderItem={renderItem}
      />
    </div>
  )
}

export default MediaGallery
