import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store";
import PALLETTE from "../../theme/pallette";
import {
  IEvent,
  IOrganization,
  IOrganizationUser,
  OrganizationUserRole,
} from "../../types";
import StyledText from "../text/styled_text";
import Title from "../text/title";
import BorderBox from "../wrappers/border_box";
import { useEffect, useState } from "react";
import {
  getOrganizationEventsRequest,
  getOrganizationUsersRequest,
} from "../../redux/features/organizationSlice";
import LoadingOverlay from "../Loading";
import {
  Accordion,
  AccordionDetails,
  AccordionGroup,
  AccordionSummary,
  Box,
  Divider,
  Grid,
  Input,
  Link,
  Option,
  Select,
  Sheet,
} from "@mui/joy";
import { getUserFullName } from "../../utils/user_utils";
import OrganizationUserView from "./organization_user_view";
import { removeUserSuccess } from "../../redux/sagas/organizationSaga";
import AddOrganizationUser from "./add_organization_user";
import OrganizationEventView from "./organization_event_view";

interface ViewOrganizationProps {
  organization: IOrganization;
}

const ViewOrganization: React.FC<ViewOrganizationProps> = ({
  organization,
}) => {
  const { user: currentUser } = useSelector((state: RootState) => state.user);

  const { organizationUsers, loading, organizationEvents } = useSelector(
    (state: RootState) => state.organization
  ) as {
    organizationUsers: IOrganizationUser[];
    loading: boolean;
    organizationEvents: IEvent[];
  };
  const dispatch: AppDispatch = useDispatch();

  const [showAllUsers, setShowAllUsers] = useState(false);
  const [showAllEvents, setShowAllEvents] = useState(false);

  const reFetch = () => {
    dispatch(getOrganizationUsersRequest(organization.id));
  };

  useEffect(() => {
    dispatch(getOrganizationUsersRequest(organization.id));
    dispatch(getOrganizationEventsRequest(organization.id));
  }, [dispatch, removeUserSuccess, organization]);

  const isOwner = organizationUsers?.find(
    (user) =>
      user.username === currentUser?.username &&
      user.organization_role === OrganizationUserRole.OWNER
  );

  return (
    <BorderBox style={{ marginTop: "16px" }}>
      {loading && <LoadingOverlay />}
      <Title fontSize={32}>{organization.name}</Title>
      <StyledText level="body-sm" fontSize={18} color={PALLETTE.charcoal}>
        Created {new Date(organization.created_at!).toLocaleDateString()}
      </StyledText>

      {/* Users */}
      <Title
        fontSize={22}
        style={{ marginTop: "16px" }}
        color={PALLETTE.charcoal}
      >
        Users
      </Title>
      <AccordionGroup>
        <Accordion
          variant="plain"
          expanded={showAllUsers}
          onChange={() => setShowAllUsers(!showAllUsers)}
        >
          <AccordionSummary>
            <StyledText
              level="body-md"
              fontSize={18}
              color={PALLETTE.charcoal_see_through}
              fontWeight={700}
            >
              {showAllUsers ? "Show less" : "Show all"}
            </StyledText>
          </AccordionSummary>
          <AccordionDetails>
            {organizationUsers?.length === 0 ? (
              <StyledText
                level="body-md"
                fontSize={18}
                color={PALLETTE.charcoal}
              >
                There are no users in this team.
              </StyledText>
            ) : (
              organizationUsers?.map((user) => {
                return (
                  <OrganizationUserView
                    user={user}
                    organization={organization}
                    canManage={isOwner !== undefined}
                  />
                );
              })
            )}
          </AccordionDetails>
        </Accordion>
      </AccordionGroup>
      {/* Add new user */}
      <AddOrganizationUser organization={organization} reFetch={reFetch} />

      <Divider sx={{ marginTop: "16px", marginBottom: "16px" }} />
      <Box sx={{ marginTop: "16px" }}>
        <Title fontSize={22} color={PALLETTE.charcoal}>
          Manage Team Events
        </Title>

        <AccordionGroup>
          <Accordion
            variant="plain"
            expanded={showAllEvents}
            onChange={() => setShowAllEvents(!showAllEvents)}
          >
            <AccordionSummary>
              <StyledText
                level="body-md"
                fontSize={18}
                color={PALLETTE.charcoal_see_through}
                fontWeight={700}
              >
                {showAllEvents ? "Show less" : "Show all"}
              </StyledText>
            </AccordionSummary>
            <AccordionDetails>
              {organizationEvents?.length === 0 ? (
                <StyledText
                  level="body-md"
                  fontSize={18}
                  color={PALLETTE.charcoal}
                >
                  There are no events in this team.{" "}
                  <Link href="/create-event">Create one</Link>.
                </StyledText>
              ) : (
                organizationEvents?.map((event) => {
                  return (
                    <OrganizationEventView
                      event={event}
                      organization={organization}
                    />
                  );
                })
              )}
            </AccordionDetails>
          </Accordion>
        </AccordionGroup>
      </Box>
    </BorderBox>
  );
};

export default ViewOrganization;
