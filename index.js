const express = require('express');
const app = express();
const fcfs = require('./algos/fcfs');
app.use(express.json());
app.use('/fcfs',fcfs);

app.listen(8000, () => {console.log("server is listning ");})