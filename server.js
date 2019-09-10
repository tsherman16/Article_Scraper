// Dependencies
var express = require("express");
var mongoose = require("mongoose");
var exphbs = require("express-handlebars");
// Require axios and cheerio. This makes the scraping possible
var axios = require("axios");
var cheerio = require("cheerio");

// Require all models
var db = require("./models");

// Initialize Express
var app = express();

// Set up a static folder (public) for our web app
app.use(express.static("public"));

// Connect to the Mongo DB
mongoose.connect("mongodb://localhost/unit18Populater", { useNewUrlParser: true });

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

app.get("/articles", function (req, res) {
    db.Article.find({}, function (err, data) {
        if (err) {
            console.log(err);
        } else {
            res.render("index", { articles: data })
        }
    })
});

app.get("/saved", function (req, res) {
    res.render("saved");
});

app.get("/clear", function (req, res) {
    db.Article.remove({}, function () {
        res.redirect("/articles");
    });
})

app.get("/articles/:id", function (req, res) {
    db.Article.findOne({ _id: req.params.id })
    .populate("comment")
    .then(function (dbArticle) {
        res.json(dbArticle)
    })
    .catch(function (err) {
        res.json(err);
    });
})

app.post("/articles/:id", function (req, res) {
    db.Article.create(req.body)
    .then(function (dbComment) {
        return db.Article.findOneAndUpdate({ _id: req.params.id }, { comment: dbComment._id });
    })
    .then(function (dbArticle) {
        res.json(dbArticle);
    })
    .catch(function (err) {
        res.json(err);
    });
})

app.get("/scrape", function (req, res) {
    axios.get("https://www.nytimes.com/").then(function (response) {
        var $ = cheerio.load(response.data);

        $("article").each(function (i, element) {
            var result = {};

            result.title = $(this).children().text();
            result.link = $(this).find("a").attr("href");
            result.summary = $(this).find("p").text();

            db.Article.create(result)
                .then(function (dbArticle) {
                    console.log(dbArticle);
                })
                .catch(function (err) {
                    console.log(err);
                });
        });

        res.redirect("/articles");
    });
})

app.listen(8080, function () {
    console.log("App running on port 8080!");
});