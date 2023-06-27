import { toContainText } from "./machers/toContainText";
import { toHaveClass } from "./machers/toHaveClass";
import { toBeInputFieldOfType } from "./machers/toBeInputFieldOfType";
expect.extend({ toContainText, toHaveClass, toBeInputFieldOfType });
