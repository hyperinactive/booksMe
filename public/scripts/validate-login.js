$("document").ready(() => {

    $(".password").on("change keyup paste", () => {
        checkMe();
    });

    $(".username").on("change keyup paste", () => {
        checkMe();
    });
});

function checkMe() {

    if (($(".username").val() === "") || ($(".password").val() === "")) {
        $(".login-btn").prop("disabled", true);
    } else {
        $(".login-btn").prop("disabled", false);
    }

}