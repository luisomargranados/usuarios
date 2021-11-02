import express from "express";
import config from "./config/config";
import auth from "./routes/auth";

const app = express();

//setting
app.set('port', config.serverport);

//middlewares
app.use(express.json());
app.use(express.urlencoded({extended: false}));

app.use(auth);

export default app;