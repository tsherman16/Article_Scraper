$(function () {
    $("#scrapeArticles").on("click", function () {
        event.preventDefault();

        if (data) {
            $.getJSON("/all", function(data) {
                res.render("index", { articles: data })
            })
        } else {
            console.log("Uh Oh. Looks like we don't have any new articles.")
        }
    })
})