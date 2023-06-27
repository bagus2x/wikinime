import styled from '@emotion/styled'
import { Loader2Icon } from 'lucide-react'

const LoadingAnimation = styled(Loader2Icon)`
  position: fixed;
  left: 50%;
  top: 50%;
  animation: spin 1s linear infinite;
  color: #10b981;
  background: #f8fafc;
  border-radius: 100%;
  padding: 8px;

  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
`

export default LoadingAnimation
