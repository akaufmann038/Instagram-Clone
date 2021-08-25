const fs = require("fs")
const path = require("path")


const fileName = "f565733deca0b3025249ea5f35642264"

const data = fs.readFileSync(path.join(__dirname + "/uploads/" + fileName))

console.log(data)