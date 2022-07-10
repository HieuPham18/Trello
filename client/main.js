const broadElement = document.querySelector("#myBroad");
const urlBroad = 'http://localhost:5000/api/broad'
const urlList = 'http://localhost:5000/api/lists'
const urlTask = 'http://localhost:5000/api/tasks'


function styleEl(el) {
    el.style.position = 'absolute'
    el.style.zIndex = 5
    el.style.width = 'inherit'
    el.style.cursor = 'move'
    el.style.backgroundColor = '#9da39e'
    el.style.opacity = '0.5'
    el.style.visibility = 'visible'
    el.style.pointerEvents = 'none'
}

function changePosition(arr, fromIndex, toIndex) {
    console.log("change", fromIndex, toIndex)
    var element = arr[fromIndex];
    arr.splice(fromIndex, 1);
    arr.splice(toIndex, 0, element);
}


const getAllData = async () => {
    try {
        const response = await fetch(urlBroad)
        const data = await response.json()
        return data
    } catch (error) {
        console.log("Error: ", error)
    }
}

const getDataById = async (url, id) => {
    const response = await fetch(`${url}/${id}`)
    const data = await response.json()
    return data
}


const createData = async (url, data) => {
    console.log("data", data)
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    }
    await fetch(url, options)
}

const updateData = async (url, id, data) => {
    const options = {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    }
    await fetch(`${url}/${id}`, options)
}

const deleteData = async (url, id, data) => {
    const options = {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    }
    await fetch(`${url}/${id}`, options)
}


const modalElement = (id) => {
    return ` <div class="modal">
                <div class="modal-list">
                    <textarea name="" id="" cols="27"  rows="5" placeholder="Enter a title..." class="input-update" id-list = ${id} style="font-family: 'Roboto', sans-serif;
                    font-family: 'Noto Sans', sans-serif;"></textarea>
                    <button class="btn-update" id-list = ${id}>Save</button>
                </div>
            </div>`
}

const taskElement = (idTask, title, idList, index) => {
    return `<li class="task" data-id=${idTask} id-list=${idList} data-index = ${index}>
                <p class="task-title">${title}</p>
                <i class="fa-solid fa-pencil icon-menu-task">
                    <ul class="options-task">
                        <li class="options-task-item" id-list = ${idList}>
                            <div style= "display: flex; align-items: center;" class = "options-task--update" id-list = ${idList} id-task = ${idTask}>
                                    <div style="width: 16px">
                                        <i class="fa-solid fa-marker"></i>
                                    </div>
                                    <p style = "margin: 0">Update</p>
                            </div>
                            ${modalElement(idTask)}
                        </li>
                        <li class="options-task-item" id-list = ${idList}>
                            <div style= "display: flex; align-items: center;" class = "options-task--del" id-list = ${idList} id-task = ${idTask}>
                                <div style="width: 16px"><i class="fa-solid fa-trash-can"></i></div>
                                <p style = "margin: 0">Delete</p>
                            </div>
                        </li>
                    </ul>
                </i>
            </li>`
}

const formSubmitTask = (idList) => {
    return ` <div class="input-task">
                <textarea name="" id="" cols="27"  rows="3" placeholder="Enter a title for this tag..." class="input-task-value" id-list = ${idList}></textarea>
                <div class="submit-task">
                    <button class="btn-submit-task">Add task</button>
                    <i class="fa-solid fa-xmark icon-cancel-task"></i>
                </div>
            </div>`
}


class Trello {
    constructor(element, data = null, dragEl = null, cloneEl = null, isDraging = false, indexItem = null, broad = null, broadID = null, listTask = [], list = null, targetList = null, listTaskTarget = []) {
        this.element = element;
        this.dragEl = dragEl
        this.cloneEl = cloneEl
        this.isDraging = isDraging
        this.indexItem = indexItem
        this.data = data
        this.broad = broad
        this.broadID = broadID
        this.listTask = listTask
        this.list = list
        this.targetList = targetList
        this.listTaskTarget = listTaskTarget
        this.element.addEventListener('click', this.onClick);
        this.element.addEventListener('mousedown', this.onMouseDown)
        this.element.addEventListener('mousemove', this.onMouseMove)
        this.element.addEventListener('mouseup', this.onMouseUp)
        this.load()
    }

    renderData(data) {
        console.log("data-render", data)
        if (data) {
            const htmls = data.map((list, index) => {
                return (
                    ` <li class="list" data-id=${list._id} data-index = ${index}>
                        <h2 class="list-header">
                            <p class="list-heading">${list.title}</p>
                            <div>
                                <i class="fa-solid fa-ellipsis-vertical icon-menu-list">
                                    <ul class="options-list">
                                        <li class="options-list-item" id-list = ${list._id}>
                                            <div style= "display: flex; align-items: center;" class = "options-list--update" id-list = ${list._id}>
                                                <div style="width: 16px"><i class="fa-solid fa-marker"></i></div>
                                                <p style = "margin: 0">Update</p>
                                                </div>
                                                ${modalElement(list._id)}
                                        </li>
                                        <li class="options-list-item" id-list = ${list._id}>
                                            <div style= "display: flex; align-items: center;" class = "options-list--del" id-list = ${list._id}>
                                                <div style="width: 16px"><i class="fa-solid fa-trash-can"></i></div>
                                                <p style = "margin: 0">Delete</p>
                                            </div>
                                        </li>
                                    </ul>
                                </i>
                            </div>
                        </h2>
                        <ul class="list-task">
                            ${list.tasks.map((task, index) => taskElement(task._id, task.title, list._id, index)).join('')}
                        </ul>
                        ${formSubmitTask(list._id)}
                        <button class="btn-add-task">
                            <div><i class="fa-solid fa-plus"></i></div>
                            <p class="btn-add-task--text">Add Task</p>
                        </button>
                    </li>
                    `
                )
            })
            broadElement.innerHTML = htmls.join('')
        }
    }

    async load() {
        const data = await getAllData()
        this.broadID = data[0]._id
        this.data = data[0].lists
        this.broad = data[0]
        console.log("res data", this.data)
        this.renderData(this.data)
    }

    onClick = async (e) => {
        if (e.target.closest('.btn-new-list')) {
            const btnNewList = e.target.closest('.btn-new-list')
            btnNewList.nextElementSibling.classList.add('active')
            btnNewList.classList.add('hidden')
        }
        else if (e.target.closest('.btn-submit-list')) {
            const btnSumitList = e.target.closest('.btn-submit-list')
            const inputList = btnSumitList.parentElement.previousElementSibling

            // Form data
            const inputValue = inputList.value
            const formData = {
                title: inputValue,
                broadKey: this.broadID
            }

            // Handle add list
            await createData(urlList, formData)
            await this.load()
            inputList.value = ''

        }
        else if (e.target.matches('.icon-menu-list')) {
            const menuList = e.target.closest('.icon-menu-list')
            menuList.querySelector('.options-list').classList.toggle('emerge')
        }
        else if (e.target.closest('.options-list--update')) {
            const updateListElement = e.target.closest('.options-list--update')
            const modalUpdate = updateListElement.nextElementSibling

            // Get list from db
            const idList = updateListElement.getAttribute('id-list')
            const list = await getDataById(urlList, idList)

            // Set data 
            const inputList = modalUpdate.querySelector('.input-update')
            inputList.value = list.title

            // Css display modal
            modalUpdate.style.display = 'flex'

            // Handle update list
            modalUpdate.addEventListener('click', async (e) => {
                if (e.target.matches(".btn-update")) {
                    const value = inputList.value

                    const formData = {
                        ...list,
                        title: value
                    }
                    // Update
                    await updateData(urlList, idList, formData)
                    await this.load()
                }
            })
        }

        else if (e.target.closest('.options-list--del')) {
            const deleteList = e.target.closest('.options-list--del')
            const idList = deleteList.getAttribute("id-list")

            console.log("ud", idList)
            // Get data by id
            const list = await getDataById(urlList, idList)

            // Handle delete list
            await deleteData(urlList, idList, list)

            // Render
            await this.load()
        }
        else if (e.target.matches('.icon-cancel-list')) {
            // CSS new list 
            const inputList = e.target.closest('.input-list')
            inputList.classList.remove('active')
            inputList.previousElementSibling.classList.remove('hidden')
        }
        else if (e.target.closest('.btn-add-task')) {
            // CSS task when click
            const btnNewTask = e.target.closest('.btn-add-task')
            btnNewTask.previousElementSibling.classList.add('active')
            btnNewTask.classList.add('hidden')
        }
        else if (e.target.matches('.btn-submit-task')) {
            const btnSubmitTask = e.target.closest('.btn-submit-task')
            const inputTask = btnSubmitTask.parentElement.previousElementSibling
            const inputValue = inputTask.value
            const idList = inputTask.getAttribute("id-list")
            // Form data 
            const formData = {
                title: inputValue,
                listKey: idList
            }

            // Handle add data
            await createData(urlTask, formData)
            await this.load()
        }
        else if (e.target.matches('.icon-menu-task')) {
            const menuTask = e.target.querySelector('.options-task')
            menuTask.classList.toggle('emerge')
        }
        else if (e.target.closest('.options-task--update')) {
            const updateTaskElement = e.target.closest('.options-task--update')
            const modalUpdate = updateTaskElement.nextElementSibling

            // Get list from db
            const idTask = updateTaskElement.getAttribute('id-task')
            const task = await getDataById(urlTask, idTask)

            // Set data 
            const inputTask = modalUpdate.querySelector('.input-update')
            inputTask.value = task.title

            // Css display modal
            modalUpdate.style.display = 'flex'

            // Handle update list
            modalUpdate.addEventListener('click', async (e) => {
                if (e.target.matches(".btn-update")) {
                    const value = inputTask.value

                    const formData = {
                        ...task,
                        title: value
                    }
                    // Update
                    await updateData(urlTask, idTask, formData)
                    await this.load()
                }
            })
        }
        else if (e.target.closest('.options-task--del')) {
            const optionDelTask = e.target.closest('.options-task--del')
            const idTask = optionDelTask.getAttribute("id-task")
            // Get data by id
            const task = await getDataById(urlTask, idTask)

            // Handle delete list
            await deleteData(urlTask, idTask, task)

            // Render
            await this.load()
        }
        else if (e.target.matches('.icon-cancel-task')) {
            const inputTask = e.target.closest('.input-task')
            inputTask.classList.remove('active')
            inputTask.nextElementSibling.classList.remove('hidden')
            inputTask.childNodes[1].value = ''
        }
    }


    onMouseDown = async (e) => {
        if (e.target.closest('.new-list') || e.target.closest('.icon-menu-task') || e.target.closest('.icon-menu-list') || e.target.closest('.btn-add-task') || e.target.closest('.input-task')) return
        if (e.target.closest('.task')) {
            this.isDraging = true;
            this.dragEl = e.target.closest('.task')

            // create clone node
            this.clone = this.dragEl.cloneNode(true)
            styleEl(this.clone)
            this.dragEl.appendChild(this.clone)

            const idListTaskDrag = this.dragEl.getAttribute("id-list")
            const listData = await getDataById(urlList, idListTaskDrag)
            this.list = listData
            this.listTask = listData.tasks
        }
        else if (e.target.closest('.list')) {
            if (e.target.closest('.list-task') || e.target.closest('.btn-add-task')) return
            const target = e.target.closest('.list')
            if (target) {
                this.isDraging = true
                this.dragEl = target
                this.dragEl.style.visibility = 'hidden'

                // create clone node
                this.clone = this.dragEl.cloneNode(true)
                styleEl(this.clone)
                document.body.appendChild(this.clone)
            }
        }

    }

    onMouseMove = async (e) => {
        if (this.dragEl) {
            if (!this.isDraging) return
            this.clone.style.top = e.pageY - this.clone.offsetHeight / 2 + 'px'
            this.clone.style.left = e.pageX - this.clone.offsetWidth / 2 + 'px'
        }
    }

    onMouseUp = async (e) => {
        if (this.dragEl.closest('.task')) {
            if(!e.target.closest('.task')){
                const dropEL = e.target.closest('.list')
                const idListClone = this.dragEl.getAttribute("id-list")
                const idListDrop= dropEL.getAttribute("data-id")
                const idTask = this.dragEl.getAttribute("data-id")
                const indexCloneList = parseInt(this.dragEl.getAttribute("data-index"))
                // const list = await getDataById(urlList, idListClone)

                const listTaget = await getDataById(urlList, idListDrop)
                this.targetList = listTaget
                this.listTaskTarget = listTaget.tasks

                if(idListClone === idListDrop){
                    changePosition(this.listTask, indexCloneList, this.listTask.length - 1)
                    const formData = {
                        ...this.list,
                        tasks: this.listTask
                    }
                    await updateData(urlList, idListClone, formData)
                    await this.load()
                }
                else{
                    this.listTask.splice(indexCloneList, 1)
                    this.listTaskTarget.splice(this.listTaskTarget.length, 0, idTask)
                    
                    const formData = {
                        ...this.list,
                        tasks: this.listTask
                    }

                    const formDataTarget = {
                        ...this.targetList,
                        tasks: this.listTaskTarget
                    }
                    console.log("daa", formData, formDataTarget)

                    await updateData(urlList, idListClone, formData)
                    await updateData(urlList, idListDrop, formDataTarget)
                    await this.load()
                }
            }
            else{
                const dropElTask = e.target.closest('.task')
                if (dropElTask && this.dragEl !== dropElTask) {
                    
                    
                    const rectDragEl = this.dragEl.getBoundingClientRect()
                    const rectdropElTask = dropElTask.getBoundingClientRect()
    
                    const idTaskDrag = this.clone.getAttribute("data-id")
                    const idListDrop = dropElTask.getAttribute("id-list")
                    const idListClone = this.clone.getAttribute("id-list")
                    const indexTaskDrag = parseInt(this.dragEl.getAttribute("data-index"))
                    const indexTaskDrop = parseInt(dropElTask.getAttribute("data-index"))
    
                    const listDrop = await getDataById(urlList, idListDrop)
                    this.listTarget = listDrop
                    this.listTaskTarget = listDrop.tasks
    
                    // console.log("new list", this.listTarget)
    
                    // get position
                    const mY = e.pageY
                    const dY = mY - rectdropElTask.y
                    const dH = dropElTask.offsetHeight
                    // console.log("dy, dh/2", dY, dH / 2)
    
                    // sort
                    if (mY > rectDragEl.top) {
                        if (idListClone === idListDrop) {
                            if (dY > dH / 2) {
                                changePosition(this.listTask, indexTaskDrag, indexTaskDrop)
                                const formData = {
                                    ...this.list,
                                    tasks: this.listTask
                                }
                                await updateData(urlList, idListClone, formData)
                                await this.load()
                            }
                            else {
                                changePosition(this.listTask, indexTaskDrag, indexTaskDrop - 1)
                                const formData = {
                                    ...this.list,
                                    tasks: this.listTask
    
                                }
                                await updateData(urlList, idListClone, formData)
                                await this.load()
                            }
                        }
                        else {
                            console.log("2 list")
                            if (dY > dH / 2) {
                                this.listTask.splice(indexTaskDrag, 1)
                                this.listTaskTarget.splice(indexTaskDrop + 1, 0, idTaskDrag)
                                const formDragData = {
                                    ...this.list,
                                    tasks: this.listTask
                                }
                                const formDropData = {
                                    ...this.listTarget,
                                    tasks: this.listTaskTarget
                                }
                                await updateData(urlList, idListClone, formDragData)
                                await updateData(urlList, idListDrop, formDropData)
                                await this.load()
                            }
                            else {
                                this.listTask.splice(indexTaskDrag, 1)
                                this.listTaskTarget.splice(indexTaskDrop, 0, idTaskDrag)
                                const formDragData = {
                                    ...this.list,
                                    tasks: this.listTask
                                }
                                const formDropData = {
                                    ...this.listTarget,
                                    tasks: this.listTaskTarget
                                }
                                await updateData(urlList, idListClone, formDragData)
                                await updateData(urlList, idListDrop, formDropData)
                                await this.load()
                            }
                        }
                    } else {
                        if (idListClone === idListDrop) {
                            if (dY < dH / 2) {
                                changePosition(this.listTask, indexTaskDrag, indexTaskDrop)
                                const formData = {
                                    ...this.list,
                                    tasks: this.listTask
                                }
                                await updateData(urlList, idListClone, formData)
                                await this.load()
                            }
                            else {
                                changePosition(this.listTask, indexTaskDrag, indexTaskDrop + 1)
                                const formData = {
                                    ...this.list,
                                    tasks: this.listTask
    
                                }
                                await updateData(urlList, idListClone, formData)
                                await this.load()
                            }
                        }
                        else {
                            if (dY < dH / 2) {
                                this.listTask.splice(indexTaskDrag, 1)
                                this.listTaskTarget.splice(indexTaskDrop, 0, idTaskDrag)
                                // console.log("new list", this.listTask)
                                // console.log("new list drop", this.listTaskTarget)
    
                                const formDragData = {
                                    ...this.list,
                                    tasks: this.listTask
                                }
                                const formDropData = {
                                    ...this.listTarget,
                                    tasks: this.listTaskTarget
                                }
                                await updateData(urlList, idListClone, formDragData)
                                await updateData(urlList, idListDrop, formDropData)
                                await this.load()
                            }
                            else {
                                this.listTask.splice(indexTaskDrag, 1)
                                this.listTaskTarget.splice(indexTaskDrop + 1, 0, idTaskDrag)
    
                                const formDragData = {
                                    ...this.list,
                                    tasks: this.listTask
                                }
                                const formDropData = {
                                    ...this.listTarget,
                                    tasks: this.listTaskTarget
                                }
                                await updateData(urlList, idListClone, formDragData)
                                await updateData(urlList, idListDrop, formDropData)
                                await this.load()
                            }
                        }
                    }
                    // reset
                    this.dragEl.style.visibility = 'visible'
                    this.clone.style.visibility = 'hidden'
                    this.isDraging = false
                    this.indexItem = null
                    this.dragEl = null
                    this.clone = null
                }
            }
        }
        else if (this.dragEl.closest('.list')) {
            let dropElList = e.target.closest('.list')
            if (e.target.closest('.task') || e.target.closest('.list-task') || e.target.closest('.btn-add-task')) {
                dropElList = e.target.closest('.list')
            }
            if (dropElList && this.dragEl !== dropElList) {

                const indexCloneList = parseInt(this.dragEl.getAttribute("data-index"))
                const indexDropList = parseInt(dropElList.getAttribute("data-index"))

                const rectDropEl = dropElList.getBoundingClientRect()
                const rectDragEl = this.dragEl.getBoundingClientRect()

                const mX = e.pageX
                const dX = Math.abs(mX - rectDropEl.x)
                const dW = rectDropEl.width

                const broadEl = document.querySelector('#myBroad')
                const rectBroadEl = broadEl.getBoundingClientRect()

                if(mX > rectDropEl.right){
                    changePosition(this.data, indexCloneList, this.data.length)
                    const formData = {
                        ...this.broad,
                        lists: this.data
                    }
                    await updateData(urlBroad, this.broadID, formData)
                    await this.load()
                }

                if (mX > rectDragEl.x) {
                    // right
                    if (dX > dW / 2) {
                        changePosition(this.data, indexCloneList, indexDropList)
                        const formData = {
                            ...this.broad,
                            lists: this.data
                        }
                        console.log("new broad", this.data)
                        await updateData(urlBroad, this.broadID, formData)
                        await this.load()
                    }
                    else {
                        changePosition(this.data, indexCloneList, indexDropList - 1)
                        const formData = {
                            ...this.broad,
                            lists: this.data
                        }
                        console.log("new broad", this.data)
                        await updateData(urlBroad, this.broadID, formData)
                        await this.load()
                    }
                }
                else {
                    if (dX < dW / 2) {
                        changePosition(this.data, indexCloneList, indexDropList)
                        const formData = {
                            ...this.broad,
                            lists: this.data
                        }
                        console.log("new broad", this.data)
                        await updateData(urlBroad, this.broadID, formData)
                        await this.load()
                    }
                    else {
                        changePosition(this.data, indexCloneList, indexDropList + 1)
                        const formData = {
                            ...this.broad,
                            lists: this.data
                        }
                        console.log("new broad", this.data)
                        await updateData(urlBroad, this.broadID, formData)
                        await this.load()
                    }
                }


                // reset
                this.dragEl.style.visibility = 'visible'
                this.clone.style.visibility = 'hidden'
                this.isDraging = false
                this.indexItem = null
                this.dragEl = null
                this.clone = null
            }
        }
    }

}

const todo = new Trello(document.querySelector('.trello'))
todo.renderData()



