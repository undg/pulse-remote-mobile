import { renderHook, act } from "@testing-library/react-native";
import { useWebSocketClient } from "./client";

type WS = ReturnType<typeof createMockSocket>;

const createMockSocket = () => {
  const socket = {
    readyState: MockWebSocket.OPEN,
    onopen: undefined as (() => void) | undefined,
    onmessage: undefined as ((event: { data: string }) => void) | undefined,
    onclose: undefined as (() => void) | undefined,
    onerror: undefined as (() => void) | undefined,
    send: jest.fn(),
    close: jest.fn(),
    triggerOpen() {
      this.onopen?.();
    },
    triggerMessage(data: string) {
      this.onmessage?.({ data });
    },
    triggerError() {
      this.onerror?.();
    },
    triggerClose() {
      this.onclose?.();
    },
  };
  return socket;
};

class MockWebSocket {
  static OPEN = 1;
}

describe("useWebSocketClient", () => {
  const originalWebSocket = global.WebSocket;

  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
    global.WebSocket = originalWebSocket;
  });

  it("connects, parses JSON, and sends payloads", () => {
    const socket = createMockSocket();
    const factory = jest.fn(
      () => socket as unknown as WebSocket,
    ) as unknown as typeof WebSocket;
    (factory as any).OPEN = MockWebSocket.OPEN;
    global.WebSocket = factory;

    const { result } = renderHook(() =>
      useWebSocketClient({ url: "ws://test" }),
    );

    act(() => {
      socket.triggerOpen();
    });

    expect(result.current.status).toBe("Open");

    act(() => {
      socket.triggerMessage('{"hello":"world"}');
    });

    expect(result.current.lastJson).toEqual({ hello: "world" });

    act(() => {
      result.current.send("ping");
    });

    expect(socket.send).toHaveBeenCalledWith("ping");
    expect(factory).toHaveBeenCalledTimes(1);
  });

  it("reconnects after close using backoff", () => {
    const sockets: WS[] = [];
    global.WebSocket = Object.assign(
      jest.fn(() => {
        const next = createMockSocket();
        sockets.push(next);
        return next as unknown as WebSocket;
      }),
      { OPEN: MockWebSocket.OPEN },
    ) as unknown as typeof WebSocket;

    renderHook(() =>
      useWebSocketClient({
        url: "ws://reconnect",
        reconnectIntervalsMs: [50, 100],
        reconnect: true,
      }),
    );

    act(() => {
      sockets[0].triggerOpen();
    });
    expect(sockets[0].onclose).toBeDefined();

    act(() => {
      sockets[0].triggerError();
    });
    act(() => {
      sockets[0].triggerClose();
    });

    // first reconnect
    act(() => {
      jest.advanceTimersByTime(50);
    });
    expect(sockets.length).toBeGreaterThanOrEqual(2);
    expect(sockets.length).toBeLessThanOrEqual(3);

    // fire second close, ensure no unbounded reconnects
    act(() => {
      sockets[1].triggerError();
      sockets[1].triggerClose();
    });
    act(() => {
      jest.runOnlyPendingTimers();
    });

    expect(sockets.length).toBeLessThanOrEqual(3);
  });
});
