const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs');

// Set up EJS
app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static assets
app.use(express.static(path.join(__dirname, "public")));
app.use('/files', express.static(path.join(__dirname, 'files')));

// Route: Home Page
app.get('/', (req, res) => {
    fs.readdir('./files', (err, files) => {
        if (err) {
            console.error(err);
            res.status(500).send("Error reading files directory.");
        } else {
            res.render("index", { files: files });
        }
    });
});

// Route: Read File
app.get('/file/:filename', (req, res) => {
    const filePath = `./files/${req.params.filename}`;
    fs.readFile(filePath, "utf-8", (err, filedata) => {
        if (err) {
            console.error(err);
            res.status(404).send("File not found.");
        } else {
            res.render("file", { filename: req.params.filename, content: filedata });
        }
    });
});

// Route: Edit File Page
app.get('/edit/:filename', (req, res) => {
    const filePath = `./files/${req.params.filename}`;
    fs.access(filePath, fs.constants.F_OK, (err) => {
        if (err) {
            console.error(err);
            res.status(404).send("File not found.");
        } else {
            res.render("edit", { oldFilename: req.params.filename });
        }
    });
});

// Route: Rename File
app.post('/edit/:filename', (req, res) => {
    const oldFilePath = `./files/${req.params.filename}`;
    const newFilePath = `./files/${req.body.newName}.txt`;

    fs.rename(oldFilePath, newFilePath, (err) => {
        if (err) {
            console.error(err);
            res.status(500).send("Error renaming the file.");
        } else {
            res.redirect("/");
        }
    });
});

// Route: Create File
app.post('/create', (req, res) => {
    const fileName = req.body.title.split(' ').join('') + ".txt";
    const fileContent = req.body.details;

    fs.writeFile(`./files/${fileName}`, fileContent, (err) => {
        if (err) {
            console.error(err);
            res.status(500).send("Error creating the file.");
        } else {
            res.redirect("/");
        }
    });
});

// Start the server
app.listen(3000, () => {
    console.log("Server is running on http://localhost:3000");
});
