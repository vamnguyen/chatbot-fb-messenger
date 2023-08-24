import express from "express";
import homepageController from "../controllers/homepageController.js";
import chatBotController from "../controllers/chatBotController.js";

let router = express.Router();

let initWebRoutes = (app) => {
  router.get("/", homepageController.getHomePage);

  // setup get_started button, whitelisted domain
  router.post("/setup-profile", chatBotController.setupProfile);

  // setup persistent menu
  router.post("/setup-persistent-menu", chatBotController.setupPersistentMenu);

  router.get("/webhook", chatBotController.getWebhook);
  router.post("/webhook", chatBotController.postWebhook);

  return app.use("/", router);
};

export default initWebRoutes;
