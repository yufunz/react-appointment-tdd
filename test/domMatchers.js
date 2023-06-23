import { toContainText } from "./machers/toContainText";
import { toHaveClass } from "./machers/toHaveClass";
expect.extend({ toContainText, toHaveClass });
