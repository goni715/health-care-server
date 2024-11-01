import express, { Application, Request, Response } from 'express';
import cors from 'cors';


const app : Application = express();



//middleware implementation
app.use(cors())




//testing route
app.get("/", (req: Request, res: Response) => {
    res.send("This is PH Health Care server");
});


export default app;