import React from "react";
import {
  initializeReactContainer,
  render,
  form,
  field,
  click,
  submit,
  submitButton,
  change,
  labelFor
} from "./reactTestExtensions";
import { CustomerForm } from "../src/CustomerForm";

const spy = () => {
  let receivedArguments;
  return {
    fn: (...args) => (receivedArguments = args),
    receivedArguments: () => receivedArguments,
    receivedArgument: (n) => receivedArguments[n]
  };
};

describe("CustomerForm", () => {
  const originalFetch = global.fetch;
  let fetchSpy;
  const blankCustomer = {
    firstName: "",
    lastName: "",
    phoneNumber: ""
  };

  beforeEach(() => {
    initializeReactContainer();
    fetchSpy = spy();
    global.fetch = fetchSpy.fn;
  });

  afterEach(() => {
    global.fetch = originalFetch;
  });

  it("renders a form", () => {
    render(<CustomerForm original={blankCustomer} />);
    expect(form()).not.toBeNull();
  });

  const itRendersAsATextBox = (fieldName) =>
    it("renders as a text box", () => {
      render(<CustomerForm original={blankCustomer} />);
      expect(field(fieldName)).toBeInputFieldOfType("text");
    });

  const itIncludesTheExistingValue = (fieldName, existing) =>
    it("includes the existing value", () => {
      const customer = { [fieldName]: existing };
      render(<CustomerForm original={customer} />);
      expect(field(fieldName).value).toEqual(existing);
    });

  const itRendersALabel = (fieldName, text) => {
    it("renders a label", () => {
      render(<CustomerForm original={blankCustomer} />);
      expect(labelFor(fieldName)).not.toBeNull();
    });

    it(`renders ${fieldName} as the label content`, () => {
      render(<CustomerForm original={blankCustomer} />);
      expect(labelFor(fieldName)).toContainText(text);
    });
  };

  const itAssignsAnIdThatMatchesTheLabelId = (fieldName) =>
    it("assigns an id that matches the label id", () => {
      render(<CustomerForm original={blankCustomer} />);
      expect(field(fieldName).id).toEqual(fieldName);
    });

  const itSubmitsNewValue = (fieldName, value) =>
    it("saves new value when submitted", () => {
      render(<CustomerForm original={blankCustomer} />);
      change(field(fieldName), value);
      click(submitButton());
      expect(fetchSpy).toBeCalledWith(
        expect.anything(),
        expect.objectContaining({
          body: JSON.stringify({ ...blankCustomer, [fieldName]: value })
        })
      );
    });

  const itSubmitsExistingValue = (fieldName, value) =>
    it("saves existing value when submitted", () => {
      const customer = { [fieldName]: value };
      render(<CustomerForm original={customer} />);
      click(submitButton());
      expect(fetchSpy).toBeCalledWith(
        expect.anything(),
        expect.objectContaining({
          body: JSON.stringify(customer)
        })
      );
    });

  describe("first name field", () => {
    itRendersAsATextBox("firstName");
    itAssignsAnIdThatMatchesTheLabelId("firstName");
    itIncludesTheExistingValue("firstName", "David");
    itRendersALabel("firstName", "First name");
    itSubmitsExistingValue("firstName", "David");
    itSubmitsNewValue("firstName", "Jamie");
  });

  describe("last name field", () => {
    itRendersAsATextBox("lastName");
    itAssignsAnIdThatMatchesTheLabelId("lastName");
    itIncludesTheExistingValue("lastName", "Jones");
    itRendersALabel("lastName", "Last name");
    itSubmitsExistingValue("lastName", "Jones");
    itSubmitsNewValue("lastName", "Carters");
  });

  describe("phone number field", () => {
    itRendersAsATextBox("phoneNumber");
    itAssignsAnIdThatMatchesTheLabelId("phoneNumber");
    itIncludesTheExistingValue("phoneNumber", "012345");
    itRendersALabel("phoneNumber", "Phone number");
    itSubmitsExistingValue("phoneNumber", "012345");
    itSubmitsNewValue("phoneNumber", "345678");
  });

  it("renders a submit button", () => {
    render(<CustomerForm original={blankCustomer} />);
    expect(submitButton()).not.toBeNull();
  });

  it("prevents the default action when submitting the form", () => {
    render(<CustomerForm original={blankCustomer} onSubmit={() => {}} />);
    const event = submit(form());
    expect(event.defaultPrevented).toBe(true);
  });

  it("sends request to POST /customers when submitting the form", () => {
    render(<CustomerForm original={blankCustomer} onSubmit={() => {}} />);
    click(submitButton());
    expect(fetchSpy).toBeCalledWith(
      "/customers",
      expect.objectContaining({ method: "POST" })
    );
  });

  it("calls fetch with the right configuration", () => {
    render(<CustomerForm original={blankCustomer} onSubmit={() => {}} />);
    click(submitButton());
    expect(fetchSpy).toBeCalledWith(
      expect.anything(),
      expect.objectContaining({
        credentials: "same-origin",
        headers: {
          "Content-Type": "application/json"
        }
      })
    );
  });
});
