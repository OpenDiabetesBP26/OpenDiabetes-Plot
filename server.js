const express = require('express');
const path = require('path');

const app = express();

// Serve the static files from the React app
app.use(express.static(path.join(__dirname, 'dist', 'data')));

app.get('/data/*', (req,res) => {
    res.sendFile(path.join(__dirname, 'dist', req.path.trim('/')));
});

app.get('/favicon*', (req,res) => {
    res.sendFile(path.join(__dirname, 'dist', req.path.trim('/')));
});

app.get('/android-icon*', (req,res) => {
    res.sendFile(path.join(__dirname,'dist', req.path.trim('/')));
});

app.get('/apple-icon*', (req,res) => {
    res.sendFile(path.join(__dirname, 'dist', req.path.trim('/')));
});

app.get('/ms-icon*', (req,res) => {
    res.sendFile(path.join(__dirname, 'dist', req.path.trim('/')));
});

app.get('/manifest.json', (req,res) => {
    res.sendFile(path.join(__dirname,'dist', req.path.trim('/')));
});

app.get('/browserconfig.xml', (req,res) => {
    res.sendFile(path.join(__dirname, 'dist', req.path.trim('/')));
});

// An api endpoint that returns a short list of items
app.get('/main.bundle.js', (req,res) => {
    res.sendFile(path.join(__dirname, 'dist', 'main.bundle.js'));
});

// Handles any requests that don't match the ones above
app.get('*', (req,res) =>{
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

const port = process.env.PORT || 8080;
app.listen(port);

console.log('App is listening on port ' + port);