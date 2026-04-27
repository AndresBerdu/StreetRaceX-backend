import { param } from "express-validator";

export const validateUserId = [
  param("id")
    .notEmpty()
    .withMessage("user id cannot be void")
    .isString()
    .withMessage("user id must be string"),
];
