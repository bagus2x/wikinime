import styled from '@emotion/styled'
import { useCollections } from '@wikinime/components/collection-provider'
import { motion } from 'framer-motion'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'

const CollectionDetail = dynamic(() => import('@wikinime/components/collection-detail'), { ssr: false })

export default function CollectionDetailPage() {
  const router = useRouter()

  return <CollectionDetail collectionId={parseInt(router.query.collectionId as string)} />
}
