const listaLivros = document.getElementById("listaLivros");
const totalLivros = document.getElementById("totalLivros");
const queroLer = document.getElementById("queroLer");
const lendo = document.getElementById("lendo");
const lidos = document.getElementById("lidos");

const btnNovoLivro = document.getElementById("btnNovoLivro");
const filtroStatus = document.getElementById("filtroStatus");
const pesquisa = document.getElementById("pesquisa");

const modal = document.getElementById("modalLivro");
const fecharModal = document.getElementById("fecharModal");
const form = document.getElementById("formLivro");

const tituloModal = document.getElementById("tituloModal");
const tituloLivro = document.getElementById("tituloLivro");
const autorLivro = document.getElementById("autorLivro");
const imagemLivro = document.getElementById("imagemLivro");
const statusLivro = document.getElementById("statusLivro");
const notaLivro = document.getElementById("notaLivro");
const comentarioLivro = document.getElementById("comentarioLivro");

let livros = JSON.parse(localStorage.getItem("livros")) || [];
let editando = null;

/* ==================== */

function salvarStorage() {
  localStorage.setItem("livros", JSON.stringify(livros));
}

function estrelas(nota) {
  return "⭐".repeat(nota);
}

/* ==================== */

function atualizarStats() {
  totalLivros.textContent = livros.length;

  queroLer.textContent = livros.filter(
    livro => livro.status === "Quero ler"
  ).length;

  lendo.textContent = livros.filter(
    livro => livro.status === "Lendo"
  ).length;

  lidos.textContent = livros.filter(
    livro => livro.status === "Lido"
  ).length;
}

/* ==================== */

function abrirModal() {
  modal.classList.add("show");
}

function fechar() {
  modal.classList.remove("show");
  form.reset();
  editando = null;
  atualizarCamposStatus();
}

fecharModal.addEventListener("click", fechar);

/* ==================== */

function atualizarCamposStatus() {

  const status = statusLivro.value;

  if (status === "Quero ler") {
    notaLivro.style.display = "none";
    comentarioLivro.style.display = "none";
  }

  else if (status === "Lendo") {
    notaLivro.style.display = "none";
    comentarioLivro.style.display = "block";
  }

  else {
    notaLivro.style.display = "block";
    comentarioLivro.style.display = "block";
  }
}

statusLivro.addEventListener("change", atualizarCamposStatus);

/* ==================== */

function aplicarFiltros() {

  let resultado = [...livros];

  if (filtroStatus.value) {
    resultado = resultado.filter(
      livro => livro.status === filtroStatus.value
    );
  }

  const texto = pesquisa.value.toLowerCase().trim();

  if (texto) {
    resultado = resultado.filter(livro =>
      livro.titulo.toLowerCase().includes(texto) ||
      livro.autor.toLowerCase().includes(texto)
    );
  }

  return resultado;
}

/* ==================== */

function renderizar() {

  listaLivros.innerHTML = "";

  const dados = aplicarFiltros();

  if (dados.length === 0) {
    listaLivros.innerHTML = `
      <p class="empty">
        Nenhum livro encontrado.
      </p>
    `;
  }

  dados.forEach((livro) => {

    const index = livros.indexOf(livro);

    let extra = "";

    if (livro.status === "Lido") {
      extra = `
        <div class="stars">
          ${estrelas(livro.nota)}
        </div>

        <p class="comment">
          ${livro.comentario || ""}
        </p>
      `;
    }

    if (livro.status === "Lendo") {
      extra = `
        <p class="comment">
          📖 Em andamento
        </p>
      `;
    }

    listaLivros.innerHTML += `
      <div class="book-card">

        <img src="${livro.imagem || 'https://via.placeholder.com/200x300'}">

        <h3>${livro.titulo}</h3>

        <p class="author">${livro.autor}</p>

        <span class="status">
          ${livro.status}
        </span>

        ${extra}

        <div class="actions">

          <button class="edit" onclick="editarLivro(${index})">
            Editar
          </button>

          <button class="delete" onclick="deletarLivro(${index})">
            Excluir
          </button>

        </div>

      </div>
    `;
  });

  atualizarStats();
}

/* ==================== */

btnNovoLivro.addEventListener("click", () => {
  tituloModal.textContent = "Adicionar Livro";
  form.reset();
  editando = null;
  atualizarCamposStatus();
  abrirModal();
});

/* ==================== */

form.addEventListener("submit", (e) => {

  e.preventDefault();

  const status = statusLivro.value;

  let nota = 0;
  let comentario = "";

  if (status === "Lido") {
    nota = Number(notaLivro.value);
    comentario = comentarioLivro.value;
  }

  if (status === "Lendo") {
    comentario = comentarioLivro.value;
  }

  const livro = {
    titulo: tituloLivro.value,
    autor: autorLivro.value,
    imagem: imagemLivro.value,
    status: status,
    nota: nota,
    comentario: comentario
  };

  if (editando === null) {
    livros.push(livro);
  } else {
    livros[editando] = livro;
  }

  salvarStorage();
  renderizar();
  fechar();
});

/* ==================== */

function editarLivro(index) {

  const livro = livros[index];

  editando = index;

  tituloModal.textContent = "Editar Livro";

  tituloLivro.value = livro.titulo;
  autorLivro.value = livro.autor;
  imagemLivro.value = livro.imagem;
  statusLivro.value = livro.status;
  notaLivro.value = livro.nota || 1;
  comentarioLivro.value = livro.comentario || "";

  atualizarCamposStatus();
  abrirModal();
}

/* ==================== */

function deletarLivro(index) {

  if (confirm("Deseja excluir este livro?")) {
    livros.splice(index, 1);
    salvarStorage();
    renderizar();
  }
}

/* ==================== */

filtroStatus.addEventListener("change", renderizar);
pesquisa.addEventListener("input", renderizar);

/* ==================== */

atualizarCamposStatus();
renderizar();