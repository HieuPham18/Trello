import { ListModel } from "../../../TodoList/Server/models/todoModel.js"
import { BroadModel } from "../models/broadModel.js"
import { TaskModel } from "../models/taskModel.js"

export const getAllBroad = async (req, res) => {
    try {
        const broads = await BroadModel.find().populate({
            path: 'lists',
            model: 'Lists',
            populate: {
                path: 'tasks',
                model: 'Tasks'
            }
        })
        res.status(200).send(broads)
    } catch (error) {
        res.status(500).json({ msg: error })
    }
}

export const postBroad = async (req, res) => {
    try {
        const data = req.body
        const broad = new BroadModel(data)
        broad.save()
        res.status(200).send(broad)
    } catch (error) {
        res.status(500).json({ msg: error })
    }
}

export const updateBroad = async (req, res) => {
    try {
        const idBroad = req.params.id
        const dataUpdate = req.body
        console.log("data", dataUpdate)
        const broadUpdate = await BroadModel.findByIdAndUpdate(idBroad, dataUpdate, { new: true })
        res.status(200).json(broadUpdate);
    } catch (error) {
        res.status(500).json({ msg: error });
    }
}