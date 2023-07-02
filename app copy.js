const express = require('express')
const bodyParser = require('body-parser')
const mysql = require('mysql')

const app = express()
const port = process.env.PORT || 5000

app.use(bodyParser.urlencoded({extended: false}))

app.use(bodyParser.json())

//mysql
const pool = mysql.createPool({
    connectionLimit: 10,
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'cliente'
});

//obter res json
app.get('', (req, res) =>{
    pool.getConnection((err, connection)=>{
        if(err) throw err
        console.log(`connected as id ${connection.threadId}`)


        connection.query('SELECT * from registro', (err, rows) => {
            connection.release(); // Return the connection to the pool
        
            if (err) {
                console.log(err);
                res.status(500).send('Erro ao executar a consulta SQL');
            } else {
                res.json(rows);
            }
        });
        


    })
})



//Get body-parser by id
app.get('/:id', (req, res) =>{
    pool.getConnection((err, connection)=>{
        if(err) throw err
        console.log(`connected as id ${connection.threadId}`)


        connection.query('SELECT * from registro WHERE id = ?', [req.params.id], (err, rows) => {
            connection.release(); // Return the connection to the pool
        
            if (err) {
                console.log(err);
                res.status(500).send('Erro ao executar a consulta SQL');
            } else {
                res.json(rows);
            }
        });
        


    })
})


//Delete by records
app.delete('/:id', (req, res) =>{
    pool.getConnection((err, connection)=>{
        if(err) throw err
        console.log(`connected as id ${connection.threadId}`)


        connection.query('DELETE from registro WHERE id = ?', [req.params.id], (err, rows) => {
            connection.release(); // Return the connection to the pool
        
            if (err) {
                console.log(err);
                res.status(500).send('Erro ao executar a consulta SQL');
            } else {
                res.json(rows);
            }
        });
        


    })
})






//Listen on eviromont port 5000
app.listen(port, () => console.log(`Linsten on port ${port}`))