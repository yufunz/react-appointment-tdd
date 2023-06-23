import React from "react";
import { Appointment, AppointmentsDayView } from "../src/AppointmentsDayView";
import {
  initializeReactContainer,
  render,
  click,
  element,
  elements,
  textOf,
  typeOf
} from "./reactTestExtensions";

describe("Appointment", () => {
  const blankCustomer = { firstName: "", lastName: "", phoneNumber: "" };

  beforeEach(() => {
    initializeReactContainer();
  });

  const appointmentTable = () => element("#appointmentView > table");

  it("renders a table", () => {
    render(<Appointment customer={blankCustomer} />);
    expect(appointmentTable()).not.toBeNull();
  });

  it("renders the customer first name", () => {
    const customer = { firstName: "Ashley" };
    render(<Appointment customer={customer} />);
    expect(appointmentTable()).toContainText("Ashley");
  });

  it("renders another customer first name", () => {
    const customer = { firstName: "Jordan" };
    render(<Appointment customer={customer} />);
    expect(appointmentTable()).toContainText("Jordan");
  });

  it("renders the customer last name", () => {
    const customer = { lastName: "Jones" };
    render(<Appointment customer={customer} />);
    expect(appointmentTable()).toContainText("Jones");
  });

  it("renders the customer phone number", () => {
    const customer = { phoneNumber: "123456789" };
    render(<Appointment customer={customer} />);
    expect(appointmentTable()).toContainText("123456789");
  });

  it("renders another customer phone number", () => {
    const customer = { phoneNumber: "987654321" };
    render(<Appointment customer={customer} />);
    expect(appointmentTable()).toContainText("987654321");
  });

  it("renders the stylist name", () => {
    render(<Appointment customer={blankCustomer} stylist="Sam" />);
    expect(appointmentTable()).toContainText("Sam");
  });

  it("renders another stylist name", () => {
    render(<Appointment customer={blankCustomer} stylist="Jo" />);
    expect(appointmentTable()).toContainText("Jo");
  });

  it("renders an h3 element", () => {
    render(<Appointment customer={blankCustomer} />);
    expect(element("h3")).not.toBeNull();
  });

  it("renders the time as the heading", () => {
    const today = new Date();
    const timestamp = today.setHours(9, 0, 0);
    render(<Appointment customer={blankCustomer} startsAt={timestamp} />);
    expect(element("h3")).toContainText("Today's appointment at 09:00");
  });
});

describe("AppointmentsDayView", () => {
  const today = new Date();
  const twoAppointments = [
    { startsAt: today.setHours(12, 0), customer: { firstName: "Ashley" } },
    { startsAt: today.setHours(13, 0), customer: { firstName: "Jordan" } }
  ];

  beforeEach(() => {
    initializeReactContainer();
  });

  it("renders a div with the right id", () => {
    render(<AppointmentsDayView appointments={[]} />);
    expect(element("div#appointmentsDayView")).not.toBeNull();
  });

  it("renders an ol element to display appointments", () => {
    render(<AppointmentsDayView appointments={[]} />);
    const listElement = element("ol");
    expect(listElement).not.toBeNull();
  });

  it("renders an li for each appointment", () => {
    render(<AppointmentsDayView appointments={twoAppointments} />);
    const listChildren = elements("ol > li");
    expect(listChildren).toHaveLength(2);
  });

  it("renders the time of each appointment", () => {
    render(<AppointmentsDayView appointments={twoAppointments} />);
    const listChildren = elements("li");
    expect(listChildren[0]).toContainText("12:00");
    expect(listChildren[1]).toContainText("13:00");
  });

  it("initially shows a message saying there are no appointments today", () => {
    render(<AppointmentsDayView appointments={[]} />);
    expect(document.body).toContainText(
      "There are no appointments scheduled for today."
    );
  });

  it("selects the first appointment by default", () => {
    render(<AppointmentsDayView appointments={twoAppointments} />);
    expect(document.body).toContainText("Ashley");
  });

  it("has a button element in each li", () => {
    render(<AppointmentsDayView appointments={twoAppointments} />);
    const buttons = elements("li > button");
    expect(buttons).toHaveLength(2);
    expect(buttons[0].type).toEqual("button");
  });

  it("renders another appointment when selected", () => {
    render(<AppointmentsDayView appointments={twoAppointments} />);
    const button = elements("button")[1];
    click(button);
    expect(document.body).toContainText("Jordan");
  });
});
