import * as Yup from "yup";
import { validationMessages } from "./validation";
import { commonLabel } from "./label";

export const loginValidationSchema = Yup.object({
  email: Yup.string()
    .email(validationMessages.email)
    .required(validationMessages.required("Email")),
  password: Yup.string().required(validationMessages.required("Password")),
});

export const categoryValidationSchema = Yup.object({
  name: Yup.string().required(
    validationMessages.required(commonLabel.categoryName),
  ),
});

export const productValidationSchema = Yup.object({
  name: Yup.string().required(
    validationMessages.required(commonLabel.productName),
  ),
  category_id: Yup.string()
    .required(validationMessages.required(commonLabel.categoryName))
    .nullable(),
  product_variants: Yup.array()
    .of(
      Yup.object({
        product_title_name: Yup.string().required(
          validationMessages.required(commonLabel.variantTitle),
        ),
        price: Yup.number()
          .required(validationMessages.required(commonLabel.price))
          .min(1, "Price must be greater than 0"),
        quantity: Yup.number()
          .required(validationMessages.required(commonLabel.qty))
          .min(0, "Quantity cannot be negative"),
        description: Yup.string().required(
          validationMessages.required(commonLabel.variantDescription),
        ),
        color: Yup.string().required(
          validationMessages.required(commonLabel.color),
        ),
        size: Yup.string().required(
          validationMessages.required(commonLabel.size),
        ),
        variant_image: Yup.object({
          image_path: Yup.string().optional(),
        }),
      }),
    )
    .min(1, "At least one variant is required"),
});
