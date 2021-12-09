import "dotenv/config.js";
import { ExtendedClient } from "./structures/Client";

export const client = new ExtendedClient();

client.start();