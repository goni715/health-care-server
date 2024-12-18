import express, { Application, Request, Response } from "express";
import cors from "cors";
import morgan from "morgan";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import router from "./app/routes";
import globalErrorHandler from "./app/middlewares/globalErrorHandler";
import notFound from "./app/middlewares/notFound";
import { cancelUnpaidAppointmentService } from "./app/modules/Appointment/appointment.service";
import cron from 'node-cron';

const app: Application = express();

//middleware implementation
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
app.use(cookieParser())
app.use(morgan("dev"));



//RequestBodySizeIncrease//Body Parser Implementation
app.use(bodyParser.json({limit: '30mb'}));
app.use(bodyParser.urlencoded({limit: '30mb', extended: true}));



//automatic cancel unpaidAppointments
cron.schedule('* * * * *', async() => {
  try{
    await cancelUnpaidAppointmentService();
  }
  catch(err){
    console.error(err)
  }
  //console.log('running a task every minute');
});
cancelUnpaidAppointmentService();



//testing route
app.get("/", (req: Request, res: Response) => {
  res.send("This is PH Health Care server");
});

//application routes
app.use('/api/v1', router);


//global error handler middleware
app.use(globalErrorHandler)
app.use(notFound)


export default app;
