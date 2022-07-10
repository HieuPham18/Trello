import { BroadModel } from "../models/broadModel.js"
import { ListModel } from "../models/listModel.js"
import { TaskModel } from "../models/taskModel.js"

export const getAllList = async (req, res) => {
    try {
        const lists = await ListModel.find().populate("tasks")
        console.log("all list", lists)
        res.send(lists)
    } catch (error) {
        res.status(500).json({ msg: error });
    }
}


export const postList = async (req, res) => {
    const newList = req.body
    const broadKey = req.body.broadKey
    const list = new ListModel(newList)
    list.save()
        .then((item) => {
            BroadModel.findByIdAndUpdate(
                broadKey,
                { $push: { lists: item._id } },
                { new: true, useFindAndModify: false },
                (err) => {
                    if (err) {
                        return res.status(500).json({ success: false, msg: err.message });
                    }
                    res.status(200).json({ success: true, item });
                }
            );
        })
        .catch((err) => {
            res.status(500).json({ success: false, msg: err.message });
        });
}

export const getListById = async (req, res) => {
    try {
        const idList = req.params.id
        const list = await ListModel.findOne({ _id: idList })
        res.status(200).send(list)
    } catch (error) {
        res.status(500).send({ msg: error })
    }
}

export const deleteList = async (req, res) => {
    try {
        const { title, status, broadKey } = req.body;

        //Delete to in list
        const list = await BroadModel.findByIdAndUpdate(
            broadKey,
            {
                $pull: { lists: req.params.id },
            },
            { new: true }
        );

        if (!list) {
            return res.status(400).send("List not found");
        }

        console.log("id", req.params.id)

        // Delete todo in todos
        await TaskModel.deleteMany({ listKey: req.params.id })
        await ListModel.deleteOne({ _id: req.params.id });
        res.status(204).send();
    } catch {
        res.status(404);
        res.send({ error: "todo doesn't exist!" });
    }
}

export const updateList = async (req, res) => {
    try {
        const idList = req.params.id
        const dataUpdate = req.body
        const listUpdate = await ListModel.findByIdAndUpdate(idList, dataUpdate, { new: true })
        res.status(200).json(listUpdate);
    } catch (error) {
        res.status(500).json({ msg: error });
    }
}