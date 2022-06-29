import propTypes from 'prop-types'
import styled from '@emotion/styled'

import { HtmlContent } from '../..'

const GuestContentView = styled.div`
  width: 100%;
  padding: 0 ${(props) => props.theme.layout.padding};
  @media (max-width: ${(props) => props.theme.breakpoints.mobile}) {
    padding: 0 ${(props) => props.theme.layout.paddingMobile};
  }
`

const GuestContent = ({ content }) => {
  const hasContent = !!(content && content.length)
  if (!hasContent) return null
  return (
    <GuestContentView>
      <HtmlContent content={content} />
    </GuestContentView>
  )
}

GuestContent.displayName = 'GuestContent'
GuestContent.propTypes = {
  content: propTypes.string,
}

export default GuestContent
