import styled from '@emotion/styled'
import AnimeItem from '@wikinime/components/anime-item'
import CollectAnimeDialog from '@wikinime/components/collect-anime-dialog'
import Anime from '@wikinime/models/anime'
import Page from '@wikinime/models/paging'
import { AnimatePresence, Variants, motion } from 'framer-motion'
import { useMemo, useState } from 'react'

export interface AnimeListProps {
  initial: Page<Anime>
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

export default function AnimeList({ initial }: AnimeListProps) {
  const [selectedAnimesObj, setSelectedAnimesObj] = useState<{ [key: number]: Anime }>({})
  const selectedAnimes = useMemo(() => Object.values(selectedAnimesObj), [selectedAnimesObj])

  const handleSelect = (anime: Anime) => {
    setSelectedAnimesObj({ ...selectedAnimesObj, [anime.id]: anime })
  }

  const handleUnselect = (anime: Anime) => {
    setSelectedAnimesObj((prev) => {
      const selectedAnimes = { ...prev }
      delete selectedAnimes[anime.id]
      return selectedAnimes
    })
  }

  const handleUnselectAll = () => {
    setSelectedAnimesObj({})
  }

  return (
    <AnimeListSection variants={containerVariants} initial='hidden' whileInView='show'>
      <AnimatePresence>
        {initial.media.map((anime) => (
          <AnimeItem
            key={anime.id}
            anime={anime}
            selected={!!selectedAnimesObj[anime.id]}
            onSelect={() => handleSelect(anime)}
            onUnselect={() => handleUnselect(anime)}
          />
        ))}
      </AnimatePresence>
      {!!selectedAnimes.length && <CollectAnimeDialog animes={selectedAnimes} onSaved={handleUnselectAll} />}
    </AnimeListSection>
  )
}

const AnimeListSection = styled(motion.section)`
  position: relative;
  padding: 16px;
  display: grid;
  gap: 16px;
  grid-template-columns: repeat(1, minmax(0, 1fr));
  width: 100%;
  @media (min-width: 640px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  @media (min-width: 768px) {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
  @media (min-width: 1024px) {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }
  @media (min-width: 1280px) {
    grid-template-columns: repeat(5, minmax(0, 1fr));
  }
  @media (min-width: 1536px) {
    grid-template-columns: repeat(6, minmax(0, 1fr));
  }
`
