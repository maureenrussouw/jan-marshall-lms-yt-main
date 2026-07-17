import "server-only";
import arcjet, {
  fixedWindow,
  detectBot,
  protectSignup,
  shield,
  slidingWindow,
} from "@arcjet/next";
import { env } from "./env";

export { fixedWindow, detectBot, protectSignup, shield, slidingWindow };

const isDevelopment = env.ARCJET_ENV === "development";

export default arcjet({
  key: env.ARCJET_KEY,
  characteristics: ["fingerprint"],
  rules: [
    shield({
      mode: isDevelopment ? "DRY_RUN" : "LIVE",
    }),
  ],
});
