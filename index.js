import express from "express";
import cookieParser  from "cookie-parser";
//Fix para __dirname
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
import {methods as authentication} from './app/controllers/authentication.controller.js'
import {methods as authorization} from './app/middlewares/authorization.js';

//server
const app = express();
app.set("port", 4000);
app.listen(app.get("port"));
console.log("Servidor corriendo en puerto", app.get("port"));

//configuracion
app.use(express.static(__dirname + "/public"));
app.use(express.json()); //para que los datos se envíen como json
app.use(cookieParser())
//rutas

app.use("/assets", express.static(path.resolve(__dirname,"assets")))
//poner authorization dependiendo del role
app.get("/login",authorization.soloPublico,(req, res)=> res.sendFile(__dirname + "/app/pages/login.html"))
app.get("/home",authorization.nuncaHome,(req, res)=> res.sendFile(__dirname + "/index.html"))
app.get("/register",authorization.soloPublico, (req, res)=> res.sendFile(__dirname + "/app/pages/register.html"))
app.get("/admin",authorization.soloAdmin, (req, res)=> res.sendFile(__dirname + "/app/pages/admin/admin.html"))
app.get("/manager",authorization.soloManager, (req, res)=> res.sendFile(__dirname + "/app/pages/manager.html"))
app.get("/cart",authorization.soloAdmin, (req, res)=> res.sendFile(__dirname + "/app/pages/cart/cart.html"))
app.post("/api/login",authentication.login)
app.post("/api/register",authentication.register)

