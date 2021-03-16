const chalk = require("chalk")
const green = chalk.black.bgGreen
const red = chalk.black.bgRed
const success = console.log
const err = console.log

const _404 = (message, error='')=>{
    console.log(red('404 - Not Found'))
}

const _201 = (message)=>{
    console.log(green('201 - Created'), message)
}

const _500 = (error)=>{
    console.log(red('500 - Internal Server Error'), error)
}

const _400 = (error)=>{
    console.log(red('400 - Bad Request'), error)
}

const _200 = (message1, message2='')=>{
    console.log(green('200 - Ok'), message1, message2)
}



module.exports = {
    green,red, success, err, _404, _201, _500, _400, _200
}







