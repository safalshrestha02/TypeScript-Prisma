import { body } from "express-validator";

const schema = [
  body("email")
    .isEmail()
    .withMessage("enter a valid email")
    .notEmpty()
    .withMessage("please enter a email"),
  body("password")
    .notEmpty()
    .withMessage("enter a password")
    .isLength({ min: 6 })
    .withMessage("Min 6 chracters")
    .matches(/\d/)
    .withMessage("must contain a number"),
];

export { schema as registerSchema };
