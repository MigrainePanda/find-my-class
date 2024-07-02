import mysql from 'mysql2'
import express from 'express'
import cors from 'cors'

const db_name = "find_my_class"
const db = mysql.createPool({
  connectionLimit : 10,
  host            : "localhost",
  user            : "root",
  password        : "TWru2*hxseap*w-w",
  database        : db_name
})

db.getConnection((err, con) => {
    if (err) {
        console.log(`Could not connect to the database ${err}.`)
    }else{
        console.log("Succesfully connected to the database.")
    }
});

const app = express()
app.use(cors())
app.use(express.json())

app.listen(8800, () => {
  console.log("Server running on port 8800.")
})

export default db;