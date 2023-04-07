import bodyParser from "body-parser";
import express from "express";

import routes from "../routes/v1/index";

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get("/", (req, res) => res.send("ehehe"));

app.use(routes);

app.listen(3000, () => console.log("server running on port 3000"));
