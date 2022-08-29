import styled from '@emotion/styled'
import propTypes from 'prop-types'
import { Heading } from '@open-tender/components'

const CheckoutSectionTitleView = styled.div`
  margin: 1.2rem 0 -0.2rem -0.1rem;
  @media (max-width: ${(props) => props.theme.breakpoints.narrow}) {
    margin: 1rem 0 -0.2rem -0.1rem;
  }
`

const CheckoutSectionTitleText = styled(Heading)`
  font-size: ${(props) => props.theme.fonts.sizes.xBig};
  @media (max-width: ${(props) => props.theme.breakpoints.narrow}) {
    font-size: ${(props) => props.theme.fonts.sizes.xBig};
  }
`

const CheckoutSectionTitle = ({ children }) => {
  return (
    <CheckoutSectionTitleView>
      <CheckoutSectionTitleText as="p">{children}</CheckoutSectionTitleText>
    </CheckoutSectionTitleView>
  )
}

CheckoutSectionTitle.displayName = 'CheckoutSectionTitle'
CheckoutSectionTitle.propTypes = {
  children: propTypes.oneOfType([
    propTypes.arrayOf(propTypes.node),
    propTypes.node,
  ]),
}

export default CheckoutSectionTitle
