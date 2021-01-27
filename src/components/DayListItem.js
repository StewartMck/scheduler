import React from "react";
import "components/DayList.scss";
const classNames = require("classnames");

export default function DayListItem(props) {
  const dayClass = classNames("day-list__item", {
    "day-list__item--full": !props.spots,
    "day-list__item--selected": props.selected,
  });

  const formatSpots = (spots) => {
    return spots
      ? `${spots} spot${spots > 1 ? "s" : ""} remaining`
      : "no spots remaining";
  };

  return (
    <li
      data-testid="day"
      className={dayClass}
      onClick={() => props.setDay(props.name)}
    >
      <h2 className="text--regular">{props.name}</h2>
      <h3 className="text--light">{formatSpots(props.spots)}</h3>
    </li>
  );
}
