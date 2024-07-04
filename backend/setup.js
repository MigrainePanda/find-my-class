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

async function makeRequest(url, payload) {
  try {
    const response = await fetch(url, payload); 

    if (!response.ok) {
      console.log("response: ", response)
      throw new Error('Network response was not ok');
    }
    
    const data = await response.json();
    return data;
  }
  catch (err) {
    console.error('Fetch error: ', err)
  }
}

export { db, makeRequest };