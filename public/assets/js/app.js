$("#scrapeArticles").on("click", function (req, res) {
    event.preventDefault();

    $.getJSON("/all", function (err, data) {
            res.render("index", { articles: data })
    })
})