import express from 'express';
import db from './db/db';
import musicians from './db/musicians';
import bodyParser from 'body-parser';

// Set up the express app
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


// get all todos
app.get('/api/v1/musicians', (req, res) => {
    res.status(200).send({
        success: 'true',
        message: 'musicans retrieved successfully',
        default: musicians
    })
});

// add todo item
app.post('/api/v1/musicians', (req, res) => {
    if (!req.body.firstName) {
        return res.status(400).send({
            success: 'false',
            message: 'first name is required'
        });
    }
    if (!req.body.lastName) {
        return res.status(400).send({
            success: 'false',
            message: 'last name is required'
        });
    } else if (!req.body.genre) {
        return res.status(400).send({
            success: 'false',
            message: 'genre is required'
        });
    }
    const musician = {
        id: db.length + 1,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        genre: req.body.genre
    }
    db.push(musician);
    return res.status(201).send({
        success: 'true',
        message: 'todo added successfully',
        musicians
    })
});


// test getcall
app.get('/api/v1/musicians/:id', (req, res) => {
    const id = parseInt(req.params.id, 10);
    db.map((musician) => {
        if (musician.id === id) {
            return res.status(200).send({
                success: 'true',
                message: 'todo retrieved successfully',
                musicians,
            });
        }
    });
    return res.status(404).send({
        success: 'false',
        message: 'todo does not exist',
    });
});



// delete todo
app.delete('/api/v1/todos/:id', (req, res) => {
    const id = parseInt(req.params.id, 10);

    db.map((todo, index) => {
        if (todo.id === id) {
            db.splice(index, 1);
            return res.status(200).send({
                success: 'true',
                message: 'Todo deleted successfuly',
            });
        }
    });
    return res.status(404).send({
        success: 'false',
        message: 'todo not found',
    });

});


// update todo
app.put('/api/v1/musicians/:id', (req, res) => {
    const id = parseInt(req.params.id, 10);
    let mfound;
    let itemIndex;
    db.map((musican, index) => {
        if (musican.id === id) {
            mfound = musican;
            itemIndex = index;
        }
    });

    if (!mfound) {
        return res.status(404).send({
            success: 'false',
            message: 'musican not found',
        });
    }

    if (!req.body.firstName) {
        return res.status(400).send({
            success: 'false',
            message: 'first name is required',
        });

    }
    if (!req.body.lastName) {
        return res.status(400).send({
            success: 'false',
            message: 'last name is required',
        });
    } else if (!req.body.genre) {
        return res.status(400).send({
            success: 'false',
            message: 'genre is required',
        });
    }

    const updatedMusician = {
        id: mfound.id,
        firstName: req.body.firstName || mfound.firstName,
        lastName: req.body.lastName || mfound.lastName,
        genre: req.body.genre || mfound.genre,
    };

    db.splice(itemIndex, 1, updatedMusician);

    return res.status(201).send({
        success: 'true',
        message: 'todo added successfully',
        updatedMusician,
    });
});

const PORT = 5000;

app.listen(PORT, () => {
    console.log(`server running on port ${PORT}`)
});