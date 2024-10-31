import {
  getLowestPriorityOnlineServer,
  Server,
} from "./getLowestPriorityOnlineServer";

// List of servers
const servers: Server[] = [
  {
    url: "https://does-not-work.perfume.new",
    priority: 1,
  },
  {
    url: "https://gitlab.com",
    priority: 4,
  },
  {
    url: "http://app.scnt.me",
    priority: 3,
  },
  {
    url: "https://offline.scentronix.com",
    priority: 2,
  },
];

// Get the online server with the lowest priority
(async () => {
  try {
    const result = await getLowestPriorityOnlineServer(servers);
    console.log(result);
  } catch (error) {
    console.error(error);
  }
  process.exit();
})();
