import { useEffect, useState } from 'react'
import propTypes from 'prop-types'
import styled from '@emotion/styled'
import { useTheme } from '@emotion/react'
import {
  addItemToCart,
  selectMenu,
  selectSelectedAllergenNames,
  showNotification,
} from '@open-tender/redux'
import { makeOrderItem } from '@open-tender/js'
import { useBuilder, useOrderItem } from '@open-tender/hooks'
import { ButtonStyled, CardMenuItem } from '@open-tender/components'
import { useDispatch, useSelector } from 'react-redux'
import { selectDisplaySettings } from '../slices'
import { MenuItemButton, MenuItemOverlay, MenuItemTagAlert } from '.'

const UpsellItemView = styled(CardMenuItem)`
  position: relative;
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`

const UpsellItemButtons = styled.div`
  flex-grow: 0;
  padding: ${(props) => (props.hasBox ? '0 1.1rem 1.1rem' : '0')};
  display: flex;
  justify-content: center;
  align-items: center;

  button {
    display: block;
  }
`

const UpsellItemSizes = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  margin: -0.25rem -0.5rem;

  button {
    margin: 0.25rem 0.5rem;
    @media (max-width: ${(props) => props.theme.breakpoints.mobile}) {
      padding-left: 1rem;
      padding-right: 1rem;
    }
  }
`

const UpsellItem = ({ menuItem, addCallback, showDesc = true }) => {
  const dispatch = useDispatch()
  const theme = useTheme()
  const hasBox = theme.cards.menuItem.bgColor !== 'transparent'
  const [hasSize, setHasSize] = useState(false)
  const allergenAlerts = useSelector(selectSelectedAllergenNames)
  const { soldOut } = useSelector(selectMenu)
  const displaySettings = useSelector(selectDisplaySettings)
  const orderItem = makeOrderItem(menuItem)
  const { item: builtItem, toggleOption } = useBuilder(orderItem)
  const {
    name,
    displayImage,
    displayDesc,
    displayTags,
    displayAllergens,
    displayPrice,
    displayCals,
    isSoldOut,
    allergenAlert,
  } = useOrderItem(orderItem, null, soldOut, allergenAlerts, displaySettings)
  const { quantity, groups, totalPrice } = builtItem
  const sizeGroup = groups.find((i) => i.isSize)
  const groupsBelowMin = groups.filter((g) => g.quantity < g.min).length > 0
  const isIncomplete = totalPrice === 0 || quantity === '' || groupsBelowMin
  const imageOverlay = displayImage ? (
    <MenuItemOverlay isSoldOut={isSoldOut} allergenAlert={allergenAlert} />
  ) : null

  const add = () => {
    if (!isIncomplete) {
      dispatch(addItemToCart(builtItem))
      dispatch(showNotification(`${builtItem.name} added to cart!`))
      if (addCallback) addCallback()
    }
  }

  const addSize = (optionId) => {
    toggleOption(sizeGroup.id, optionId)
    setHasSize(true)
  }

  useEffect(() => {
    if (hasSize && !isIncomplete) {
      dispatch(addItemToCart(builtItem))
      dispatch(showNotification(`${builtItem.name} added to cart!`))
      if (addCallback) addCallback()
    }
  }, [hasSize, isIncomplete, builtItem, addCallback, dispatch])

  return (
    <UpsellItemView>
      <MenuItemButton
        onClick={null}
        disabled={true}
        imageUrl={displayImage}
        imageOverlay={imageOverlay}
        name={name}
        desc={showDesc ? displayDesc : null}
        price={displayPrice}
        cals={displayCals}
        tags={displayTags}
        allergens={displayAllergens}
      />
      {!displayImage ? (
        <MenuItemTagAlert isSoldOut={isSoldOut} allergenAlert={allergenAlert} />
      ) : null}
      <UpsellItemButtons hasBox={hasBox}>
        {!isIncomplete ? (
          <ButtonStyled onClick={add} size="small">
            Add To Order
          </ButtonStyled>
        ) : (
          <UpsellItemSizes>
            {sizeGroup.options.map((option) => (
              <ButtonStyled
                key={option.id}
                onClick={() => addSize(option.id)}
                size="small"
              >
                {option.name}
              </ButtonStyled>
            ))}
          </UpsellItemSizes>
        )}
      </UpsellItemButtons>
    </UpsellItemView>
  )
}

UpsellItem.displayName = 'UpsellItem'
UpsellItem.propTypes = {
  menuItem: propTypes.object,
  addCallback: propTypes.func,
}

export default UpsellItem
