import propTypes from 'prop-types'
import styled from '@emotion/styled'

import { Container } from '.'

const PageIntroView = styled.div`
  // background-color: ${(props) => props.theme.bgColors.secondary};
  padding: ${(props) => props.theme.layout.margin} 0;
  @media (max-width: ${(props) => props.theme.breakpoints.mobile}) {
    padding: ${(props) => props.theme.layout.marginMobile} 0;
  }
`

const PageIntroContent = styled.div`
  width: 100%;
  max-width: ${(props) => props.width || '72rem'};
  margin: 0 auto;
  text-align: center;

  p {
    margin: 1em 0;
    // font-size: ${(props) => props.theme.fonts.sizes.xBig};
    // line-height: ${(props) => props.theme.lineHeight};
    font-family: 'Lora', sans-serif;
    font-size: 2.5rem;
    line-height: 1.5;
  }
`

const PageIntro = ({ content }) => {
  return (
    <PageIntroView>
      <Container>
        <PageIntroContent dangerouslySetInnerHTML={{ __html: content }} />
      </Container>
    </PageIntroView>
  )
}

PageIntro.displayName = 'PageIntro'
PageIntro.propTypes = {
  style: propTypes.object,
}

export default PageIntro
