require("dotenv").config();
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
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.use(
  session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());

mongoose.connect(process.env.DB_HOST, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
mongoose.set("useCreateIndex", true);

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  password: String,
});

const authorSchema = new mongoose.Schema({
  name: String,
});

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  author: {
    type: authorSchema,
    required: true,
  },
  isbn: {
    type: Number,
    required: true,
  },
  description: String,
  publisher: {
    type: String,
    required: true,
  },
  yearOfPublication: Number,
  img: String,
});

const reviewSchema = new mongoose.Schema({
  book: {
    type: bookSchema,
    required: true,
  },
  rev: {
    type: String,
    required: true,
  },
  grade: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  user: String,
});

userSchema.plugin(passportLocalMongoose);

const User = new mongoose.model("User", userSchema);
const Book = new mongoose.model("Book", bookSchema);
const Author = new mongoose.model("Author", authorSchema);
const Review = new mongoose.model("Review", reviewSchema);

passport.use(User.createStrategy());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.get("/", (req, res) => {
  res.render("home");
});

app.get("/register", (req, res) => {
  let alreadyLoggedFlag = false;
  if (req.isAuthenticated()) {
    alreadyLoggedFlag = true;
  }
  let logRegFlag = true;
  res.render("register", {
    isLogReg: logRegFlag,
    isAuthenticated: alreadyLoggedFlag,
    callType: "register",
  });
});

app.get("/login", (req, res) => {
  let alreadyLoggedFlag = false;
  if (req.isAuthenticated()) {
    alreadyLoggedFlag = true;
  }
  let logRegFlag = true;
  res.render("register", { isLogReg: logRegFlag, isAuthenticated: alreadyLoggedFlag, callType: "login" });
});

app
  .route("/reviews")

  .get((req, res) => {
    let authFlag = false;
    let username = "Guest";
    if (req.isAuthenticated()) {
      authFlag = true;
      username = req.user.username;
    }
    Book.find({}, (err, foundBooks) => {
      if (err) {
        console.log(err);
      } else {
        Review.find({}, (err, foundReviews) => {
          if (err) {
            console.log(err);
          } else {
            res.render("reviews", {
              reviews: foundReviews,
              books: foundBooks,
              isLogReg: false,
              isAuthenticated: authFlag,
            });
          }
        });
      }
    });
  })

  .post((req, res) => {
    let authFlag = false;
    let username = "Guest";
    if (req.isAuthenticated()) {
      authFlag = true;
      username = req.user.username;

      const review = new Review({
        rev: req.body.review,
        grade: req.body.rating,
        user: req.user.username,
      });

      const tit = req.body.re.toString();

      Book.findOne({ title: tit }, (err, foundBook) => {
        if (err) {
          console.log(err);
        } else {
          if (foundBook) {
            review.book = foundBook;
            review.save();
            /**
             * todo: render page only after the data has been saved
             * cheap hack solution
             * sometimes db doesn't save data fast enough
             */
            setTimeout(() => {
              res.redirect("/reviews");
            }, 500);
          } else {
            console.log("No such book exists");
          }
        }
      });
    } else {
      console.log("Only registered users can enter data");
    }
  });

app
  .route("/books")

  .get((req, res) => {
    let authFlag = false;
    let username = "Guest";

    if (req.isAuthenticated()) {
      authFlag = true;
      username = req.user.username;
    }
    let authorsMid = {};
    Author.find({}, (err, foundAuthors) => {
      if (err) {
        console.log(err);
      } else {
        authorsMid = foundAuthors;
      }
    });
    Book.find({}, (err, foundBooks) => {
      if (err) {
        console.log(err);
      } else {
        res.render("books", {
          isAuthenticated: authFlag,
          isLogReg: false,
          books: foundBooks,
          userName: username,
          authors: authorsMid,
        });
      }
    });
  })

  /**
   * Placeholder pic: https://previews.123rf.com/images/mousemd/mousemd1710/mousemd171000009/87405336-404-not-found-concept-glitch-style-vector.jpg
   */
  .post((req, res) => {
    if (req.isAuthenticated()) {
      let book = new Book({
        title: req.body.title,
        isbn: req.body.isbn,
        description: req.body.description,
        publisher: req.body.publisher,
        yearOfPublication: req.body.yearOfPublication,
      });

      const info = req.body.author;

      Author.findOne(
        { name: { $regex: new RegExp("^" + info + "$", "i") } },
        (err, foundAuthor) => {
          if (err) {
            console.log(err);
          } else {
            if (foundAuthor) {
              book.author = foundAuthor;

              Book.findOne(
                {
                  title: book.title,
                  author: book.author,
                  isbn: book.isbn,
                  publisher: book.publisher,
                },
                (err, foundBook) => {
                  if (err) {
                    console.log(err);
                  } else {
                    if (foundBook) {
                      res.send("Book already exists");
                    } else {
                      book.save();
                      //todo
                      setTimeout(() => {
                        res.redirect("/books");
                      }, 500);
                    }
                  }
                }
              );
            } else {
              const newAuthor = new Author({
                name: info,
              });
              book.author = newAuthor;
              newAuthor.save();
              book.save();
              res.redirect("/books");
            }
          }
        }
      );
    } else {
      throw new Error("Invalid user");
    }
  });

app.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

app.post("/register", (req, res) => {
  User.findOne(
    { username: { $regex: new RegExp("^" + req.body.username + "$", "i") } },
    (err, foundUser) => {
      if (err) {
        console.log(err);
      } else {
        if (foundUser) {
          res.send("User with that username already exists");
        } else {
          User.register(
            { username: req.body.username },
            req.body.password,
            (err, user) => {
              if (err) {
                console.log(err);
                res.redirect("/register");
              } else {
                passport.authenticate("local")(req, res, () => {
                  res.redirect("/books");
                });
              }
            }
          );
        }
      }
    }
  );
});

app.post("/login", (req, res) => {
  const user = new User({
    username: req.body.username,
    password: req.body.password,
  });

  req.login(user, (err) => {
    if (err) {
      console.log(err);
    } else {
      passport.authenticate("local")(req, res, () => {
        res.redirect("/books");
      });
    }
  });
});

app.get("/switch", (req, res) => {
  req.logout();
  res.redirect("login");
});

app.use((req, res, next) => {
  res.status(404).send({
    status: 404,
    error: "No such page exists",
  });
});

app.listen(3000, () => {
  console.log("Server running");
});
