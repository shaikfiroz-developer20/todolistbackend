import LoginController from "../controllers/logincontroller.js";
import { Router } from "express";
const Loginroute=Router();

Loginroute.post('/login',LoginController);


export default Loginroute;