import express from "express";
import bodyParser from "body-parser";

import router from "../routes/v1/index";

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.listen(3000, () => console.log("server running on port 3000"));

app.use(router);
