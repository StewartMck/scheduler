import React, { useState } from "react";
import InterviewerList from "../InterviewerList";
import Button from "../Button";

const Form = function ({
  name: nameFromState,
  interviewer: interviewerFromState,
  onSave,
  onCancel,
  interviewers,
}) {
  const [name, setName] = useState(nameFromState || "");
  const [interviewer, setInterviewer] = useState(interviewerFromState || null);
  const [error, setError] = useState("");

  const validate = function () {
    if (name === "" && interviewer === null) {
      setError("Both a student name and interviewer are required");
      return;
    }
    if (name === "" || interviewer === null) {
      const message = !name
        ? "Student name cannot be blank"
        : "An interviewer must be chosen";
      setError(message);
      return;
    }

    setError("");
    onSave(name, interviewer);
  };

  const reset = () => {
    setName("");
    setInterviewer(null);
  };

  const cancel = () => {
    reset();
    onCancel();
  };

  return (
    <main className="appointment__card appointment__card--create">
      <section className="appointment__card-left">
        <form autoComplete="off" onSubmit={(event) => event.preventDefault()}>
          <input
            className="appointment__create-input text--semi-bold"
            name={name}
            value={name}
            type="text"
            placeholder="Enter Student Name"
            onChange={(event) => setName(event.target.value)}
            data-testid={"student-name-input"}
            /*
          This must be a controlled component
        */
          />
          <section className="appointment__validation">{error}</section>
        </form>
        <InterviewerList
          interviewers={interviewers}
          value={interviewer}
          onChange={setInterviewer}
        />
      </section>
      <section className="appointment__card-right">
        <section className="appointment__actions">
          <Button danger onClick={cancel}>
            Cancel
          </Button>
          <Button confirm onClick={validate}>
            Save
          </Button>
        </section>
      </section>
    </main>
  );
};

export default Form;
