import "./index.css";
import { encryptRailFence, decryptRailFence } from "./cipher.js";

const tabButtons = document.querySelectorAll(".tab-btn");
const tabContents = document.querySelectorAll(".tab-content");
const encryptError = document.getElementById("encryptError");
const decryptError = document.getElementById("decryptError");
const resultText = document.getElementById("resultText");
const tableContainer = document.getElementById("tableContainer");

const productKeyPattern = /^[A-Z0-9]{5}-[A-Z0-9]{5}-[A-Z0-9]{5}$/;
const commonPasswords = [
  "123456",
  "password",
  "12345678",
  "1234",
  "pussy",
  "12345",
  "dragon",
  "qwerty",
  "696969",
  "mustang",
  "letmein",
  "seball",
  "master",
  "michael",
  "football",
  "shadow",
  "monkey",
  "abc123",
  "pass",
  "fuckme",
  "6969",
  "jordan",
  "harley",
  "ranger",
  "iwantu",
  "jennifer",
  "hunter",
  "fuck",
  "2000",
  "test",
];

const keyModal = document.getElementById("keyModal");
const passwordSetupModal = document.getElementById("passwordSetupModal");
const passwordModal = document.getElementById("passwordModal");
const forgotPasswordModal = document.getElementById("forgotPasswordModal");
const productKeyInput = document.getElementById("productKeyInput");
const newPasswordInput = document.getElementById("newPasswordInput");
const passwordInput = document.getElementById("passwordInput");
const forgotProductKeyInput = document.getElementById("forgotProductKeyInput");
const keyError = document.getElementById("keyError");
const newPasswordError = document.getElementById("newPasswordError");
const passwordError = document.getElementById("passwordError");
const forgotPasswordError = document.getElementById("forgotPasswordError");
const submitPassword = document.getElementById("submitPassword");
const togglePassword = document.querySelectorAll(".toggle-password");

const storedKey = localStorage.getItem("productKey");
const storedPassword = localStorage.getItem("password");

if (!storedKey) {
  openModal(keyModal);
} else if (!storedPassword) {
  openModal(passwordSetupModal);
} else {
  openModal(passwordModal);
}

function openModal(modal) {
  modal.classList.add("active");
}

function closeModal(modal) {
  modal.classList.remove("active");
}

document.getElementById("backToPasswordModal").addEventListener("click", () => {
  closeModal(forgotPasswordModal);
  openModal(passwordModal);
});

document.getElementById("submitKey").addEventListener("click", () => {
  const productKey = productKeyInput.value.trim();
  if (productKeyPattern.test(productKey)) {
    localStorage.setItem("productKey", productKey);
    closeModal(keyModal);
    openModal(passwordSetupModal);
  } else {
    keyError.textContent = "Невірний формат ключа продукту!";
  }
});

document.getElementById("submitNewPassword").addEventListener("click", () => {
  const newPassword = newPasswordInput.value;
  if (newPassword === "") return;
  if (commonPasswords.includes(newPassword)) {
    newPasswordError.textContent = "Пароль занадто поширений. Виберіть інший!";
  } else {
    localStorage.setItem("password", newPassword);
    closeModal(passwordSetupModal);
  }
});

submitPassword.addEventListener("click", () => {
  const password = passwordInput.value;
  if (password === "") return;
  if (password === storedPassword) {
    closeModal(passwordModal);
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

document.getElementById("resetPassword").addEventListener("click", () => {
  const productKey = forgotProductKeyInput.value.trim();
  if (productKey === storedKey) {
    closeModal(forgotPasswordModal);
    openModal(passwordSetupModal);
  } else {
    forgotPasswordError.textContent = "Неправильний ключ продукту!";
  }
});

document.getElementById("forgotPassword").addEventListener("click", () => {
  closeModal(passwordModal);
  openModal(forgotPasswordModal);
});

togglePassword.forEach((button) =>
  button.addEventListener("click", () => {
    if (button.textContent == "👁️") {
      button.textContent = "🙈";
      passwordInput.type = "text";
      newPasswordInput.type = "text";
    } else {
      button.textContent = "👁️";
      passwordInput.type = "password";
      newPasswordInput.type = "password";
    }
  })
);

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
