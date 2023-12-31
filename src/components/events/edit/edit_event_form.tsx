import {
  Button,
  Checkbox,
  Divider,
  FormControl,
  FormHelperText,
  FormLabel,
  Grid,
  Input,
  Link,
  Option,
  Select,
  Stack,
  Textarea,
} from "@mui/joy";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { AppDispatch, RootState } from "../../../store";
import { useDispatch, useSelector } from "react-redux";
import { getMyOrganizationsRequest } from "../../../redux/features/organizationSlice";
import { useEffect, useState } from "react";
import { EventFormInitialValues, IEvent, IEventForm } from "../../../types";
import {
  clearEventForm,
  setEventForm,
} from "../../../redux/features/eventCreationSlice";
import LoadingOverlay from "../../Loading";
import {
  StyledFormLabel,
  StyledFormLabelWithHelperText,
} from "../../forms/form_labels";
import {
  DefaultInputStyle,
  FormCheckbox,
  FormGooglePlacesAutocomplete,
  FormInput,
  FormTextarea,
} from "../../forms/input_types";
import { StyledErrorMessage } from "../../forms/messages";
import StyledButton from "../../buttons/styled_button";
import PALLETTE from "../../../theme/pallette";
import { format } from "date-fns";
import CreateEventFormSchema from "../../../validation/create_event_form";
import { editEventRequest } from "../../../redux/features/editEventSlice";

interface EditEventFormProps {
  event: IEvent;
}

const EditEventForm: React.FC<EditEventFormProps> = ({ event }) => {
  const { organizations, loading } = useSelector(
    (state: RootState) => state.organization
  );

  const dispatch: AppDispatch = useDispatch();

  const [initialValues, setInitialValues] = useState<IEventForm>(
    EventFormInitialValues
  );
  const [initValueSet, setInitValueSet] = useState<boolean>(false);

  useEffect(() => {
    dispatch(getMyOrganizationsRequest());
  }, [dispatch]);

  useEffect(() => {
    if (event) {
      setInitialValues({
        name: event.name,
        description: event.description,
        date: format(new Date(event.date), "yyyy-MM-dd'T'HH:mm"),
        location: {
          label: event.location,
          value: event.location,
        },
        organization_id: event.organizationId,
        is_private: event.is_private,
      });
      setInitValueSet(true);
    }
  }, [event]);

  const handleSubmission = (values: IEventForm) => {
    // Convert date to Unix timestamp
    dispatch(
      editEventRequest({
        id: event.id,
        event: values,
      })
    );
  };

  if (loading || !initValueSet) {
    return <LoadingOverlay />;
  }

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={CreateEventFormSchema}
      validateOnBlur={true}
      validateOnChange={true}
      onSubmit={(values: IEventForm) => {
        // Convert date to Unix timestamp
        handleSubmission(values);
      }}
    >
      {({ values, isValid, errors }) => {
        return (
          <Form>
            <Grid
              container
              columns={16}
              flexDirection="row"
              justifyContent="flex-start"
            >
              <Grid xs={16} sm={8}>
                <FormControl>
                  <StyledFormLabel>Name*</StyledFormLabel>
                  <FormInput
                    name="name"
                    label="Name"
                    placeholder="Party Rangers"
                  />
                  <StyledErrorMessage name="name" />

                  <StyledFormLabelWithHelperText>
                    What is the name of your event?
                  </StyledFormLabelWithHelperText>
                </FormControl>

                <FormControl>
                  <StyledFormLabel>Description*</StyledFormLabel>

                  <FormTextarea
                    name="description"
                    label="Description"
                    placeholder="Party Rangers is a party for rangers."
                  />
                  <StyledErrorMessage name="description" />

                  <StyledFormLabelWithHelperText>
                    What is your event about? What should people expect?
                  </StyledFormLabelWithHelperText>
                </FormControl>

                <FormControl>
                  <StyledFormLabel>Date*</StyledFormLabel>
                  <FormInput
                    name="date"
                    label="Date"
                    type="datetime-local"
                    placeholder=""
                  />
                  <StyledErrorMessage name="date" />

                  <StyledFormLabelWithHelperText>
                    When is your event?
                  </StyledFormLabelWithHelperText>
                </FormControl>
              </Grid>

              <Grid xs={16} sm={8}>
                <FormControl>
                  <StyledFormLabel>Location*</StyledFormLabel>
                  <FormGooglePlacesAutocomplete name="location" />
                  <StyledErrorMessage name="location" />

                  <StyledFormLabelWithHelperText>
                    Where is your event?
                  </StyledFormLabelWithHelperText>
                </FormControl>

                <FormControl>
                  <StyledFormLabel>Team*</StyledFormLabel>
                  <Field name="organization_id">
                    {({ field, form }: any) => {
                      return (
                        <Select
                          {...field}
                          onChange={(_, newValue) => {
                            form.setFieldValue(field.name, newValue as number);
                          }}
                          style={DefaultInputStyle}
                        >
                          {organizations?.map((org) => {
                            return (
                              <Option key={org.id} value={org.id}>
                                {org.name}
                              </Option>
                            );
                          })}
                        </Select>
                      );
                    }}
                  </Field>
                  <StyledErrorMessage name="organization_id" />
                  <StyledFormLabelWithHelperText>
                    Which team is hosting your event? You need to tie the event
                    to a team. If your not a part of a team, you can create one{" "}
                    <Link href="/organizations/create">here</Link>.
                  </StyledFormLabelWithHelperText>
                </FormControl>

                <FormControl>
                  <StyledFormLabel>Private Event</StyledFormLabel>
                  <FormCheckbox name="is_private" label="Is Private" />
                  <StyledErrorMessage name="is_private" />

                  <StyledFormLabelWithHelperText>
                    Is your event private?
                  </StyledFormLabelWithHelperText>
                </FormControl>
              </Grid>
            </Grid>

            <Grid
              container
              flexDirection="row"
              justifyContent="flex-start"
              spacing={2}
              sx={{ mt: 2 }}
            >
              <Grid>
                <StyledButton
                  color={PALLETTE.charcoal}
                  bgColor={PALLETTE.green}
                  textColor={PALLETTE.charcoal}
                  size="md"
                  disabled={!isValid}
                  type="submit"
                  style={{
                    width: "150px",
                  }}
                >
                  Save
                </StyledButton>
              </Grid>
            </Grid>
          </Form>
        );
      }}
    </Formik>
  );
};

export default EditEventForm;
