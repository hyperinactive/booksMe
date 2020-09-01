console.log("This just works");

console.log($(".add-btn").val());

$(".add-btn").click(() => {
  console.log("I work");
  if ($(".add-btn").val() === "Add a book, now!") {
    console.log("click");
    $("#add-book").hide();
    $(".add-btn").val("Maybe not");
  } else {
    console.log("reverse click");
    $("#add-book").show();
    $(".add-btn").val("Add a book, now!");
  }
})