const http = require("http")
const fs = require("fs")

const server = http.createServer(function (reqest, response) {

    fs.access("./index.html", fs.constants.R_OK, err => {
        if (err) {
            response.statusCode = 404;
            response.end("Not found")
        } else {
            fs.createReadStream("./index.html").pipe(response);
        }
    })

})


console.log("server is listening on http://localhost:3000")
server.listen("3000", "localhost")