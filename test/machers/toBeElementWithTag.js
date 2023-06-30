import { matcherHint, printExpected, printReceived } from "jest-matcher-utils";

export const toBeElementWithTag = (element, expectedTagName) => {
  const pass = element?.tagName === expectedTagName.toUpperCase();

  const actualText = () => `Actual: ${receivedText()}`;

  const receivedText = () => {
    if (!element || !element.tagName) {
      return "element was not found";
    }
    return `<${element.tagName.toLowerCase()}>`;
  };

  const sourceHint = () =>
    matcherHint(
      "toBeElementWithTag",
      "element",
      printExpected(expectedTagName),
      { isNot: pass }
    );

  const message = () => [sourceHint(), actualText()].join("\n\n");

  return { pass, message };
};
