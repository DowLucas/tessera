import { call, put, takeEvery, takeLatest } from "redux-saga/effects";
import {
  fetchEventTicketsStart,
  fetchEventTicketsSuccess,
  fetchEventTicketsFailure,
} from "../features/eventTicketsSlice";
import axios from "axios";
import { PayloadAction } from "@reduxjs/toolkit";
import {
  IEvent,
  ITicket,
  ITicketRelease,
  ITicketRequest,
  ITicketType,
  IUser,
} from "../../types";

function* fetchEventTickets(
  action: PayloadAction<number>
): Generator<any, void, any> {
  try {
    const response = yield call(
      axios.get,
      `${process.env.REACT_APP_BACKEND_URL}/events/${action.payload}/tickets`,
      {
        withCredentials: true,
      }
    );

    const tickets: ITicket[] = response.data.tickets.map((ticket: any) => {
      console.log(ticket.user);
      const ticket_request = ticket.ticket_request;
      return {
        id: ticket.ID!,
        is_paid: ticket.is_paid!,
        is_reserve: ticket.is_reserve!,
        refunded: ticket.refunded!,
        user_id: ticket.user_id!,
        created_at: new Date(ticket.CreatedAt!).getTime(),
        user: {
          ug_kth_id: ticket.user.ug_kth_id!,
          id: ticket.user.ID!,
          email: ticket.user.email!,
          username: ticket.user.username!,
          first_name: ticket.user.first_name!,
          last_name: ticket.user.last_name!,
        } as IUser,
        ticket_request: {
          id: ticket_request.ID!,
          created_at: new Date(ticket_request.CreatedAt!).getTime(),
          is_handled: ticket_request.is_handled!,
          ticket_amount: ticket_request.ticket_amount!,
          ticket_type_id: ticket_request.ticket_type_id!,
          ticket_type: {
            id: ticket_request.ticket_type.ID!,
            name: ticket_request.ticket_type.name!,
            description: ticket_request.ticket_type.description!,
            price: ticket_request.ticket_type.price!,
            isReserved: ticket_request.ticket_type.is_reserved!,
          } as ITicketType,
          ticket_release_id: ticket_request.ticket_release_id!,
          ticket_release: {
            id: ticket_request.ticket_release.ID!,
            eventId: ticket_request.ticket_release.event_id!,
            event: {
              id: ticket_request.ticket_release.event.ID!,
              name: ticket_request.ticket_release.event.name!,
              date: new Date(
                ticket_request.ticket_release.event.date!
              ).getTime(),
            } as IEvent,
            name: ticket_request.ticket_release.name!,
            description: ticket_request.ticket_release.description!,
            open: new Date(ticket_request.ticket_release.open!).getTime(),
            close: new Date(ticket_request.ticket_release.close!).getTime(),
            has_allocated_tickets:
              ticket_request.ticket_release.has_allocated_tickets,
          } as ITicketRelease,
        } as ITicketRequest,
      } as ITicket;
    });

    yield put(fetchEventTicketsSuccess(tickets));
  } catch (error: any) {
    yield put(fetchEventTicketsFailure(error.message));
  }
}

function* watchAllocateTicketsSaga() {
  yield takeLatest(fetchEventTicketsStart.type, fetchEventTickets);
}

export default watchAllocateTicketsSaga;