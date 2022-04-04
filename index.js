const express = require('express');
const app = express();
const db = require('./db');
const api = require('./api');

app.use(express.json());

app.listen(3000);

async function checkIdInDB(req,res,next){
    const cliente =  await db.selectCostumerById(req.params.id);
    console.log(cliente[0]);
    if(cliente[0] !== undefined){
        return res.status(400).json({warning: 'id already exists in database'});
    }
    
    return next();
}

async function checkEmptyIdInDB(req,res,next){
    const cliente =  await db.selectCostumerById(req.params.id);
    console.log(cliente[0]);
    if(cliente[0] == undefined){
        return res.status(400).json({warning: 'id does not exists in database'});
    }
    
    return next();
}

app.get('/peopleAPI/:id', checkIdInDB, async (req, res) =>{
    const { id } = req.params;
    try {
        const { data } = await api.get(`people/${id}`);
        console.log(data);
        const people = ({
            id: `${id}`,
            name: data.name
        });

        await db.insertCustomer(people);
        return res.send(people);
    } catch (error) {
        return {error: error.message};
    }
});



app.get('/peopleDB/', async (req,res) =>{
    const clientes = await db.selectCostumers();
    return res.send(clientes);
});

app.get('/peopleDB/:id', checkEmptyIdInDB,async (req,res) =>{
    const { id } = req.params;
    const clientes = await db.selectCostumerById(`${id}`);
    return res.send(clientes);
});

app.put('/peopleDB/:id', async (req,res)=> {
    const { id } = req.params;
    const { name } = req.body;
    try {
        const clientes = await db.updateCustomer(`${id}`, `${name}`);
        return res.send({message: 'character updated'});
    } catch (error) {
        return res.send({error: error.message});
    }
});

app.delete('/peopleDB/:id', async (req,res) =>{
    const { id } = req.params;
    try {
        const clientes = await db.deleteCustomer(`${id}`);
        return res.send({message: 'character deleted'});
    } catch (error) {
        return res.send({error: error.message});
    }
});