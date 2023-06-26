import Anime from '@wikinime/models/anime'

export interface Collection {
  id: number
  name: string
  animes: Anime[]
  createdAt: number
}
