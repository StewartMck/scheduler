import { useState, useEffect } from "react";
const axios = require("axios");

const useApplicationData = function () {
  const [state, setState] = useState({
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
        setState((prev) => ({
          ...prev,
          days: all[0].data,
          appointments: all[1].data,
          interviewers: all[2].data,
        }));
      })
      .catch((error) =>
        console.log(
          `ERROR:\nStatus: ${error.response.status}\n${error.response.data}`
        )
      );
  }, []);

  const setDay = (day) => setState({ ...state, day });

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

    setState((prev) => ({ ...prev, days }));
  };

  const bookInterview = (id, interview) => {
    const appointment = {
      ...state.appointments[id],
      interview: { ...interview },
    };
    const appointments = {
      ...state.appointments,
      [id]: appointment,
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
      return setState((prev) => ({ ...prev, appointments }));
    });
  };

  const cancelInterview = (id) => {
    const updatedAppointment = { ...state.appointments[id], interview: null };
    const appointments = {
      ...state.appointments,
      [id]: updatedAppointment,
    };

    updateDaySpots(state.day, false);

    return axios({
      method: "delete",
      url: `/api/appointments/${updatedAppointment.id}`,
      data: updatedAppointment,
    }).then(() => {
      return setState((prev) => ({ ...prev, appointments }));
    });
  };

  return { state, setDay, bookInterview, cancelInterview };
};

export default useApplicationData;
