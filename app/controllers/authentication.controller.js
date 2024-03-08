import bcryptjs from "bcryptjs";
import jsonwebtoken from "jsonwebtoken";
import dotenv from "dotenv"

dotenv.config();

const usuarios =[{
  user:"a",
  email:"a@a.com",
  password:"$2a$10$mpMJ2o96Vvo.AkcG8nnJjeZxgH.XCKN0kjROnl/aREBf0xDsxoufW",
  role:"admin"
}, {
  user:"b",
  email:"b@a.com",
  password:"$2a$10$7kgjxHAc3AVf.TefCDsudet8LuVv4GE9tpuTX.7CJyeajUPQdEac6",
  role:"user"
}
]

async function login(req,res){
  console.log(req.body);
  const user = req.body.user;
  const password = req.body.password;
  if(!user || !password){
    return res.status(400).send({status:"Error", message:"Faltan datos por ingresar"})
  }
  const usuarioARevisar = usuarios.find(usuario => usuario.user === user)
  if (!usuarioARevisar) {
    return res.status(400).send({status:"Error", message:"El usuario no existe"})
  }
  const loginCorrecto = await bcryptjs.compare(password, usuarioARevisar.password)
  console.log(usuarioARevisar.password)
  if(!loginCorrecto){
    return res.status(400).send({status:"Error", message:"La contraseña es incorrecta"})
  }
  const token = jsonwebtoken.sign(
    {user:usuarioARevisar.user},
    process.env.JWT_SECRET,
    {expiresIn:process.env.JWT_EXPIRATION});
  const cookieOption ={
    expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000),
    path: "/"
  }
  res.cookie("jwt", token, cookieOption);
  if(usuarioARevisar.role=="admin"){
    res.send({status:"ok",message:"Usuario loggeado", redirect:"/manager"})
  }else if(usuarioARevisar.role=="user"){
    res.send({status:"ok",message:"Usuario loggeado", redirect:"/admin"})
  }
}


async function register(req,res) {
  console.log(req.body);
  const user = req.body.user;
  const password = req.body.password;
  const  email = req.body.email;
  if(!user || !password || !email ){
    return res.status(400).send({status:"Error", message:"Faltan datos por ingresar"})
  }
  const emailARevisar = usuarios.find((usuario)=>usuario.email===email);
  if(emailARevisar){
    return res.status(400).send({status:"Error", message:"Este correo ya esta registrado"})
  }
  const salt= await bcryptjs.genSalt(10);
  const hashPassword=await bcryptjs.hash(password,salt);
  const nuevoUsuario={
    user, email, password:hashPassword
  }
  usuarios.push(nuevoUsuario);
  console.log(nuevoUsuario)
  return res.status(201).send({status: "Ok", message:`Usuario ${nuevoUsuario.user} agregado`, redirect:"/home"}) 
}

export const methods={
  login,
  register
}
export{
  usuarios
}