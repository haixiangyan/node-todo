// 声明是假模块
const fs = jest.genMockFromModule('fs')
const _fs = jest.requireActual('fs')

Object.assign(fs, _fs)

const readMocks = {}
const writeMocks = {}

fs.setReadMocks = (path, error, data) => {
    readMocks[path] = [error, data]
}

fs.setWriteMocks = (path, fn) => {
    writeMocks[path] = fn
}

fs.readFile = (path, options, callback) => {
    if (callback === undefined) {
        callback = options
    }
    // 测试专用
    if (path in readMocks) {
        callback(...readMocks[path])
    }
    else {
        _fs.readFile(path, options, callback)
    }
}

fs.writeFile = (path, data, options, callback) => {
    if (path in writeMocks) {
        writeMocks[path](path, data, options, callback)
    }
    else {
        _fs.writeFile(path, data, options, callback)
    }
}

module.exports = fs
