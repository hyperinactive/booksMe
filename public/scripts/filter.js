$("document").ready(() => {

    $("#filter-btn-author").click(() => {

        let nodes = document.querySelectorAll(".book-row");
        let arr = Array.from(nodes);

        if ($("#filter-btn-author").children().hasClass("btn-dark")) {

            $("#filter-btn-author").children().removeClass("btn-dark");
            $("#filter-btn-author").children().addClass("btn-light");

            let an = Array.from(document.querySelectorAll(".book-row"));
            document.querySelector(".book-container").innerHTML = "";
            

            let na = an.sort(function (a, b) {
                var im = a.children[0].children[1].innerHTML.toString().localeCompare(b.children[0].children[1].innerHTML.toString());
                return im;
            });
            
            let container = document.querySelector(".book-container");
            
            for (let i = 0; i < na.length; i++) {
                container.appendChild(na[i]);
            }

            

        } else {
            $("#filter-btn-author").children().addClass("btn-dark");
            $("#filter-btn-author").children().removeClass("btn-light");

            let an = Array.from(document.querySelectorAll(".book-row"));
            document.querySelector(".book-container").innerHTML = "";
            

            let na = an.sort(function (a, b) {
                var im = a.children[0].children[1].innerHTML.toString().localeCompare(b.children[0].children[1].innerHTML.toString());
                return im*(-1);
            });
            
            let container = document.querySelector(".book-container");
            
            for (let i = 0; i < na.length; i++) {
                container.appendChild(na[i]);
            }
        }
    });
});