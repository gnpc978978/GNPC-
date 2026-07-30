import mongoose, { Schema } from "mongoose";


const eventSchema = new Schema(
{
 title:{
   type:String,
   required:true
 },

 banner:{
   type:String,
   required:true
 },

 gallery:[
   {
     type:String
   }
 ],

 description:{
   type:String,
   required:true
 },

 location:{
   type:String,
   required:true
 },

 date:{
   type:Date,
   required:true
 },

 status:{
   type:String,
   enum:[
     "draft",
     "published"
   ],
   default:"draft"
 },

 slug:{
   type:String,
   trim:true,
   unique:true,
   sparse:true
 },

 isActive:{
   type:Boolean,
   default:true
 }

},
{
 timestamps:true
}
);

const Event =
  mongoose.models.Event ||
  mongoose.model(
    "Event",
    eventSchema
  );


export default Event;
