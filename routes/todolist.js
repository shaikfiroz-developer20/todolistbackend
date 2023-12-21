import Todolistofuser from "../controllers/todolistcontroller.js";
import { Router } from "express";
import corsMiddleware from "../middleware/middlewares.js";
import historyofuniquedatstasks from "../controllers/historyoftasks.js";

const todolistrouter=Router();



todolistrouter.post("/todolist",corsMiddleware,Todolistofuser);
todolistrouter.get("/gethistoryofdatestasksadded",corsMiddleware,historyofuniquedatstasks)


export default todolistrouter;