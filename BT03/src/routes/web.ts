import express, { Express, Router } from "express";
import homeController from "../controllers/homeController";

const router = Router();

const initWebRoutes = (app: Express): void => {
  // Test route
  router.get("/", (req, res) => {
    res.send("Le chi nghia");
  });

  // Home and About routes
  router.get("/home", homeController.getHomePage);
  router.get("/about", homeController.getAboutPage);

  // CRUD routes
  router.get("/crud", homeController.getCRUD);
  router.post("/post-crud", homeController.postCRUD);
  router.get("/get-crud", homeController.getFindAllCrud);
  router.get("/edit-crud", homeController.getEditCRUD);
  router.post("/put-crud", homeController.putCRUD);
  router.get("/delete-crud", homeController.deleteCRUD);

  app.use("/", router);
};

export default initWebRoutes;
