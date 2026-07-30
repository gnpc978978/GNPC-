import mongoose, {Schema, Document} from "mongoose";


export interface IUser extends Document{

name:string;

username?: string;

email:string;

password:string;

role:"SUPER_ADMIN"|"ADMIN";

status:"ACTIVE"|"INACTIVE";

profileImage?:string;

phone?: string;

resetOtpHash?: string;
resetOtpExpiresAt?: Date;
resetOtpAttempts?: number;
resetTokenHash?: string;
resetTokenExpiresAt?: Date;
lastLogin?: Date;

}


const UserSchema = new Schema<IUser>(

{

name:{
type:String,
required:true
},


email:{
type:String,
required:true,
unique:true
},


password:{
type:String,
required:true
},


role:{
type:String,
enum:[
"SUPER_ADMIN",
"ADMIN"
],
default:"ADMIN"
},


status:{
type:String,
enum:[
"ACTIVE",
"INACTIVE"
],
default:"ACTIVE"
},


profileImage:{
type:String
},

username: {
type: String,
unique: true,
sparse: true,
trim: true,
lowercase: true,
},

phone: {
type: String,
unique: true,
sparse: true,
trim: true,
},

resetOtpHash: {
type: String,
select: false,
},

resetOtpExpiresAt: {
type: Date,
select: false,
},

resetOtpAttempts: {
type: Number,
select: false,
default: 0,
},

resetTokenHash: {
type: String,
select: false,
},

resetTokenExpiresAt: {
type: Date,
select: false,
},

lastLogin: {
type: Date,
},

},

{
timestamps:true
}

);



export default mongoose.model<IUser>(
"User",
UserSchema
);
