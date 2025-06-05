import { corsMiddleware } from "./cors.middleware";
import { loggingMiddleware } from "./logging.middleware";
import { rateLimitMiddleware } from "./rateLimit.middleware";

export const registerCommonMiddilewware = (app: any): void => {
  app.use(loggingMiddleware);
  app.use(corsMiddleware);
  app.use(rateLimitMiddleware);
};
