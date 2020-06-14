import React, { useState, useCallback, useContext } from 'react'
import debounce from 'lodash/debounce'
import {
  Button,
  ButtonRevenueCenter,
  ButtonServiceType,
  ButtonRequestedAt,
  CheckoutLineItem,
  CheckoutTip,
  Input,
  Textarea,
  Switch,
} from './index'
import { serviceTypeNamesMap } from './utils/constants'
import { FormContext } from './CheckoutForm'

const CheckoutDetails = () => {
  const {
    config,
    order,
    tz,
    check,
    form,
    errors,
    updateForm,
    updateRequestedAt,
    updateLocation,
    updateServiceType,
  } = useContext(FormContext)
  const checkDetails = form.details || check.details
  const [details, setDetails] = useState(checkDetails)
  const [showTip, setShowTip] = useState(false)
  // const [pendingTip, setPendingTip] = useState(null)
  const serviceTypeName = serviceTypeNamesMap[order.serviceType]
  const allowTaxExempt = check.config.allow_tax_exempt
  const requiredFields = check.config.required.details
  const tipSettings = check.config.gratuity
  const eatingUtensilsRequired = requiredFields.includes('eating_utensils')
  const servingUtensilsRequired = requiredFields.includes('serving_utensils')
  const personCountRequired = requiredFields.includes('person_count')
  const notesRequired = requiredFields.includes('notes')
  const detailsErrors = errors.details || {}

  // useEffect(() => {
  //   setDetails(checkDetails)
  // }, [checkDetails])

  const debouncedUpdate = useCallback(
    debounce((newDetails) => updateForm({ details: newDetails }), 500),
    []
  )

  const handleChange = (evt) => {
    const { id, type, value, checked } = evt.target
    const inputValue = type === 'checkbox' ? checked : value
    const field = id.replace('details-', '')
    const newDetails = { ...details, [field]: inputValue }
    setDetails(newDetails)
    debouncedUpdate(newDetails)
  }

  const handleShowTip = (evt) => {
    evt.preventDefault()
    setShowTip(!showTip)
    evt.target.blur()
  }

  return (
    <div className="form__fieldset">
      <div className="form__legend">
        <p className="form__legend__title heading ot-font-size-h3">
          {config.details.title}
        </p>
      </div>
      <div className="form__inputs">
        <CheckoutLineItem label="Location">
          <ButtonRevenueCenter
            revenueCenter={order.revenueCenter}
            onClick={updateLocation}
            classes="btn--header"
          />
        </CheckoutLineItem>
        <CheckoutLineItem label="Service Type">
          <ButtonServiceType
            serviceType={order.serviceType}
            onClick={updateServiceType}
            classes="btn--header"
          />
        </CheckoutLineItem>
        <CheckoutLineItem label={`${serviceTypeName} Time`}>
          <ButtonRequestedAt
            requestedAt={order.requestedAt}
            tz={tz}
            onClick={updateRequestedAt}
            classes="btn--header"
          />
        </CheckoutLineItem>
        {tipSettings.has_tip && (
          <>
            <CheckoutLineItem label="Tip">
              <Button
                text={`${check.totals.tip}`}
                ariaLabel={`Adjust tip of $${check.totals.tip}`}
                icon="DollarSign"
                classes="btn--header"
                onClick={handleShowTip}
              />
            </CheckoutLineItem>
            {showTip && <CheckoutTip setShowTip={setShowTip} />}
          </>
        )}

        {eatingUtensilsRequired && (
          <Switch
            label="Eating Utensils"
            id="details-eating_utensils"
            on={details.eating_utensils}
            onChange={handleChange}
            inputClasses="input--button"
          />
        )}
        {servingUtensilsRequired && (
          <Switch
            label="Serving Utensils"
            id="details-serving_utensils"
            on={details.serving_utensils}
            handleChange={handleChange}
            inputClasses="input--button"
          />
        )}
        {allowTaxExempt && (
          <Input
            label="Tax Exempt ID"
            name="details-tax_exempt_id"
            type="text"
            value={details.tax_exempt_id}
            onChange={handleChange}
            error={detailsErrors.tax_exempt_id}
            required={false}
          />
        )}
        {personCountRequired && (
          <Input
            label="Person Count"
            name="details-person_count"
            type="number"
            value={details.person_count}
            onChange={handleChange}
            error={detailsErrors.person_count}
            required={personCountRequired}
          />
        )}
        {notesRequired && (
          <Textarea
            label="Notes"
            name="details-notes"
            value={details.notes}
            onChange={handleChange}
            error={detailsErrors.notes}
            required={notesRequired}
          />
        )}
      </div>
    </div>
  )
}

CheckoutDetails.displayName = 'CheckoutDetails'

export default CheckoutDetails
