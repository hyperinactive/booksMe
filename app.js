require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const session = require("express-session");
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");


const app = express();
app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

mongoose.connect(process.env.DB_HOST, {useNewUrlParser: true, useUnifiedTopology: true});
mongoose.set("useCreateIndex", true);

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    password: String
});


const authorSchema = new mongoose.Schema({
    name: String,
});


const bookSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    author: {
        type: authorSchema,
        required: true
    },
    isbn: {
        type: Number,
        required: true
    },
    description: String,
    publisher: {
        type: String,
        required: true
    },
    yearOfPublication: Number,
    img: String
});

const reviewSchema = new mongoose.Schema({
    book: {
        type: bookSchema,
        required: true
    },
    rev: {
        type: String,
        required: true
    },
    grade: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    user: String
});

userSchema.plugin(passportLocalMongoose);

const User = new mongoose.model("User", userSchema);
const Book = new mongoose.model("Book", bookSchema);
const Author = new mongoose.model("Author", authorSchema);
const Review = new mongoose.model("Review", reviewSchema);

passport.use(User.createStrategy());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.get("/", (req, res)=>{
    res.render("home");
});

app.get("/register", (req, res) => {
    if (req.isAuthenticated()) {
        res.redirect("already-logged");
    } else {
        res.render("register");
    }
});

app.get("/login", (req, res)=>{
    if (req.isAuthenticated()) {
        res.redirect("already-logged");
    } else {
        res.render("login");
    }
});

app.get("/already-logged", (req, res) => {
    if (req.isUnauthenticated()) {
        res.redirect("register");
    } else {
        res.render("already-logged", {username: req.user.username});
    }
});

app.get("/reviews", (req, res)=>{

    if (req.isAuthenticated()) {
        res.redirect("/reviews4members");
    } else {
        Review.find({}, (err, foundReviews)=>{
            if (err) {
                console.log(err);
            } else {    
                res.render("reviews", {reviews: foundReviews});
            }
        });
    }

 
});

app.route("/reviews4members")

.get((req, res)=>{
    if (req.isAuthenticated()) {

        Book.find({}, (err, foundBooks)=>{
            if (err) {
                console.log(err);
            } else {
                Review.find({}, (err, foundReviews)=>{
                    if (err) {
                        console.log(err);
                    } else {
                        res.render("reviews4members", {reviews: foundReviews, books: foundBooks});
                    }
                });
            }
        });
    } else {
        res.redirect("login");
    }
})

.post((req, res)=>{
    if (req.isAuthenticated()) {
        const review = new Review({
            rev: req.body.review,
            grade: req.body.rating,
            user: req.user.username
        });

        const tit =  req.body.re.toString();

        Book.findOne({title: tit}, (err, foundBook)=>{
            if (err) {
                console.log(err);
            } else {
                if (foundBook) {
                    review.book = foundBook;
                    review.save();
                    res.redirect("reviews4members");
                } else {
                    console.log("No such book exists");
                }
            }
        });

    } else {
        res.send("Invalid user");
    }
});

app.get("/books", (req, res)=>{
    if (req.isAuthenticated()) {
        res.redirect("/books4members");
    } else {
        let authorsMid = {};
        Author.find({}, (err, foundAuthors)=>{
            if (err) {
                console.log(err);
            } else {
                authorsMid = foundAuthors;
            }
        });

    Book.find({}, (err, foundBooks)=>{
        if (err) {
            console.log(err);
        } else {
            res.render("books", {books: foundBooks, authors: authorsMid});
        }
    });
    }
});

app.route("/books4members")

.get((req, res)=>{
    if(req.isAuthenticated()) {
        let authorsMid = {};
        Author.find({}, (err, foundAuthors)=>{
            if (err) {
                console.log(err);
            } else {
                authorsMid = foundAuthors;
            }
        });
        Book.find({}, (err, foundBooks)=>{
            if (err) {
                console.log(err);
            } else {
                res.render("books4members", {books: foundBooks, userName: req.user.username, authors: authorsMid});
            }
        });
    } else {
        res.redirect("/login");
    }
})

.post((req, res)=>{
    
    if (req.isAuthenticated()) {

        let book = new Book({
            title: req.body.title,
            isbn:   req.body.isbn,
            description: req.body.description,
            publisher: req.body.publisher,
            yearOfPublication: req.body.yearOfPublication
        });
    
        const info = req.body.author;
    
        Author.findOne({ "name": { $regex: new RegExp("^" + info + "$", "i") } }, (err, foundAuthor) => {
            if (err) {
                console.log(err);
            } else {
                if (foundAuthor) {
                    book.author = foundAuthor;
    
                    Book.findOne({ title: book.title, author: book.author, isbn: book.isbn, publisher: book.publisher }, (err, foundBook) => {
                        if (err) {
                            console.log(err);
                        } else {
                            if (foundBook) {
                                res.send("Book already exists");
                            } else {
                                book.save();
                                res.redirect("/books4members");
                            }
                        }
                    });
                } else {
                    const newAuthor = new Author({
                        name: info
                    });
                    book.author = newAuthor;
                    newAuthor.save();
                    book.save();
                    res.redirect("/books4members");
                }
            }
        });
    } else {
        throw new Error("Invalid user");
    }
});

app.get("/logout", (req, res)=>{
    req.logout();
    res.redirect("/"); 
 });

app.post("/register", (req, res)=>{

    User.findOne({ "username": { $regex: new RegExp("^" + req.body.username + "$", "i") } }, (err, foundUser)=>{
        if (err) {
            console.log(err);
        } else {
            if (foundUser) {
                res.send("User with that username already exists");
            } else {
                User.register({ username: req.body.username }, req.body.password, (err, user) => {
                    if (err) {
                        console.log(err);
                        res.redirect("/register");
                    } else {
                        passport.authenticate("local")(req, res, () => {
                            res.redirect("/books4members")
                        });
                    }
                });
            }
        }
    });
});

app.post("/login", (req, res)=>{
    const user = new User({
        username: req.body.username,
        password: req.body.password
    });

    req.login(user, err=>{
        if(err) {
            alert("Something went wrong, please try again");
            console.log(err);
        } else {
            passport.authenticate("local")(req, res, ()=>{
                res.redirect("/books4members");
            });
        }
    })
});

app.get("/switch", (req, res) => {
    req.logout();
    res.redirect("login");
});

/* 
app.post("/kill-me", (req, res) => {
   
    const foo = req.body.search.toLowerCase();
    
    Author.find({ "name": {$regex: new RegExp("^" + foo, "i")} }, (err, foundAuthors) => {
        if (err) {
           console.log(err);
        } else {
            if (foundAuthors) {
                console.log(foundAuthors);
            }
       }
    });

    res.redirect("books4members");

});
*/

app.use((req, res, next) => {
    res.status(404).send({
    status: 404,
    error: "No such page exists"
    });
});

app.listen(3000, ()=>{
    console.log("Server running");
});