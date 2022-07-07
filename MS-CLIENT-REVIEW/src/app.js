const app = require('express')();

const PORT = 3002;

app.get('/', (_, res) => {
    return res.send({ message: 'Hello World!' });
});

app.listen(PORT);