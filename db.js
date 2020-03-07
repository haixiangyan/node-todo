const path = require('path')
const fs = require('fs')
const home = process.env.HOME
const dbPath = path.join(home, '.todo')

const db = {
    read(path=dbPath) {
        return new Promise((resolve, reject) => {
            fs.readFile(path, {flag: 'a+'}, (error, data) => {
                if (error) return reject(error)

                let list = []
                try { list = JSON.parse(data.toString()) }
                catch (e) { }
                resolve(list)
            })
        })
    },
    write(list, path=dbPath) {
        return new Promise((resolve, reject) => {
            const string = JSON.stringify(list)
            fs.writeFile(path, string + '\n', (error) => {
                if (error) return reject(error)

                resolve()
            })
        })
    }
}

module.exports = db
