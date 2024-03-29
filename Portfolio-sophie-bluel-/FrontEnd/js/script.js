//call image and text for the gallery
const displayGallery = (works) => {
  const gallery = document.querySelector(".gallery");
  gallery.innerHTML = "";
  //for each image and text
  works.forEach(function (work) {
    const imageUrl = work.imageUrl;
    const title = work.title;
    // create element place  
    const figure = document.createElement('figure');

    const image = document.createElement('img');
    image.src = imageUrl;
    figure.appendChild(image);

    const text = document.createElement('figcaption');
    text.innerText = title;
    figure.appendChild(text);
    // attach element to parent 
    gallery.appendChild(figure);

  })
}
// target element to category
const handleFilterWorks = (event, works) => {
  const filtredCategory = event.target.textContent.toLowerCase();
  let filteredWorks = []

  if (filtredCategory === "tous") {
    filteredWorks = works;
  } else {
    filteredWorks = works.filter(function (work) {
      return work.category.name.toLowerCase() === filtredCategory;
    });
  }
  displayGallery(filteredWorks);
}
function init(){// to init the elements call by API (img, text...)
  // call to the api
fetch('http://localhost:5678/api/works')
.then(function (response) {
  if (response.ok) {
    return response.json();
  }
})
.then(function (works) {
  //remove duplicate of array
  const categories = new Set();
  displayGallery(works);
  //each element add to set of categories, collect categories
  works.forEach(function (work) {
    categories.add(work.category.name);
  })
  // identification ok editor mode on the index page
  const token = localStorage.getItem('token');
  if (!token) {
    // create button for elements of gallery 
    const filterBar = document.querySelector('.filterBar');
    Array.from(categories).forEach(category => {
      const categoryElement = document.createElement('div');
      categoryElement.classList.add("filterBarButton");
      categoryElement.textContent = category;

      categoryElement.addEventListener('click', (event) => handleFilterWorks(event, works))

      filterBar.appendChild(categoryElement);
    });
    const filterButtonAll = document.getElementById('filterButtonAll');
    filterButtonAll.addEventListener('click', (event) => handleFilterWorks(event, works))
  } else {
    const filterButtonAll = document.getElementById('filterButtonAll');
    filterButtonAll.style.display = "none";
  }
})

.catch(function (error) {

});
}
init();
// identification ok editor mode on the index page
const token = localStorage.getItem('token');
if (token) {
  //change login to logout (clean locale storage)
  const logOut = document.getElementById("loginButton");
  logOut.addEventListener('click', () => {
    localStorage.clear();
    window.location.href = 'login.html';
  })
  logOut.textContent = 'logout';
  logOut.style.cursor = "pointer";
  logOut.classList.add('nav', 'li');
  //localStorage.clear();

  // create each element of Editor mode 
  const editorMode = document.querySelector('.editorMode');

  const headerBar = document.createElement('div');
  headerBar.textContent = 'Mode édition';
  headerBar.classList.add('editorMode__BarHeader');

  const headerBarButton = document.createElement('button');
  headerBarButton.textContent = 'publier les changements';
  headerBarButton.classList.add('editorMode__button');
  headerBar.appendChild(headerBarButton);

  const idImage = document.createElement('div');
  idImage.textContent = 'modifier';
  idImage.classList.add('editorMode__idImage');

  const textEdition = document.createElement('div');
  textEdition.textContent = 'modifier';
  textEdition.classList.add('editorMode__textEdition');

  const filters = document.createElement('div');
  filters.textContent = 'modifier';
  filters.classList.add('editorMode__filterBar');
  // .insertbefore is for the font icon place
  const fontModal = document.createElement('i');
  fontModal.classList.add('fas', 'fa-edit');
  headerBar.insertBefore(fontModal, headerBar.firstChild);

  const fontIdImage = document.createElement('i');
  fontIdImage.classList.add('fas', 'fa-edit');
  idImage.insertBefore(fontIdImage, idImage.firstChild);

  const fontTextEdition = document.createElement('i');
  fontTextEdition.classList.add('fas', 'fa-edit');
  textEdition.insertBefore(fontTextEdition, textEdition.firstChild);

  const fontFilters = document.createElement('i');
  fontFilters.classList.add('fas', 'fa-edit');
  filters.insertBefore(fontFilters, filters.firstChild);

  editorMode.appendChild(headerBar);
  editorMode.appendChild(idImage);
  editorMode.appendChild(filters);
  editorMode.appendChild(textEdition);

  // "click" to call modale (differents button)
  const modalButton = [headerBarButton, idImage, filters, textEdition];
  const modalOpen = document.getElementById("modal");
  //function selection Button
  modalButton.forEach(function (button) {
    button.addEventListener('click', function (event) {
      console.log('ok');
      modalOpen.style.display = "block";
      getWorks()//
      .then(function(works){
        displayMiniGallery(works);
      })

      window.addEventListener('click', function (event) {
        if (event.target === modalOpen) {
          closeModal();
          //listen click on modal, if click out modale is close 
        }
      });
    });
  });
}