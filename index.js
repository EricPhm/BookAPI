const express = require('express');
const app = express(); // middleware for parse request to json
const PORT = 8080;
// const bodyParser = require('body-parser');

const { author } = require('./authors');
const { book } = require("./books");
const fs = require("fs");

//to run: node index.js

app.use(express.json()); // convert the body to json
// app.use(bodyParser.json()); // convert the body from json 
// fire it up
app.listen(
    PORT, () => console.log(`ALIVE on http://localhost:${PORT}`)
)

app.get("/", (req, res) => {
    res.send("Hello, world!");

});


app.get('/author', (req, res) => {
    res.status(200).json(author);
});


app.post("/author/create_author", (req, res) => {
    const { FullName } = req.body;
    const { Bio } = req.body;
    const { BirthDate } = req.body;
    const { PrimaryGenre } = req.body;

    if (!FullName || !Bio || !BirthDate || !PrimaryGenre) {
        res.status(418).send({ message: 'We need a full details on author'})
    } else {
        const new_author = {
            id: author.length,
            FullName,
            Bio,
            BirthDate,
            PrimaryGenre    
        }    
        //adds the new author to the author array in memory, 
        // but it doesn't automatically persist these changes to the data.js file
        author.push(new_author);

        // Update the books.js file with the new author data,    4 represent 4 spaces
        const newData = `let book = ${JSON.stringify(author, null, 4)};\n\nmodule.exports = { author };`;
        fs.writeFileSync('./authors.js', newData);

        res.status(201).json(author);    
    }
});

// Update a specific author's bio
app.patch("/author/change_bio/:id", (req, res) => {
    const { id } = req.params;
    const { new_Bio } = req.body;

    if (!author[id]){ //.id != id) {
        return res.status(404).json({ message: "Author not found" });
    } 

    author[id].Bio = new_Bio;

    const newData = `let author = ${JSON.stringify(author, null, 4)};\n\nmodule.exports = { author };`;
    fs.writeFileSync('./authors.js', newData);
    // updating 200
    res.status(202).json(author);    
});



app.get('/books', (req, res) => {
    res.status(200).json(book);
});

// Add a book
app.post('/books/add_book', (req, res) => {
    // need to be match in books.js data name
    const{ 
        Title, 
        SubTitle, 
        Original_publication_date, 
        Tags,
        Primary_author_id,
        Edition
        // Edition_num,
        // Publication_date

    } = req.body; 

    if (!Title || !Original_publication_date || !Tags || !Primary_author_id) {
        res.status(412).send({ message: 'We need a full details on book creation'})
    }
    
    if (!Array.isArray(Edition) || Edition.length === 0) {
        res.status(412).send({ message: 'We need a full details on edition'})
    }
    // check each edition object
    // edition should have 2 elements: Edition_num and Publication_date
    for(let i = 0; i < Edition.length; i++){
        // Edition[i].length return JSON string
        const edition = Edition[i];
        if(!edition.Edition_num || !edition.Publication_date){
            res.status(412).send({ message: 'We need a full details on edition ' + i})
        }
    }
    
    if (!SubTitle){
        const new_book = {
            id: book.length,
            Title,
            Original_publication_date,
            Tags,
            Primary_author_id,
            Edition 
        }
        book.push(new_book);
        const newData = `let book = ${JSON.stringify(book, null, 4)};\n\nmodule.exports = { book };`;
        fs.writeFileSync('./books.js', newData);

    } else {
        const new_book = {
            id: book.length,
            Title,
            SubTitle,
            Original_publication_date,
            Tags,
            Primary_author_id,
            Edition 
        }
        book.push(new_book)
        const newData = `let book = ${JSON.stringify(book, null, 4)};\n\nmodule.exports = { book };`;
        fs.writeFileSync('./books.js',newData)
    }

    res.status(201).json(book);    
});

// list of tags - tags?tags=suspenseful&tags=thrilling - work
app.get("/books/tags", (req, res) => {
    // let because if 1 tag provided 
    // then can change it to array
    let {tags} = req.query;


    // Check if the 'tags' query parameter is provided
    if (!tags) {
        return res.status(400).json({ message: "Please provide a valid list of tags" });
    }

    // If tags is not an array, convert it to an array for future use
    if (!Array.isArray(tags)) {
        tags = [tags];
    }   

    // filter out book with differ tags
    const bookHoler = book.filter(book => {
        return tags.every(tag => book.Tags.includes(tag));
    });
    // if no books match the tags
    if (bookHoler.length === 0) {
        return res.status(404).json({ message: "No books match the provided tags" });
    }

    res.status(200).json(bookHoler);
});

// List all books by a specific author - work
app.get("/author/author_book/:author_id", (req, res) => {
    const { author_id } = req.params;
    const bookFile = []
    for(let i = 0; i < book.length; i++) {
        if(book[i].Primary_author_id == author_id) {
            bookFile.push(book[i]);
        }
    }
    if(bookFile.length == 0){
        res.status(404).json({ message:"No author match this ID"});
    } 

    res.status(200).json(bookFile);
});

//Get the details of a specific book - work
app.get("/books/book_details/:id", (req, res) => {
    const { id } = req.params;
    
    if (!book[id]) {
        res.status(404).json({ message:"This book ID is invalid"});
    }
    // memory released when exit the function
    const bookDetails = [];
    bookDetails.push(book[id]);
    res.status(200).json(bookDetails);
});

// Update any of the attributes of a specific book // 0?editionNum=1
// should check for !== undefined ?
app.patch("/books/update/:id", (req, res) => {
    const { id } = req.params;
    const editionNum = req.query.editionNum; // Retrieve editionNum from the request parameters
    const edition_num = editionNum ? parseInt(editionNum) : null; // Parse editionNum to integer if provided
    if (edition_num < 0){
        res.status(412).json({ message: "edition_num < 0"})
    }
    const{ 
        new_Title, 
        new_SubTitle, 
        new_Original_publication_date, 
        new_Tags,
        new_Primary_author_id,
        new_Edition_num,
        new_Publication_date
    } = req.body; 

    if (!book[id]){
        res.status(404).json({ message: "Invalid ID for book"})
    }

    if (new_Edition_num && !edition_num || new_Publication_date && !edition_num){
        res.status(412).json({message: "need to have a edition num"})
    }

    if (new_Title) book[id].Title = new_Title;
    if (new_SubTitle) book[id].SubTitle = new_SubTitle;
    if (new_Original_publication_date) book[id].Original_publication_date = new_Original_publication_date;
    if (new_Tags) book[id].Tags = new_Tags;
    if (new_Primary_author_id) book[id].Primary_author_id = new_Primary_author_id;
    
    if (!edition_num){
        if (new_Edition_num) {
            book[id].Edition[edition_num].Edition_num = new_Edition_num;
        }
        if (new_Publication_date){
            book[id].Edition[edition_num].Publication_date = new_Publication_date;
        } 
    }

    const bookDetails = [book[id]]
    const newData = `let book = ${JSON.stringify(book, null, 4)};\n\nmodule.exports = { book };`;
    fs.writeFileSync('./books.js',newData)
    res.status(202).json(bookDetails);    
});


//Remove a book (and by extension all its editions) work
app.delete("/books/delete_last_book", (req, res) => {
    const index = book.length - 1;

    if (index === -1){
        res.status(404).json({ message: "No more book to remove"})
    }
    // remove from array
    book.splice(index, 1);
    const newData = `let book = ${JSON.stringify(book, null, 4)};\n\nmodule.exports = { book };`;
    fs.writeFileSync('./books.js', newData);
    res.status(200).json({ message: "Book Removed success"})

});

//Add an edition of a specific book - work
app.post("/books/add_editions/:id", (req, res) =>{
    const { id } = req.params;
    const { Edition_num, Publication_date } = req.body;
    if (!book[id]){
        res.status(404).json({ message: "Invalid ID for book"})
    }

    // const edition = book[id].Edition[Edition.length]
    if (!Edition_num || !Publication_date){
        res.status(400).json({ message: "Need 2 elements for edition"})
    }
    const newEdition = {
        Edition_num,
        Publication_date
    };

    book[id].Edition.push(newEdition);

    const newData = `let book = ${JSON.stringify(book, null, 4)};\n\nmodule.exports = { book };`;
    fs.writeFileSync('./books.js', newData);

    res.status(201).json({ message: "Book added edition successfully"});
});

//List editions of a specific book - work
app.get("/books/list_editions/:id", (req, res) =>{
    const { id } = req.params;
    if (!book[id]){
        res.status(404).json({ message: "Invalid ID for book"})
    }
    const edition_holder = [];
    let size = book[id].Edition.length;
    for (let i = 0; i < size; i++){
        edition_holder.push(book[id].Edition[i]);
    }

    res.status(200).json(edition_holder);
});

//Remove an edition of a specific book - work
app.delete("/books/remove_editions/:id", (req, res) =>{
    const { id } = req.params;
    if (!book[id]){
        res.status(404).json({ message: "Invalid ID for book"})
    }

    let index = book[id].Edition.length - 1;
    if (index < 0){
        res.status(404).json({ message: "No more edition for this book"})
    }
    book[id].Edition.splice(index,1);

    const newData = `let book = ${JSON.stringify(book, null, 4)};\n\nmodule.exports = { book };`;
    fs.writeFileSync('./books.js', newData);
    res.status(202).json({ message: "Book's edition Removed success"})
    
});

