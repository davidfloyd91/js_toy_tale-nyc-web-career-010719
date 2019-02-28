const addBtn = document.querySelector('#new-toy-btn');
const toyForm = document.querySelector('.container');
const toyName = toyForm.querySelector('#toy-name');
const toyImage = toyForm.querySelector('#toy-image');
const toyCollection = document.querySelector('#toy-collection');
const toysUrl = 'http://localhost:3000/toys';
let allToys = [];
let addToy = false;

toyCollection.addEventListener("click", e => {
  if (e.target.classList.contains('like-btn')) {
    let toy = allToys.find(t => {
      return e.target.dataset.id == t.id;
    });
    likeToy(toy);
  };
});

function likeToy(toy) {
  let data = {
    likes: toy.likes + 1
  };
  fetch(`${toysUrl}/${toy.id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
  .then(resp => resp.json())
  .then(toy => {
    let juguete = allToys.find(t => {
      return t.id == toy.id
    });
    juguete.likes = toy.likes;
    return juguete;
  })
  .then(toy => {
    let toyDiv = toyCollection.querySelector(`#x${toy.id}`);
    let likesLine = toyDiv.querySelector('.likes-line');
    likesLine.innerText = likesLine.innerText.replace(/(\d+)/, `${toy.likes}`)
  });
};

function getToys() {
  fetch(toysUrl)
  .then(resp => resp.json())
  .then(toys => {
    toys.forEach(toy => {
      allToys.push(toy);
    });
    return allToys;
  })
  .then(toys => displayToys(toys))
};

function displayToys(toys) {
  toyCollection.innerHTML = '';
  toys.forEach(toy => {
    displayOneToy(toy);
  });
};

function displayOneToy(toy) {
  toyCollection.innerHTML += `
    <div class="card" id="x${toy.id}">
      <h2>${toy.name}</h2>
      <img src=${toy.image} class="toy-avatar" />
      <p class="likes-line">${toy.likes} Likes </p>
      <button class="like-btn" data-id="${toy.id}">Like <3</button>
    </div>
  `;
};

addBtn.addEventListener('click', () => {
  addToy = !addToy;
  if (addToy) {
    toyForm.style.display = 'block';
    toyForm.addEventListener('submit', e => {
      e.preventDefault();
      let data = {
        name: toyName.value,
        image: toyImage.value,
        likes: 0
      };
      manufactureToy(data);
    });
  } else {
    toyForm.style.display = 'none';
  };
});

function manufactureToy(data) {
  fetch(toysUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
  .then(resp => resp.json())
  .then(toy => {
    allToys.push(toy);
    return allToys;
  })
  .then(toys => {
    displayToys(toys);
    toyName.value = '';
    toyImage.value = '';
  })
};

getToys();
