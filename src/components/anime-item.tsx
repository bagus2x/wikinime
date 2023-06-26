import styled from '@emotion/styled'
import Anime from '@wikinime/models/anime'
import { Variants, motion } from 'framer-motion'
import { MinusCircleIcon, PlusCircleIcon } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'

export interface AnimeItemCardProps {
  anime: Anime
  selected?: boolean
  onSelect?: () => void
  onUnselect?: () => void
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

export default function AnimeItem({ anime, selected, onSelect, onUnselect }: AnimeItemCardProps) {
  const router = useRouter()

  return (
    <AnimeItemContainer variants={itemVariants} layout selected={selected}>
      <AnimeItemCover>
        <Image
          src={anime.coverImage.large ? anime.coverImage.large : '/images/image-not-available'}
          fill
          sizes='100%'
          alt={anime.title.romaji}
          priority
          onClick={() => router.push(`/anime/${anime.id}`)}
          style={{ cursor: 'pointer', objectFit: 'cover' }}
        />
        {selected && (
          <BookmarkButton onClick={onUnselect}>
            <MinusCircleIcon size={16} />
          </BookmarkButton>
        )}
        {!selected && (
          <BookmarkButton onClick={onSelect}>
            <PlusCircleIcon size={16} />
          </BookmarkButton>
        )}
      </AnimeItemCover>
      <AnimeItemContent>
        <AnimeItemTitle>
          <Link href={`/anime/${anime.id}`}>
            {anime.title.romaji || anime.title.english || anime.title.native} ({anime.seasonYear})
          </Link>
        </AnimeItemTitle>
        <AnimeEpisodes>
          {anime.episodes} {anime.episodes > 1 ? 'Episodes' : 'Episode'} • {anime.meanScore / 10} ⭐
        </AnimeEpisodes>
        <AnimeGenreList>
          {anime.genres.slice(0, 2).map((genre, index) => (
            <AnimeGenreItem key={index}>{genre}</AnimeGenreItem>
          ))}
        </AnimeGenreList>
      </AnimeItemContent>
    </AnimeItemContainer>
  )
}

const AnimeItemContainer = styled(motion.div)<{ selected?: boolean }>`
  border-radius: 16px;
  overflow: hidden;
  outline: ${(props) => (props.selected ? '2px solid #10b981' : '1px solid #1e293b')};
  transition-duration: 250ms;
  :hover {
    background-color: #1e293b;
    scale: 1.01;
  }
`

const AnimeItemCover = styled.div`
  display: block;
  position: relative;
  transition: all;
  width: 100%;
  aspect-ratio: 1 / 1;
  @supports not (aspect-ratio: 1 / 1) {
    height: 120px;
  }
`

const AnimeItemContent = styled.div`
  padding: 16px;
  display: flex;
  flex-direction: column;
  & > *:not(:last-child) {
    margin-bottom: 8px;
  }
`

const AnimeItemTitle = styled.span`
  font-size: 1rem;
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
`
const AnimeGenreList = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 8px;
`
const AnimeGenreItem = styled.span`
  border: 1px solid #1e293b;
  color: #94a3b8;
  border-radius: 16px;
  font-size: 0.75rem;
  line-height: 1rem;
  padding: 4px 8px;
`

const AnimeEpisodes = styled.span`
  display: flex;
  align-items: center;
  font-size: 0.75rem;
  color: #94a3b8;
`

const BookmarkButton = styled.div`
  border: none;
  background-color: #0f172a;
  padding: 8px;
  width: 32px;
  height: 32px;
  border-radius: 100%;
  position: absolute;
  right: 8px;
  bottom: 8px;
  cursor: pointer;
  user-select: none;
`
