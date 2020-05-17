import React, { useState, useCallback, useEffect } from 'react'
import propTypes from 'prop-types'
import debounce from 'lodash/debounce'
import {
  ButtonLocation,
  ButtonServiceType,
  ButtonRequestedAt,
  Input,
  Switch,
} from './index'
import { serviceTypeNamesMap } from './constants'
import { Textarea } from './Inputs'
import CheckoutLineItem from './CheckoutLineItem'

const CheckoutDetails = ({
  title = 'Please review your order details',
  order,
  check,
  form,
  updateForm,
}) => {
  const serviceTypeName = serviceTypeNamesMap[order.serviceType]
  const checkDetails = form.details || check.details
  const [details, setDetails] = useState(checkDetails)

  useEffect(() => {
    setDetails(checkDetails)
  }, [checkDetails])

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

  const errors = {}
  const allowTaxExempt = check.config.allow_tax_exempt
  const requiredFields = check.config.required_fields.details
  const eatingUtensilsRequired = requiredFields.includes('eating_utensils')
  const servingUtensilsRequired = requiredFields.includes('serving_utensils')
  const personCountRequired = requiredFields.includes('person_count')
  const notesRequired = requiredFields.includes('notes')
  return (
    <div className="form__fieldset">
      <div className="form__legend heading ot-font-size-h5">{title}</div>
      <div className="form__inputs">
        <CheckoutLineItem label="Location">
          <ButtonLocation classes="btn--header" />
        </CheckoutLineItem>
        <CheckoutLineItem label="Service Type">
          <ButtonServiceType classes="btn--header" />
        </CheckoutLineItem>
        <CheckoutLineItem label={`${serviceTypeName} Time`}>
          <ButtonRequestedAt classes="btn--header" />
        </CheckoutLineItem>
        {eatingUtensilsRequired && (
          <CheckoutLineItem label="Eating Utensils">
            <Switch
              label="Eating Utensils"
              id="details-eating_utensils"
              on={details.eating_utensils}
              onChange={handleChange}
            />
          </CheckoutLineItem>
        )}
        {servingUtensilsRequired && (
          <CheckoutLineItem label="Serving Utensils">
            <Switch
              label="Serving Utensils"
              id="details-serving_utensils"
              on={details.serving_utensils}
              handleChange={handleChange}
            />
          </CheckoutLineItem>
        )}
        {allowTaxExempt && (
          <CheckoutLineItem
            label="Tax Exempt ID"
            classes="form__line__input person-count"
          >
            <Input
              label="Tax Exempt ID"
              name="details-tax_exempt_id"
              type="text"
              value={details.tax_exempt_id}
              onChange={handleChange}
              error={errors.tax_exempt_id}
              required={false}
              classes="form__input--small"
              inputClasses=""
              showLabel={false}
            />
          </CheckoutLineItem>
        )}
        {personCountRequired && (
          <CheckoutLineItem
            label="No. of People"
            classes="form__line__input person-count"
            required={personCountRequired}
          >
            <Input
              label="Person Count"
              name="details-person_count"
              type="text"
              value={details.person_count}
              onChange={handleChange}
              error={errors.person_count}
              required={true}
              classes="form__input--small"
              inputClasses=""
              showLabel={false}
            />
          </CheckoutLineItem>
        )}
        {notesRequired && (
          <CheckoutLineItem
            label="Notes"
            classes="form__line__textarea"
            required={notesRequired}
          >
            <Textarea
              label="Notes"
              name="details-notes"
              value={details.notes}
              onChange={handleChange}
              error={errors.notes}
              required={true}
              classes="form__input--small"
              inputClasses=""
              showLabel={false}
            />
          </CheckoutLineItem>
        )}
      </div>
    </div>
  )
}

CheckoutDetails.displayName = 'CheckoutDetails'
CheckoutDetails.propTypes = {
  title: propTypes.string,
  order: propTypes.object,
  checkConfig: propTypes.object,
  checkDetails: propTypes.object,
  updateForm: propTypes.func,
}

export default CheckoutDetails