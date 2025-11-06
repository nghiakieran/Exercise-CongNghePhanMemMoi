import express from "express";

let configViewEngine = (app) => {
  app.use(express.static("./src/public")); // Thiết lập thư mục tĩnh chứa images, css,..
  app.set("view engine", "ejs"); // thiết lập view engine
  app.set("views", "./src/views"); // thư mục chứa views
}
module.exports = configViewEngine; // xuất hàm ra
