import Gettasks from "../controllers/gettasksdata.js";
import { Router } from "express";
import corsMiddleware from "../middleware/middlewares.js";

const gettaskroute=Router();
  

gettaskroute.get('/tasks',corsMiddleware,Gettasks);

export default gettaskroute;