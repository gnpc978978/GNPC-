import mongoose, { Schema } from "mongoose";


const newsSchema = new Schema(
{
    title:{
        type:String,
        required:true
    },

    description:{
        type:String,
        required:true
    },

    status:{
        type:String,
        default:"DRAFT"
    }

},
{
    timestamps:true
}
);


const News = mongoose.model(
"News",
newsSchema
);


export default News;