import React, { useEffect } from 'react'
import { Helmet } from 'react-helmet'
import { useHistory } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import styled from '@emotion/styled'
import { deviceType } from 'react-device-detect'
import {
  selectCustomer,
  selectCartTotal,
  selectMenuSlug,
  selectOrder,
  selectCheckout,
  resetErrors,
  resetTip,
  setSubmitting,
  setDeviceType,
} from '@open-tender/redux'
import { isEmpty } from '@open-tender/js'
import { FormError } from '@open-tender/components'

import { selectBrand, selectConfig } from '../../../slices'
import { Content, Main } from '../..'
import CheckoutCancelEdit from './CheckoutCancelEdit'
import CheckoutCustomer from './CheckoutCustomer'
import CheckoutGuest from './CheckoutGuest'
import CheckoutPickup from './CheckoutPickup'
import CheckoutDelivery from './CheckoutDelivery'
import CheckoutCart from './CheckoutCart'
import CheckoutHeader from './CheckoutHeader'
import CheckoutAddress from './CheckoutAddress'
import CheckoutDetails from './CheckoutDetails'
import CheckoutButton from './CheckoutButton'
import CheckoutSection from './CheckoutSection'

const makeDeviceType = (deviceType) => {
  switch (deviceType) {
    case 'tablet':
      return 'TABLET'
    case 'mobile':
      return 'MOBILE'
    case 'browser':
      return 'DESKTOP'
    default:
      return 'DESKTOP'
  }
}

const CheckoutView = styled('div')`
  flex: 1 1 auto;
  display: flex;
  width: 100%;
  max-width: 128rem;
  margin: 0 auto;
  padding: 0 ${(props) => props.theme.layout.padding};
  @media (max-width: ${(props) => props.theme.breakpoints.narrow}) {
    padding: 0 ${(props) => props.theme.layout.paddingMobile};
  }
`

const CheckoutTitle = styled('div')`
  label: CheckoutTitle;

  h1 {
    @media (max-width: ${(props) => props.theme.breakpoints.narrow}) {
      font-size: ${(props) => props.theme.fonts.sizes.h3};
    }
  }

  p {
    margin: 0.5rem 0 0;
    @media (max-width: ${(props) => props.theme.breakpoints.narrow}) {
      font-size: ${(props) => props.theme.fonts.sizes.small};
    }
  }
`

const CheckoutContent = styled('div')`
  opacity: 0;
  animation: slide-up 0.25s ease-in-out 0.125s forwards;
  flex: 1 1 auto;
  padding: ${(props) => props.theme.layout.navHeight} 0;
  @media (max-width: ${(props) => props.theme.breakpoints.narrow}) {
    flex: 0 0 55%;
    padding: ${(props) => props.theme.layout.navHeightMobile} 0;
  }
  @media (max-width: ${(props) => props.theme.breakpoints.mobile}) {
    flex: 0 0 100%;
  }
`

const CheckoutInfo = styled('div')`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  @media (max-width: 1160px) {
    flex-direction: column;
    justify-content: flex-start;
  }

  & > div {
    flex-grow: 1;
    min-width: 50%;
  }
`

const CheckoutForm = styled('div')`
  margin: ${(props) => props.theme.layout.margin} 0 0;
  @media (max-width: ${(props) => props.theme.breakpoints.narrow}) {
    margin: ${(props) => props.theme.layout.marginMobile} 0 0;
  }

  h4 {
    margin: 0 0 1em;
    @media (max-width: ${(props) => props.theme.breakpoints.narrow}) {
      font-size: ${(props) => props.theme.fonts.sizes.h5};
    }
  }
`

const CheckoutSidebar = styled('div')`
  opacity: 0;
  animation: slide-up 0.25s ease-in-out 0.25s forwards;
  position: relative;
  flex: 0 0 48rem;
  padding: ${(props) => props.theme.layout.navHeight} 0
    ${(props) => props.theme.layout.navHeight}
    ${(props) => props.theme.layout.padding};
  background-color: ${(props) => props.theme.bgColors.tertiary};
  border-width: 0;
  border-style: solid;
  border-color: ${(props) => props.theme.border.color};
  border-left-width: ${(props) => props.theme.border.width};
  @media (max-width: ${(props) => props.theme.breakpoints.narrow}) {
    flex: 0 0 45%;
  }
  @media (max-width: ${(props) => props.theme.breakpoints.mobile}) {
    display: none;
  }

  &:after {
    content: '';
    display: block;
    position: absolute;
    z-index: 1;
    top: 0;
    left: 0;
    bottom: 0;
    width: 300%;
    background-color: ${(props) => props.theme.bgColors.tertiary};
  }
`

const CheckoutSidebarContent = styled('div')`
  position: relative;
  z-index: 2;
`

const makeFormTitle = (check) => {
  if (!check || !check.config) return null
  const displayed = check.config.displayed
  const required = check.config.required
  const hasAddress = displayed.address.length || required.address.length
  const hasDetails = displayed.details.length || required.details.length
  return hasAddress && hasDetails
    ? 'Address & Order Details'
    : hasAddress
    ? 'Address Details'
    : hasDetails
    ? 'Order Details'
    : null
}

const Checkout = () => {
  const history = useHistory()
  const dispatch = useDispatch()
  const { title } = useSelector(selectBrand)
  const { checkout: config } = useSelector(selectConfig)
  const cartTotal = useSelector(selectCartTotal)
  const menuSlug = useSelector(selectMenuSlug)
  const { serviceType, revenueCenter } = useSelector(selectOrder)
  const { revenue_center_id: revenueCenterId } = revenueCenter || {}
  const { auth } = useSelector(selectCustomer)
  const { check, form, errors, submitting } = useSelector(selectCheckout)
  const hasGuest = form && !isEmpty(form.customer) ? true : false
  const formError = errors ? errors.form || null : null
  const deviceTypeName = makeDeviceType(deviceType)
  const formTitle = makeFormTitle(check)

  useEffect(() => {
    if (!submitting && formError) window.scrollTo(0, 0)
  }, [formError, submitting])

  useEffect(() => {
    dispatch(setSubmitting(false))
    dispatch(setDeviceType(deviceTypeName))
    return () => {
      dispatch(resetErrors())
      dispatch(resetTip())
    }
  }, [dispatch, deviceTypeName])

  useEffect(() => {
    if (!revenueCenterId || !serviceType) {
      history.push('/')
    } else if (cartTotal === 0) {
      history.push(menuSlug)
    }
  }, [history, cartTotal, menuSlug, revenueCenterId, serviceType])

  useEffect(() => {
    if (!auth && !hasGuest) {
      history.push('/checkout/guest')
    }
  }, [auth, hasGuest, history])

  return (
    <>
      <Helmet>
        <title>Checkout | {title}</title>
      </Helmet>
      <Content>
        <Main bgColor="transparent" style={{ overflow: 'hidden', padding: 0 }}>
          <CheckoutView>
            <CheckoutHeader />
            <CheckoutContent>
              <CheckoutTitle>
                <h1>{config.title}</h1>
                <p>{config.subtitle}</p>
              </CheckoutTitle>
              <CheckoutCancelEdit />
              {formError && <FormError errMsg={formError} />}
              <CheckoutInfo>
                {auth ? <CheckoutCustomer /> : <CheckoutGuest />}
                {serviceType === 'PICKUP' ? (
                  <CheckoutPickup />
                ) : serviceType === 'DELIVERY' ? (
                  <CheckoutDelivery />
                ) : null}
              </CheckoutInfo>
              {formTitle && (
                <CheckoutForm>
                  <h4>{formTitle}</h4>
                  <CheckoutAddress />
                  <CheckoutDetails />
                </CheckoutForm>
              )}
              <CheckoutSection>
                <CheckoutButton
                  title="Some credit card"
                  subtitle="Credit card details"
                  onPress={() => console.log('test this')}
                />
              </CheckoutSection>
            </CheckoutContent>
            <CheckoutSidebar>
              <CheckoutSidebarContent>
                <CheckoutCart />
              </CheckoutSidebarContent>
            </CheckoutSidebar>
          </CheckoutView>
        </Main>
      </Content>
    </>
  )
}

Checkout.displayName = 'Checkout'
export default Checkout
