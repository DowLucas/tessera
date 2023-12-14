import { ITicket, ITicketRequest } from "../../types";
import {
  Accordion,
  AccordionDetails,
  AccordionGroup,
  AccordionSummary,
  Box,
  Chip,
  Grid,
  IconButton,
  Stack,
  Tooltip,
  styled,
} from "@mui/joy";
import BorderBox from "../wrappers/border_box";
import StyledText from "../text/styled_text";
import PALLETTE from "../../theme/pallette";
import { format } from "date-fns";

const StyledTicketBox = styled(Box)(({ theme }) => ({
  border: "2px solid " + PALLETTE.charcoal,
  padding: theme.spacing(1),
  transition: "all 0.2s ease-in-out",
  cursor: "pointer",

  "&:hover": {
    transition: "all 0.2s ease-in-out",
    border: "2px solid " + PALLETTE.charcoal_see_through,
  },
}));

interface TicketListRowViewProps {
  ticket: ITicket;
  selected: number | null;
  setSelected: (id: number | null) => void;
}

const TicketListRowView: React.FC<TicketListRowViewProps> = ({
  ticket,
  selected,
  setSelected,
}) => {
  if (!ticket) {
    return <></>;
  }

  const ticketRequest = ticket.ticket_request!;
  const event = ticketRequest.ticket_release!.event;

  return (
    <StyledTicketBox
      key={ticketRequest.id}
      my={1}
      style={{
        borderColor:
          selected === ticketRequest.id ? PALLETTE.cerise : undefined,
      }}
      onClick={() => setSelected(ticket.id)}
    >
      <Grid
        container
        justifyContent="space-between"
        spacing={2}
        style={{
          padding: "8px",
        }}
      >
        <Grid>
          <StyledText
            color={PALLETTE.charcoal}
            level="body-md"
            fontWeight={700}
          >
            {ticketRequest.ticket_type!.name} -
            <StyledText
              color={PALLETTE.charcoal}
              level="body-md"
              fontWeight={500}
            >
              {" "}
              {ticketRequest.ticket_amount}x{ticketRequest.ticket_type!.price}{" "}
              SEK
            </StyledText>
          </StyledText>
        </Grid>
        <Grid>
          <Stack direction="row" spacing={1}>
            <Tooltip
              title={
                <StyledText
                  color={PALLETTE.white}
                  level="body-md"
                  fontWeight={500}
                  fontSize={15}
                  style={{
                    textAlign: "center",
                  }}
                >
                  This shows if you got the ticket or is a reserve.
                </StyledText>
              }
            >
              <Chip
                variant="soft"
                color="primary"
                style={{
                  backgroundColor: PALLETTE.charcoal,
                }}
              >
                <StyledText
                  color={ticket.is_reserve ? PALLETTE.orange : PALLETTE.green}
                  level="body-sm"
                  fontSize={14}
                  fontWeight={600}
                >
                  {ticket.is_reserve ? "Reserve" : "Ticket"}
                </StyledText>
              </Chip>
            </Tooltip>
            {ticketRequest.ticket_release?.is_reserved && (
              <Chip
                variant="soft"
                color="primary"
                style={{
                  backgroundColor: PALLETTE.charcoal,
                }}
              >
                <StyledText
                  color={PALLETTE.cerise}
                  level="body-sm"
                  fontSize={14}
                  fontWeight={600}
                >
                  Reserved
                </StyledText>
              </Chip>
            )}
          </Stack>
        </Grid>
      </Grid>
    </StyledTicketBox>
  );
};

export default TicketListRowView;
