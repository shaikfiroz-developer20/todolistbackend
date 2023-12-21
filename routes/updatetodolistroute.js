
import UpdateTodo from "../controllers/updatetodolistcontroller.js";
import corsMiddleware from "../middleware/middlewares.js";
import { Router} from "express";
import DeleteTask from "../controllers/deletetaskcontroller.js";

const updatetodolistroute=Router();

updatetodolistroute.put("/updatetodolistroute",corsMiddleware,UpdateTodo);
updatetodolistroute.delete("/deletetask",corsMiddleware,DeleteTask);


export default updatetodolistroute;