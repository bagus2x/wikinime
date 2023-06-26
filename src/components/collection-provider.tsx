import Anime from '@wikinime/models/anime'
import { Collection } from '@wikinime/models/collection'
import React, { Dispatch, useContext, useEffect, useReducer } from 'react'

const initialState =
  typeof window === 'undefined' ? [] : (JSON.parse(localStorage.getItem('collections') || '[]') as Collection[])

const CollectionContext = React.createContext<{
  state: typeof initialState
  dispatch: Dispatch<Action>
}>({
  state: initialState,
  dispatch: () => {},
})

type Action =
  | { type: 'GET_COLLECTIONS' }
  | { type: 'CREATE_COLLECTION'; title: string; animes: Anime[] }
  | { type: 'DELETE_COLLECTION'; collectionId: number }
  | { type: 'UPDATE_COLLECTION'; collection: Collection }
  | { type: 'ADD_ANIMES_INTO_COLLECTIONS'; animes: Anime[]; collections: Collection[] }

const reducer = (state = initialState, action: Action) => {
  switch (action.type) {
    case 'GET_COLLECTIONS':
      const collections = JSON.parse(localStorage.getItem('collections') || '[]') as Collection[]
      return collections
    case 'CREATE_COLLECTION': {
      const newCollection: Collection = {
        id: autoincrement(),
        name: action.title,
        animes: action.animes,
        createdAt: Date.now(),
      }
      const newCollections: Collection[] = [newCollection, ...state]
      localStorage.setItem('collections', JSON.stringify(newCollections))
      return newCollections
    }
    case 'DELETE_COLLECTION': {
      const newCollections = state.filter((collection) => collection.id !== action.collectionId)
      localStorage.setItem('collections', JSON.stringify(newCollections))
      return newCollections
    }
    case 'UPDATE_COLLECTION': {
      const newCollections = state.map((old) => (old.id === action.collection.id ? action.collection : old))
      localStorage.setItem('collections', JSON.stringify(newCollections))
      return newCollections
    }
    case 'ADD_ANIMES_INTO_COLLECTIONS': {
      const newCollections = [...state]
      action.collections.forEach((oldCollection) => {
        const index = newCollections.findIndex((collection) => collection.id === oldCollection.id)
        if (index >= 0) {
          const oldAnimeIds = oldCollection.animes.map((anime) => anime.id)
          newCollections[index] = {
            ...oldCollection,
            animes: [...oldCollection.animes, ...action.animes.filter((anime) => !oldAnimeIds.includes(anime.id))],
          }
        }
      })
      localStorage.setItem('collections', JSON.stringify(newCollections))
      return newCollections
    }
    default:
      return state
  }
}

export const useCollections = () => {
  const { state, dispatch } = useContext(CollectionContext)
  return {
    collections: state,
    dispatchCollection: dispatch,
  }
}

export interface CollectionProviderProps {
  children: React.ReactNode
}

export default function CollectionProvider({ children }: CollectionProviderProps) {
  const [state, dispatch] = useReducer(reducer, initialState)

  // Sync data between tabs
  useEffect(() => {
    const handler = (_: FocusEvent) => {
      dispatch({ type: 'GET_COLLECTIONS' })
    }
    window.addEventListener('focus', handler)
    return () => {
      window.removeEventListener('focus', handler)
    }
  }, [])

  return <CollectionContext.Provider value={{ state, dispatch }}>{children}</CollectionContext.Provider>
}

const autoincrement = () => {
  const next = parseInt(localStorage.getItem('autoincrement') || '0') + 1
  localStorage.setItem('autoincrement', `${next}`)
  return next
}
