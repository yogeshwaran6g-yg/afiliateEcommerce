/**
 * Validates a single field in the registration form.
 * @param {string} name - Field name.
 * @param {any} value - Field value.
 * @param {object} formData - Current form data (for dependent validation like confirmPassword).
 * @returns {string} - Error message or empty string.
 */
export const validateField = (name, value, formData) => {
  let error = "";
  switch (name) {
    case "firstName":
      if (!value.trim()) error = "First name is required";
      break;
    case "lastName":
      if (!value.trim()) error = "Last name is required";
      break;
    case "email":
      if (!value.trim()) {
        error = "Email is required";
      } else if (!/\S+@\S+\.\S+/.test(value)) {
        error = "Email is invalid";
      }
      break;
    case "password":
      if (!value) {
        error = "Password is required";
      } else if (value.length < 6) {
        error = "Password must be at least 6 characters";
      }
      break;
    case "confirmPassword":
      if (value !== formData.password) {
        error = "Passwords do not match";
      }
      break;
    case "address":
      if (!value.trim()) error = "Street address is required";
      break;
    case "city":
      if (!value.trim()) error = "City is required";
      break;
    case "state":
      if (!value.trim()) error = "State is required";
      break;
    case "pincode":
      if (!value.trim()) {
        error = "Pincode is required";
      } else if (!/^\d{6}$/.test(value)) {
        error = "Pincode must be 6 digits";
      }
      break;
    default:
      break;
  }
  return error;
};

/**
 * Validates the entire registration form.
 * @param {object} formData - Form data to validate.
 * @returns {object} - Object containing field errors.
 */
export const validateRegistrationForm = (formData) => {
  const newErrors = {};

  // Personal Info & Shipping Adress combined for this loop
  [
    "firstName",
    "lastName",
    "email",
    "password",
    "confirmPassword",
    "address",
    "city",
    "state",
    "pincode",
  ].forEach((field) => {
    const err = validateField(field, formData[field], formData);
    if (err) newErrors[field] = err;
  });

  // Product
  if (!formData.selectedProduct) {
    newErrors.product = "Please select a package";
  }

  // Payment
  if (!formData.paymentType) {
    newErrors.paymentType = "Please select a payment method";
  }

  // Proof
  if (!formData.proof) {
    newErrors.proof =
      "Account cannot be activated without payment proof screenshot";
  }

  return newErrors;
};
