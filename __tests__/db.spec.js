const fs = require('fs')
const db = require('../db')

// 调用了假的 fs，来自 __mocks__ -> fs.js
jest.mock('fs')

describe('db', () => {
    afterEach(() => {
        fs.clearMocks()
    })
    it('can read', async () => {
        const data = [{title: 'hi', done: true}]
        fs.setReadMocks('/xxx', null, JSON.stringify(data))
        const list = await db.read('/xxx')
        expect(list).toStrictEqual(data)
    })
    it('can write', async () => {
        let fakeFile = ''
        fs.setWriteMocks('/yyy', (path, data, callback) => {
            fakeFile = data
            callback(null)
        })
        const list = [{title: 'Do something', done: true}, {title: 'Say hi', done: false}]
        await db.write(list, '/yyy')
        expect(fakeFile).toBe(JSON.stringify(list) + '\n')
    })
})
