import propTypes from 'prop-types'
import styled from '@emotion/styled'
import { Body, ButtonStyled } from '@open-tender/components'
import React, { useCallback, useEffect, useRef } from 'react'

const MenuItemFooterView = styled.div`
  position: fixed;
  z-index: 1;
  bottom: 0;
  right: 0;
  width: 64rem;
  background-color: ${(props) => props.theme.bgColors.primary};
  background-color: palegreen;
  padding: 1.5rem ${(props) => props.theme.layout.padding};
  @media (max-width: ${(props) => props.theme.breakpoints.mobile}) {
    width: 100%;
    padding: 1.5rem ${(props) => props.theme.layout.paddingMobile};
  }
`

const MenuItemFooterButtons = styled.div`
  height: 100%;
  margin: 0 -0.6rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
`

const MenuItemFooterButton = styled.div`
  flex: 1 1 50%;
  padding: 0 0.6rem;

  button {
    width: 100%;
    max-height: 5rem;

    &:disabled {
      opacity: 1;
      color: ${(props) => props.theme.colors.primary};
      background-color: ${(props) => props.theme.bgColors.tertiary};
      border-color: ${(props) => props.theme.bgColors.tertiary};
    }
  }
`

const MenuItemFooterWarning = styled.div`
  padding: 0 0 1.5rem;
  text-align: center;

  p {
    font-size: ${(props) => props.theme.fonts.sizes.small};
    color: ${(props) => props.theme.colors.error};
  }
`

const MenuItemFooter = React.forwardRef(({ builtItem, addItem }, ref) => {
  const { groups, quantity, totalPrice } = builtItem
  const sizeGroup = groups.find((g) => g.isSize)
  const missingSize = sizeGroup
    ? !sizeGroup.options.find((i) => i.quantity >= 1)
    : false
  const hasCustomize = groups.filter((g) => !g.isSize).length > 0
  const groupsBelowMin = groups.filter((g) => g.quantity < g.min).length > 0
  const isIncomplete = totalPrice === 0 || quantity === '' || groupsBelowMin

  return (
    <MenuItemFooterView ref={ref}>
      {isIncomplete && (
        <MenuItemFooterWarning>
          <Body as="p">
            {missingSize
              ? 'Please select a size to add a bag!'
              : 'Item requires customization. Please make selections.'}
          </Body>
        </MenuItemFooterWarning>
      )}
      <MenuItemFooterButtons>
        {hasCustomize && (
          <MenuItemFooterButton>
            <ButtonStyled
              onClick={() => addItem(builtItem)}
              size="big"
              color="secondary"
            >
              Customize
            </ButtonStyled>
          </MenuItemFooterButton>
        )}
        <MenuItemFooterButton>
          <ButtonStyled
            onClick={() => addItem(builtItem)}
            disabled={isIncomplete}
            builtItem
            size="big"
          >
            Add to bag
          </ButtonStyled>
        </MenuItemFooterButton>
      </MenuItemFooterButtons>
    </MenuItemFooterView>
  )
})

MenuItemFooter.displayName = 'MenuItemFooter'
MenuItemFooter.propTypes = {
  builtItem: propTypes.object,
  addItem: propTypes.func,
}

export default MenuItemFooter
