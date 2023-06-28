import React from "react";
import ReactDOM from "react-dom/client";
import { AppointmentsDayView } from "./AppointmentsDayView";
import { CustomerForm } from "./CustomerForm";
import { sampleAppointments } from "./sampleData";
import { AppointmentForm } from "./AppointmentForm";

ReactDOM.createRoot(document.getElementById("root")).render(
  <>
    <AppointmentForm />
    {/*
    <AppointmentsDayView appointments={sampleAppointments} />
    <CustomerForm original={{}} onSubmit={() => {}} />
  */}
  </>
);
