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
