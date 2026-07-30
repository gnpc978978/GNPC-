import mongoose from "mongoose";


const connectDB = async()=>{


try{


const mongoUri = process.env.MONGO_URI;
if (!mongoUri) {
throw new Error("MONGO_URI is not configured");
}

await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 5000 });


console.log(
"MongoDB Connected"
);



}catch(error:any){


console.error("MongoDB connection failed:", error.message);
throw error;


}


};


export default connectDB;
