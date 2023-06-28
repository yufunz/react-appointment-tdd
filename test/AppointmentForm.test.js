import React from "react";
import {
  initializeReactContainer,
  render,
  field,
  form,
  element,
  elements
} from "./reactTestExtensions";

import { AppointmentForm } from "../src/AppointmentForm";

describe("AppointmentForm", () => {
  const findOption = (selectBox, textContent) => {
    const options = Array.from(selectBox.childNodes);
    return options.find((option) => option.textContent === textContent);
  };

  const blankAppointment = {
    service: ""
  };

  const services = ["Cut", "Blow-dry"];

  beforeEach(() => {
    initializeReactContainer();
  });

  const labelsOfAllOptions = (element) =>
    Array.from(element.childNodes, (node) => node.textContent);

  it("renders a form", () => {
    render(<AppointmentForm original={blankAppointment} />);
    expect(form()).not.toBeNull();
  });

  describe("service field", () => {
    it("renders as a select box", () => {
      render(<AppointmentForm original={blankAppointment} />);
      expect(field("service")).not.toBeNull();
      expect(field("service").tagName).toEqual("SELECT");
    });
  });

  it("has a blank value as the first value", () => {
    render(<AppointmentForm original={blankAppointment} />);
    const firstOption = field("service").childNodes[0];
    expect(firstOption.value).toEqual("");
  });

  it("lists all salon services", () => {
    render(
      <AppointmentForm
        selectableServices={services}
        original={blankAppointment}
      />
    );
    expect(labelsOfAllOptions(field("service"))).toEqual(
      expect.arrayContaining(services)
    );
  });

  it("pre-selects the existing value", () => {
    const appointment = { service: "Blow-dry" };
    render(
      <AppointmentForm selectableServices={services} original={appointment} />
    );
    const option = findOption(field("service"), "Blow-dry");
    expect(option.selected).toBe(true);
  });

  describe("time slot table", () => {
    it("renders a table for time sltos with an id", () => {
      render(<AppointmentForm original={blankAppointment} />);
      expect(element("table#time-slots")).not.toBeNull();
    });

    it("renders a time slot for every half an hour between open and close times", () => {
      render(
        <AppointmentForm
          original={blankAppointment}
          salonOpensAt={9}
          salonClosesAt={11}
        />
      );
      const timesOfDayHeadings = elements("tbody >* th");
      expect(timesOfDayHeadings[0]).toContainText("09:00");
      expect(timesOfDayHeadings[1]).toContainText("09:30");
      expect(timesOfDayHeadings[3]).toContainText("10:30");
    });

    it("renders an empty cell at the start of the header row", () => {
      render(<AppointmentForm original={blankAppointment} />);
      const headerRow = element("thead > tr");
      expect(headerRow.firstChild).toContainText("");
    });

    it("renders a week of available dates", () => {
      const specificDate = new Date(2018, 11, 1);
      render(
        <AppointmentForm original={blankAppointment} today={specificDate} />
      );
      const dates = elements("thead >* th:not(:first-child)");
      expect(dates).toHaveLength(7);
      expect(dates[0]).toContainText("Sat 01");
      expect(dates[1]).toContainText("Sun 02");
      expect(dates[3]).toContainText("Tue 04");
    });
  });
});
