import { gql } from '@apollo/client'

export const GET_ANIMES_GQL = gql`
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

export const GET_ANIME_GQL = gql`
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
