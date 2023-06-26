import dynamic from 'next/dynamic'
import Head from 'next/head'

const CollectionList = dynamic(() => import('@wikinime/components/collection-list'), { ssr: false })

export default function CollectionsPage() {
  return (
    <>
      <Head>
        <title>My Collections | Wikinime</title>
      </Head>
      <CollectionList />
    </>
  )
}
