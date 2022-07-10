import mongoose from "mongoose";


const broadSchema = mongoose.Schema({
    title: String,
    lists: [{ type: mongoose.Schema.Types.ObjectID, ref: "Lists" }],
    broadKey: mongoose.Schema.Types.ObjectID
    },
    {
        collection: "broad",
        versionKey: false,
    },
    {
        timestamps: true
    }
)

export const BroadModel = mongoose.model("Broad", broadSchema)