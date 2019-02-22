const toyForm = document.querySelector('.container')
const toyCollection = document.querySelector('#toy-collection')

document.addEventListener("DOMContentLoaded", () => {
  getFetch()


  const createButton = document.querySelector(".submit")
  .addEventListener("click", e => {
    e.preventDefault();
    let toyName = document.querySelector("#name").value
    let toyImage = document.querySelector("#image").value
    createToy(toyName, toyImage);
  })
}); //DOMContentLoaded

function idButtons() {
  let buttons = document.getElementsByClassName('like-btn');
  for (let item of buttons) {
    item.addEventListener("click", e => {
      addALike(e.target.dataset.id, e.target.dataset.likes)
    })
  }
}

const allToys = []
let addToy = false

function getFetch() {
  toyCollection.innerHTML = ""
  fetch('http://localhost:3000/toys')
  .then(toys => toys.json())
  .then(function(parsed) {
    for (var toy in parsed) {
      allToys.push(parsed[toy]);
      toyCollection.innerHTML += `
      <div class="card">
        <h2>${parsed[toy].name}</h2>
        <img src="${parsed[toy].image}" class="toy-avatar" />
        <p>${parsed[toy].likes} Likes </p>
        <button class='like-btn' data-likes="${parsed[toy].likes}" data-id="${parsed[toy].id}" id="like-btn-${parsed[toy].id}">Like <3</button>
      </div>`
    }
  })
  .then(idButtons)
}
function createToy(toyName, toyImage) {
  fetch("http://localhost:3000/toys", {
    method: "POST",
    mode: "cors",
    cache: "no-cache",
    credentials: "same-origin",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json"
    },
    body: JSON.stringify({name: toyName, image: toyImage, likes: 0})
  })
  .then(response => response.json())
  .then(function(toy) {
    allToys.push(toy)
    getFetch()
  })
}

function addALike(toyId, toyLikes) {
  fetch(`http://localhost:3000/toys/${toyId}`, {
    method: "PATCH",
    mode: "cors",
    cache: "no-cache",
    credentials: "same-origin",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json"
    },
    body: JSON.stringify({likes: parseInt(toyLikes) + 1})
  })
  .then(response => response.json())
  .then(function(toy) {
    allToys.push(toy)
    getFetch()
  })
}

const addBtn = document.querySelector('#new-toy-btn')

// addBtn.addEventListener('click', () => {
//   // hide & seek with the form
//   addToy = !addToy
//   if (addToy) {
//     toyForm.style.display = 'block'
//     // submit listener here
//   } else {
//     toyForm.style.display = 'none'
//   }
// })

// OR HERE!
