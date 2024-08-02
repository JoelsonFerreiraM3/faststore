import Link from 'next/link'
import { useState } from 'react'
import type { MouseEvent } from 'react'

import FullArrowRightIcon from '../Icons/General/FullArrowRightIcon'
import Heading from '../Heading/Heading'
import Image from '../Image/Image'
import styles from './EditorsChoiceGrid.module.scss'
import type {
  Card as EditorsChoiceCard,
  EditorsChoiceGrid as EditorsChoiceGridProps,
} from '../../@generated/cms/EditorsChoiceGrid'

const EditorsChoiceGrid = ({
  cards,
  heading,
  yearButtons,
}: EditorsChoiceGridProps) => {
  const firstYear = yearButtons[0].text
  const defaultItems = cards

  const [activeYear, setActiveYear] = useState(firstYear)
  const [items, setItems] = useState<EditorsChoiceCard[]>(defaultItems)

  const handleYearButtonClick = (event: MouseEvent<HTMLButtonElement>) => {
    const { year } = event.currentTarget.dataset

    if (year === activeYear) {
      setActiveYear('')
      setItems(defaultItems)
    } else if (year) {
      setActiveYear(year)
      setItems(defaultItems.filter((item) => item.year === year))
    }
  }

  return (
    <div className={styles.outerWrapper}>
      <div className={styles.innerWrapper}>
        <div className={styles.headingWrapper}>
          <Heading level={2} uiStyle={8} allCaps divider>
            {heading}
          </Heading>
        </div>

        <div>
          <ul className={`list-reset ${styles.yearButtonRow}`}>
            {yearButtons.map((yearButton) => (
              <li key={yearButton.text}>
                <button
                  className={styles.yearButton}
                  data-is-active={activeYear === yearButton.text}
                  data-year={yearButton.text}
                  onClick={handleYearButtonClick}
                  type="button"
                >
                  {yearButton.text}
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <ul className={`list-reset ${styles.cardGrid}`}>
            {items.length > 0 ? (
              items.map((item) => {
                const { linkText } = item
                const linkTextArray = linkText.split(' ')

                const [year] = linkTextArray
                const text = linkTextArray.slice(1).join(' ')

                return (
                  <li key={item.heading} className={styles.cardItem}>
                    <Link href={item.link} className={styles.cardLink}>
                      <div className={styles.imagesWrapper}>
                        <Image
                          src={item.baseImage.src}
                          alt={item.baseImage.alt ?? ''}
                          height={375}
                          width={375}
                        />

                        <Image
                          src={item.hoverImage.src}
                          alt={item.hoverImage.alt ?? ''}
                          className={styles.hoverImage}
                          height={375}
                          width={375}
                        />

                        <div className={styles.gradientOverlay} />
                      </div>

                      <div className={styles.contentWrapper}>
                        <div className={styles.cardIconWrapper}>
                          <Image
                            src={item.icon.src}
                            alt={item.icon.alt ?? ''}
                            className={styles.cardIcon}
                            height={40}
                            width={40}
                          />
                        </div>

                        <Heading level={3} uiStyle={3}>
                          {item.heading}
                        </Heading>

                        <p className={styles.linkText}>
                          <span>
                            <span className={styles.linkYearText}>{year}</span>{' '}
                            {text}
                          </span>

                          <span className={styles.arrowIconWrapper}>
                            <FullArrowRightIcon />
                          </span>
                        </p>
                      </div>
                    </Link>
                  </li>
                )
              })
            ) : (
              <li>
                <p>No items found</p>
              </li>
            )}
          </ul>
        </div>
      </div>
    </div>
  )
}

export default EditorsChoiceGrid
