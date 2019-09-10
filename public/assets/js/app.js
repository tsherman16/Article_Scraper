$(document).on("click", ".commentButton", function() {

    var thisId = $(this).attr("data-id");

    $.ajax({
        method: "GET",
        url: "/articles/" + thisId
    })
    .then(function(data) {
        console.log(data);
        // A textarea to add a comment
        $("#comments").append("<textarea id='commentInput' name='comment'></textarea>")
        // A button to submit a new comment, with the id of the article saved to it
        $("#comments").append("<button data-id='" + data._id + "' class='btn btn-success saveComment'>Save Comment</button>");

        if (data.comment) {
            // Place the body of the comment in the body textarea
            $("#commentInput").val(data.comment.body);
        }
    });
});

$(document).on("click", ".saveComment", function() {
    var thisId =$(this).attr("data-id");

    $.ajax({
        method: "POST",
        url: "/articles/" + thisId,
        data: {
            body: $("#commentInput").val()
        }
    })
    .then(function(data) {
        console.log(data);
        $("#comments").empty();
    })

    $("#commentInput").val("");
})