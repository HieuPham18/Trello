import { TaskModel } from "../models/taskModel.js"
import { ListModel } from "../models/listModel.js"

export const getAllTask = async (req, res) => {
    try {
        const tasks = await TaskModel.find()
        console.log("all task", tasks)
        res.send(tasks)
    } catch (error) {
        res.status(500).json({ msg: err.message });
    }
}

export const postTask = async (req, res) => {
    const newTask = req.body
    const listKey = req.body.listKey
    const task = new TaskModel(newTask)
    task.save()
        .then((item) => {
            ListModel.findByIdAndUpdate(
                listKey,
                { $push: { tasks: item._id } },
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

export const getTaskById = async (req, res) => {
    try {
        const idTask = req.params.id
        const task = await TaskModel.findOne({ _id: idTask })
        res.status(200).send(task)
    } catch (error) {

    }
}

export const deleteTask = async (req, res) => {
    const { title, status, listKey } = req.body;
    console.log("id", listKey)

    //Delete to in tasks
    const task = await ListModel.findByIdAndUpdate(
      listKey, 
      {
        $pull: { tasks: req.params.id },
      },
      { new: true }
    );

    if (!task) {
      return res.status(400).send("Tasks not found");
    }

    // Delete todo in todos
    await TaskModel.deleteOne({ _id: req.params.id });
    res.status(204).send();
}

export const updateTask = async (req, res) => {
    try {
        const idTask = req.params.id
        const dataUpdate = req.body
        const taskUpdate = await TaskModel.findByIdAndUpdate(idTask, dataUpdate, { new: true })
        res.status(200).json(taskUpdate);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}