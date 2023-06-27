import styled from '@emotion/styled'
import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import { MoreVerticalIcon } from 'lucide-react'

export interface CollectionMoreVertDropdownProps {
  onEditCollection?: () => void
  onDeleteCollection?: () => void
  onDeleteAnime?: () => void
}

export default function CollectionMoreVertDropdown({
  onEditCollection,
  onDeleteCollection,
  onDeleteAnime,
}: CollectionMoreVertDropdownProps) {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <MoreVertButton>
          <MoreVerticalIcon size={20} style={{ pointerEvents: 'none' }} />
        </MoreVertButton>
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenuContent sideOffset={5}>
          {onDeleteAnime && (
            <>
              <DropdownMenuItem onClick={onDeleteAnime}>Remove single anime</DropdownMenuItem>
              <DropdownMenuItemDivier />
            </>
          )}
          {onEditCollection && <DropdownMenuItem onClick={onEditCollection}>Edit collection</DropdownMenuItem>}
          {onDeleteCollection && (
            <DropdownMenuItem onClick={onDeleteCollection}>Delete collection and all animes</DropdownMenuItem>
          )}
          <DropdownMenu.Arrow style={{ fill: 'white' }} />
        </DropdownMenuContent>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  )
}

const DropdownMenuContent = styled(DropdownMenu.Content)`
  min-width: 220px;
  background-color: #f8fafc;
  color: #020617;
  border-radius: 16px;
  padding: 4px;
  box-shadow: 0px 10px 38px -10px rgba(22, 23, 24, 0.35), 0px 10px 20px -15px rgba(22, 23, 24, 0.2);
  animation-duration: 400ms;
  animation-timing-function: cubic-bezier(0.16, 1, 0.3, 1);
  will-change: transform, opacity;
  z-index: 1;
  &[data-side='top'] {
    animation-name: slideDownAndFade;
  }
  &[data-side='right'] {
    animation-name: slideLeftAndFade;
  }
  &[data-side='bottom'] {
    animation-name: slideUpAndFade;
  }
  &[data-side='left'] {
    animation-name: slideRightAndFade;
  }

  @keyframes slideUpAndFade {
    from {
      opacity: 0;
      transform: translateY(2px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes slideRightAndFade {
    from {
      opacity: 0;
      transform: translateX(-2px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }

  @keyframes slideDownAndFade {
    from {
      opacity: 0;
      transform: translateY(-2px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes slideLeftAndFade {
    from {
      opacity: 0;
      transform: translateX(2px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }
`

const DropdownMenuItem = styled(DropdownMenu.Item)`
  font-size: 0.875rem;
  line-height: 1;
  color: #0f172a;
  border-radius: 16px;
  display: flex;
  align-items: center;
  height: 24px;
  padding: 16px 8px;
  position: relative;
  user-select: none;
  outline: none;
  :hover {
    background-color: #e2e8f0;
  }
`

const DropdownMenuItemDivier = styled.span`
  display: block;
  width: calc(100% - 16px);
  height: 1px;
  background-color: #cbd5e1;
  margin: 0 auto;
`

const MoreVertButton = styled.button`
  background: none;
  top: 8px;
  right: 8px;
  width: 32px;
  height: 32px;
  padding: 4px;
  position: absolute;
  cursor: pointer;
  background: #0f172a59;
  border-radius: 100%;
  color: #f8fafc;
  transition: all;
  transition-duration: 250ms;
  :hover {
    background: #0f172aa8;
    scale: 1.1;
  }
`
