import express from 'express'
import { deleteList, getAllList, getListById, postList, updateList } from '../controller/listController.js'
const routerList = express.Router()

routerList.get('/:id', getListById)
routerList.post('/', postList)
routerList.get('/', getAllList)
routerList.patch('/:id', updateList)
routerList.delete('/:id', deleteList)

export default routerList