import { log } from "@repo/logger";
import { createServer } from "./server";

const port = process.env.PORT || 5001;
const server = createServer();

server.get("/", (req, res) => res.send("WOrking"));

server.listen(port, () => {
  log(`api running on ${port}`);
});
