import { render, screen } from "@testing-library/react-native";
import App from "../../../App";

jest.mock("@react-native-async-storage/async-storage", () =>
  require("@react-native-async-storage/async-storage/jest/async-storage-mock"),
);

describe("App tabs", () => {
  it("renders tabs and initial content", async () => {
    render(<App />);
    await screen.findByLabelText("Sinks, tab, 1 of 4");
    await screen.findByLabelText("Sources, tab, 2 of 4");
    await screen.findByLabelText("Config, tab, 3 of 4");
    await screen.findByLabelText("About, tab, 4 of 4");
    await screen.findByText("No sinks found.");
  });
});
