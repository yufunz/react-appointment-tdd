import React from "react";
import {
  initializeReactContainer,
  render,
  form,
  field,
  submit,
  submitButton,
  change,
  labelFor,
  clickAndWait,
  submitAndWait
} from "./reactTestExtensions";
import { CustomerForm } from "../src/CustomerForm";

const spy = () => {
  let returnValue;
  let receivedArguments;
  return {
    fn: (...args) => {
      receivedArguments = args;
      return returnValue;
    },
    receivedArguments: () => receivedArguments,
    receivedArgument: (n) => receivedArguments[n],
    stubReturnValue: (value) => (returnValue = value)
  };
};

const fetchResponseOk = (body) =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve(body)
  });

describe("CustomerForm", () => {
  const bodyOfLastFetchRequest = () =>
    JSON.parse(fetchSpy.receivedArgument(1).body);

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
    fetchSpy.stubReturnValue(fetchResponseOk({}));
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
    it("saves new value when submitted", async () => {
      render(<CustomerForm original={blankCustomer} onSave={() => {}} />);
      change(field(fieldName), value);
      await clickAndWait(submitButton());
      expect(bodyOfLastFetchRequest()).toMatchObject({
        [fieldName]: value
      });
    });

  const itSubmitsExistingValue = (fieldName, value) =>
    it("saves existing value when submitted", async () => {
      const customer = { [fieldName]: value };
      render(<CustomerForm original={customer} onSave={() => {}} />);
      await clickAndWait(submitButton());
      expect(bodyOfLastFetchRequest()).toMatchObject(customer);
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

  it("prevents the default action when submitting the form", async () => {
    render(<CustomerForm original={blankCustomer} onSave={() => {}} />);
    const event = await submitAndWait(form());
    expect(event.defaultPrevented).toBe(true);
  });

  it("sends request to POST /customers when submitting the form", async () => {
    render(<CustomerForm original={blankCustomer} onSave={() => {}} />);
    await clickAndWait(submitButton());
    expect(fetchSpy).toBeCalledWith(
      "/customers",
      expect.objectContaining({ method: "POST" })
    );
  });

  it("calls fetch with the right configuration", async () => {
    render(<CustomerForm original={blankCustomer} onSave={() => {}} />);
    await clickAndWait(submitButton());
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

  it("notifies onSave when form is submitted", async () => {
    const customer = { id: 123 };
    fetchSpy.stubReturnValue(fetchResponseOk(customer));
    const saveSpy = spy();
    render(<CustomerForm original={customer} onSave={saveSpy.fn} />);
    await clickAndWait(submitButton());
    expect(saveSpy).toBeCalledWith(customer);
  });
});
