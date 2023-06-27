import styled from '@emotion/styled'
import CollectionMoreVertDropdown from '@wikinime/components/collection-more-vert-dropdown'
import Anime from '@wikinime/models/anime'
import { Collection } from '@wikinime/models/collection'
import { Variants, motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useMemo } from 'react'
import { EffectCards } from 'swiper'
import 'swiper/css'
import 'swiper/css/effect-cards'
import { Swiper, SwiperSlide } from 'swiper/react'

export interface CollectionItemProps {
  collection: Collection
  onEditCollection?: () => void
  onDeleteCollection?: () => void
  onRemoveAnime?: (anime: Anime) => void
}

const itemVariants: Variants = {
  hidden: { opacity: 0, scale: 0.5 },
  show: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 1.4,
      type: 'spring',
      damping: 5,
      stiffness: 70,
    },
  },
}

export default function CollectionItem({
  collection,
  onEditCollection,
  onDeleteCollection,
  onRemoveAnime,
}: CollectionItemProps) {
  const router = useRouter()
  const animes = useMemo(() => collection.animes.slice(0, 5), [collection])

  return (
    <CollectionItemContainer variants={itemVariants} exit={{ scale: 0, opacity: 0 }} layout>
      <AnimeSwiper effect='cards' grabCursor={true} modules={[EffectCards]} className='mySwiper'>
        {animes.map((anime) => (
          <AnimeSwiperSlide key={anime.id}>
            <Image
              alt={anime.title.romaji || anime.title.english || anime.title.native}
              src={
                anime.coverImage.large ||
                anime.coverImage.medium ||
                anime.coverImage.extraLarge ||
                '/image-not-available.png'
              }
              fill
              sizes='100%'
              onClick={() => router.push(`/collections/${collection.id}`)}
            />
            <AnimeTitle href={`/anime/${anime.id}`}>
              {anime.title.romaji || anime.title.english || anime.title.native}
            </AnimeTitle>
            <CollectionMoreVertDropdown
              onEditCollection={onEditCollection}
              onDeleteCollection={onDeleteCollection}
              onDeleteAnime={() => onRemoveAnime && onRemoveAnime(anime)}
            />
          </AnimeSwiperSlide>
        ))}
        {/* Show placeholder if collections empty */}
        {!collection.animes.length && (
          <AnimeSwiperSlide>
            <Image
              alt='Anime is empty'
              src='/images/image-not-available.png'
              fill
              sizes='100%'
              style={{ objectFit: 'contain' }}
            />
            <CollectionMoreVertDropdown onEditCollection={onEditCollection} onDeleteCollection={onDeleteCollection} />
          </AnimeSwiperSlide>
        )}
      </AnimeSwiper>
      <CollectionTitle href={`/collections/${collection.id}`}>{collection.name}</CollectionTitle>
    </CollectionItemContainer>
  )
}

const CollectionItemContainer = styled(motion.div)`
  display: flex;
  flex-direction: column;
  width: 100%;
  user-select: none;
`

const AnimeTitle = styled(Link)`
  position: absolute;
  left: 0;
  bottom: 0;
  padding: 8px;
  font-size: 0.75rem;
  background-color: #0f172a46;
  width: 100%;
  font-weight: 400;
  text-align: center;
  word-break: break-all;
`

const CollectionTitle = styled(Link)`
  font-size: 1rem;
  padding: 16px;
  text-align: center;
  word-break: break-all;
`

const AnimeSwiper = styled(Swiper)`
  width: 100%;
  aspect-ratio: 3 / 4;
  @supports not (aspect-ratio: 1 / 1) {
    height: 200px;
  }
`

const AnimeSwiperSlide = styled(SwiperSlide)`
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 18px;
  font-size: 22px;
  font-weight: bold;
  color: #fff;
  position: relative;
  transition: all;
`

const DeleteCollectionButton = styled.button``
