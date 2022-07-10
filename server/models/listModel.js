import mongoose from "mongoose";

const listSchema = mongoose.Schema(
    {
        title: String,
        tasks: [{ type: mongoose.Schema.Types.ObjectID, ref: 'Tasks' }],
        broadKey: mongoose.Schema.Types.ObjectID
    },
    {
        collection: "lists",
        versionKey: false,
    },
    {
        timestamps: true
    }
)

export const ListModel = mongoose.model("Lists", listSchema)