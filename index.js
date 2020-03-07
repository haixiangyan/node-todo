const path = require('path')
const fs = require('fs')
const db = require('./db')
const home = process.env.HOME
const dbPath = path.join(home, '.todo')

module.exports.add = async (title) => {
    // 读取之前的任务
    const list = await db.read()
    // 往里面添加一个 tittle 的任务
    list.push({title, done: false})
    // 存储任务到文件
    await db.write(list)
}
