import { useEffect, useReducer } from "react";
import reducer, {
  SET_DAY,
  SET_APPLICATION_DATA,
  SET_INTERVIEW,
} from "reducers/application";
import axios from "axios";

const useApplicationData = function () {
  const [state, dispatch] = useReducer(reducer, {
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {},
  });

  useEffect(() => {
    Promise.all([
      axios.get(`/api/days`),
      axios.get(`/api/appointments`),
      axios.get(`/api/interviewers`),
    ])
      .then((all) => {
        dispatch({
          type: "SET_APPLICATION_DATA",
          value: {
            days: all[0].data,
            appointments: all[1].data,
            interviewers: all[2].data,
          },
        });
      })
      .catch((error) =>
        console.log(
          `ERROR:\nStatus: ${error.response.status}\n${error.response.data}`
        )
      );

    const socket = new WebSocket(process.env.REACT_APP_WEBSOCKET_URL);
    socket.addEventListener("open", () => {
      socket.addEventListener("message", (event) => {
        const { id, interview } = JSON.parse(event.data);
        const appointment = {
          id,
          interview,
        };
        dispatch({
          type: SET_INTERVIEW,
          value: appointment,
        });
      });
    });

    return () => {
      socket.close();
    };
  }, []);

  const setDay = (day) => dispatch({ type: "SET_DAY", value: day });

  const bookInterview = (id, interview) => {
    const appointment = {
      ...state.appointments[id],
      interview: { ...interview },
    };

    return axios
      .put(`/api/appointments/${appointment.id}`, appointment)
      .then(() => {
        return dispatch({ type: SET_INTERVIEW, value: appointment });
      });
  };

  const cancelInterview = (id) => {
    const updatedAppointment = { ...state.appointments[id], interview: null };

    return axios
      .delete(`/api/appointments/${updatedAppointment.id}`, updatedAppointment)
      .then(() => {
        return dispatch({ type: SET_INTERVIEW, value: updatedAppointment });
      });
  };

  return { state, setDay, bookInterview, cancelInterview };
};

export default useApplicationData;
