import styled from '@emotion/styled'
import Anime from '@wikinime/models/anime'
import { getAnime } from '@wikinime/services/anime-services'
import { GetServerSideProps } from 'next'
import Image from 'next/image'

export interface AnimeDetailPageProps {
  anime: Anime
}

export default function AnimeDetailPage({ anime }: AnimeDetailPageProps) {
  return (
    <AnimeDetailContainer>
      <AnimeDetailBanner>
        <Image
          fill
          src={anime.bannerImage || anime.coverImage.extraLarge || anime.coverImage.large || anime.coverImage.medium}
          alt={anime.title.english || anime.title.romaji || anime.title.native}
        />
      </AnimeDetailBanner>
      <AnimeDetailCover
        src={anime.coverImage.large || anime.coverImage.medium || anime.coverImage.extraLarge}
        width={150}
        height={200}
        alt={anime.title.english || anime.title.romaji || anime.title.native}
      />
    </AnimeDetailContainer>
  )
}

export const getServerSideProps: GetServerSideProps<{ anime: Anime }, { animeId: string }> = async ({ params }) => {
  const anime = await getAnime({ animeId: parseInt(params!!.animeId) })
  return { props: { anime } }
}

const AnimeDetailContainer = styled.article`
  display: flex;
  flex-direction: column;
  align-items: center;
`

const AnimeDetailBanner = styled.div`
  position: relative;
  aspect-ratio: 8 / 1;
  width: 100%;
  height: 100%;
`

const AnimeDetailCover = styled(Image)`
  border-radius: 16px;
  overflow: hidden;
`
