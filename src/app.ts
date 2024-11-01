import express, { Application, Request, Response } from "express";
import cors from "cors";
import { userRoutes } from "./app/modules/User/user.routes";
import morgan from "morgan";
import bodyParser from "body-parser";
import { AdminRoutes } from "./app/modules/Admin/admin.routes";

const app: Application = express();

//middleware implementation
app.use(cors());
app.use(morgan("dev"));



//RequestBodySizeIncrease//Body Parser Implementation
app.use(bodyParser.json({limit: '30mb'}));
app.use(bodyParser.urlencoded({limit: '30mb', extended: true}));

//testing route
app.get("/", (req: Request, res: Response) => {
  res.send("This is PH Health Care server");
});

//application routes
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/admin", AdminRoutes);


export default app;
