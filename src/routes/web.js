import express from "express";
import homepageController from "../controllers/homepageController.js";
import chatBotController from "../controllers/chatBotController.js";

let router = express.Router();

let initWebRoutes = (app) => {
  router.get("/", homepageController.getHomePage);
  router.get("/webhook", chatBotController.getWebhook);
  router.post("/webhook", chatBotController.postWebhook);

  return app.use("/", router);
};

export default initWebRoutes;
