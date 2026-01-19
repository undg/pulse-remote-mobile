import { act, renderHook, waitFor } from "@testing-library/react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useConfig } from "./storage";

const SERVER_KEY = "pr-rn-config";

function renderConfig() {
  return renderHook(() => useConfig());
}

describe("useConfig", () => {
  beforeEach(async () => {
    await AsyncStorage.clear();
  });

  it("loads defaults and derives serverUrl", async () => {
    const { result } = renderConfig();
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.config.hostname).toBe("192.168.1.244");
    expect(result.current.serverUrl).toBe("ws://192.168.1.244:8448/api/v1/ws");
    expect(result.current.hasUrl).toBe(true);
  });

  it("saves overrides and derives URL", async () => {
    const { result } = renderConfig();
    await waitFor(() => expect(result.current.loading).toBe(false));

    await act(async () => {
      result.current.updateConfig({
        hostname: "example.com",
        port: "9000",
        endpoint: "/foo",
      });
    });

    const stored = await AsyncStorage.getItem(SERVER_KEY);
    expect(stored).toContain("example.com");
    expect(result.current.serverUrl).toBe("ws://example.com:9000/foo");
    expect(result.current.config.hostname).toBe("example.com");
  });

  it("resets to defaults", async () => {
    const { result } = renderConfig();
    await waitFor(() => expect(result.current.loading).toBe(false));

    await act(async () => {
      result.current.updateConfig({ hostname: "example.com" });
    });

    await act(async () => {
      result.current.resetConfig();
    });

    expect(result.current.config.hostname).toBe("192.168.1.244");
    expect(result.current.serverUrl).toBe("ws://192.168.1.244:8448/api/v1/ws");
    const stored = await AsyncStorage.getItem(SERVER_KEY);
    expect(stored).not.toContain("example.com");
  });
});
