import { useEffect, useReducer } from "react";
const axios = require("axios");

const useApplicationData = function () {
  const SET_DAY = "SET_DAY";
  const SET_APPLICATION_DATA = "SET_APPLICATION_DATA";
  const SET_INTERVIEW = "SET_INTERVIEW";
  const SET_SPOTS_REMAINING = "SET_SPOTS_REMAINING";

  const reducer = function (state, action) {
    switch (action.type) {
      case SET_DAY:
        return { ...state, day: action.value };
      case SET_APPLICATION_DATA:
        return { ...state, ...action.value };
      case SET_INTERVIEW:
        const interview = action.value.interview;
        return {
          ...state,
          appointments: {
            ...state.appointments,
            [action.value.id]: {
              ...state.appointments[action.value.id],
              interview,
            },
          },
        };
      case SET_SPOTS_REMAINING:
        return { ...state, days: action.value };
      default:
        throw new Error(
          `Tried to reduce with unsupported action type: ${action.type}`
        );
    }
  };

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

    socket.addEventListener("message", (event) => {
      const data = JSON.parse(event.data);
      const appointment = {
        id: data.id,
        interview: data.interview,
      };

      //need to fix update spots feature here
      // switch of if statement to output day to pass to update Day
      let id = appointment.id;
      let day =
        id > 0 && id <= 5
          ? "Monday"
          : id > 5 && id <= 10
          ? "Tuesday"
          : id > 10 && id <= 15
          ? "Wednesday"
          : id > 15 && id <= 20
          ? "Thusday"
          : "Friday";

      console.log("day", day);

      // updateDaySpots(day, true);

      dispatch({
        type: SET_INTERVIEW,
        value: appointment,
      });
    });

    return () => {
      socket.close();
    };
  }, []);

  const setDay = (day) => dispatch({ type: "SET_DAY", value: day });

  const updateDaySpots = (appointmentDay, bookAppointment) => {
    const days = [...state.days];
    const filteredDay =
      days && appointmentDay
        ? days.find((days) => days.name === appointmentDay)
        : null;

    const updatedSpots = bookAppointment
      ? --filteredDay.spots
      : ++filteredDay.spots;
    filteredDay.spots = updatedSpots;

    days[days.indexOf(filteredDay)] = filteredDay;

    dispatch({
      type: SET_SPOTS_REMAINING,
      value: days,
    });
  };

  const bookInterview = (id, interview) => {
    const appointment = {
      ...state.appointments[id],
      interview: { ...interview },
    };

    // only update spots if this is a new interview
    if (!state.appointments[id].interview) {
      updateDaySpots(state.day, true);
    }

    return axios({
      method: "put",
      url: `/api/appointments/${appointment.id}`,
      data: appointment,
    }).then(() => {
      return dispatch({ type: SET_INTERVIEW, value: appointment });
    });
  };

  const cancelInterview = (id) => {
    const updatedAppointment = { ...state.appointments[id], interview: null };

    updateDaySpots(state.day, false);

    return axios({
      method: "delete",
      url: `/api/appointments/${updatedAppointment.id}`,
      data: updatedAppointment,
    }).then(() => {
      return dispatch({ type: SET_INTERVIEW, value: updatedAppointment });
    });
  };

  return { state, setDay, bookInterview, cancelInterview };
};

export default useApplicationData;
