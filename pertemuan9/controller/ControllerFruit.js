let fruits = require('../models/modelfruits.js')

const index = () => {
    for (const fruit of fruits) {
        console.log(fruit)
    }
}

const store = (dataArray) => {
    fruits.push(dataArray)
    index()
}

const update = (position,dataArray) => {
    fruits[position] = dataArray
    index()
}

const destroy = (position) => {
    fruits.splice(position,1)
    index()
}

module.exports = { index,store,update,destroy }