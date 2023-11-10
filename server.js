const app = require('./app')
const port = process.env.PORT || 8001

app.listen(port, (err)=> {
    if(err) {
        console.log("Getting trouble in starting server", err.message);
    }
    console.log(`Server is started on localhost:${port}`);
})