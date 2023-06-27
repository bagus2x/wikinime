import { useQuery } from '@apollo/client'
import styled from '@emotion/styled'
import CollectAnimeDialog from '@wikinime/components/collect-anime-dialog'
import { useCollections } from '@wikinime/components/collection-provider'
import LoadingAnimation from '@wikinime/components/loading-indicator'
import Anime from '@wikinime/models/anime'
import { GET_ANIME_GQL } from '@wikinime/gql/anime-gql'
import { motion } from 'framer-motion'
import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useMemo } from 'react'
import { toast } from 'react-hot-toast'

export default function AnimeDetailPage() {
  const router = useRouter()
  const { data, loading } = useQuery<{ Media?: Anime }>(GET_ANIME_GQL, {
    variables: {
      id: router.query.animeId,
    },
    onError: (err) => {
      toast.error(err.message || 'Error has occurred')
    },
  })
  const anime = data?.Media
  const { collections } = useCollections()
  const animeCollections = useMemo(() => {
    return collections.filter((collection) => !!collection.animes.find((colAnime) => colAnime.id === anime?.id))
  }, [collections, anime])
  const title = anime ? `${anime.title.romaji || anime.title.english || anime.title.native} | Wikinime` : 'Wikinime'

  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>
      <AnimeDetailSection
        initial={{ opacity: 0, y: '-100vh' }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        {anime && (
          <>
            <AnimeDetailBanner>
              <Image
                fill
                src={
                  anime.bannerImage || anime.coverImage.extraLarge || anime.coverImage.large || anime.coverImage.medium
                }
                alt={anime.title.english || anime.title.romaji || anime.title.native}
                style={{ objectFit: 'cover', objectPosition: 'top' }}
              />
            </AnimeDetailBanner>
            <AnimeDetailArticle>
              <AnimeDetailInfo>
                <div style={{ display: 'flex' }}>
                  <AnimeDetailCover
                    src={anime.coverImage.large || anime.coverImage.medium || anime.coverImage.extraLarge}
                    width={135}
                    height={180}
                    alt={anime.title.english || anime.title.romaji || anime.title.native}
                  />
                  <div>
                    <AnimeTitle>{anime.title.romaji || anime.title.english || anime.title.native}</AnimeTitle>
                    <AnimeGenreList>
                      {anime.genres.map((genre) => (
                        <AnimeGenreItem key={genre}>{genre}</AnimeGenreItem>
                      ))}
                    </AnimeGenreList>
                    <AnimeSeason>
                      {anime.seasonYear} • {anime?.season} • {anime.meanScore / 10} ⭐
                    </AnimeSeason>
                    <AnimeSeason>{anime.episodes} episodes</AnimeSeason>
                  </div>
                </div>
                <CollectAnimeDialog
                  animes={[anime]}
                  trigger={<AddToCollectionButton>Add to Collection</AddToCollectionButton>}
                />
              </AnimeDetailInfo>
              <AnimeDescriptionTitle>Description</AnimeDescriptionTitle>
              <AnimeDescription>{anime.description}</AnimeDescription>
              <AnimeDescriptionTitle>Added in collections</AnimeDescriptionTitle>
              <CollectionItemLinkList style={{ position: 'relative' }}>
                {animeCollections.map((collection) => (
                  <CollectionItemLink key={collection.id} href={`/collections/${collection.id}`}>
                    {collection.name}
                  </CollectionItemLink>
                ))}
              </CollectionItemLinkList>
            </AnimeDetailArticle>
          </>
        )}
        {loading && <LoadingAnimation size={40} />}
      </AnimeDetailSection>
    </>
  )
}

const AnimeDetailSection = styled(motion.section)`
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
`

const AnimeDetailBanner = styled.div`
  position: relative;
  aspect-ratio: 4 / 1;
  width: 100%;
  height: 100%;
  @supports not (aspect-ratio: 4 / 1) {
    height: calc(1 / 2 * 100vh);
  }
`

const AnimeDetailArticle = styled.article`
  max-width: 1280px;
  width: 100%;
  margin: 0 auto;
  padding: 16px 0;
`

const AnimeDetailInfo = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  justify-content: space-between;
  align-items: flex-start;
  @media (min-width: 1024px) {
    flex-direction: row;
  }
`

const AnimeTitle = styled.h1`
  font-size: 2.25rem; /* 36px */
  line-height: 2.5rem; /* 40px */
  margin-left: 16px;
  line-clamp: 2;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
`

const AnimeSeason = styled.span`
  display: flex;
  align-items: center;
  font-size: 0.875rem;
  color: #94a3b8;
  margin-top: 16px;
  margin-left: 16px;
`

const AnimeGenreList = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  margin-left: 16px;
  & > * {
    margin-top: 8px;
  }
  & > *:not(:last-child) {
    margin-right: 8px;
  }
`
const AnimeGenreItem = styled.span`
  border: 1px solid #1e293b;
  color: #94a3b8;
  border-radius: 16px;
  font-size: 0.75rem;
  line-height: 1rem;
  padding: 4px 8px;
`

const AnimeDetailCover = styled(Image)`
  border-radius: 16px;
  overflow: hidden;
  position: relative;
  align-self: flex-start;
  flex-shrink: 0;
  display: none;
  @media (min-width: 1024px) {
    display: block;
    align-self: flex-start;
    margin-left: 16px;
  }
`

const AnimeDescriptionTitle = styled.h6`
  font-size: 1rem;
  margin: 16px 16px 0px 16px;
`

const AnimeDescription = styled.p`
  font-size: 0.875rem;
  margin: 8px 16px 16px 16px;
  color: #f8fafc;
  font-size: 0.875rem;
`

const AddToCollectionButton = styled.button`
  display: flex;
  background-color: #10b981;
  color: #f8fafc;
  padding: 8px 16px;
  font-size: 0.875rem;
  border-radius: 16px;
  margin: 16px;
  cursor: pointer;
  transition: all;
  transition-duration: 250ms;
  :hover {
    background-color: #059669;
  }
  @media (min-width: 1024px) {
    margin: 0px 16px;
  }
`

const CollectionItemLinkList = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  margin-left: 16px;
  & > * {
    margin-top: 8px;
  }
  & > *:not(:last-child) {
    margin-right: 8px;
  }
`

const CollectionItemLink = styled(Link)`
  border: 1px solid #1e293b;
  color: #94a3b8;
  border-radius: 16px;
  font-size: 0.75rem;
  line-height: 1rem;
  padding: 4px 8px;
  display: flex;
  flex-direction: row;
  align-items: center;
`
