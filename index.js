const express = require('express');
const dotenv = require('dotenv')
const app = express();
const router = require('./routes/routes')

const port = process.env.PORT;

app.use('/', router)

app.listen(port, () => {
    console.log(`Apps running at http://localhost:${port}`);
});