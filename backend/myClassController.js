import * as index from './index.js'
import express from 'express'
import cors from 'cors'

const app = express()
app.use(cors())
app.use(express.json())

let db = index.db;

app.get("/", (req, res) => {
    res.json("Hello World")
    db.query("INSERT INTO classes (name) VALUES ('123')", (err, res) => {
        if (err) {console.log(err)}
        else {console.log(res)}
    })
})

app.get("/classes", async function(req, res) {
    const result = await index.getClasses();
    console.log(result);
    return res.send(result);
})

app.listen(8800, () => {
    console.log("Server running on port 8800.")
})