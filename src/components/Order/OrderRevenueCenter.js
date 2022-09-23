import React from 'react'
import propTypes from 'prop-types'
import styled from '@emotion/styled'

const OrderRevenueCenterName = styled.p`
  color: ${(props) =>
    props.serviceType === 'PICKUP'
      ? props.theme.links.primary.color
      : 'inherit'};
`

const OrderRevenueCenter = ({ revenueCenter, serviceType }) => {
  const { address: rcAddr } = revenueCenter || {}
  return (
    <>
      <OrderRevenueCenterName serviceType={serviceType}>
        {revenueCenter.name}
      </OrderRevenueCenterName>
      <p>
        {rcAddr.street}, {rcAddr.city}, {rcAddr.state} {rcAddr.postal_code}
      </p>
      <p>{rcAddr.phone}</p>
    </>
  )
}

OrderRevenueCenter.displayName = 'OrderRevenueCenter'
OrderRevenueCenter.propTypes = {
  revenueCenter: propTypes.object,
}
export default OrderRevenueCenter
