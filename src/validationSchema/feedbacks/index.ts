import * as yup from 'yup';

export const feedbackValidationSchema = yup.object().shape({
  rating: yup.number().integer().required(),
  review: yup.string(),
  created_at: yup.date().required(),
  customer_id: yup.string().nullable().required(),
  restaurant_id: yup.string().nullable().required(),
});
