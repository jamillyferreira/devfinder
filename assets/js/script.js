const themeToggleBtn = document.querySelector(".theme-toggle-btn");
const icon = themeToggleBtn.querySelector(".theme-toggle-icon");
const text = themeToggleBtn.querySelector(".theme-toggle-text");
const body = document.body;

const profileCard = document.querySelector(".profile-card");
const inputSearch = document.querySelector(".input-search");
const buttonSearch = document.querySelector(".search__button");

const avatar = document.querySelector(".profile-card__avatar");
const user = document.querySelector(".profile-card__name");
const login = document.querySelector(".profile-card__username");
const bio = document.querySelector(".profile-card__bio");

const repoCount = document.querySelector("#repo-count");
const followersCount = document.querySelector("#followers-count");
const followingCount = document.querySelector("#following-count");

const userLocation = document.querySelector("#user-location");
const createdAt = document.querySelector("#created-at");
const userBlog = document.querySelector("#user-blog");
const userTwitter = document.querySelector("#user-twitter");
const userCompany = document.querySelector("#user-company");

const showMessageError = document.querySelector(".message-error-container");

// Estado inicial
const savedTheme = localStorage.getItem("theme");

// Define o tema inicial com base no armazenamento local
if (savedTheme === "light") {
  body.classList.add("mode-light");
  icon.classList.replace("ph-sun", "ph-moon");
  text.textContent = "dark";
}

const toggleTheme = () => {
  const isLight = body.classList.toggle("mode-light");

  text.textContent = isLight ? "dark" : "light";

  if (isLight) {
    icon.classList.replace("ph-sun", "ph-moon");
  } else {
    icon.classList.replace("ph-moon", "ph-sun");
  }
  localStorage.setItem("theme", isLight ? "light" : "dark");
};
themeToggleBtn.addEventListener("click", toggleTheme);

// Função para buscar dados do usuário no GitHub
async function fetchGitHubUser(username = "octocat") {
  try {
    const response = await fetch(`https://api.github.com/users/${username}`);
    if (!response.ok) {
      throw new Error("Usuário não encontrado");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Erro ao buscar usuário:", error);
    return null;
  }
}

// Função para exibir informações do usuário
const displayUserInfo = (userData) => {
  if (!userData) {
    return;
  }

  avatar.src = userData.avatar_url;
  user.textContent = userData.name || userData.login || "Nome não disponível";
  login.textContent = `@${userData.login}`;
  bio.textContent = userData.bio || "Sem biografia disponível";

  repoCount.textContent = userData.public_repos || 0;
  followersCount.textContent = userData.followers || 0;
  followingCount.textContent = userData.following || 0;
  userLocation.textContent = userData.location || "Localização não informada";
  userBlog.textContent = userData.blog ? userData.blog : "Blog não informado";
  userTwitter.textContent = userData.twitter_username
    ? `@${userData.twitter_username}`
    : "Não informado";
  createdAt.textContent = formatDate(userData.created_at);
  userCompany.textContent = userData.company || "Empresa não informada";
};

// Formata a data de criação do perfil
const formatDate = (dateString) => {
  const date = new Date(dateString);
  const day = date.getDate();
  const month = date.toLocaleString("pt-BR", { month: "short" });
  const year = date.getFullYear();

  return `Desde ${day} de ${month} de ${year}`;
};

// funcao para buscar e exibir o usuário ao clicar no botão de pesquisa
buttonSearch.addEventListener("click", async () => {
  const username = inputSearch.value.trim();
  if (!username) return;

  const originalPlaceholder = inputSearch.placeholder;
  inputSearch.value = "";
  inputSearch.placeholder = "Buscando...";

  const userData = await fetchGitHubUser(username);

  if (!userData) {
    showMessageError.classList.add("visible");
    profileCard.classList.add("hidden");
    inputSearch.placeholder = originalPlaceholder;
    return;
  }
  // reseta o estado anterior
  showMessageError.classList.remove("visible");
  profileCard.classList.remove("hidden");

  displayUserInfo(userData);
  inputSearch.placeholder = originalPlaceholder;
});

// Evento de tecla Enter no campo de pesquisa
inputSearch.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    buttonSearch.click();
  }
});

// Busca o usuário padrão ao carregar a página
(async () => {
  const userData = await fetchGitHubUser();
  displayUserInfo(userData);
})();
