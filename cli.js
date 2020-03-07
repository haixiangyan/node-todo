const program = require('commander')
const api = require('./index')

program
    .command('add')
    .description('添加一个任务')
    .action(async (...args) => {
        api.add(args[1].join(' '))
            .then(() => '添加成功', () => '添加失败')
    })

program
    .command('clear')
    .description('清除所有任务')
    .action(async () => {
        await api.clear()
            .then(() => '清除完毕', () => '清除失败')
    })

program.parse(process.argv)

if (process.argv.length === 2) {
    void api.showAll()
}
