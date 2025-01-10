// Імпортуємо iziToast Описаний у документації
import iziToast from "izitoast";
// Додатковий імпорт стилів
import "izitoast/dist/css/iziToast.min.css";

document.querySelector('.form').addEventListener('submit', (event) => {
  event.preventDefault(); // Зупиняємо стандартну поведінку форми

  // Отримуємо значення з форми
  const form = event.target;
  const delay = Number(form.delay.value); // Значення затримки в мілісекундах
  const state = form.state.value; // Стан промісу (fulfilled або rejected)

  // Створюємо проміс
  const promise = new Promise((resolve, reject) => {
    setTimeout(() => {
      if (state === 'fulfilled') {
        resolve(delay); // Виконується успішно
      } else {
        reject(delay); // Відхиляється
      }
    }, delay);
  });

  // Обробляємо результат промісу
  promise
    .then((delay) => {
      iziToast.success({
        title: '✅ Success',
        message: `Fulfilled promise in ${delay}ms`,
        position: 'topRight',
        timeout: 5000,
      });
    })
    .catch((delay) => {
      iziToast.error({
        title: '❌ Error',
        message: `Rejected promise in ${delay}ms`,
        position: 'topRight',
        timeout: 5000,
      });
    });
});
