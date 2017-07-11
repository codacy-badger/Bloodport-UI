const express = require('express'),
    path = require('path'),
    app = express()
app.use(express.static('./'));
app.use(express.static('public'));
app.get('/', (request, response) => {
    response.sendFile(path.join(__dirname, 'test.html'));
})

app.listen(8000, () => {
    console.log('Server running on port 8000')
})