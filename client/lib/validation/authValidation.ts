import Joi from "joi";

export const loginSchema = Joi.object({
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .required()
    .messages({
      "string.empty": "Email is required",
      "string.email": "Please enter a valid email",
    }),

  password: Joi.string().min(6).required().messages({
    "string.empty": "Password is required",
    "string.min": "Password must be at least 6 characters",
  }),
});

export const registerSchema = Joi.object({
  name: Joi.string().min(3).max(50).required().messages({
    "string.empty": "Name is required",
    "string.min": "Name must be at least 3 characters",
  }),

  email: Joi.string()
    .email({ tlds: { allow: false } })
    .required()
    .messages({
      "string.empty": "Email is required",
      "string.email": "Invalid email format",
    }),

  password: Joi.string().min(6).required().messages({
    "string.empty": "Password is required",
    "string.min": "Password must be at least 6 characters",
  }),

  phone: Joi.string()
    .pattern(/^[0-9]{10}$/)
    .allow("")
    .messages({
      "string.pattern.base": "Phone must be 10 digits",
    }),

  address: Joi.string().max(200).allow(""),

  confirmPassword: Joi.any()
  .valid(Joi.ref("password"))
  .required()
  .messages({
    "any.required": "Confirm password is required",
    "any.only": "Passwords do not match",
  }),

  isAcceptedTerms: Joi.boolean().required().messages({
    "any.required": "You must accept the terms and conditions",
  }),
});
