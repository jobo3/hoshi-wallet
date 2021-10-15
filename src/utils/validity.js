/*
 * Set and Check the validy of html inputs
 */

import WAValidator from 'multicoin-address-validator'

export const setAmountInputValidity = (input) => {
  const value = Number(input.value)
  // set validity
  if (value < 0) {
    input.setCustomValidity("Value cannot be less than 0")
  }
  else if (value === 0) {
    input.setCustomValidity("Value cannot be 0")
  }
  else if (isNaN(value)) {
    input.setCustomValidity("Value is not a number")
  }
  else {
    input.setCustomValidity("")
  }
}

export const checkInputValidity = (input) => {
  // check validity
  let isValid = input.checkValidity()
  if (isValid) {
    input.classList.remove("is-invalid")
    input.classList.add("is-valid")
  }
  else {
    input.classList.remove("is-valid")
    input.classList.add("is-invalid")
  }
  input.reportValidity()

  return isValid
}

export const setSendAmountInputValidity = (input, maxAmount) => {
  setAmountInputValidity(input)
  const value = Number(input.value)
  if (value > maxAmount) {
    input.setCustomValidity("Value cannot be greater than the balance")
  }
}

export const setAddressInputValidity = (input, assetId) => {
  const address = input.value
  console.log(address, assetId)
  let isValid = WAValidator.validate(address, assetId)
  if (isValid) {
    input.setCustomValidity("")
  }
  else {
    input.setCustomValidity("Address is not valid")
  }
}