import fetch, { Response } from "node-fetch";

export interface Server {
  url: string;
  priority: number;
}

async function checkServer(server: Server): Promise<Server | null> {
  try {
    const response: Response = await fetch(server.url, {
      method: "GET",
      timeout: 5000,
    });
    if (response.ok) {
      return server;
    }
  } catch (error) {
    // Server is not online or request failed
  }
  return null;
}

export const getLowestPriorityOnlineServer = async (
  servers: Server[]
): Promise<Server> => {
  const serverChecks: Promise<Server | null>[] = servers.map((server) =>
    checkServer(server)
  );
  const results = await Promise.allSettled(serverChecks);

  const onlineServers: Server[] = results
    .filter(
      (result): result is PromiseFulfilledResult<Server | null> =>
        result.status === "fulfilled" && result.value !== null
    )
    .map((result) => result.value as Server);

  if (onlineServers.length === 0) {
    throw new Error("No servers are online");
  }

  onlineServers.sort((a, b) => a.priority - b.priority);
  return onlineServers[0];
};
