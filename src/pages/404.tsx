import styled from '@emotion/styled'

export default function NotFoundPage() {
  return (
    <NotFoundPageSection>
      <NotFoundTitle>Not Found</NotFoundTitle>
    </NotFoundPageSection>
  )
}

const NotFoundPageSection = styled.section`
  display: flex;
  width: 100%;
  height: 100%;
  justify-content: center;
  align-items: center;
`

const NotFoundTitle = styled.h6`
  font-size: 1.25rem;
`
