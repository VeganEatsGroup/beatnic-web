import propTypes from 'prop-types'
import styled from '@emotion/styled'
import { isMobile } from 'react-device-detect'
import { useDispatch } from 'react-redux'
import { ButtonStyled } from '@open-tender/components'
import { openModal } from '../../slices'
import { Sliders } from '../icons'
import Icon from './Icon'

const AllergensButtonView = styled.div``

const Allergens = ({ style }) => {
  const dispatch = useDispatch()

  return isMobile ? (
    <Icon
      onClick={() => dispatch(openModal({ type: 'allergens' }))}
      style={style}
    >
      <Sliders size={19} />
    </Icon>
  ) : (
    <AllergensButtonView>
      <ButtonStyled
        onClick={() => dispatch(openModal({ type: 'allergens' }))}
        size="header"
        color="header"
      >
        Filter by Allergens
      </ButtonStyled>
    </AllergensButtonView>
  )
}

Allergens.displayName = 'Allergens'
Allergens.propTypes = {
  style: propTypes.object,
}

export default Allergens
