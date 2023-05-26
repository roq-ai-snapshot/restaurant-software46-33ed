import AppLayout from 'layout/app-layout';
import React, { useState } from 'react';
import {
  FormControl,
  FormLabel,
  Input,
  Button,
  Text,
  Box,
  Spinner,
  FormErrorMessage,
  Switch,
  NumberInputStepper,
  NumberDecrementStepper,
  NumberInputField,
  NumberIncrementStepper,
  NumberInput,
} from '@chakra-ui/react';
import * as yup from 'yup';
import DatePicker from 'react-datepicker';
import { useFormik, FormikHelpers } from 'formik';
import { getFeedbackById, updateFeedbackById } from 'apiSdk/feedbacks';
import { Error } from 'components/error';
import { feedbackValidationSchema } from 'validationSchema/feedbacks';
import { FeedbackInterface } from 'interfaces/feedback';
import useSWR from 'swr';
import { useRouter } from 'next/router';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { UserInterface } from 'interfaces/user';
import { RestaurantInterface } from 'interfaces/restaurant';
import { getUsers } from 'apiSdk/users';
import { getRestaurants } from 'apiSdk/restaurants';

function FeedbackEditPage() {
  const router = useRouter();
  const id = router.query.id as string;
  const { data, error, isLoading, mutate } = useSWR<FeedbackInterface>(
    () => (id ? `/feedbacks/${id}` : null),
    () => getFeedbackById(id),
  );
  const [formError, setFormError] = useState(null);

  const handleSubmit = async (values: FeedbackInterface, { resetForm }: FormikHelpers<any>) => {
    setFormError(null);
    try {
      const updated = await updateFeedbackById(id, values);
      mutate(updated);
      resetForm();
    } catch (error) {
      setFormError(error);
    }
  };

  const formik = useFormik<FeedbackInterface>({
    initialValues: data,
    validationSchema: feedbackValidationSchema,
    onSubmit: handleSubmit,
    enableReinitialize: true,
  });

  return (
    <AppLayout>
      <Text as="h1" fontSize="2xl" fontWeight="bold">
        Edit Feedback
      </Text>
      <Box bg="white" p={4} rounded="md" shadow="md">
        {error && <Error error={error} />}
        {formError && <Error error={formError} />}
        {isLoading || (!formik.values && !error) ? (
          <Spinner />
        ) : (
          <form onSubmit={formik.handleSubmit}>
            <FormControl id="rating" mb="4" isInvalid={!!formik.errors?.rating}>
              <FormLabel>Rating</FormLabel>
              <NumberInput
                name="rating"
                value={formik.values?.rating}
                onChange={(valueString, valueNumber) =>
                  formik.setFieldValue('rating', Number.isNaN(valueNumber) ? 0 : valueNumber)
                }
              >
                <NumberInputField />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
              {formik.errors.rating && <FormErrorMessage>{formik.errors?.rating}</FormErrorMessage>}
            </FormControl>
            <FormControl id="review" mb="4" isInvalid={!!formik.errors?.review}>
              <FormLabel>Review</FormLabel>
              <Input type="text" name="review" value={formik.values?.review} onChange={formik.handleChange} />
              {formik.errors.review && <FormErrorMessage>{formik.errors?.review}</FormErrorMessage>}
            </FormControl>
            <FormControl id="created_at" mb="4">
              <FormLabel>Created At</FormLabel>
              <DatePicker
                dateFormat={'dd/MM/yyyy'}
                selected={formik.values?.created_at}
                onChange={(value: Date) => formik.setFieldValue('created_at', value)}
              />
            </FormControl>
            <AsyncSelect<UserInterface>
              formik={formik}
              name={'customer_id'}
              label={'Customer'}
              placeholder={'Select User'}
              fetcher={getUsers}
              renderOption={(record) => (
                <option key={record.id} value={record.id}>
                  {record.roq_user_id}
                </option>
              )}
            />
            <AsyncSelect<RestaurantInterface>
              formik={formik}
              name={'restaurant_id'}
              label={'Restaurant'}
              placeholder={'Select Restaurant'}
              fetcher={getRestaurants}
              renderOption={(record) => (
                <option key={record.id} value={record.id}>
                  {record.name}
                </option>
              )}
            />
            <Button isDisabled={!formik.isValid || formik?.isSubmitting} colorScheme="blue" type="submit" mr="4">
              Submit
            </Button>
          </form>
        )}
      </Box>
    </AppLayout>
  );
}

export default FeedbackEditPage;
