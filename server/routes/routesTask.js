import express from 'express'
import { deleteTask, getAllTask, getTaskById, postTask, updateTask } from '../controller/taskController.js';
const routerTask = express.Router();

routerTask.get('/:id', getTaskById)
routerTask.post('/', postTask)
routerTask.get('/', getAllTask)
routerTask.patch('/:id', updateTask)
routerTask.delete('/:id', deleteTask)

export default routerTask