const express=require("express");
const app=express();
const mongoose=require("mongoose");
app.use(express.json());
const bcrypt=require("bcryptjs");
var cors = require("cors");
const jwt=require('jsonwebtoken');
const mongoUrl=
 "mongodb+srv://nethrasuresh26:Nethra25@cluster0.09zqw.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

 const JWT_SECRET="dhjlhiy8y7i608uihlkhbjfjgkhknlih/lihjt76[[p]p"
mongoose.connect(mongoUrl).then(()=>{
    console.log("Done");
}).catch((e) => {
    console.log(e);
});

require('./UserDetails');
require('./AnimalDetails');

const User=mongoose.model("UserInfo");
const Animal=mongoose.model("AnimalInfo");

app.use(cors());
const allowedOrigins = [
  "https://cloudscript-one.vercel.app",
  "http://192.168.0.150:5005"
];

// app.use(
//   cors({
//     origin: function (origin, callback) {
//       if (!origin || allowedOrigins.includes(origin)) {
//         callback(null, true);
//       } else {
//         callback(new Error("Not allowed by CORS"));
//       }
//     },
//     credentials: true,
//   })
// );


app.get("/",(req,res)=> {
    res.send({status:"started"})

})

app.post('/register',async(req,res)=>{
    const {name,email,mobile,password,userType}=req.body;
    const oldUser= await User.findOne({email:email});
    if(oldUser){
        return res.send({data: "User already exists"})
    }

    const encryptedPassword=await bcrypt.hash(password,10);
    try{
        await User.create({
            name:name,
            email:email,
            mobile,
            password: encryptedPassword,
            userType
        });
        res.send({status:"ok",data:"User created"});
    }
    catch(error){
        res.send({status:"error",data: error});
    }
});

app.post("/login-user",async(req,res)=>{
    const {email,password}=req.body;
    const oldUser=await User.findOne({email:email});

    if(!oldUser){
        return res.send({data:"User does not exist"})
    }

    if(await bcrypt.compare(password,oldUser.password)){
        const token=jwt.sign({email:oldUser.email},JWT_SECRET);

        if(res.status(200)){
            return res.send({status: "ok", data: token,userType:oldUser.userType});
        } else {
            return res.send({error:"error"});
        }
    }
})

app.post("/userdata",async(req,res)=>{
    const {token}=req.body;
    try{
        const user =jwt.verify(token,JWT_SECRET);
        const useremail=user.email;
        User.findOne({email:useremail}).then((data)=>{
            return res.send({status:"ok",data: data});
        })
    }
    catch(error){
        return res.send({error: error});
    }
})



app.post('/addanimal',async(req,res)=>{
    const { animalUID, breed, age, parity, name, fathersName, fullAddress, aadhaarNo, contactNo } = req.body;
  
    // Validate all required fields are provided
    if (!animalUID || !breed || age === undefined || parity === undefined || !name || !fathersName || !fullAddress || !aadhaarNo || !contactNo) {
      return res.status(400).json({ error: "All fields are required." });
    }
  
    try {
      // Create a new Animal instance
      const newAnimal = new Animal({
        animalUID,
        breed,
        age,
        parity,
        name,
        fathersName,
        fullAddress,
        aadhaarNo,
        contactNo
      });
  
      // Save the animal to the database
      const savedAnimal = await newAnimal.save();
  
      // Respond with the saved animal data
      res.status(201).json(savedAnimal);
    //   res.send({status : "ok"});
    } catch (error) {
      console.error("Error saving animal:", error);
      res.status(500).json({ error: "An error occurred while saving the animal data." });
    }
  });

  app.post("/animaldata",async(req,res)=>{
    const {token}=req.body;
    try{
        const animals = await Animal.find();
        if (animals.length === 0) {
            return res.status(404).json({ message: "No animals found." });
          }
          else{
            console.log(animals)
            res.send(animals);
          }
    }
    catch(error){
        return res.send({error: error});
    }
})




app.listen(8000,()=>{
    console.log("Node js server started");
})
