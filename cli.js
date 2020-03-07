const program = require('commander');
const api = require('./index')

program
    .option('-d, --debug', 'output extra debugging')
program
    .command('add')
    .description('添加一个任务')
    .action((...args) => {
        api.add(args[1].join(' '))
    })

program
    .command('clear')
    .description('清除所有任务')
    .action((...args) => {
        console.log('This is clear')
    })

program.parse(process.argv);
