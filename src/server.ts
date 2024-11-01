import express, { Request, Response } from "express";

const app = express();

//testing route
app.get("/", (req: Request, res: Response) => {
  res.send("This is PH Health Care server");
});

app.listen(5000, () => {
  console.log(`server running at @5000`);
});
