import mongoose from "mongoose";

const taskSchema = mongoose.Schema({
    title: String,
    listKey: mongoose.Schema.Types.ObjectId,
    },
    {
        collection: "tasks",
        versionKey: false,
    },
    {
        timestamps: true
    }
)

export const TaskModel = mongoose.model("Tasks", taskSchema)