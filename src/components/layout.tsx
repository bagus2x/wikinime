import styled from '@emotion/styled'
import { BookmarkIcon, GithubIcon, HomeIcon, MenuIcon } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'

export interface LayoutProps {
  children: React.ReactNode
}

export default function Layout({ children }: LayoutProps) {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    const matchMedia = window.matchMedia('(min-width: 640px)')
    setIsOpen(matchMedia.matches)

    const handler = (ev: MediaQueryListEvent) => {
      setIsOpen(ev.matches)
    }

    matchMedia.addEventListener('change', handler)
    return () => {
      matchMedia.removeEventListener('change', handler)
    }
  }, [])

  return (
    <LayoutContainer>
      <Header>
        <MenuIcon onClick={() => setIsOpen(!isOpen)} style={{ cursor: 'pointer', userSelect: 'none' }} size={24} />
        <HeaderTitle>
          <Image
            src='/images/anbu.svg'
            width={32}
            height={32}
            alt='Wikinime'
            style={{ marginRight: 8, marginLeft: 8 }}
          />
          <span>wikinime</span>
        </HeaderTitle>
      </Header>
      <LayoutContent>
        <Sidebar visible={isOpen}>
          <SidebarMenu>
            <SidebarMenuItem active={router.pathname === '/'}>
              <SidebarMenuItemLink href='/'>
                <HomeIcon size={24} />
                Home
              </SidebarMenuItemLink>
            </SidebarMenuItem>
            <SidebarMenuItem active={router.pathname.startsWith('/collections')}>
              <SidebarMenuItemLink href='/collections'>
                <BookmarkIcon />
                Collections
              </SidebarMenuItemLink>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuItemLink href='https://github.com/bagus2x' target='_blank'>
                <GithubIcon />
                Github
              </SidebarMenuItemLink>
            </SidebarMenuItem>
          </SidebarMenu>
        </Sidebar>
        <LayoutMain expand={!isOpen}>{children}</LayoutMain>
      </LayoutContent>
    </LayoutContainer>
  )
}

const LayoutContainer = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
  min-height: 100vh;
`

export const SIDEBAR_WIDTH = '240px'
export const TOPBAR_HEIGTH = '56px'

const LayoutContent = styled.div`
  position: relative;
`

const LayoutMain = styled.main<{ expand: boolean }>`
  margin-top: ${TOPBAR_HEIGTH};
  transition: all;
  transition-duration: 250ms;
  @media (min-width: 640px) {
    margin-left: ${(props) => (props.expand ? 0 : SIDEBAR_WIDTH)};
    width: ${(props) => (props.expand ? '100%' : 'calc(100% - ${DESKTOP_SIDEBAR_WIDTH})')};
  }
`

export const Sidebar = styled.div<{ visible: boolean }>`
  display: flex;
  flex-direction: column;
  padding: 16px 0;
  position: fixed;
  width: ${SIDEBAR_WIDTH};
  margin-top: ${TOPBAR_HEIGTH};
  height: calc(100vh - ${TOPBAR_HEIGTH});
  border-right: 1px solid #1e293b;
  left: ${(props) => (props.visible ? '0' : `-${SIDEBAR_WIDTH}`)};
  transition: all;
  transition-duration: 250ms;
  z-index: 50;
  backdrop-filter: blur(32px);
  @supports not (backdrop-filter: blur(32px)) {
    background-color: #1e293b;
  }
`

export const HeaderTitle = styled.div`
  color: #10b981;
  font-size: 1.5rem;
  font-weight: bold;
  display: flex;
  align-items: center;
`

export const SidebarMenu = styled.ul`
  display: flex;
  flex-direction: column;
  list-style: none;
`
export const SidebarMenuItem = styled.li<{ active?: boolean }>`
  font-size: 0.865rem;
  user-select: none;
  position: relative;
  padding: 8px 16px;
  margin-bottom: 8px;
  transition: all;
  transition-duration: 250ms;
  color: ${(props) => (props.active ? '#10b981' : 'inherit')};
  :hover {
    background-color: #1e293b;
  }
  ::after {
    content: '';
    height: 32px;
    width: 4px;
    border-radius: 16px;
    background-color: ${(props) => (props.active ? '#10b981' : 'transparent')};
    position: absolute;
    top: 50%;
    right: 0;
    transform: translateY(-50%);
    transition: all;
    transition-duration: 500ms;
  }
`
export const SidebarMenuItemLink = styled(Link)`
  display: flex;
  gap: 16px;
  align-items: center;
  cursor: pointer;
  text-decoration: none;
  color: inherit;
`

const Header = styled.header`
  z-index: 50;
  right: 0;
  top: 0;
  padding: 0 16px;
  display: flex;
  align-items: center;
  border-bottom: 1px solid #1e293b;
  width: 100%;
  position: fixed;
  height: 56px;
  backdrop-filter: blur(32px);
  @supports not (backdrop-filter: blur(32px)) {
    background-color: #1e293b;
  }
`
