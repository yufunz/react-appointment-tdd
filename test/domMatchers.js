import { toContainText } from "./machers/toContainText";
import { toHaveClass } from "./machers/toHaveClass";
import { toBeInputFieldOfType } from "./machers/toBeInputFieldOfType";
import { toBeElementWithTag } from "./machers/toBeElementWithTag";

expect.extend({
  toContainText,
  toHaveClass,
  toBeInputFieldOfType,
  toBeElementWithTag
});

expect.extend({
  toBeCalled(received) {
    if (received.receivedArguments() === undefined) {
      return {
        pass: false,
        message: () => "Spy was not called."
      };
    }
    return {
      pass: true,
      message: () => "Spy was called."
    };
  }
});

expect.extend({
  toBeCalledWith(received, ...expectedArguments) {
    if (received.receivedArguments() === undefined) {
      return {
        pass: false,
        message: () => "Spy was not called."
      };
    }
    const notMatch = !this.equals(
      received.receivedArguments(),
      expectedArguments
    );
    if (notMatch) {
      return {
        pass: false,
        message: () =>
          "Spy called with the wrong arguments: " +
          received.receivedArguments() +
          "."
      };
    }
    return {
      pass: true,
      message: () => "Spy was called."
    };
  }
});
