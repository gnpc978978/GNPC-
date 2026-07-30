import { Request, Response } from "express";
import Event from "../models/event.model";
import mongoose from "mongoose";
import { deleteCloudinaryAssets } from "../utils/cloudinaryCleanup";


// Create Event
export const createEvent = async (
  req: Request,
  res: Response
) => {
  try {

    const event = await Event.create({
      ...req.body,
      slug: req.body.slug || `${req.body.title.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}-${Date.now().toString(36)}`,

      banner: req.files
        ? (req.files as any).banner?.[0]?.path || ""
        : "",

      gallery: req.files
        ? (req.files as any).gallery?.map(
            (file:any)=>file.path
          )
        : [],
    });


    res.status(201).json({
      success:true,
      message:"Event created successfully",
      data:event,
    });


  } catch(error){

    res.status(500).json({
      success:false,
      message:"Failed to create event",
    });

  }
};



// Get All Events
export const getEvents = async (
  req:Request,
  res:Response
)=>{

  try{

    const {search,status}=req.query;


    const filter:any={};


    if(search){

      filter.title={
        $regex:search,
        $options:"i",
      };

    }


    if(status){

      filter.status=status;

    }



    const events = await Event.find(filter)
    .sort({
      createdAt:-1,
    });



    res.status(200).json({

      success:true,

      count:events.length,

      data:events,

    });



  }catch(error){

    res.status(500).json({

      success:false,

      message:"Failed to fetch events",

    });

  }

};




// Get Single Event
export const getEvent = async(
 req:Request,
 res:Response
)=>{

try{


const event = await Event.findOne(
 mongoose.isValidObjectId(req.params.id)
  ? { $or: [{ _id: req.params.id }, { slug: req.params.id }] }
  : { slug: req.params.id }
);


if(!event){

return res.status(404).json({

success:false,

message:"Event not found",

});

}

res.status(200).json({

success:true,

data:event,

});



}catch(error){

res.status(500).json({

success:false,

message:"Failed to fetch event",

});

}


};





// Update Event
export const updateEvent = async(
 req:Request,
 res:Response
)=>{

try{

const existingEvent = await Event.findById(req.params.id);

if(!existingEvent){
return res.status(404).json({
success:false,
message:"Event not found",
});
}


const data:any={
 ...req.body,
};

const files:any = req.files || {};



if(req.files){


if(files.banner){

data.banner =
files.banner[0].path;

}



if(files.gallery){

data.gallery =
files.gallery.map(
(file:any)=>file.path
);

}


}




const event =
await Event.findByIdAndUpdate(

req.params.id,

data,

{

returnDocument: "after",

runValidators:true,

}

);



if(files?.banner && existingEvent.banner !== event!.banner){
await deleteCloudinaryAssets([existingEvent.banner]);
}

if(files?.gallery?.length){
await deleteCloudinaryAssets(existingEvent.gallery);
}



res.status(200).json({

success:true,

message:"Event updated successfully",

data:event,

});



}catch(error){


res.status(500).json({

success:false,

message:"Failed to update event",

});


}


};






// Delete Event
export const deleteEvent = async(
 req:Request,
 res:Response
)=>{


try{


const event =
await Event.findByIdAndDelete(
 req.params.id
);



if(!event){

return res.status(404).json({

success:false,

message:"Event not found",

});

}

await deleteCloudinaryAssets([
 event.banner,
 ...event.gallery,
]);



res.status(200).json({

success:true,

message:"Event deleted successfully",

});



}catch(error){


res.status(500).json({

success:false,

message:"Failed to delete event",

});


}


};
