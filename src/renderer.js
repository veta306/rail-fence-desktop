import "./index.css";
import { encryptRailFence, decryptRailFence } from "./cipher.js";

const tabButtons = document.querySelectorAll(".tab-btn");
const tabContents = document.querySelectorAll(".tab-content");
const encryptError = document.getElementById("encryptError");
const decryptError = document.getElementById("decryptError");
const resultText = document.getElementById("resultText");
const tableContainer = document.getElementById("tableContainer");

const passwordModal = document.getElementById("passwordModal");
const passwordInput = document.getElementById("passwordInput");
const passwordError = document.getElementById("passwordError");
const submitPassword = document.getElementById("submitPassword");

passwordModal.style.display = "block";

submitPassword.addEventListener("click", () => {
  const password = passwordInput.value;
  if (password === "") return;
  if (password === "secret") {
    passwordModal.style.display = "none";
  } else {
    passwordInput.disabled = true;
    submitPassword.disabled = true;
    passwordError.textContent =
      "Неправильний пароль. Комп'ютер перезавантажиться через 5 секунд.";
    setTimeout(() => {
      window.system.reboot();
    }, 5000);
  }
});

tabButtons.forEach((button) => {
  button.addEventListener("click", () => {
    tabButtons.forEach((btn) => btn.classList.remove("active"));
    button.classList.add("active");

    const tab = button.getAttribute("data-tab");
    tabContents.forEach((content) => {
      content.classList.remove("active");
      if (content.id === tab) {
        content.classList.add("active");
      }
    });

    resultText.textContent = "";
    tableContainer.innerHTML = "";
    encryptError.textContent = "";
    decryptError.textContent = "";
  });
});

document.getElementById("encryptButton").addEventListener("click", () => {
  const text = document.getElementById("textInput").value;
  const numRows = parseInt(document.getElementById("numRows").value);

  if (
    text.length === 0 ||
    numRows < 2 ||
    text.length < numRows ||
    isNaN(numRows)
  ) {
    encryptError.textContent =
      "Введіть текст і виберіть кількість рівнів більше ніж 1, але менше ніж довжина рядка!";
    return;
  }

  const { result: encryptedText, rail: arrayView } = encryptRailFence(
    text,
    numRows
  );

  createTable(arrayView);
  resultText.textContent = encryptedText;
});

document.getElementById("decryptButton").addEventListener("click", () => {
  const cipherText = document.getElementById("cipherInput").value;
  const numRows = parseInt(document.getElementById("numRowsDecrypt").value);

  if (
    cipherText.length === 0 ||
    numRows < 2 ||
    cipherText.length < numRows ||
    isNaN(numRows)
  ) {
    decryptError.textContent =
      "Введіть зашифрований текст і виберіть кількість рівнів більше ніж 1, але менше ніж довжина рядка!";
    return;
  }

  const { result: decryptedText, rail: arrayView } = decryptRailFence(
    cipherText,
    numRows
  );

  createTable(arrayView);
  resultText.textContent = decryptedText;
});

function createTable(data) {
  const table = document.createElement("table");

  data.forEach((row) => {
    const tr = document.createElement("tr");

    row.forEach((cell) => {
      const td = document.createElement("td");

      if (cell === "\n") {
        td.classList.add("empty");
      } else {
        td.textContent = cell;
      }

      tr.appendChild(td);
    });

    table.appendChild(tr);
  });

  tableContainer.innerHTML = "";
  tableContainer.appendChild(table);
}
