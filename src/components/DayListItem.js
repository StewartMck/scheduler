import React from "react";
import "components/DayList.scss";
const classNames = require("classnames");

export default function DayListItem({ spots, selected, name, setDay }) {
  const dayClass = classNames("day-list__item", {
    "day-list__item--full": !spots,
    "day-list__item--selected": selected,
  });

  const formatSpots = (spots) => {
    return spots
      ? `${spots} spot${spots > 1 ? "s" : ""} remaining`
      : "no spots remaining";
  };

  return (
    <li data-testid="day" className={dayClass} onClick={() => setDay(name)}>
      <h2 className="text--regular">{name}</h2>
      <h3 className="text--light">{formatSpots(spots)}</h3>
    </li>
  );
}
