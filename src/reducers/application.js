const SET_DAY = "SET_DAY";
const SET_APPLICATION_DATA = "SET_APPLICATION_DATA";
const SET_INTERVIEW = "SET_INTERVIEW";

const reducer = function (state, { value, type }) {
  switch (type) {
    case SET_DAY:
      return { ...state, day: value };
    case SET_APPLICATION_DATA:
      return { ...state, ...value };
    case SET_INTERVIEW:
      const { id, interview } = value;

      // only update spots if this is a new interview or interview = null
      // Logic needed to prevent websocket from double deleting.
      // Only delete if interview is null and interview is present.
      const days = [...state.days];
      if (
        (interview === null && state.appointments[id].interview) ||
        (!state.appointments[id].interview && interview)
      ) {
        const dayOfInterview = [...state.days].filter((day) =>
          day.appointments.includes(value.id)
        );
        let { spots } = dayOfInterview[0];
        dayOfInterview[0].spots = interview
          ? (spots = spots - 1)
          : (spots = spots + 1);

        days[days.indexOf(dayOfInterview)] = dayOfInterview;
      }
      return {
        ...state,
        appointments: {
          ...state.appointments,
          [value.id]: {
            ...state.appointments[value.id],
            interview,
          },
        },
        days,
      };
    default:
      throw new Error(`Tried to reduce with unsupported action type: ${type}`);
  }
};

export default reducer;
export { SET_APPLICATION_DATA, SET_DAY, SET_INTERVIEW };
