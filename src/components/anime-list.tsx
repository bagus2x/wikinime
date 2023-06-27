import { useQuery } from '@apollo/client'
import styled from '@emotion/styled'
import AnimeItem from '@wikinime/components/anime-item'
import CollectAnimeDialog from '@wikinime/components/collect-anime-dialog'
import LoadingAnimation from '@wikinime/components/loading-indicator'
import { GET_ANIMES_GQL } from '@wikinime/gql/anime-gql'
import Anime from '@wikinime/models/anime'
import Page from '@wikinime/models/paging'
import { AnimatePresence, Variants, motion } from 'framer-motion'
import { useMemo, useState } from 'react'
import { toast } from 'react-hot-toast'
import ReactPaginate from 'react-paginate'

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

const PER_PAGE = 10

export default function AnimeList() {
  const [selectedAnimesObj, setSelectedAnimesObj] = useState<{ [key: number]: Anime }>({})
  const selectedAnimes = useMemo(() => Object.values(selectedAnimesObj), [selectedAnimesObj])
  const { data, loading, fetchMore } = useQuery<{ Page?: Page<Anime> }>(GET_ANIMES_GQL, {
    variables: {
      page: 1,
      perPage: PER_PAGE,
    },
    notifyOnNetworkStatusChange: true,
    fetchPolicy: 'cache-first',
    onError: (err) => {
      toast.error(err.message || 'Error has occurred. Please check rate limit')
    },
  })

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

  const handlePageChange = ({ selected }: { selected: number }) => {
    fetchMore({
      variables: { page: selected + 1, perPage: PER_PAGE },
      updateQuery: (_, { fetchMoreResult }) => {
        window.scrollTo({ top: 0, behavior: 'smooth' })
        return fetchMoreResult
      },
    })
  }

  return (
    <AnimeListSection>
      <AnimeListContainer
        key={data?.Page?.pageInfo.currentPage}
        variants={containerVariants}
        initial='hidden'
        whileInView='show'
      >
        <AnimatePresence>
          {data?.Page?.media.map((anime) => (
            <AnimeItem
              key={anime.id}
              anime={anime}
              selected={!!selectedAnimesObj[anime.id]}
              onSelect={() => handleSelect(anime)}
              onUnselect={() => handleUnselect(anime)}
            />
          ))}
        </AnimatePresence>
      </AnimeListContainer>

      {!!selectedAnimes.length && (
        <CollectAnimeDialog
          animes={selectedAnimes}
          onSaved={handleUnselectAll}
          trigger={
            <Fab whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              Add {selectedAnimes.length} animes into collections 💾
            </Fab>
          }
        />
      )}
      {data && (
        <Pagination
          breakLabel='...'
          nextLabel='Next >'
          previousLabel='< Previous'
          pageRangeDisplayed={3}
          pageCount={data?.Page?.pageInfo.total || 0}
          onPageChange={handlePageChange}
          forcePage={data.Page?.pageInfo.currentPage && data.Page?.pageInfo.currentPage - 1}
        />
      )}
      {loading && <LoadingAnimation size={40} />}
    </AnimeListSection>
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

const AnimeListSection = styled.section`
  position: relative;
  width: 100%;
`

const AnimeListContainer = styled(motion.div)`
  position: relative;
  padding: 16px;
  display: grid;
  gap: 16px;
  grid-template-columns: repeat(1, minmax(0, 1fr));
  width: 100%;
  @media (min-width: 640px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (min-width: 1024px) {
    grid-template-columns: repeat(5, minmax(0, 1fr));
  }
`

const Pagination = styled(ReactPaginate)`
  margin-bottom: 120px;
  display: flex;
  flex-wrap: wrap;
  align-self: center;
  flex-direction: row;
  justify-content: center;
  list-style-type: none;
  font-size: 0.875rem;

  & > *:not(:last-child) {
    margin-right: 16px;
  }

  & > * {
    margin-top: 32px;
  }

  li a {
    border-radius: 16px;
    padding: 8px 16px;
    border: 1px solid #1e293b;
    cursor: pointer;
  }
  li.previous a,
  li.next a,
  li.break a {
    border-color: transparent;
  }
  li.active a {
    background-color: #10b981;
    border-color: transparent;
    color: #f8fafc;
    min-width: 32px;
    transition: all;
    transition-duration: 250ms;
    :hover {
      background-color: #059669;
    }
  }
  li.disabled a {
    color: #94a3b8;
  }
  li.disable,
  li.disabled a {
    cursor: default;
  }
`
Pagination.defaultProps = {
  activeClassName: 'active',
}
