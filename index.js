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

module.exports.showAll = async () => {
    // 读取之前的任务
    const list = await db.read()
    // 打印之前的任务
    list.forEach((task, index) => {
        console.log(`${task.done ? '[X]' : '[_]'} ${index + 1} - ${task.title}`)
    })

    inquirer.prompt([{
        type: 'list',
        name: 'index',
        message: '请选择你想操作的任务',
        choices: [
            {value: '-1', name: '[+] 创建任务'},
            ...list.map((task, index) => {
                return {
                    value: index.toString(),
                    name: `${task.done ? '[X]' : '[_]'} ${index + 1} - ${task.title}`
                }
            }),
            {value: '-2', name: '[<- 退出'}
        ]
    }]).then(answer => {
        const index = parseInt(answer.index)
        if (index >= 0) {
            inquirer.prompt({
                type: 'list',
                name: 'action',
                message: '请选择操作',
                choices: [
                    {value: 'quit', name: '退出'},
                    {value: 'done', name: '已完成'},
                    {value: 'undone', name: '未完成'},
                    {value: 'remove', name: '删除'},
                    {value: 'update', name: '修改'}
                ]
            }).then(answer => {
                switch (answer.action) {
                    case 'quit':
                        break
                    case 'done':
                        list[index].done = true
                        db.write(list)
                        break
                    case 'undone':
                        list[index].done = false
                        db.write(list)
                        break
                    case 'update':
                        inquirer.prompt({
                            type: 'input',
                            name: 'title',
                            message: '新的任务标题',
                            default: list[index].title
                        }).then(answer => {
                            list[index].title = answer.title
                            db.write(list)
                        })
                        break
                    case 'remove':
                        list.splice(index, 1)
                        db.write(list)
                        break
                }
            })
        } else if (index === -1) {
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
    })
}
