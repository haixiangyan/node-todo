const inquirer = require('inquirer')
const db = require('./db')

module.exports.add = async (title) => {
    // 读取之前的任务
    const list = await db.read()
    // 往里面添加一个 tittle 的任务
    list.push({title, done: false})
    // 存储任务到文件
    await db.write(list)
}

module.exports.clear = async () => {
    await db.write([])
}

const parseList = (list) => {
    return [
        {value: '-1', name: '[+] 创建任务'},
        ...list.map((task, index) => {
            return {
                value: index.toString(),
                name: `${task.done ? '[X]' : '[_]'} ${index + 1} - ${task.title}`
            }
        }),
        {value: '-2', name: '[<- 退出'}
    ]
}

const ACTIONS = [
    {value: 'quit', name: '退出'},
    {value: 'done', name: '已完成'},
    {value: 'undone', name: '未完成'},
    {value: 'remove', name: '删除'},
    {value: 'update', name: '修改'}
]

const markAsDone = (list, index) => {
    list[index].done = true
    db.write(list)
}
const markAsUndone = (list, index) => {
    list[index].done = false
    db.write(list)
}
const updateTask = (list, index) => {
    inquirer.prompt({
        type: 'input',
        name: 'title',
        message: '新的任务标题',
        default: list[index].title
    }).then(answer => {
        list[index].title = answer.title
        db.write(list)
    })
}
const removeTask = (list, index) => {
    list.splice(index, 1)
    db.write(list)
}

const askForAction = (answer, list, index) => {
    const actions = {
        done: markAsDone,
        undone: markAsUndone,
        update: updateTask,
        remove: removeTask
    }
    actions && actions[answer.action](list, index)
}

const showActions = (list) => {
    inquirer.prompt([{
        type: 'list',
        name: 'index',
        message: '请选择你想操作的任务',
        choices: parseList(list)
    }]).then(answer => {
        const index = parseInt(answer.index)
        if (index >= 0) {
            inquirer.prompt({
                type: 'list',
                name: 'action',
                message: '请选择操作',
                choices: ACTIONS
            }).then(answer => {
                askForAction(answer, list, index)
            })
        } else if (index === -1) {
            askForCreateTask(list)
        }
    })
}

const askForCreateTask = (list) => {
    inquirer.prompt({
        type: 'input',
        name: 'title',
        message: '输入任务标题',
    }).then(answer => {
        list.push({
            title: answer.title,
            done: false
        })
        db.write(list)
    })
}

module.exports.showAll = async () => {
    // 读取之前的任务
    const list = await db.read()

    showActions(list)
}
