import styled from '@emotion/styled'
import * as Dialog from '@radix-ui/react-dialog'
import { useCollections } from '@wikinime/components/collection-provider'
import Anime from '@wikinime/models/anime'
import { Collection } from '@wikinime/models/collection'
import { motion } from 'framer-motion'
import { ChangeEvent, useMemo, useState } from 'react'
import toast from 'react-hot-toast'

export interface SaveAnimeDialogProps {
  animes: Anime[]
  onSaved: () => void
}

export default function CollectAnimeDialog({ animes, onSaved }: SaveAnimeDialogProps) {
  const [selectedCollectionsObj, setSelectedCollectionsObj] = useState<{ [key: number]: Collection }>([])
  const selectedCollections = useMemo(() => Object.values(selectedCollectionsObj), [selectedCollectionsObj])
  const [newCollectionName, setNewCollectionName] = useState('')
  const { collections, dispatchCollection } = useCollections()

  const handleSelectChange = (collection: Collection) => (ev: ChangeEvent<HTMLInputElement>) => {
    if (ev.target.checked) {
      setSelectedCollectionsObj((prev) => ({ ...prev, [collection.id]: collection }))
      return
    }
    setSelectedCollectionsObj((prev) => {
      const newSelectedCollectionsObj = { ...prev }
      delete newSelectedCollectionsObj[collection.id]
      return newSelectedCollectionsObj
    })
  }

  const handleSubmit = () => {
    let saved = false
    // Create new collection
    if (newCollectionName) {
      const isNameDuplicate = collections
        .map((collection) => collection.name.toLowerCase())
        .includes(newCollectionName.toLowerCase())

      if (isNameDuplicate) {
        toast.error('Collection name must be unique')
      } else {
        dispatchCollection({ type: 'CREATE_COLLECTION', title: newCollectionName, animes })
        saved = true
      }
    }

    // Add animes into existing collections
    if (selectedCollections.length) {
      dispatchCollection({
        type: 'ADD_ANIMES_INTO_COLLECTIONS',
        animes,
        collections: selectedCollections,
      })
      saved = true
    }

    if (saved) {
      onSaved()
      toast.success('Animes succesfully added 🎉')
    }
  }

  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <Fab whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
          Save {animes.length} animes into collections 💾
        </Fab>
      </Dialog.Trigger>
      <Dialog.Portal>
        <DialogOverlay />
        <DialogContent className='DialogContent'>
          <DialogTitle className='DialogTitle'>Save anime</DialogTitle>
          <DialogDescription className='DialogDescription'>Select collection or create new one!</DialogDescription>
          <CollectionsContainer>
            {collections.map((collection) => (
              <Label key={collection.id} style={{ marginBottom: 16 }}>
                <Checkbox
                  type='checkbox'
                  style={{ marginRight: 8 }}
                  onChange={handleSelectChange(collection)}
                  checked={!!selectedCollectionsObj[collection.id]}
                />
                {collection.name}
              </Label>
            ))}
          </CollectionsContainer>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Checkbox
              type='checkbox'
              style={{ marginRight: 8 }}
              checked={!!newCollectionName}
              onChange={(ev) => {
                if (ev.target.checked && newCollectionName === '') {
                  setNewCollectionName('New Collection')
                }
                if (!ev.target.checked && newCollectionName !== '') {
                  setNewCollectionName('')
                }
              }}
            />
            <Input
              type='text'
              placeholder='New collection name'
              onChange={(ev) => setNewCollectionName(ev.target.value.replace(/[^\w\s]/gi, ''))}
              value={newCollectionName}
            />
          </div>
          <div style={{ display: 'flex', marginTop: 25, justifyContent: 'flex-end' }}>
            <Dialog.Close asChild>
              <CancelButton style={{ marginRight: 16 }}>Cancel</CancelButton>
            </Dialog.Close>
            <Dialog.Close asChild>
              <SaveButton onClick={handleSubmit} disabled={!selectedCollections.length && !newCollectionName}>
                Save
              </SaveButton>
            </Dialog.Close>
          </div>
        </DialogContent>
      </Dialog.Portal>
    </Dialog.Root>
  )
}

const Fab = styled(motion.button)`
  position: fixed;
  display: flex;
  flex-direction: column;
  align-items: end;
  background-color: #059669;
  right: 16px;
  bottom: 16px;
  padding: 16px;
  border-radius: 16px;
  font-size: 1rem;
  border: none;
  color: inherit;
  cursor: pointer;
`

const DialogOverlay = styled(Dialog.Overlay)`
  position: fixed;
  inset: 0;
  animation: overlayShow 150ms cubic-bezier(0.16, 1, 0.3, 1);
  backdrop-filter: blur(4px);
  z-index: 55;
  @keyframes overlayShow {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
  @supports not (backdrop-filter: blur(4px)) {
    background-color: #1e293b;
  }
`

const DialogContent = styled(Dialog.Content)`
  background-color: #f8fafc;
  color: #020617;
  border-radius: 16px;
  box-shadow: hsl(206 22% 7% / 35%) 0px 10px 38px -10px, hsl(206 22% 7% / 20%) 0px 10px 20px -15px;
  position: fixed;
  z-index: 55;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 90vw;
  max-width: 450px;
  padding: 25px;
  animation: contentShow 150ms cubic-bezier(0.16, 1, 0.3, 1);
`

const DialogTitle = styled(Dialog.Title)`
  margin: 0;
  font-weight: 500;
  font-size: 1rem;
`

const DialogDescription = styled(Dialog.Description)`
  margin: 10px 0 20px;
  font-size: 0.875rem;
  line-height: 1.5;
`
const Input = styled.input`
  padding: 8px 16px;
  border-radius: 16px;
  outline: none;
  font-size: 0.875rem;
  border: 1px solid #cbd5e1;
  width: 100%;
  :focus {
    outline: 2px solid #059669;
  }
  [type='checkbox'] {
    padding: 2px;
    width: 8px;
    height: 4px;
  }
`

const Checkbox = styled.input`
  width: 16px;
  height: 16px;
  accent-color: #059669;
`

const Label = styled.label`
  font-size: 0.875rem;
  display: flex;
  align-items: center;
  word-break: break-all;
`

const CollectionsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  max-height: 85vh;
  overflow-y: auto;
  gap: 4px;
`
const SaveButton = styled.button`
  padding: 8px 16px;
  font-size: 0.875rem;
  background-color: #059669;
  color: #f8fafc;
  border-radius: 16px;
  cursor: pointer;
  :disabled {
    background-color: #94a3b8;
    cursor: unset;
  }
`

const CancelButton = styled.button`
  background-color: transparent;
  padding: 8px 16px;
  font-size: 0.875rem;
  border-radius: 16px;
  cursor: pointer;
  :disabled {
    cursor: unset;
  }
`
