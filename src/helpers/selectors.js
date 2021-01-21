export const getAppointmentsForDay = function (state, day) {
  // validation for both state obj & days string
  const filteredDay =
    state.days && day ? state.days.find((days) => days.name === day) : null;
  const appointments = [];

  if (filteredDay) {
    filteredDay.appointments.forEach((appointment) => {
      appointments.push(state.appointments[appointment]);
    });
  }
  return appointments;
};

export const getInterviewersForDay = function (state, day) {
  // validation for both state obj & days string
  const filteredDay =
    state.days && day ? state.days.find((days) => days.name === day) : null;
  const interviewers = [];

  if (filteredDay) {
    filteredDay.interviewers.forEach((interviewer) => {
      interviewers.push(state.interviewers[interviewer]);
    });
  }
  return interviewers;
};

export const getInterview = function (state, interview) {
  return state && interview
    ? {
        student: interview.student,
        interviewer: state.interviewers[interview.interviewer],
      }
    : null;
};
