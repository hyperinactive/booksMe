$('document').ready(() => {
  // todo ES5 functions? JQuery mixed with Javascript? Does it work? Yes, but it's terrible!!!

  setFilterListeners();

  function setFilterListeners() {
    $('#filter-btn-title').click(() => {
      filterAlphabetically('title');
    });
    $('#filter-btn-author').click(() => {
      filterAlphabetically('author');
    });
    $('#filter-btn-isbn').click(() => {
      filterNumerically('isbn');
    });
  }

  function filterAlphabetically(arg) {
    let nodes = document.querySelectorAll('.book-row');
    let arg_code = -1;

    arg === 'author' ? (arg_code = 1) : (arg_code = 0);

    filterReverse(arg, nodes, arg_code);
  }

  function filterNumerically(arg) {
    let nodes = document.querySelectorAll('.book-row');
    let arg_code = 2;

    filterReverse(arg, nodes, arg_code);
  }
});
/**************************************************************************/

function filterReverse(arg, nodes, arg_code) {
  if (
    $('#filter-btn-' + arg)
      .children()
      .hasClass('btn-dark')
  ) {
    $('#filter-btn-' + arg)
      .children()
      .removeClass('btn-dark');
    $('#filter-btn-' + arg)
      .children()
      .addClass('btn-light');

    if (arg_code !== 2) {
      sortDOMAlpha(nodes, arg_code, 'asc');
    } else {
      sortDOMNum(nodes, 2, 'asc');
    }
  } else {
    $('#filter-btn-' + arg)
      .children()
      .addClass('btn-dark');
    $('#filter-btn-' + arg)
      .children()
      .removeClass('btn-light');

    if (arg_code !== 2) {
      sortDOMAlpha(nodes, arg_code, 'desc');
    } else {
      sortDOMNum(nodes, 2, 'desc');
    }
  }
}

function sortDOMAlpha(nodeList, typeOfField, typeOfSort) {
  let an = Array.from(nodeList);
  let reverseUno = 0;
  typeOfSort === 'asc' ? (reverseUno = 1) : (reverseUno = -1);

  document.querySelector('.book-container').innerHTML = '';

  let na = an.sort(function (a, b) {
    var im = a.children[0].children[typeOfField].innerHTML
      .toString()
      .localeCompare(b.children[0].children[typeOfField].innerHTML.toString());
    return im * reverseUno;
  });

  let container = document.querySelector('.book-container');

  for (let i = 0; i < na.length; i++) {
    container.appendChild(na[i]);
  }
}

function sortDOMNum(nodeList, typeOfField, typeOfSort) {
  let an = Array.from(nodeList);
  let container = document.querySelector('.book-container');
  let reverseUno;
  typeOfSort === 'asc' ? (reverseUno = true) : (reverseUno = false);

  document.querySelector('.book-container').innerHTML = '';

  if (reverseUno) {
    let na = an.sort(function (a, b) {
      if (
        parseInt(a.children[0].children[typeOfField].innerHTML) >
        parseInt(b.children[0].children[typeOfField].innerHTML)
      ) {
        return 1;
      } else if (
        parseInt(a.children[0].children[typeOfField].innerHTML) <
        parseInt(b.children[0].children[typeOfField].innerHTML)
      ) {
        return -1;
      } else return 0;
    });

    for (let i = 0; i < na.length; i++) {
      container.appendChild(na[i]);
    }
  } else {
    let na = an.sort(function (a, b) {
      if (
        parseInt(a.children[0].children[typeOfField].innerHTML) <
        parseInt(b.children[0].children[typeOfField].innerHTML)
      ) {
        return 1;
      } else if (
        parseInt(a.children[0].children[typeOfField].innerHTML) >
        parseInt(b.children[0].children[typeOfField].innerHTML)
      ) {
        return -1;
      } else return 0;
    });

    for (let i = 0; i < na.length; i++) {
      container.appendChild(na[i]);
    }
  }
}
