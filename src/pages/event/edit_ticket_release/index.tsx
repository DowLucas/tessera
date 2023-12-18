import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../store";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { resetTicketTypes } from "../../../redux/features/ticketTypeCreationSlice";
import {
  createEventFullWorkflowRequest,
  resetCurrentStep,
  resetSuccess,
} from "../../../redux/features/eventCreationSlice";
import TesseraWrapper from "../../../components/wrappers/page_wrapper";
import { Box, Grid } from "@mui/joy";
import StandardGrid from "../../../components/wrappers/standard_grid";
import Title from "../../../components/text/title";
import StyledText from "../../../components/text/styled_text";
import PALLETTE from "../../../theme/pallette";
import BorderBox from "../../../components/wrappers/border_box";
import CreateEventForm from "../../../components/events/create_event_form";
import CreateTicketReleases from "../../../components/events/ticket_release/create_ticket_releases";
import CreateTicketTypes from "../../../components/events/ticket_types/create_ticket_types";
import CreateEventLastStep from "../../../components/events/create_event_last_step";
import EditEventAddTicketRelease from "../../../components/events/edit/edit_event_add_ticket_release";
import {
  ITicketReleaseForm,
  ITicketTypeForm,
  TicketReleaseFormInitialValues,
} from "../../../types";
import { FormikHelpers } from "formik";
import { toast } from "react-toastify";
import { getEventRequest } from "../../../redux/features/eventSlice";
import LoadingOverlay from "../../../components/Loading";
import EditEventAddTicketReleaseLastStep from "../../../components/events/edit/edit_event_add_ticket_release_last_step";
import { createTicketReleaseRequest } from "../../../redux/features/createTicketReleaseSlice";
import { format } from "date-fns";

const EditEventAddTicketReleasePage: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const { eventID } = useParams();

  const [ticketReleaseForm, setTicketReleaseForm] =
    useState<ITicketReleaseForm | null>(null);

  const { event } = useSelector((state: RootState) => state.eventDetail);

  const navigate = useNavigate();
  // Only run when the component mounts

  useEffect(() => {
    if (eventID) dispatch(getEventRequest(parseInt(eventID!)));
  }, [dispatch, eventID]);

  const handleTicketReleaseSubmit = async (
    values: ITicketReleaseForm,
    { validateForm }: FormikHelpers<ITicketReleaseForm>
  ) => {
    const errors = await validateForm(values);
    if (Object.keys(errors).length === 0) {
      dispatch(
        createTicketReleaseRequest({
          ticketRelease: values,
          eventId: parseInt(eventID!),
        })
      );
    } else {
      toast.error("Please fill in all the fields.");
    }
  };

  if (!event) return <LoadingOverlay />;

  const initialValues: ITicketReleaseForm = {
    ...TicketReleaseFormInitialValues,
    event_date: format(new Date(event.date!), "yyyy-MM-dd HH:mm"),
  };

  return (
    <TesseraWrapper>
      <Box sx={{ padding: "16px 32px" }}>
        <EditEventAddTicketRelease
          eventId={parseInt(eventID!)}
          submit={handleTicketReleaseSubmit}
          initialValues={ticketReleaseForm || initialValues}
          createOnSubmit={true}
        />
      </Box>
    </TesseraWrapper>
  );
};

export default EditEventAddTicketReleasePage;
