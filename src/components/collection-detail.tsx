import styled from '@emotion/styled'
import AlertDialog from '@wikinime/components/alert-dialog'
import AnimeItem from '@wikinime/components/anime-item'
import { useCollections } from '@wikinime/components/collection-provider'
import UpdateCollectionDialog from '@wikinime/components/update-collection-dialog'
import Anime from '@wikinime/models/anime'
import { Collection } from '@wikinime/models/collection'
import { AnimatePresence, Variants, motion } from 'framer-motion'
import { Edit2Icon, Trash2Icon } from 'lucide-react'
import Head from 'next/head'
import { useMemo, useState } from 'react'
import { toast } from 'react-hot-toast'

export interface CollectionDetailProps {
  collectionId: number
}

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
  | { type: 'DELETE_COLLECTION' }
  | { type: 'UPDATE_COLLECTION' }
  | { type: 'REMOVE_ANIME_FROM_COLLECTION'; anime: Anime }
  | { type: 'NONE' }

export default function CollectionDetail({ collectionId }: CollectionDetailProps) {
  const { collections, dispatchCollection } = useCollections()
  const collection = useMemo(() => {
    const collection = collections.find((collection) => collection.id === collectionId)
    if (!collection && collectionId) {
      toast.error('Collection not found')
    }
    return collection
  }, [collections, collectionId])
  const title = collection?.name ? `${collection.name} | Wikinime` : 'Wikinime'
  const [dialogEvent, setDialogEvent] = useState<DialogEvent>({ type: 'NONE' })

  const handleDeleteCollection = () => {
    if (dialogEvent.type === 'DELETE_COLLECTION' && collection) {
      dispatchCollection({ type: 'DELETE_COLLECTION', collectionId: collection.id })
      setDialogEvent({ type: 'NONE' })
      toast.success('Collections successfully deleted')
    }
  }

  const handleRemoveAnime = () => {
    if (dialogEvent.type === 'REMOVE_ANIME_FROM_COLLECTION' && collection) {
      dispatchCollection({
        type: 'UPDATE_COLLECTION',
        collection: {
          ...collection,
          animes: collection.animes.filter((anime) => anime.id !== dialogEvent.anime.id),
        },
      })
      toast.success(`Animes successfully removed from ${collection.name}`)
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
      <Head>
        <title>{title}</title>
      </Head>
      <CollectionDetailSection>
        <CollectionDetailHeader>
          <CollectionDetailTitle>{collection?.name}</CollectionDetailTitle>
          <div style={{ display: 'flex' }}>
            <DeleteCollectionButton
              onClick={() => setDialogEvent({ type: 'DELETE_COLLECTION' })}
              style={{ marginRight: 16 }}
            >
              <Trash2Icon size={20} />
            </DeleteCollectionButton>
            <EditCollectionButton onClick={() => setDialogEvent({ type: 'UPDATE_COLLECTION' })}>
              <Edit2Icon size={20} />
            </EditCollectionButton>
          </div>
        </CollectionDetailHeader>
        <AnimeListContainer key={collection?.id} variants={containerVariants} initial='hidden' whileInView='show'>
          <AnimatePresence>
            {collection?.animes.map((anime) => (
              <AnimeItem
                key={anime.id}
                anime={anime}
                onRemove={() => setDialogEvent({ type: 'REMOVE_ANIME_FROM_COLLECTION', anime })}
              />
            ))}
          </AnimatePresence>
        </AnimeListContainer>
        {dialogEvent.type === 'DELETE_COLLECTION' && collection && (
          <AlertDialog
            open={dialogEvent.type === 'DELETE_COLLECTION'}
            title={`Delete ${collection.name}?`}
            description='This action cannot be undone. This will permanently delete your collection'
            onCancel={() => setDialogEvent({ type: 'NONE' })}
            onAction={handleDeleteCollection}
          />
        )}
        {dialogEvent.type === 'REMOVE_ANIME_FROM_COLLECTION' && collection && (
          <AlertDialog
            open={dialogEvent.type === 'REMOVE_ANIME_FROM_COLLECTION'}
            title={`Remove anime from ${collection.name}?`}
            description={`This action cannot be undone. This will permanently remove your anime from ${collection.name}`}
            onCancel={() => setDialogEvent({ type: 'NONE' })}
            onAction={handleRemoveAnime}
          />
        )}
        {dialogEvent.type === 'UPDATE_COLLECTION' && collection && (
          <UpdateCollectionDialog
            open={dialogEvent.type === 'UPDATE_COLLECTION'}
            onCancel={() => setDialogEvent({ type: 'NONE' })}
            collection={collection}
            onSave={handleUpdateCollection}
          />
        )}
      </CollectionDetailSection>
    </>
  )
}

const CollectionDetailSection = styled.section`
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 16px;
`

const CollectionDetailTitle = styled.h1`
  font-size: 1.875rem;
  font-weight: 400;
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
  word-wrap: break-word;
  white-space: break-spaces;
`

const AnimeListContainer = styled(motion.div)`
  position: relative;
  display: grid;
  gap: 16px;
  grid-template-columns: repeat(1, minmax(0, 1fr));
  width: 100%;
  margin-top: 16px;
  @media (min-width: 640px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (min-width: 1024px) {
    grid-template-columns: repeat(5, minmax(0, 1fr));
  }
`

const EditCollectionButton = styled.button`
  display: flex;
  position: sticky;
  align-items: center;
  background-color: transparent;
  color: #f8fafc;
  font-size: 0.875rem;
  cursor: pointer;
  @media (min-width: 640px) {
    background-color: #facc15;
    padding: 8px 16px;
    border-radius: 16px;
    cursor: pointer;
    ::after {
      margin-left: 8px;
      content: 'Edit collection';
    }
  }
`

const CollectionDetailHeader = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  & > *:not(:last-child) {
    margin-right: 16px;
  }
`

const DeleteCollectionButton = styled.button`
  display: flex;
  position: sticky;
  align-items: center;
  background-color: transparent;
  color: #f8fafc;
  font-size: 0.875rem;
  cursor: pointer;
  @media (min-width: 640px) {
    background-color: #ef4444;
    padding: 8px 16px;
    border-radius: 16px;
    cursor: pointer;
    ::after {
      margin-left: 8px;
      content: 'Delete collection';
    }
  }
`
