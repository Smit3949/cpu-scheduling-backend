const express = require('express');
const app = express();
const fcfs = require('./algos/fcfs');
const ljf = require('./algos/ljf');
const lrtf = require('./algos/lrtf');
const srtf = require('./algos/srtf');
const sjf = require('./algos/sjf');
const rr = require('./algos/rr');
const prio_p = require('./algos/prio_p');
const prio_np = require('./algos/prio_np');

app.use(express.json());
app.use('/fcfs', fcfs);
app.use('/ljf', ljf);
app.use('/lrtf', lrtf);
app.use('/srtf', srtf);
app.use('/sjf', sjf);
app.use('/rr', rr);
app.use('/prio_p', prio_p);
app.use('/prio_np', prio_np);

app.listen(8000, () => {console.log("server is listning ");})