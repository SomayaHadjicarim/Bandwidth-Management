import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { MikroNode } from 'mikronode';
// const cors = require('cors')


import usersRoutes from './routes/users.js';


const defaultUsername = 'admin';
const defaultPassword = '22234567';

const app = express();
const PORT = 5000;

app.use(bodyParser.json());                                                                                                         
                         
app.use('/', usersRoutes);
app.use(cors());



app.listen(PORT, () => console.log('Server Running on port: http://localhost${PORT}'));
