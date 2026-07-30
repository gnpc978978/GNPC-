import mongoose, { Schema } from "mongoose";


const activitySchema = new Schema(
{
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },

    action: {
        type: String,
        required: true,
    },

    module: {
        type: String,
        required: true,
    },

    description: {
        type: String,
        required: true,
    },

},
{
    timestamps:true
}
);


const Activity = mongoose.model(
    "Activity",
    activitySchema
);


export default Activity;