import styled from '@emotion/styled'
import * as Dialog from '@radix-ui/react-dialog'
import { Collection } from '@wikinime/models/collection'
import { useState } from 'react'

export interface EditCollectionsDialogProps {
  open?: boolean
  collection: Collection
  onCancel?: () => void
  onSave?: (collection: Collection) => void
}

export default function EditCollectionDialog({ open, collection, onSave, onCancel }: EditCollectionsDialogProps) {
  const [newCollectionName, setNewCollectionName] = useState(collection.name)

  return (
    <Dialog.Root open={!!open}>
      <Dialog.Portal>
        <DialogOverlay />
        <DialogContent>
          <DialogTitle>Edit collection</DialogTitle>
          <DialogDescription>Type your collection name</DialogDescription>
          <Input
            type='text'
            placeholder='New collection name'
            onChange={(ev) => setNewCollectionName(ev.target.value.replace(/[^\w\s]/gi, ''))}
            value={newCollectionName}
          />
          <div style={{ display: 'flex', marginTop: 25, justifyContent: 'flex-end' }}>
            <CancelButton style={{ marginRight: 16 }} onClick={onCancel}>
              Cancel
            </CancelButton>
            <SaveButton
              onClick={() => {
                onSave && onSave({ ...collection, name: newCollectionName })
                setNewCollectionName('')
              }}
              disabled={!newCollectionName}
            >
              Save
            </SaveButton>
          </div>
        </DialogContent>
      </Dialog.Portal>
    </Dialog.Root>
  )
}

const DialogOverlay = styled(Dialog.Overlay)`
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

const DialogContent = styled(Dialog.Content)`
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

const DialogTitle = styled(Dialog.Title)`
  margin: 0;
  font-weight: 500;
  font-size: 1rem;
`

const DialogDescription = styled(Dialog.Description)`
  margin: 10px 0 20px;
  font-size: 0.875rem;
  line-height: 1.5;
`
const Input = styled.input`
  padding: 8px 16px;
  border-radius: 16px;
  outline: none;
  font-size: 0.875rem;
  border: 1px solid #cbd5e1;
  width: 100%;
  :focus {
    outline: 2px solid #059669;
  }
  [type='checkbox'] {
    padding: 2px;
    width: 8px;
    height: 4px;
  }
`

const SaveButton = styled.button`
  padding: 8px 16px;
  font-size: 0.875rem;
  background-color: #059669;
  color: #f8fafc;
  border-radius: 16px;
  cursor: pointer;
  :disabled {
    background-color: #94a3b8;
    cursor: unset;
  }
`

const CancelButton = styled.button`
  background-color: transparent;
  padding: 8px 16px;
  font-size: 0.875rem;
  border-radius: 16px;
  cursor: pointer;
  :disabled {
    cursor: unset;
  }
`
