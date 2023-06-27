import React from "react";
import ReactDOM from "react-dom/client";
import { AppointmentsDayView } from "./AppointmentsDayView";
import { CustomerForm } from "./CustomerForm";
import { sampleAppointments } from "./sampleData";

ReactDOM.createRoot(document.getElementById("root")).render(
  <>
    {/*
    <AppointmentsDayView appointments={sampleAppointments} />
  */}
    <CustomerForm original={{}} onSubmit={() => {}} />
  </>
);
