import express from 'express';
import bcrypt from 'bcryptjs';
import cors from 'cors';
import knex from 'knex';
import handleRegister from './controllers/register.js';
import handleSignin from './controllers/signin.js';
import handleProfileGet from './controllers/profile.js';
import handleImage from './controllers/image.js';
import handlePredict from './controllers/predict.js';

//start the server
const app = express();

//Connect PostgreSQL
const db = knex({
    client: 'pg',
    connection: {
        connectionString: process.env.DATABASE_URL,
        ssl: true,
    }
  });

// turn the request into json
app.use(express.json());

// CORS policy
app.use(cors());

// GET for root /
app.get('/', (req, res) => {
    db('users')
    .select('*')
    .then(users => res.json(users))
    .catch(err => res.status(400).json('unable to get the user'))
})

// POST for signin
app.post('/signin', handleSignin(db, bcrypt))

// POST for register
app.post('/register', handleRegister(db, bcrypt))

//GET for update the user
app.get('/profile/:id', handleProfileGet(db))

// PUT for updating the image
app.put('/image', handleImage(db))

// Predict the face position
app.post('/predict', handlePredict());

// Let the app listen to port
// In bash, run [PORT=3001 APIKey='aa296bf469ee48d2b1222b3d9a6ade70' node server.js] to start the app
const PORT = process.env.PORT;
app.listen(PORT, ()=> {
    console.log(`app is running on port ${PORT}`);
});

/*
/     --> res = this is working
/signin --> POST = success/fail
/register --> POST = add the new user into the database, return new user
/profile/:userId --> GET = return user
/image --> PUT = return user
*/