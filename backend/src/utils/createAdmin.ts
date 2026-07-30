import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import User from "../models/User";


dotenv.config();



const createAdmin=async()=>{


await mongoose.connect(
process.env.MONGO_URI as string
);



const password =
await bcrypt.hash(
"Admin@123",
10
);



await User.create({

name:"Press Club Super Admin",

email:"admin@pressclub.com",

password,

role:"SUPER_ADMIN",

status:"ACTIVE"

});



console.log(
"Admin Created"
);


process.exit();


};



createAdmin();