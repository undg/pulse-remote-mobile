import { render, screen, fireEvent } from "@testing-library/react-native";
import { LoadingOrError } from "./LoadingOrError";
import { ThemeProvider } from "../theme";

describe("LoadingOrError", () => {
  const renderWithTheme = (ui: React.ReactNode) =>
    render(<ThemeProvider>{ui}</ThemeProvider>);

  it("shows loading indicator", () => {
    renderWithTheme(<LoadingOrError loading />);
    expect(screen.getByText("Loading...")).toBeTruthy();
  });

  it("shows error message and retry", () => {
    const onRetry = jest.fn();
    renderWithTheme(<LoadingOrError error="Oops" onRetry={onRetry} />);
    expect(screen.getByText("Oops")).toBeTruthy();
    fireEvent.press(screen.getByText("Retry"));
    expect(onRetry).toHaveBeenCalled();
  });

  it("returns null when no state provided", () => {
    const { toJSON } = renderWithTheme(<LoadingOrError />);
    expect(toJSON()).toBeNull();
  });
});
