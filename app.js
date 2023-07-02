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


// Delete by records
app.delete('/:id', (req, res) =>{
    pool.getConnection((err, connection) => {
        if (err) throw err;
        console.log(`connected as id ${connection.threadId}`);

        connection.query('DELETE FROM registro WHERE id = ?', [req.params.id], (err, result) => {
            connection.release(); // Return the connection to the pool

            if (err) {
                console.log(err);
                res.status(500).send('Erro ao executar a consulta SQL');
            } else {
                res.json(result);
            }
        });
    });
});


// Add by record 
// cria um endpoint que recebe uma solicitação POST contendo os dados de um novo registro a ser inserido no banco de dados. 
app.post('', (req, res) => {
    pool.getConnection((err, connection) => {
        if (err) throw err;
        console.log(`connected as id ${connection.threadId}`);

        const params = req.body;
        connection.query('INSERT INTO registro SET ?', params, (err, result) => {
            connection.release(); // Return the connection to the pool

            if (err) {
                console.log(err);
                res.status(500).send('Erro ao executar a consulta SQL');
            } else {
                res.json({
                    message: 'Registro inserido com sucesso',
                    result: result
                });
            }
        });
    });
});

// Update by record
app.put('/registro/:id', (req, res) => {
    pool.getConnection((err, connection) => {
        if (err) throw err;
        console.log(`connected as id ${connection.threadId}`);

        const { nome, email, empresa } = req.body;
        const id = req.params.id; // Obtém o valor do ID do req.params

        connection.query('UPDATE registro SET nome = ?, email = ?, empresa = ? WHERE id = ?', [nome, email, empresa, id], (err, result) => {
            connection.release(); // Return the connection to the pool

            if (err) {
                console.log(err);
                res.status(500).send('Erro ao executar a consulta SQL');
            } else {
                res.json({
                    message: 'Registro atualizado com sucesso',
                    result: result
                });
            }
        });
    });
});






//Listen on eviromont port 5000
app.listen(port, () => console.log(`Linsten on port ${port}`))