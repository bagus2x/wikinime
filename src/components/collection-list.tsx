import styled from '@emotion/styled'
import AlertDialog from '@wikinime/components/alert-dialog'
import CollectionItem from '@wikinime/components/collection-item'
import { useCollections } from '@wikinime/components/collection-provider'
import CreateCollectionDialog from '@wikinime/components/create-collection-dialog'
import UpdateCollectionDialog from '@wikinime/components/update-collection-dialog'
import Anime from '@wikinime/models/anime'
import { Collection } from '@wikinime/models/collection'
import { AnimatePresence, Variants, motion } from 'framer-motion'
import { PlusIcon } from 'lucide-react'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      delayChildren: 0.01,
      staggerChildren: 0.1,
    },
  },
}

type DialogEvent =
  | { type: 'NEW_COLLECTION' }
  | { type: 'DELETE_COLLECTION'; collection: Collection }
  | { type: 'UPDATE_COLLECTION'; collection: Collection }
  | { type: 'REMOVE_ANIME_FROM_COLLECTION'; anime: Anime; collection: Collection }
  | { type: 'NONE' }

export default function CollectionList() {
  const { collections, dispatchCollection } = useCollections()
  const [dialogEvent, setDialogEvent] = useState<DialogEvent>({ type: 'NONE' }) // CRUD Dialog
  const [motion, setMotion] = useState(true)

  useEffect(() => {
    setTimeout(() => {
      setMotion(false)
    }, 500)
  }, [])

  const handleCreateNewCollection = (newCollectionName: string) => {
    if (newCollectionName) {
      const isNameDuplicate = collections
        .map((collection) => collection.name.toLowerCase())
        .includes(newCollectionName.toLowerCase())

      if (isNameDuplicate) {
        toast.error('Collection name must be unique')
      } else {
        dispatchCollection({ type: 'CREATE_COLLECTION', title: newCollectionName, animes: [] })
        toast.success('Collection successfully created 🎉')
        setDialogEvent({ type: 'NONE' })
      }
    }
  }

  const handleDeleteCollection = () => {
    if (dialogEvent.type === 'DELETE_COLLECTION') {
      dispatchCollection({ type: 'DELETE_COLLECTION', collectionId: dialogEvent.collection.id })
      setDialogEvent({ type: 'NONE' })
      toast.success('Collections successfully deleted')
    }
  }

  const handleRemoveAnime = () => {
    if (dialogEvent.type === 'REMOVE_ANIME_FROM_COLLECTION') {
      dispatchCollection({
        type: 'UPDATE_COLLECTION',
        collection: {
          ...dialogEvent.collection,
          animes: dialogEvent.collection.animes.filter((anime) => anime.id !== dialogEvent.anime.id),
        },
      })
      toast.success(`Animes successfully removed from ${dialogEvent.collection.name}`)
      setDialogEvent({ type: 'NONE' })
    }
  }

  const handleUpdateCollection = (editedCollection: Collection) => {
    if (dialogEvent.type === 'UPDATE_COLLECTION') {
      const isNameDuplicate = collections
        .filter((collection) => collection.id !== editedCollection.id)
        .map((collection) => collection.name.toLowerCase())
        .includes(editedCollection.name.toLowerCase())

      if (isNameDuplicate) {
        toast.error('Collection name must be unique')
      } else {
        dispatchCollection({ type: 'UPDATE_COLLECTION', collection: editedCollection })
        toast.success('Collections updated')
      }
      setDialogEvent({ type: 'NONE' })
    }
  }

  return (
    <>
      <CollectionListSection>
        <CollectionListHeader>
          <CollectionListTitle>My Collections</CollectionListTitle>
          <NewCollectionButton onClick={() => setDialogEvent({ type: 'NEW_COLLECTION' })}>
            <PlusIcon size={20} />
          </NewCollectionButton>
        </CollectionListHeader>
        <CollectionListContainer variants={containerVariants} initial={motion ? 'hidden' : 'show'} whileInView='show'>
          <AnimatePresence>
            {collections.map((collection) => (
              <CollectionItem
                key={collection.id}
                collection={collection}
                onDeleteCollection={() => setDialogEvent({ type: 'DELETE_COLLECTION', collection })}
                onEditCollection={() => setDialogEvent({ type: 'UPDATE_COLLECTION', collection })}
                onRemoveAnime={(anime) => setDialogEvent({ type: 'REMOVE_ANIME_FROM_COLLECTION', anime, collection })}
              />
            ))}
          </AnimatePresence>
        </CollectionListContainer>
      </CollectionListSection>
      <CreateCollectionDialog
        open={dialogEvent.type === 'NEW_COLLECTION'}
        onCancel={() => setDialogEvent({ type: 'NONE' })}
        onSave={handleCreateNewCollection}
      />
      {dialogEvent.type === 'DELETE_COLLECTION' && (
        <AlertDialog
          open={dialogEvent.type === 'DELETE_COLLECTION'}
          title={`Delete ${dialogEvent.collection.name}?`}
          description='This action cannot be undone. This will permanently delete your collection'
          onCancel={() => setDialogEvent({ type: 'NONE' })}
          onAction={handleDeleteCollection}
        />
      )}
      {dialogEvent.type === 'REMOVE_ANIME_FROM_COLLECTION' && (
        <AlertDialog
          open={dialogEvent.type === 'REMOVE_ANIME_FROM_COLLECTION'}
          title={`Remove anime from ${dialogEvent.collection.name}?`}
          description={`This action cannot be undone. This will permanently remove your anime from ${dialogEvent.collection.name}`}
          onCancel={() => setDialogEvent({ type: 'NONE' })}
          onAction={handleRemoveAnime}
        />
      )}
      {dialogEvent.type === 'UPDATE_COLLECTION' && (
        <UpdateCollectionDialog
          open={dialogEvent.type === 'UPDATE_COLLECTION'}
          onCancel={() => setDialogEvent({ type: 'NONE' })}
          collection={dialogEvent.collection}
          onSave={handleUpdateCollection}
        />
      )}
    </>
  )
}

const CollectionListSection = styled.section`
  display: flex;
  flex-direction: column;
  & > *:not(:first-child) {
    margin-bottom: 16px;
  }
`

const CollectionListHeader = styled.div`
  padding: 0 16px;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  & > *:not(:last-child) {
    margin-right: 16px;
  }
`

const NewCollectionButton = styled.button`
  display: flex;
  position: sticky;
  align-items: center;
  background-color: transparent;
  color: #f8fafc;
  font-size: 0.875rem;
  cursor: pointer;
  @media (min-width: 640px) {
    background-color: #10b981;
    padding: 8px 16px;
    border-radius: 16px;
    cursor: pointer;
    ::after {
      margin-left: 8px;
      content: 'Add a collection';
    }
  }
`

const CollectionListTitle = styled.h1`
  font-size: 1.875rem;
  font-weight: 400;
  padding: 16px;
`

const CollectionListContainer = styled(motion.div)`
  position: relative;
  padding: 32px 64px;
  display: grid;
  row-gap: 16px;
  column-gap: 64px;
  grid-template-columns: repeat(1, minmax(0, 1fr));
  width: 100%;
  @media (min-width: 768px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  @media (min-width: 1024px) {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
  @media (min-width: 1280px) {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }
  @media (min-width: 1920px) {
    grid-template-columns: repeat(5, minmax(0, 1fr));
  }
`
