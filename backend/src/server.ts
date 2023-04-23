import { createServer } from "http";
import serverFunction from "./handler";

const PORT = 8000;

const server = createServer(serverFunction);
server.listen(PORT);

console.log("Node.js web server at port 8000 is running..");
