import Signupcontroller from "../controllers/signupcontroller.js";
import { Router } from "express";
const route=Router();


route.post("/signup",Signupcontroller);

export default route;