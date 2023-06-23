import { experiments } from "webpack";
import { toHaveClass } from "./toHaveClass";

describe("toHaveClass matcher", () => {
  const stripTerminalColor = (text) => text.replace(/\x1B\[\d+m/g, "");

  it("returns pass is true when class is found in the given DOM element", () => {
    const domElement = {
      className: "testClass"
    };
    const result = toHaveClass(domElement, "testClass");
    expect(result.pass).toBe(true);
  });

  it("returns pass is false when the class is not found in the given DOM element", () => {
    const domElement = {
      className: ""
    };
    const result = toHaveClass(domElement, "testClass");
    expect(result.pass).toBe(false);
  });

  it("returns a message that contains the source line if no match", () => {
    const domElement = {
      className: ""
    };
    const result = toHaveClass(domElement, "testClass");
    expect(stripTerminalColor(result.message())).toContain(
      `expect(element).toHaveClass("testClass")`
    );
  });

  it("returns a message that contains the source line if negated match", () => {
    const domElement = {
      className: "testClass"
    };
    const result = toHaveClass(domElement, "testClass");
    expect(stripTerminalColor(result.message())).toContain(
      `expect(element).not.toHaveClass("testClass")`
    );
  });
});
