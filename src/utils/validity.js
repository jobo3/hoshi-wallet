/*
 * Set and Check the validy of html inputs
 */

import WAValidator from 'multicoin-address-validator'

export const setAmountInputValidity = (input) => {
  const value = Number(input.value)
  // set validity
  if (value < 0) {
    input.setCustomValidity("Value cannot be less than 0")
    return "Value cannot be less than 0"
  }
  else if (value === 0) {
    input.setCustomValidity("Value cannot be 0")
    return "Value cannot be 0"
  }
  else if (isNaN(value)) {
    input.setCustomValidity("Value is not a number")
    return "Value is not a number"
  }
  else {
    input.setCustomValidity("")
    return ""
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
  //input.reportValidity()
  return isValid
}

export const setSendAmountInputValidity = (input, maxAmount) => {
  const value = Number(input.value)
  // set validity
  if (isNaN(value)) {
    input.setCustomValidity("Value is not a number")
    return "Value is not a number"
  }
  else if (value < 0) {
    input.setCustomValidity("Value cannot be less than 0")
    return "Value cannot be less than 0"
  }
  else if (value === 0) {
    input.setCustomValidity("Value cannot be 0")
    return "Value cannot be 0"
  }
  else if (value > maxAmount) {
    input.setCustomValidity("Value cannot be greater than the balance")
    return "Value cannot be greater than the balance"
  }
  else {
    input.setCustomValidity("")
    return ""
  }
}

export const setAddressInputValidity = (input, assetId) => {
  const address = input.value
  let isValid = WAValidator.validate(address, assetId)
  if (isValid) {
    input.setCustomValidity("")
    return ""
  }
  else {
    input.setCustomValidity("Address is not valid")
    return "Address is not valid"
  }
}

export const setFeeInputValidity = (input, maxAmount) => {
  if (input.value === "") {
    input.setCustomValidity("")
    return null
  }
  const value = Number(input.value)
  // set validity
  if (isNaN(value)) {
    input.setCustomValidity("")
    return ""
  }
  else if (value < 0) {
    input.setCustomValidity("Value cannot be less than 0")
    return "Value cannot be less than 0"
  }
  else if (value === 0) {
    input.setCustomValidity("Value cannot be 0")
    return "Value cannot be 0"
  }
  else if (value > maxAmount) {
    input.setCustomValidity("Value cannot be greater than the balance")
    return "Value cannot be greater than the balance"
  }
  else {
    input.setCustomValidity("")
    return ""
  }
}
