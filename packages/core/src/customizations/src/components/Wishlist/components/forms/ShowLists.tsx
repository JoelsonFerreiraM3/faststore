import { useState } from 'react'
import {
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  TextArea,
  Button,
  Label,
  useUI,
} from '@faststore/ui'

import { useWishlist } from '../../../../hooks/useWishlist'
import styles from './ListForm.module.scss'
import Trashcan from '../../../Icons/General/Trashcan'
import CircledArrowUpIcon from '../../../Icons/General/CircledArrowUpIcon'
import CircledArrowDownIcon from '../../../Icons/General/CircledArrowDownIcon'

type ShowListsProps = {
  onChangeStep?: () => void
}

function ShowLists({ onChangeStep }: ShowListsProps) {
  const { pushToast } = useUI()
  const { lists, updateList } = useWishlist()
  const [openedList, setOpenedList] = useState<number>()

  const handleOpenList = (listIndex: number) => {
    if (listIndex === openedList) {
      setOpenedList(undefined)
    } else {
      setOpenedList(listIndex)
    }
  }

  const updateListNotes = async (notes: string) => {
    if (openedList === undefined) {
      return
    }

    const list = lists[openedList]

    if (!list || !list.id || !list.wishlistType) {
      return
    }

    await updateList(list.id, list.wishlistType, notes)

    pushToast({
      message: 'List notes have been updated',
      status: 'INFO',
    })
  }

  return (
    <Accordion
      className={`${styles.formContainer} ${styles.accordionContainer}`}
      indices={openedList !== undefined ? [openedList] : []}
      onChange={handleOpenList}
    >
      {lists.map((list, index) => (
        <AccordionItem data-fs-opened={index === openedList}>
          <AccordionButton
            icon={
              index === openedList ? (
                <CircledArrowUpIcon />
              ) : (
                <CircledArrowDownIcon />
              )
            }
          >
            {list?.wishlistType?.replace('_', ' ')}
          </AccordionButton>
          <AccordionPanel>
            <div data-fs-input-container>
              <Label htmlFor="wishlist-item-notes">Note</Label>
              <TextArea
                data-fs-custom-textarea
                id="wishlist-item-notes"
                name="wishlist-item-notes"
                defaultValue={list?.fieldsConfig?.description ?? ''}
                onBlur={(event) => {
                  void updateListNotes(event.currentTarget.value)
                }}
              />

              <Button
                onClick={() => {
                  void updateListNotes('')
                }}
                variant="tertiary"
                icon={<Trashcan />}
              >
                Remove From List
              </Button>
            </div>
          </AccordionPanel>
        </AccordionItem>
      ))}

      <Button onClick={onChangeStep} variant="tertiary">
        Add to Another List
      </Button>
    </Accordion>
  )
}

export default ShowLists
