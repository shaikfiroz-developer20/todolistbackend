import filteredTasksOnDate from "../controllers/filteredtodoroute.js";

import { Router } from "express";
import corsMiddleware from "../middleware/middlewares.js";

const todofilterdateroute=Router();

todofilterdateroute.get("/filteredtasksondate",corsMiddleware,filteredTasksOnDate);


export default todofilterdateroute;