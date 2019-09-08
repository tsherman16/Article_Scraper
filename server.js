// Dependencies
var express = require("express");
var mongojs = require("mongojs");
var exphbs = require("express-handlebars");
// Require axios and cheerio. This makes the scraping possible
var axios = require("axios");
var cheerio = require("cheerio");

// Initialize Express
var app = express();

// Set up a static folder (public) for our web app
app.use(express.static("public"));

// Database configuration
var databaseUrl = "articles";
var collections = ["scrapedArticles"];

// Hook mongojs configuration to the db variable
var db = mongojs(databaseUrl, collections);
db.on("error", function (error) {
    console.log("Database Error:", error);
});

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

app.get("/", function (req, res) {
    res.render("index");
});

app.get("/saved", function (req, res) {
    res.render("saved");
});

axios.get("https://www.nytimes.com/").then(function (response) {
    var $ = cheerio.load(response.data);
    var results = [];

    $("article").each(function (i, element) {

        var title = $(element).children().text();
        var link = $(element).find("a").attr("href");
        var summary = $(element).find("p").text();

        if (title && link && summary) {
            results.push({
                title: title,
                link: link,
                summary: summary
            });
        }
    });

    for (var i = 0; i < results.length; i++) {
        db.scrapedArticles.insert({
            title: results[i].title,
            link: results[i].link,
            summary: results[i].summary
        });
    }
});

app.get("/all", function (req, res) {
    db.scrapedArticles.find({}, function (error, found) {
        if (error) {
            console.log(error);
        } else {
            res.json(found);
        }
    })
})








// Listen on port 3000
app.listen(3000, function () {
    console.log("App running on port 3000!");
});