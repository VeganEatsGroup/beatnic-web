import React from 'react'
import propTypes from 'prop-types'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { isBrowser } from 'react-device-detect'
import styled from '@emotion/styled'
import {
  addItemToCart,
  selectCartCounts,
  selectMenu,
  selectMenuSlug,
  selectSelectedAllergenNames,
  setCurrentItem,
  showNotification,
} from '@open-tender/redux'
import {
  formatDollars,
  prepareMenuItem,
  rehydrateOrderItem,
  slugify,
} from '@open-tender/js'
import {
  BgImage,
  Body,
  ButtonStyled,
  CardMenuItem,
  Heading,
  useBuilder,
} from '@open-tender/components'

import {
  selectDisplaySettings,
  openModal,
  setTopOffset,
  toggleSidebarModal,
  selectContent,
} from '../../../slices'
import iconMap from '../../iconMap'
import { Tag } from '../..'
import { useTheme } from '@emotion/react'

const MenuFavoriteItemView = styled(CardMenuItem)`
  position: relative;
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`

const MenuFavoriteItemButton = styled.button`
  flex-grow: 1;
  display: block;
  width: 100%;
  margin: 0 0 1.3rem;
  text-align: left;

  &:disabled {
    opacity: 1;
  }
`

const MenuFavoriteItemContainer = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
`

const MenuFavoriteItemImage = styled(BgImage)`
  position: relative;
  width: 100%;
  padding: 33.33333% 0;
  background-color: ${(props) => props.theme.bgColors.tertiary};
  @media (max-width: ${(props) => props.theme.breakpoints.tablet}) {
    padding: 33.33333% 0;
  }
`

export const MenuFavoriteItemOverlay = styled.div`
  position: absolute;
  z-index: 3;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 0 0.5rem;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  border-radius: ${(props) => props.theme.border.radius};
  border-bottom-left-radius: 0 !important;
  border-bottom-right-radius: 0 !important;
  background-color: ${(props) =>
    props.isSoldOut
      ? props.theme.overlay.dark
      : props.isAlert
      ? props.theme.overlay.alert
      : 'transparent'};
`

const MenuFavoriteItemCount = styled.div`
  position: absolute;
  z-index: 3;
  top: -1.1rem;
  right: -1.1rem;
  display: flex;
  justify-content: center;
  align-items: center;
  min-width: 2.4rem;
  height: 2.4rem;
  border-radius: 1.2rem;
  border-style: solid;
  border-width: ${(props) => props.theme.counts.alerts.borderWidth};
  padding-top: ${(props) => props.theme.counts.alerts.paddingTop};
  padding-bottom: ${(props) => props.theme.counts.alerts.paddingBottom};
  color: ${(props) => props.theme.counts.alerts.color};
  background-color: ${(props) => props.theme.counts.alerts.bgColor};
  border-color: ${(props) => props.theme.counts.alerts.borderColor};
  @media (max-width: ${(props) => props.theme.breakpoints.tablet}) {
    top: -1rem;
    right: -0.9rem;
    min-width: 2.2rem;
    height: 2.2rem;
  }

  span {
    display: block;
    line-height: 0;
    font-family: ${(props) => props.theme.counts.alerts.family};
    font-weight: ${(props) => props.theme.counts.alerts.weight};
    font-size: ${(props) => props.theme.counts.alerts.fontSize};
    -webkit-font-smoothing: ${(props) =>
      props.theme.counts.alerts.fontSmoothing};
    @media (max-width: ${(props) => props.theme.breakpoints.tablet}) {
      font-size: ${(props) => props.theme.counts.alerts.fontSizeMobile};
    }
  }
`

const MenuFavoriteItemAlert = styled('div')`
  position: absolute;
  z-index: 2;
  bottom: -1.2rem;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  align-items: center;
`

const MenuFavoriteItemContent = styled.div`
  padding: ${(props) => (props.hasBox ? '1.1rem 1.1rem 0' : '1.1rem 0 0')};
  @media (max-width: ${(props) => props.theme.breakpoints.mobile}) {
    padding: ${(props) => (props.hasBox ? '1.1rem 1.1rem 0' : '0.7rem 0 0')};
  }
`

const MenuFavoriteItemInfo = styled('div')`
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  @media (max-width: ${(props) => props.theme.breakpoints.mobile}) {
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
  }
`

const MenuFavoriteItemName = styled(Heading)`
  display: block;
  flex: 1 1 auto;
  padding: 0 0.5rem 0 0;
  font-size: ${(props) => props.theme.fonts.sizes.big};
  @media (max-width: ${(props) => props.theme.breakpoints.mobile}) {
    font-size: ${(props) => props.theme.fonts.sizes.small};
  }
`

const MenuFavoriteItemPriceCals = styled.div`
  flex-grow: 0;
  flex-shrink: 0;
  text-align: right;
  @media (max-width: ${(props) => props.theme.breakpoints.mobile}) {
    text-align: left;
    margin: 0 0 0;
  }
`

const MenuFavoriteItemPrice = styled(Heading)`
  font-size: ${(props) => props.theme.fonts.sizes.small};
  @media (max-width: ${(props) => props.theme.breakpoints.mobile}) {
    font-size: ${(props) => props.theme.fonts.sizes.xSmall};
  }
`

const MenuFavoriteItemCals = styled(Body)`
  font-size: ${(props) => props.theme.fonts.sizes.small};
  @media (max-width: ${(props) => props.theme.breakpoints.mobile}) {
    font-size: ${(props) => props.theme.fonts.sizes.xSmall};
  }
`

const MenuFavoriteItemDescription = styled(Body)`
  display: block;
  margin: 0.8rem 0 0;
  line-height: 1.2;
  font-size: ${(props) => props.theme.fonts.sizes.small};
  @media (max-width: ${(props) => props.theme.breakpoints.mobile}) {
    display: none;
  }
`

const MenuFavoriteItemButtons = styled.div`
  flex-grow: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${(props) => (props.hasBox ? '0 1.1rem 1.1rem' : '0')};
  @media (max-width: ${(props) => props.theme.breakpoints.mobile}) {
    display: none;
  }
`

const MenuFavoriteItemButtonsCustomize = styled.div`
  button {
    border: 0;
    padding-left: 0;
    padding-right: 0;
  }
`

const MenuFavoriteItem = ({ item }) => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const theme = useTheme()
  const hasBox = theme.cards.menuItem.bgColor !== 'transparent'
  const { menu: menuContent } = useSelector(selectContent)
  const menuSlug = useSelector(selectMenuSlug)
  const allergenAlerts = useSelector(selectSelectedAllergenNames)
  const { soldOut } = useSelector(selectMenu)
  const displaySettings = useSelector(selectDisplaySettings)
  const { builderType } = displaySettings
  const cartCounts = useSelector(selectCartCounts)
  const { imageUrl, allergenAlert, isSoldOut, showQuickAdd, cartCount } =
    prepareMenuItem(
      item,
      allergenAlerts,
      soldOut,
      displaySettings,
      cartCounts,
      isBrowser
    )
  const bgStyle = imageUrl ? { backgroundImage: `url(${imageUrl}` } : null
  const soldOutMsg = menuContent.soldOutMessage || 'Sold out for day'
  const orderItem = item.favorite
    ? { ...rehydrateOrderItem(item, item.favorite.item), index: -1 }
    : item
  const { item: builtItem } = useBuilder(orderItem, soldOut)
  const { groups, totalPrice, totalCals } = builtItem
  const optionNames = item.favorite
    ? item.favorite.item.groups
        .reduce((arr, group) => {
          const names = group.options.map((o) => o.name)
          return [...arr, ...names]
        }, [])
        .join(', ')
    : null
  const groupsBelowMin = groups.filter((g) => g.quantity < g.min).length > 0
  const isIncomplete =
    totalPrice === 0 || item.quantity === '' || groupsBelowMin

  const view = () => {
    if (!isSoldOut) {
      dispatch(setCurrentItem(orderItem))
      if (builderType === 'PAGE') {
        const mainElement = document.getElementById('main')
        const mainOffset = mainElement.getBoundingClientRect().top
        dispatch(setTopOffset(-mainOffset))
        navigate(`${menuSlug}/item/${slugify(item.name)}`)
      } else if (builderType === 'SIDEBAR') {
        dispatch(toggleSidebarModal())
      } else {
        dispatch(openModal({ type: 'item', args: { focusFirst: true } }))
      }
    }
  }

  const add = () => {
    if (!isSoldOut && !isIncomplete) {
      const cartItem = { ...builtItem }
      if (cartItem.index === -1) delete cartItem.index
      dispatch(addItemToCart(cartItem))
      dispatch(showNotification(`${builtItem.name} added to cart!`))
    }
  }

  const itemTag = isSoldOut ? (
    <Tag icon={iconMap.Slash} text={soldOutMsg} bgColor="alert" />
  ) : allergenAlert ? (
    <Tag
      icon={iconMap.AlertCircle}
      text={allergenAlert.join(', ')}
      bgColor="alert"
    />
  ) : null

  return (
    <MenuFavoriteItemView>
      {cartCount > 0 && (
        <MenuFavoriteItemCount>
          <span>{cartCount}</span>
        </MenuFavoriteItemCount>
      )}
      {!imageUrl && itemTag ? (
        <MenuFavoriteItemAlert>{itemTag}</MenuFavoriteItemAlert>
      ) : null}
      <MenuFavoriteItemButton onClick={() => view()} disabled={isSoldOut}>
        <MenuFavoriteItemContainer>
          {imageUrl && (
            <MenuFavoriteItemImage style={bgStyle}>
              {itemTag && (
                <MenuFavoriteItemOverlay
                  isSoldOut={isSoldOut}
                  isAlert={allergenAlert}
                >
                  <div>{itemTag}</div>
                </MenuFavoriteItemOverlay>
              )}
            </MenuFavoriteItemImage>
          )}
          <MenuFavoriteItemContent hasBox={hasBox}>
            <MenuFavoriteItemInfo>
              <MenuFavoriteItemName>
                <Heading>{item.name}</Heading>
              </MenuFavoriteItemName>
              <MenuFavoriteItemPriceCals>
                {totalPrice && (
                  <MenuFavoriteItemPrice>
                    {formatDollars(totalPrice)}
                  </MenuFavoriteItemPrice>
                )}
                {totalCals && (
                  <MenuFavoriteItemCals>
                    {' '}
                    &mdash; {totalCals} Cal
                  </MenuFavoriteItemCals>
                )}
              </MenuFavoriteItemPriceCals>
            </MenuFavoriteItemInfo>
            {optionNames && (
              <MenuFavoriteItemDescription>
                {optionNames}
              </MenuFavoriteItemDescription>
            )}
          </MenuFavoriteItemContent>
        </MenuFavoriteItemContainer>
      </MenuFavoriteItemButton>
      <MenuFavoriteItemButtons hasBox={hasBox}>
        <ButtonStyled
          onClick={add}
          disabled={!showQuickAdd && !isIncomplete}
          size="small"
        >
          Add To Order
        </ButtonStyled>
        <MenuFavoriteItemButtonsCustomize>
          <ButtonStyled
            onClick={view}
            disabled={isSoldOut}
            size="small"
            color="secondary"
          >
            Customize
          </ButtonStyled>
        </MenuFavoriteItemButtonsCustomize>
      </MenuFavoriteItemButtons>
    </MenuFavoriteItemView>
  )
}

MenuFavoriteItem.displayName = 'MenuFavoriteItem'
MenuFavoriteItem.propTypes = {
  item: propTypes.object,
  soldOut: propTypes.array,
  menuConfig: propTypes.object,
  allergenAlerts: propTypes.array,
}

export default MenuFavoriteItem