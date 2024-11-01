import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import { userRoutes } from './app/modules/User/user.routes';


const app : Application = express();



//middleware implementation
app.use(cors())



//testing route
app.get("/", (req: Request, res: Response) => {
    res.send("This is PH Health Care server");
});



//application routes
app.use('/api/v1/user', userRoutes);









export default app;