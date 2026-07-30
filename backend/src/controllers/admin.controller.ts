import { createActivity } from "../services/activity.service";
import {Request,Response} from "express";
import bcrypt from "bcryptjs";
import User from "../models/User";


// Get All Admins

export const getAdmins = async (
  req: Request,
  res: Response
) => {

  try {

    const search = typeof req.query.search === "string" ? req.query.search.trim() : "";
    const role = typeof req.query.role === "string" ? req.query.role : "";
    const status = typeof req.query.status === "string" ? req.query.status : "";
    const page = Math.max(Number(req.query.page) || 1, 1);
    const limit = Math.min(Math.max(Number(req.query.limit) || 20, 1), 100);
    const filter: any = {
      role:{
        $in:[
          "ADMIN",
          "SUPER_ADMIN"
        ]
      }
    };
    if (search) filter.$or = ["name", "username", "email"].map((field) => ({ [field]: { $regex: search, $options: "i" } }));
    if (["ADMIN", "SUPER_ADMIN"].includes(role)) filter.role = role;
    if (["ACTIVE", "INACTIVE"].includes(status)) filter.status = status;
    const [admins, total] = await Promise.all([User.find(filter)
    .select("-password")
    .sort({
      createdAt:-1
    }).skip((page - 1) * limit).limit(limit), User.countDocuments(filter)]);


    res.status(200).json({

      success:true,

      data:admins,
      pagination: { page, limit, total, pages: Math.max(Math.ceil(total / limit), 1) }

    });


  } catch(error:any) {


    res.status(500).json({

      success:false,

      message:"Failed to fetch admins"

    });


  }

};




// Create Admin

export const createAdmin = async(
req:Request,
res:Response
)=>{


try{


const {
name,
username,
email,
password,
role,
status
}=req.body;

if (!name || !email || !password || password.length < 8 || !["ADMIN", "SUPER_ADMIN"].includes(role || "ADMIN")) {
return res.status(400).json({ message:"Valid name, email, password, and role are required" });
}



const exists = await User.findOne({
 $or: [{ email: email.toLowerCase() }, ...(username ? [{ username: String(username).toLowerCase() }] : [])]
});


if(exists){

return res.status(400).json({

message:"Email already exists"

});

}



const hashPassword =
await bcrypt.hash(
password,
10
);



const admin = await User.create({

name,

username: username ? String(username).trim().toLowerCase() : undefined,

email,

password:hashPassword,

role:role || "ADMIN",

status:status === "INACTIVE" ? "INACTIVE" : "ACTIVE"

});

await createActivity({
    user: req.user.id,
    action: "CREATE",
    module: "ADMIN",
    description: `Created new admin ${admin.name}`
});


res.status(201).json({ success:true, message:"Admin Created", data: await User.findById(admin._id).select("-password") });


}
catch(error:any){

res.status(500).json({

message:error.message

});

}


};




// Update Admin

export const updateAdmin = async(
req:Request,
res:Response
)=>{


try{

const { name, username, email, role, status } = req.body;
const updates: Record<string, string> = {};

if (typeof name === "string" && name.trim()) updates.name = name.trim();
if (typeof email === "string" && email.trim()) updates.email = email.trim().toLowerCase();
if (typeof username === "string" && username.trim()) updates.username = username.trim().toLowerCase();
if (["ADMIN", "SUPER_ADMIN"].includes(role)) updates.role = role;
if (["ACTIVE", "INACTIVE"].includes(status)) updates.status = status;

if (Object.keys(updates).length === 0) {
return res.status(400).json({ message:"No valid admin fields supplied" });
}


const admin =
await User.findByIdAndUpdate(

req.params.id,

updates,

{
returnDocument: "after"
}

)
.select("-password");

if (!admin) {
return res.status(404).json({ message:"Admin not found" });
}



res.json({ success:true, message:"Admin Updated", data:admin });


}
catch(error:any){

res.status(500).json({

message:error.message

});

}


};




// Delete Admin

export const deleteAdmin = async(
req:Request,
res:Response
)=>{


try{

if (req.user.id === req.params.id) {
return res.status(400).json({ message:"You cannot delete your own account" });
}


const admin = await User.findByIdAndDelete(
req.params.id
);

if (!admin) {
return res.status(404).json({ message:"Admin not found" });
}



res.json({ success:true, message:"Admin Deleted" });


}
catch(error:any){

res.status(500).json({

message:error.message

});

}


};




// Change Status

export const changeStatus = async(
req:Request,
res:Response
)=>{


try{

if (!["ACTIVE", "INACTIVE"].includes(req.body.status)) {
return res.status(400).json({ message:"Invalid admin status" });
}

if (req.user.id === req.params.id && req.body.status === "INACTIVE") {
return res.status(400).json({ message:"You cannot deactivate your own account" });
}


const admin =
await User.findByIdAndUpdate(

req.params.id,

{
status:req.body.status
},

{
returnDocument: "after"
}

)
.select("-password");

if (!admin) {
return res.status(404).json({ message:"Admin not found" });
}



res.json({ success:true, message:"Status Updated", data:admin });


}
catch(error:any){

res.status(500).json({

message:error.message

});

}


};

export const getAdminById = async (req: Request, res: Response) => {
  try {
    const admin = await User.findById(req.params.id).select("-password");
    if (!admin || !["ADMIN", "SUPER_ADMIN"].includes(admin.role)) {
      return res.status(404).json({ success: false, message: "Admin not found" });
    }
    return res.status(200).json({ success: true, data: admin });
  } catch {
    return res.status(400).json({ success: false, message: "Invalid admin id" });
  }
};

export const resetAdminPassword = async (req: any, res: Response) => {
  try {
    if (req.user.id === req.params.id) return res.status(400).json({ success: false, message: "Use your account settings to change your own password." });
    const password = typeof req.body.password === "string" ? req.body.password : "";
    if (password.length < 8) return res.status(400).json({ success: false, message: "Password must be at least 8 characters." });
    const admin = await User.findByIdAndUpdate(req.params.id, { password: await bcrypt.hash(password, 12) }, { returnDocument: "after" }).select("-password");
    if (!admin) return res.status(404).json({ success: false, message: "Admin not found" });
    return res.json({ success: true, message: "Password reset successfully." });
  } catch { return res.status(500).json({ success: false, message: "Failed to reset password." }); }
};
