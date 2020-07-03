import React from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import {
  selectCartQuantity,
  selectCartTotal,
  selectMenuSlug,
  selectCanOrder,
  selectOrder,
  selectOrderLimits,
} from 'open-tender-redux'
import { displayPrice } from 'open-tender-js'
import { Button } from 'open-tender'

import { selectSidebar, toggleSidebar } from '../slices'
import SidebarOverlay from './SidebarOverlay'
import Cart from './Cart'
import SidebarClose from './SidebarClose'

const Sidebar = () => {
  const dispatch = useDispatch()
  const history = useHistory()
  const { pathname } = useLocation()
  const { isOpen } = useSelector(selectSidebar)
  const { orderId } = useSelector(selectOrder)
  const cartCount = useSelector(selectCartQuantity)
  const cartTotal = useSelector(selectCartTotal)
  const menuSlug = useSelector(selectMenuSlug)
  const canOrder = useSelector(selectCanOrder)
  const { orderMinimum } = useSelector(selectOrderLimits)
  const classes = `sidebar bg-secondary-color ${isOpen ? 'is-open' : ''}`
  const isMenu = pathname.includes('menu')
  const isCheckout = pathname.includes('checkout')
  const belowMinimum = orderMinimum && cartTotal < orderMinimum
  const canCheckout = canOrder && !belowMinimum && cartCount !== 0

  const handleBack = (evt) => {
    evt.preventDefault()
    dispatch(toggleSidebar())
    if (!isMenu) history.push(menuSlug)
    evt.target.blur()
  }

  const handleCheckout = (evt) => {
    evt.preventDefault()
    dispatch(toggleSidebar())
    if (!isCheckout) history.push(`/checkout`)
    evt.target.blur()
  }

  return (
    <>
      <SidebarOverlay />
      <div className={classes}>
        <div className="sidebar__container">
          {isOpen && <SidebarClose />}
          <div className="sidebar__header bg-color">
            <h2 className="sidebar__title ot-font-size-h3">
              {orderId ? `Editing Order ${orderId}` : 'Your Order'}
            </h2>
            {cartCount === 0 ? (
              <p className="font-size-small ot-alert-color">
                Your cart is currently empty. Please add some items.
              </p>
            ) : (
              <p className="font-size-small secondary-color">
                <span className="ot-bold body-color">{cartCount} items</span>{' '}
                for a total of{' '}
                <span className="ot-bold body-color">
                  ${cartTotal.toFixed(2)}
                </span>{' '}
                before tax
              </p>
            )}
            {belowMinimum && (
              <div className="sidebar__header__message">
                <p className="font-size-small ot-bold ot-alert-color">
                  Your cart total is below the order minimum of $
                  {displayPrice(orderMinimum)}. Please add some items.
                </p>
              </div>
            )}
          </div>
          <div className="sidebar__content">
            <Cart />
          </div>
          <div className="sidebar__footer bg-color">
            <div className="sidebar__back">
              <Button
                onClick={handleBack}
                classes="btn btn--big"
                disabled={!canOrder}
              >
                Menu
              </Button>
            </div>
            <div className="sidebar__checkout">
              <Button
                onClick={handleCheckout}
                // classes={`btn btn--big ${!isCheckout ? 'btn--highlight' : ''}`}
                classes="btn btn--big btn--highlight"
                disabled={!canCheckout}
              >
                {isCheckout ? 'Checkout' : 'Checkout'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

Sidebar.displayName = 'Sidebar'

export default Sidebar
