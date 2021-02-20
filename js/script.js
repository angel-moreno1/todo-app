const title = document.getElementById('title');
const content = document.getElementById('content');
const error = document.getElementById('error');
const taskContainer = document.getElementById('tasks-container')

const haveTaskInStorage = () => localStorage.getItem('tasks') ? true : false;

const createTaskHTML = (task, index) => {
    return `
        <li>
            <div class="task" >
                <div class="container-task-details">
                    <h2>${task.title}</h2>
                    <p>
                        ${task.content}
                    </p>
                </div>
                <div class="actions">
                    <button id="delete" data-key=${index}>Delete</button>
                    <button id="update" data-key=${index}>Update</button>
                </div>
            </div>
        </li>
    `
}

const updateTask = ({ target }) => {
    const index = parseInt(target.dataset.key, 10)
    const alltasks = JSON.parse(localStorage.getItem('tasks'))
    const taskToUpdate = alltasks[index]

    title.value = taskToUpdate.title
    content.value = taskToUpdate.content

    //TODO delete current task and put it again with the new values in the dom and in localStorage

}

const deleteTask = ({target}) => {
    const index = parseInt(target.dataset.key, 10)
    const allTasks = JSON.parse(localStorage.getItem('tasks'))
    const newTasks = JSON.stringify(allTasks.filter( task => task.title !== allTasks[index].title ))
    localStorage.setItem('tasks', newTasks)
    target.parentElement.parentElement.parentElement.remove()
}

const listAllTasks = () => {
    const currentTask = JSON.parse(localStorage.getItem('tasks'))
    currentTask.map( (task, index) =>  taskContainer.innerHTML += createTaskHTML(task, index) )
}

const listeningButtons = (callback, ...inputs) => {
    Array.from(inputs[0], input => input.addEventListener('click', callback))
}


const loadAllTask = () => {
    if(haveTaskInStorage()){
        listAllTasks()
        listeningButtons(deleteTask, document.querySelectorAll('#delete'))
        listeningButtons(updateTask, document.querySelectorAll('#update'))
    }
}

document.addEventListener('DOMContentLoaded', loadAllTask)

const isInputEmpty = input => !input.value ? true : false;

const whoIsEmpty = () => {

    if(!title.value && content.value){

        return 'Title is';
    }else if(!content.value && title.value){

        return "Content is";
    }else {

        return "Both are";
    }

}

const clearInputs = (...inputs) => inputs.map( input => input.value = "" )

const emptyInputs = () => {
    if(isInputEmpty(title) || isInputEmpty(content)){
        error.style.transform = "translateY(0)";
        error.innerHTML = `${whoIsEmpty(title, content)} empty`;
        setTimeout(() => error.style.transform = "translateY(-30rem)" , 1000);     
        return true;
    }
}

const createTask = () => {
    if(emptyInputs())
        return;

    const newTask = { title: title.value, content: content.value };
    clearInputs(title, content)
    
    if(haveTaskInStorage()){
        const tasks = JSON.parse(localStorage.getItem('tasks'))
        tasks.push(newTask)
        localStorage.setItem('tasks', JSON.stringify(tasks))
    }else {
        const tasks = []
        tasks.push(newTask)
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    listAllTasks()
    listeningButtons(deleteTask, document.querySelectorAll('#delete'))
    listeningButtons(updateTask, document.querySelectorAll('#update'))

}

document.getElementById('create').addEventListener('click', createTask)