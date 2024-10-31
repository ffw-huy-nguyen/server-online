import fetch, { RequestInfo, RequestInit } from "node-fetch";
import {
  getLowestPriorityOnlineServer,
  Server,
} from "./getLowestPriorityOnlineServer";

jest.mock("node-fetch");

const { Response: MockResponse } = jest.requireActual("node-fetch");

describe("getLowestPriorityOnlineServer", () => {
  beforeEach(() => {
    (fetch as jest.MockedFunction<typeof fetch>).mockClear();
  });

  it("should return the online server with the lowest priority", async () => {
    const servers: Server[] = [
      { url: "https://does-not-work.perfume.new", priority: 1 },
      { url: "https://gitlab.com", priority: 4 },
      { url: "http://app.scnt.me", priority: 3 },
      { url: "https://offline.scentronix.com", priority: 2 },
    ];

    (fetch as jest.MockedFunction<typeof fetch>).mockImplementation(
      (url: RequestInfo, init?: RequestInit) => {
        if (url === "https://does-not-work.perfume.new") {
          return Promise.resolve(new MockResponse(null, { status: 500 }));
        } else if (url === "https://gitlab.com") {
          return Promise.resolve(new MockResponse(null, { status: 200 }));
        } else if (url === "http://app.scnt.me") {
          return Promise.resolve(new MockResponse(null, { status: 200 }));
        } else if (url === "https://offline.scentronix.com") {
          return Promise.resolve(new MockResponse(null, { status: 200 }));
        }
        return Promise.reject(new Error("Network error"));
      }
    );

    const result = await getLowestPriorityOnlineServer(servers);
    expect(result).toEqual({
      url: "https://offline.scentronix.com",
      priority: 2,
    });
  });

  it("should throw an error if no servers are online", async () => {
    const servers: Server[] = [
      { url: "https://does-not-work.perfume.new", priority: 1 },
      { url: "https://gitlab.com", priority: 4 },
    ];

    (fetch as jest.MockedFunction<typeof fetch>).mockImplementation(
      (url: RequestInfo, init?: RequestInit) =>
        Promise.resolve(new MockResponse(null, { status: 500 }))
    );

    await expect(getLowestPriorityOnlineServer(servers)).rejects.toThrow(
      "No servers are online"
    );
  });
});
