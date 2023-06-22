import React from "react";
import ReactDOM from "react-dom/client";
import { Appointment, AppointmentsDayView } from "../src/AppointmentsDayView";
import { act } from "react-dom/test-utils";
import { experiments } from "webpack";

describe("Appointment", () => {
  let container;
  const blankCustomer = { firstName: "", lastName: "", phoneNumber: "" };

  beforeEach(() => {
    container = document.createElement("div");
    document.body.replaceChildren(container);
  });

  const render = (component) =>
    act(() => ReactDOM.createRoot(container).render(component));

  const appointmentTable = () =>
    document.querySelector("#appointmentView > table");

  it("renders a table", () => {
    render(<Appointment customer={blankCustomer} />);
    expect(appointmentTable()).not.toBeNull();
  });

  it("renders the customer first name", () => {
    const customer = { firstName: "Ashley" };
    render(<Appointment customer={customer} />);
    expect(appointmentTable().textContent).toContain("Ashley");
  });

  it("renders another customer first name", () => {
    const customer = { firstName: "Jordan" };
    render(<Appointment customer={customer} />);
    expect(appointmentTable().textContent).toContain("Jordan");
  });

  it("renders the customer last name", () => {
    const customer = { lastName: "Jones" };
    render(<Appointment customer={customer} />);
    expect(appointmentTable().textContent).toContain("Jones");
  });

  it("renders the customer phone number", () => {
    const customer = { phoneNumber: "123456789" };
    render(<Appointment customer={customer} />);
    expect(appointmentTable().textContent).toContain("123456789");
  });

  it("renders another customer phone number", () => {
    const customer = { phoneNumber: "987654321" };
    render(<Appointment customer={customer} />);
    expect(appointmentTable().textContent).toContain("987654321");
  });

  it("renders the stylist name", () => {
    render(<Appointment customer={blankCustomer} stylist="Sam" />);
    expect(appointmentTable().textContent).toContain("Sam");
  });

  it("renders another stylist name", () => {
    render(<Appointment customer={blankCustomer} stylist="Jo" />);
    expect(appointmentTable().textContent).toContain("Jo");
  });

  it("renders an h3 element", () => {
    render(<Appointment customer={blankCustomer} />);
    expect(document.querySelector("h3")).not.toBeNull();
  });

  it("renders the time as the heading", () => {
    const today = new Date();
    const timestamp = today.setHours(9, 0, 0);
    render(<Appointment customer={blankCustomer} startsAt={timestamp} />);
    expect(document.querySelector("h3").textContent).toEqual(
      "Today's appointment at 09:00"
    );
  });
});

describe("AppointmentsDayView", () => {
  let container;
  const today = new Date();
  const twoAppointments = [
    { startsAt: today.setHours(12, 0), customer: { firstName: "Ashley" } },
    { startsAt: today.setHours(13, 0), customer: { firstName: "Jordan" } }
  ];

  beforeEach(() => {
    container = document.createElement("div");
    document.body.replaceChildren(container);
  });
  const render = (component) =>
    act(() => ReactDOM.createRoot(container).render(component));

  it("renders a div with the right id", () => {
    render(<AppointmentsDayView appointments={[]} />);
    expect(document.querySelector("div#appointmentsDayView")).not.toBeNull();
  });

  it("renders an ol element to display appointments", () => {
    render(<AppointmentsDayView appointments={[]} />);
    const listElement = document.querySelector("ol");
    expect(listElement).not.toBeNull();
  });

  it("renders an li for each appointment", () => {
    render(<AppointmentsDayView appointments={twoAppointments} />);
    const listChildren = document.querySelectorAll("ol > li");
    expect(listChildren).toHaveLength(2);
  });

  it("renders the time of each appointment", () => {
    render(<AppointmentsDayView appointments={twoAppointments} />);
    const listChildren = document.querySelectorAll("li");
    expect(listChildren[0].textContent).toEqual("12:00");
    expect(listChildren[1].textContent).toEqual("13:00");
  });

  it("initially shows a message saying there are no appointments today", () => {
    render(<AppointmentsDayView appointments={[]} />);
    expect(document.body.textContent).toContain(
      "There are no appointments scheduled for today."
    );
  });

  it("selects the first appointment by default", () => {
    render(<AppointmentsDayView appointments={twoAppointments} />);
    expect(document.body.textContent).toContain("Ashley");
  });

  it("has a button element in each li", () => {
    render(<AppointmentsDayView appointments={twoAppointments} />);
    const buttons = document.querySelectorAll("li > button");
    expect(buttons).toHaveLength(2);
    expect(buttons[0].type).toEqual("button");
  });

  it("renders another appointment when selected", () => {
    render(<AppointmentsDayView appointments={twoAppointments} />);
    const button = document.querySelectorAll("button")[1];
    act(() => button.click());
    expect(document.body.textContent).toContain("Jordan");
  });
});
