let allUsers = [];
let filteredUsers = [];
let filter = "";
let numberFormat = null;

let userInput = null;
let searchButton = null;
let countFilteredUsersTitle = null;
let statisticsTitle = null;
let filteredUsersList = null;
let statisticsList = null;

window.addEventListener("load", () => {
  userInput = document.getElementById("userInput");
  searchButton = document.getElementById("searchButton");
  countFilteredUsersTitle = document.getElementById("countFilteredUsersTitle");
  filteredUsersList = document.getElementById("filteredUsersList");
  statisticsTitle = document.getElementById("statisticsTitle");
  statisticsList = document.getElementById("statisticsList");

  userInput.addEventListener("keyup", handleUserInputKeyup);
  searchButton.addEventListener("click", handleSearchButtonClick);
  deactivateSearchButton();

  numberFormat = Intl.NumberFormat("pt-BR", { maximumFractionDigits: 2 });

  render();

  fetchUsers();

  userInput.focus();
});

async function fetchUsers() {
  const res = await fetch(
    "https://randomuser.me/api/?seed=javascript&results=100&nat=BR&noinfo"
  );
  const json = await res.json();

  allUsers = json.results.map((user) => {
    const { name, picture, dob, gender } = user;

    return {
      name: `${name.first} ${name.last}`,
      age: dob.age,
      picture,
      gender,
    };
  });

  /*   console.log(allUsers); */
}

function filterUsers() {
  filteredUsers = allUsers
    .filter((user) => {
      return user.name.toUpperCase().indexOf(filter) > -1;
    })
    .sort(sortFilteredUsers);
}

function sortFilteredUsers(a, b) {
  return a.name > b.name ? 1 : a.name < b.name ? -1 : 0;
}

function countMales() {
  return filteredUsers.filter((user) => {
    return user.gender === "male";
  }).length;
}

function countFemales() {
  return filteredUsers.filter((user) => {
    return user.gender === "female";
  }).length;
}

function ageSum() {
  return filteredUsers.reduce((sum, user) => {
    return (sum += user.age);
  }, 0);
}

function ageAverage() {
  return formatNumber(ageSum() / filteredUsers.length);
}

function handleUserInputKeyup(event) {
  let currentName = event.target.value.trim();

  if (currentName === "") {
    deactivateSearchButton();
    return;
  }

  filter = currentName.toUpperCase();

  activateSearchButton();

  if (event.key === "Enter") {
    filterUsers();
    render();
  }
}

function activateSearchButton() {
  searchButton.disabled = false;
}

function deactivateSearchButton() {
  searchButton.disabled = true;
}

function handleSearchButtonClick() {
  console.log("handleSearchButtonClick");
  filterUsers();
  render();
  userInput.focus();
}

function renderCountFilteredUsersTitle() {
  let textToRender = "Nenhum usuário filtrado";

  if (filteredUsers.length > 0) {
    textToRender = `${filteredUsers.length} usuário(s) encontrado(s)`;
  }

  countFilteredUsersTitle.textContent = textToRender;
}

function renderFilteredUsersList() {
  let ul = document.createElement("ul");

  filteredUsers.forEach((user) => {
    let li = document.createElement("li");
    let img = document.createElement("img");

    li.className = "my-li";

    img.className = "avatar";
    img.src = user.picture.thumbnail;

    li.innerHTML = img.outerHTML + ` ${user.name}, ${user.age}`;

    ul.appendChild(li);
  });
  filteredUsersList.innerHTML = "";
  filteredUsersList.appendChild(ul);
}

function renderStatisticsTitle() {
  let textToRender = "Nada a ser exibido";

  if (filteredUsers.length > 0) {
    textToRender = "Estatísticas";
  }

  statisticsTitle.textContent = textToRender;
}

function renderStatisticsList() {
  statisticsList.innerHTML = "";
  if (filteredUsers.length > 0) {
    let ul = document.createElement("ul");
    ul.appendChild(renderMalesCount());
    ul.appendChild(renderFemalesCount());
    ul.appendChild(renderAgeSum());
    ul.appendChild(renderAgeAverage());
    statisticsList.appendChild(ul);
  }
}

function renderMalesCount() {
  let li = document.createElement("li");
  li.style.listStyleType = "none";
  li.innerHTML = `Sexo masculino: <b>${countMales()}</b>`;
  return li;
}

function renderFemalesCount() {
  let li = document.createElement("li");
  li.style.listStyleType = "none";
  li.innerHTML = `Sexo feminino: <b>${countFemales()}</b>`;
  return li;
}

function renderAgeSum() {
  let li = document.createElement("li");
  li.style.listStyleType = "none";
  li.innerHTML = `Soma das idades: <b>${ageSum()}</b>`;
  return li;
}

function renderAgeAverage() {
  let li = document.createElement("li");
  li.style.listStyleType = "none";
  li.innerHTML = `Média das idades: <b>${ageAverage()}</b>`;
  return li;
}

function render() {
  renderCountFilteredUsersTitle();
  renderFilteredUsersList();
  renderStatisticsTitle();
  renderStatisticsList();
}

function formatNumber(number) {
  return numberFormat.format(number);
}
