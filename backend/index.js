import mysql from 'mysql2'

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


const getClasses = async () => {
    const q = "SELECT * FROM classes";
    return new Promise((resolve, reject) => {
        db.query(q, (err, result) => {
          if (err) {
            reject(err);
          }
          else {
            resolve(result);
          }
        });
    });
};

const getClassByID = async (id) => {
    const q = `SELECT id FROM classes where id=${id}`;
    return new Promise((resolve, reject) => {
        db.query(q, (err, result) => {
          if (err) {
            reject(err);
          }
          else {
            resolve(result);
          }
        });
    });
}

export { db, getClasses, getClassByID }