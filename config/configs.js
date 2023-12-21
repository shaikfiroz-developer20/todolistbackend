import express from "express"
import mongoose from "mongoose";
const app=express();
import cors from "cors";

app.use(express.json());
export  {app}