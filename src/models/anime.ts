export default interface Anime {
  id: number
  title: {
    native: string
    romaji: string
    english: string | null
  }
  description: string
  coverImage: {
    color: string
    medium: string
    large: string
    extraLarge: string
  }
  bannerImage: string | null
  meanScore: number
  seasonYear: number
  season: string
  genres: string[]
  episodes: number
  updatedAt: number
}
