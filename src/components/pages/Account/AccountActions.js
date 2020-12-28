import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useHistory } from 'react-router-dom'
import {
  resetOrderType,
  resetOrder,
  selectOrder,
  fetchCustomerOrders,
  selectCustomerOrders,
  fetchCustomerFavorites,
  fetchMenuItems,
  fetchRevenueCenter,
  setOrderServiceType,
  setAddress,
  selectCartQuantity,
} from '@open-tender/redux'
import { getLastOrder, makeOrderTypeName } from '@open-tender/js'
import { Button } from '@open-tender/components'

import iconMap from '../../iconMap'
import { Loading } from '../..'

const Continue = ({ current, startNew }) => {
  return (
    <>
      <Button
        text="Continue Current Order"
        icon={iconMap['ShoppingBag']}
        onClick={current}
        classes="ot-btn ot-btn--big"
      />
      <div style={{ margin: '1.5rem 0 0' }}>
        <Button
          text="Or start a new order from scratch"
          classes="ot-btn ot-btn--small ot-btn--secondary"
          onClick={startNew}
        />
      </div>
    </>
  )
}

const Reorder = ({ orderTypeName, reorder, switchType }) => {
  return (
    <>
      <Button
        text={`Order ${orderTypeName} Again`}
        icon={iconMap['ShoppingBag']}
        onClick={reorder}
        classes="ot-btn ot-btn--big"
      />
      <div style={{ margin: '1.5rem 0 0' }}>
        <Button
          text="Or switch to a different order type"
          classes="ot-btn ot-btn--small ot-btn--secondary"
          onClick={switchType}
        />
      </div>
    </>
  )
}

const AccountActions = () => {
  const history = useHistory()
  const dispatch = useDispatch()
  const currentOrder = useSelector(selectOrder)
  const { revenueCenter, serviceType, cart } = currentOrder
  const { entities: orders, loading } = useSelector(selectCustomerOrders)
  const lastOrder = getLastOrder(orders)
  let orderTypeName = null
  if (lastOrder) {
    const { order_type, service_type } = lastOrder
    orderTypeName = makeOrderTypeName(order_type, service_type)
  }
  const isCurrentOrder = revenueCenter && serviceType && cart.length
  const cartQuantity = useSelector(selectCartQuantity)
  const isLoading = loading === 'pending' && !isCurrentOrder && !lastOrder

  useEffect(() => {
    dispatch(fetchCustomerOrders(20))
    dispatch(fetchCustomerFavorites())
  }, [dispatch])

  // useEffect(() => {
  //   if (lastOrder) {
  //     const { revenue_center, service_type, order_type, address } = lastOrder
  //     const { revenue_center_id: revenueCenterId } = revenue_center
  //     dispatch(fetchMenuItems({ revenueCenterId, serviceType: service_type }))
  //     if (!cartQuantity) {
  //       const isOutpost = revenue_center.is_outpost
  //       dispatch(fetchRevenueCenter(revenueCenterId))
  //       dispatch(setOrderServiceType(order_type, service_type, isOutpost))
  //       dispatch(setAddress(address || null))
  //     }
  //   }
  // }, [lastOrder, cartQuantity, dispatch])

  const startNewOrder = (evt) => {
    evt.preventDefault()
    dispatch(resetOrder())
    history.push('/')
    evt.target.blur()
  }

  const switchOrderType = (evt) => {
    evt.preventDefault()
    dispatch(resetOrderType())
    history.push(`/`)
    evt.target.blur()
  }

  const continueCurrent = (evt) => {
    evt.preventDefault()
    history.push(revenueCenter ? `/menu/${revenueCenter.slug}` : '/')
    evt.target.blur()
  }

  return isLoading ? (
    <Loading text="Retrieving your account info..." />
  ) : isCurrentOrder ? (
    <Continue current={continueCurrent} startNew={startNewOrder} />
  ) : lastOrder ? (
    <Reorder
      orderTypeName={orderTypeName}
      reorder={continueCurrent}
      switchType={switchOrderType}
    />
  ) : (
    <Button
      text="Start a New Order"
      icon={iconMap['ShoppingBag']}
      onClick={startNewOrder}
      classes="ot-btn ot-btn--big"
    />
  )
}

AccountActions.displayName = 'AccountActions'

export default AccountActions
