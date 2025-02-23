import { createRouteHandler } from "uploadthing/next-legacy";
import { ourFileRouter } from "@/server/uploadthing";

const uploadThingToken = process.env.UPLOADTHING_TOKEN;

if (!uploadThingToken) {
  throw new Error("UPLOADTHING_TOKEN is not set in .env");
}

export default createRouteHandler({
  router: ourFileRouter,
});