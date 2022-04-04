
async function connect(){
    if(global.connection && global.connection.state !== 'disconnected')
        return global.connection;
 
    const mysql = require("mysql2/promise");
    const connection = await mysql.createConnection("mysql://root:root@localhost:3306/nodecrud");
    console.log("Conectou no MySQL!");
    global.connection = connection;
    return connection;
}

connect();

async function selectCostumers(){
    const conn = await connect();
    const [rows] = await conn.query('SELECT * FROM people');
    return rows;
}

async function selectCostumerById(id){
    const conn = await connect();
    const value = id; 
    const [rows] = await conn.query('SELECT * FROM people where id = ?',value);
    return rows;
}

async function insertCustomer(customer){
    const conn = await connect();
    const sql = 'INSERT INTO people(id,name) VALUES (?,?);';
    const values = [customer.id, customer.name];
    return await conn.query(sql, values);
}

async function updateCustomer(id, name){
    const conn = await connect();
    const sql = 'UPDATE people SET name = ? WHERE id = ?';
    const values = [name, id];
    return await conn.query(sql, values);
}

async function deleteCustomer(id){
    const conn = await connect();
    const sql = 'DELETE FROM people where id=?;';
    return await conn.query(sql, [id]);
}

module.exports = { deleteCustomer, selectCostumers, insertCustomer, selectCostumerById, updateCustomer};
