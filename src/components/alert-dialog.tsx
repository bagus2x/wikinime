import styled from '@emotion/styled'
import * as AlertDialogUnstyled from '@radix-ui/react-alert-dialog'
import React from 'react'

export interface AlertDialogProps {
  open?: boolean
  title?: string
  description?: string
  onCancel?: () => void
  onAction?: () => void
}

export default function AlertDialog({ open, onCancel, onAction, title, description }: AlertDialogProps) {
  return (
    <AlertDialogUnstyled.Root open={open}>
      <AlertDialogUnstyled.Portal>
        <AlertDialogOverlay />
        <AlertDialogContent>
          {!!title && <AlertDialoTitle>{title}</AlertDialoTitle>}
          {!!description && <AlertDialogDescription>{description}</AlertDialogDescription>}
          <div style={{ display: 'flex', gap: 16, justifyContent: 'flex-end' }}>
            <AlertDialogCancel onClick={onCancel}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={onAction}>Yes</AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialogUnstyled.Portal>
    </AlertDialogUnstyled.Root>
  )
}

const AlertDialogOverlay = styled(AlertDialogUnstyled.Overlay)`
  position: fixed;
  inset: 0;
  animation: overlayShow 150ms cubic-bezier(0.16, 1, 0.3, 1);
  backdrop-filter: blur(4px);
  z-index: 55;
  @keyframes overlayShow {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
  @supports not (backdrop-filter: blur(4px)) {
    background-color: #1e293b;
  }
`
const AlertDialogContent = styled(AlertDialogUnstyled.Content)`
  background-color: #f8fafc;
  color: #020617;
  border-radius: 16px;
  box-shadow: hsl(206 22% 7% / 35%) 0px 10px 38px -10px, hsl(206 22% 7% / 20%) 0px 10px 20px -15px;
  position: fixed;
  z-index: 55;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 90vw;
  max-width: 450px;
  padding: 25px;
  animation: contentShow 150ms cubic-bezier(0.16, 1, 0.3, 1);
`

const AlertDialoTitle = styled(AlertDialogUnstyled.Title)`
  margin: 0;
  font-weight: 500;
  font-size: 1rem;
`

const AlertDialogDescription = styled(AlertDialogUnstyled.Description)`
  margin: 10px 0 20px;
  font-size: 0.875rem;
  line-height: 1.5;
`
const AlertDialogButton = styled.button`
  padding: 8px 16px;
  font-size: 0.875rem;
  border-radius: 16px;
  cursor: pointer;
  transition: all;
  transition-duration: 250ms;
  :disabled {
    background-color: #94a3b8;
    cursor: unset;
  }
`

const AlertDialogCancel = styled(AlertDialogButton)`
  color: #020617;
  background-color: #f8fafc;
`

const AlertDialogAction = styled(AlertDialogButton)`
  background-color: #ef4444;
  color: #f8fafc;
  :hover {
    background-color: #dc2626;
  }
`
