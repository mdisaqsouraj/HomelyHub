import express from "express";
import { getProperties, getProperty } from "../Controllers/propertyController.js";

const propertyRouters = express.Router();

propertyRouters.route("/").get(getProperties);
propertyRouters.route("/:id").get(getProperty);
export{propertyRouters};