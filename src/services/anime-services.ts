import { gql } from '@apollo/client'
import Anime from '@wikinime/models/anime'
import Page from '@wikinime/models/paging'
import client from '@wikinime/utils/appolo-client'

const GET_ANIMES_GQL = gql`
  query ($id: Int, $page: Int, $perPage: Int, $search: String) {
    Page(page: $page, perPage: $perPage) {
      pageInfo {
        total
        currentPage
        lastPage
        hasNextPage
        perPage
      }
      media(id: $id, search: $search) {
        id
        title {
          romaji
          english
          native
        }
        description
        coverImage {
          color
          medium
          large
          extraLarge
        }
        bannerImage
        meanScore
        seasonYear
        season
        episodes
        genres
        updatedAt
      }
    }
  }
`

export const getAnimes = async ({
  id: animeId,
  page = 1,
  perPage = 10,
  search,
}: {
  id?: number
  page: number
  perPage: number
  search?: string
}): Promise<Page<Anime>> => {
  const { data } = await client.query<{ Page: Page<Anime> }>({
    query: GET_ANIMES_GQL,
    variables: {
      id: animeId,
      page,
      perPage,
      search,
    },
  })

  return data.Page
}

const GET_ANIME_GQL = gql`
  query ($id: Int) {
    # Define which variables will be used in the query (id)
    Media(id: $id, type: ANIME) {
      id
      title {
        romaji
        english
        native
      }
      description
      coverImage {
        color
        medium
        large
        extraLarge
      }
      bannerImage
      meanScore
      seasonYear
      season
      episodes
      genres
      updatedAt
    }
  }
`

export const getAnime = async ({ animeId }: { animeId: number }): Promise<Anime> => {
  const { data } = await client.query<{ Media: Anime }>({
    query: GET_ANIME_GQL,
    variables: {
      id: animeId,
    },
  })

  return data.Media
}
