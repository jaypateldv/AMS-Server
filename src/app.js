const {app} = require("./routes/index")
const PORT = process.env.PORT||3000
app.listen(PORT , ()=>{
    console.log(`server is listing on PORT : ${PORT}`)
})