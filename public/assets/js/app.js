$("#scrapeArticles").on("click", function (req, res) {
    event.preventDefault();


    $.getJSON("/all", function (err, data) {
        if (data) {
            res.render("index", { articles: data }) 
        }
    })
})