import express from 'express'
import { getAllBroad, postBroad, updateBroad } from '../controller/broadController.js'

const routerBroad = express.Router()

routerBroad.get('/', getAllBroad)
// routerBroad.post('/', postBroad)
routerBroad.patch('/:id', updateBroad)

export default routerBroad