import { Box, Grid } from "@mui/joy";
import Title from "../../components/text/title";
import TesseraWrapper from "../../components/wrappers/page_wrapper";
import StandardGrid from "../../components/wrappers/standard_grid";
import BorderBox from "../../components/wrappers/border_box";
import StyledText from "../../components/text/styled_text";
import PALLETTE from "../../theme/pallette";
import CreateEventForm from "../../components/events/create_event_form";
import { AppDispatch, RootState } from "../../store";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import {
  createEventFullWorkflowRequest,
  previousStep,
  resetCurrentStep,
  resetSuccess,
  setTicketReleaseForm,
  setTicketTypes,
} from "../../redux/features/eventCreationSlice";
import CreateTicketReleaseForm from "../../components/events/ticket_release/ticket_release_form";
import StyledButton from "../../components/buttons/styled_button";
import CreateTicketReleases from "../../components/events/ticket_release/create_ticket_releases";
import CreateTicketTypes from "../../components/events/ticket_types/create_ticket_types";
import CreateEventLastStep from "../../components/events/create_event_last_step";
import { useNavigate } from "react-router-dom";
import {
  addTicketType,
  clearTicketType,
  resetTicketTypes,
} from "../../redux/features/ticketTypeCreationSlice";
import RestartEventCreationButton from "../../components/buttons/restart_event_creation_button";
import { ITicketReleaseForm, ITicketTypeForm } from "../../types";
import { FormikHelpers } from "formik";
import { toast } from "react-toastify";

const CreateEventPage = () => {
  const { currentStep, form, success } = useSelector(
    (state: RootState) => state.eventCreation
  );
  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate();
  // Only run when the component mounts
  useEffect(() => {
    if (success) {
      dispatch(resetTicketTypes());
      dispatch(resetCurrentStep());
      navigate(`/events`);
    }
    dispatch(resetSuccess());
  }, [dispatch, navigate, success]);

  useEffect(() => {
    if (currentStep < 1 || currentStep > 4) {
      dispatch(resetCurrentStep());
    }
  }, [currentStep, dispatch]);

  const submitEventFullWorkflow = () => {
    dispatch(createEventFullWorkflowRequest(form));
  };

  const handleTicketReleaseSubmit = async (
    values: ITicketReleaseForm,
    { validateForm }: FormikHelpers<ITicketReleaseForm>
  ) => {
    const errors = await validateForm(values);
    if (Object.keys(errors).length === 0) {
      // The form is valid
      dispatch(setTicketReleaseForm(values));
    } else {
      // The form is invalid
      toast.error("Please fix the errors in the form.");
    }
  };

  const handleTTsSubmit = (ticketTypes: ITicketTypeForm[]) => {
    dispatch(setTicketTypes(ticketTypes));
  };

  return (
    <TesseraWrapper>
      <Box sx={{ padding: "16px 32px" }}>
        {currentStep == 1 && (
          <StandardGrid>
            <Grid xs={8}>
              <Title>Create Event</Title>
              <Box>
                <StyledText
                  level="body-md"
                  fontSize={18}
                  color={PALLETTE.charcoal}
                >
                  Create an event to manage ticket releases, attendees, and
                  more. An event consists of many parts, but tessera aims to
                  make it as easy as possible. We will walk you through the
                  process step by step.
                </StyledText>
              </Box>
              <Box mt={2}>
                <RestartEventCreationButton />
              </Box>
            </Grid>

            <Grid xs={8}>
              <BorderBox>
                <StyledText
                  level="body-lg"
                  fontSize={24}
                  color={PALLETTE.cerise}
                >
                  Event Details
                </StyledText>
                <StyledText
                  level="body-md"
                  fontSize={16}
                  color={PALLETTE.charcoal}
                >
                  Let's start with the basics. What are the details of your
                  event?
                </StyledText>
                <CreateEventForm />
              </BorderBox>
            </Grid>
          </StandardGrid>
        )}

        {currentStep === 2 && (
          <CreateTicketReleases submit={handleTicketReleaseSubmit} />
        )}
        {currentStep === 3 && (
          <CreateTicketTypes
            submit={handleTTsSubmit}
            handleBack={() => {
              dispatch(previousStep());
            }}
          />
        )}
        {currentStep === 4 && (
          <CreateEventLastStep submit={submitEventFullWorkflow} />
        )}
      </Box>
    </TesseraWrapper>
  );
};

export default CreateEventPage;
