import React from "react";
import {
  initializeReactContainer,
  render,
  element,
  form,
  field,
  click,
  submit,
  submitButton,
  change,
  labelFor
} from "./reactTestExtensions";
import { CustomerForm } from "../src/CustomerForm";

describe("CustomerForm", () => {
  const blankCustomer = {
    firstName: "",
    lastName: "",
    phoneNumber: ""
  };

  beforeEach(() => {
    initializeReactContainer();
  });

  it("renders a form", () => {
    render(<CustomerForm original={blankCustomer} />);
    expect(form()).not.toBeNull();
  });

  const itRendersAsATextBox = (fieldName) =>
    it.skip("renders as a text box", () => {
      render(<CustomerForm original={blankCustomer} />);
      //expect(field(fieldName)).not.toBeNull();
      //expect(field(fieldName).tagName).toEqual("INPUT");
      //expect(field(fieldName).type).toEqual("text");
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

  const itSavesNewValue = (fieldName, value) =>
    it("saves new value when submitted", () => {
      expect.hasAssertions();
      render(
        <CustomerForm
          original={blankCustomer}
          onSubmit={(props) => expect(props[fieldName]).toEqual(value)}
        />
      );
      change(field(fieldName), value);
      click(submitButton());
    });

  const itSavesExistingValue = (fieldName, value) =>
    it("saves existing value when submitted", () => {
      expect.hasAssertions();
      const customer = { [fieldName]: value };
      render(
        <CustomerForm
          original={customer}
          onSubmit={(props) => expect(props[fieldName]).toEqual(value)}
        />
      );
      click(submitButton());
    });

  describe("first name field", () => {
    itRendersAsATextBox("firstName");
    itAssignsAnIdThatMatchesTheLabelId("firstName");
    itIncludesTheExistingValue("firstName", "David");
    itRendersALabel("firstName", "First name");
    itSavesExistingValue("firstName", "David");
    itSavesNewValue("firstName", "Jamie");
  });

  describe("last name field", () => {
    itRendersAsATextBox("lastName");
    itAssignsAnIdThatMatchesTheLabelId("lastName");
    itIncludesTheExistingValue("lastName", "Jones");
    itRendersALabel("lastName", "Last name");
    itSavesExistingValue("lastName", "Jones");
    itSavesNewValue("lastName", "Carters");
  });

  describe("phone number field", () => {
    itRendersAsATextBox("phoneNumber");
    itAssignsAnIdThatMatchesTheLabelId("phoneNumber");
    itIncludesTheExistingValue("phoneNumber", "012345");
    itRendersALabel("phoneNumber", "Phone number");
    itSavesExistingValue("phoneNumber", "012345");
    itSavesNewValue("phoneNumber", "345678");
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
});
