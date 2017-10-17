
  // ####### MENU
  let button = document.querySelector("#btn-sanduiche");
  let menu = document.querySelector("#menu");

  function toggleMenu() {
    menu.classList.toggle("show");
  }

  button.addEventListener("click", toggleMenu);

  // ####### ACCORDION
  let collapses = document.querySelectorAll(".accordion .collapse");

  function showCollapse(i) {
    collapses[i].classList.toggle("show");
  }

  for(let i=0; i < collapses.length; i++) {
    collapses[i].addEventListener("click", function(){showCollapse(i);});
  }
