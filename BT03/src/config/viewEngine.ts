import express from "express";
import expressLayouts from "express-ejs-layouts";

const configViewEngine = (app: express.Application): void => {
  app.use(express.static("./src/public"));
  app.use(expressLayouts as any);
  app.set("view engine", "ejs");
  app.set("views", "./src/views");
  app.set("layout", "layout");
};

export default configViewEngine;
