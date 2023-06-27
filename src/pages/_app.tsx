import { ApolloProvider } from '@apollo/client'
import { Global } from '@emotion/react'
import CollectionProvider from '@wikinime/components/collection-provider'
import Layout from '@wikinime/components/layout'
import client from '@wikinime/gql/appolo-client'
import { globalCss } from '@wikinime/styles/global'
import { AnimatePresence } from 'framer-motion'
import type { AppProps } from 'next/app'
import { Inter } from 'next/font/google'
import Head from 'next/head'
import router from 'next/router'
import NProgress from 'nprogress'
import { useEffect } from 'react'
import { Toaster } from 'react-hot-toast'

const inter = Inter({ subsets: ['latin'] })

export default function App({ Component, pageProps }: AppProps) {
  useEffect(() => {
    const handleRouteStart = () => NProgress.start()
    const handleRouteDone = () => NProgress.done()

    router.events.on('routeChangeStart', handleRouteStart)
    router.events.on('routeChangeComplete', handleRouteDone)
    router.events.on('routeChangeError', handleRouteDone)

    return () => {
      router.events.off('routeChangeStart', handleRouteStart)
      router.events.off('routeChangeComplete', handleRouteDone)
      router.events.off('routeChangeError', handleRouteDone)
    }
  }, [])

  return (
    <>
      <Global styles={globalCss} />
      <ApolloProvider client={client}>
        <Layout>
          <Head>
            <link rel='shortcut icon' href='/images/favicon.ico' />
          </Head>
          <CollectionProvider>
            <style jsx global>{`
              html {
                font-family: ${inter.style.fontFamily};
              }
            `}</style>
            <AnimatePresence>
              <Component {...pageProps} />
            </AnimatePresence>
          </CollectionProvider>
        </Layout>
      </ApolloProvider>
      <Toaster />
    </>
  )
}
