import { createActivity } from "../services/activity.service";
import { Request, Response } from "express";
import PressRelease from "../models/pressRelease.model";
import mongoose from "mongoose";
import { deleteCloudinaryAssets } from "../utils/cloudinaryCleanup";


// CREATE PRESS RELEASE

export const createPressRelease = async(
req:Request,
res:Response
)=>{

try{

const {
title,
slug,
content,
category,
status,
image
}=req.body;

const pressRelease = await PressRelease.create({

title,
slug,
content,
category,
status,

image:req.file
? (req.file as any).path
: undefined,

createdBy:(req as any).user.id

});

await createActivity({
  user: (req as any).user.id,
  action: "CREATE",
  module: "PRESS_RELEASE",
  description: `Created press release "${pressRelease.title}"`,
});
  
res.status(201).json({
success:true,
message:"Press Release Created",
data:pressRelease
});


}
catch(error:any){

res.status(500).json({
success:false,
message:error.message
});

}

};



// GET ALL PRESS RELEASES

export const getPressReleases = async(
req:Request,
res:Response
)=>{

try{

const pressReleases = await PressRelease
.find()
.populate("createdBy","name email")
.sort({
createdAt:-1
});


res.json({

success:true,
data:pressReleases

});


}
catch(error:any){

res.status(500).json({
success:false,
message:error.message
});

}

};



// GET SINGLE PRESS RELEASE

export const getSinglePressRelease = async(
req:Request,
res:Response
)=>{

try{

const pressRelease = await PressRelease.findOne(
  mongoose.isValidObjectId(req.params.id)
    ? { $or: [{ _id: req.params.id }, { slug: req.params.id }] }
    : { slug: req.params.id }
);


if(!pressRelease){

return res.status(404).json({
success:false,
message:"Press Release Not Found"
});

}


res.json({
success:true,
data:pressRelease
});


}
catch(error:any){

res.status(500).json({
success:false,
message:error.message
});

}

};



// UPDATE PRESS RELEASE

export const updatePressRelease = async(
req:Request,
res:Response
)=>{

try{

const existingPressRelease = await PressRelease.findById(req.params.id);

if (!existingPressRelease) {
return res.status(404).json({
success:false,
message:"Press Release Not Found"
});
}

const updateData = {
...req.body,
...(req.file ? { image: (req.file as any).path } : {}),
};

const pressRelease = await PressRelease.findByIdAndUpdate(
req.params.id,
updateData,
{
returnDocument: "after",
runValidators:true,
}
);

if (req.file && existingPressRelease.image !== pressRelease!.image) {
await deleteCloudinaryAssets([existingPressRelease.image]);
}

res.json({

success:true,
message:"Press Release Updated",
data:pressRelease

});


}
catch(error:any){

res.status(500).json({
success:false,
message:error.message
});

}

};



// DELETE PRESS RELEASE

export const deletePressRelease = async(
req:Request,
res:Response
)=>{

try{

const pressRelease = await PressRelease.findByIdAndDelete(
req.params.id
);

if(!pressRelease){

return res.status(404).json({
success:false,
message:"Press Release Not Found"
});

}

await deleteCloudinaryAssets([pressRelease.image]);


res.json({

success:true,
message:"Press Release Deleted"

});


}
catch(error:any){

res.status(500).json({
success:false,
message:error.message
});

}

};
