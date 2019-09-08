$("#scrapeArticles").on("click", function (req, res) {
    event.preventDefault();

    $.getJSON("/all", function (err, data) {

        let articleObj = {
            articleArray = []
        };

        if (data) {
            for (let i = 0; i < data.length; i++) {
                articleObj.articleArray.push(data[i])
            }

            res.render("index", { articles: articleObj })
        }
    })
})