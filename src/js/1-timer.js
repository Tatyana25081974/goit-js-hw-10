import flatpickr from "flatpickr";//Додає функціонал календаря для вибору дати.
import "flatpickr/dist/flatpickr.min.css";
import iziToast from "izitoast";//Використовується для показу спливаючих повідомлень (наприклад, помилки).
import "izitoast/dist/css/iziToast.min.css";

let userSelectedDate = null;
let timerInterval = null;

const startButton = document.querySelector('button[data-start]');//Посилання на кнопку "Start". Знайдено за атрибутом data-start. Спочатку кнопка неактивна (disabled), щоб запобігти запуску таймера без вибору дати.
const datePicker = document.getElementById('datetime-picker');//Поле вибору дати. Знайдено за id="datetime-picker".
const daysSpan = document.querySelector('[data-days]');//Відображають дні, години, хвилини та секунди. Знайдено за атрибутами data-days, data-hours тощо.
const hoursSpan = document.querySelector('[data-hours]');
const minutesSpan = document.querySelector('[data-minutes]');
const secondsSpan = document.querySelector('[data-seconds]');

// Ініціалізація Flatpickr
flatpickr(datePicker, {
  enableTime: true, //Дозволяє вибирати час разом із датою.
  time_24hr: true,//Задає 24-годинний формат для вибору часу
  defaultDate: new Date(),//Встановлює поточну дату та час як значення за замовчуванням
  minuteIncrement: 1,//Дозволяє збільшувати або зменшувати час на 1 хвилину при налаштуванні.
    onClose(selectedDates) {   //Функція викликається, коли користувач обирає дату й закриває календар.
      //обробка закриття календаря:
    const selectedDate = selectedDates[0];//Це дата, яку обрав користувач.selectedDates — масив усіх вибраних дат (ми беремо першу).
    if (selectedDate <= new Date()) { //Якщо дата в минулому або поточна, показується помилка через iziToast.Кнопка "Start" залишається вимкненою.
      iziToast.error({
        title: "Error",
        message: "Please choose a date in the future",
        position: "topRight",
      });
      startButton.disabled = true;//Кнопка "Start" стає неактивною (startButton.disabled = true).
    } else {
      userSelectedDate = selectedDate;//Обрана дата зберігається в змінній userSelectedDate
      startButton.disabled = false;//Кнопка "Start" стає активною (startButton.disabled = false).
    }
  },
});

// Логіка таймера.Ця функція перетворює час у мілісекундах на кількість днів, годин, хвилин і секунд.
function convertMs(ms) {
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  const days = Math.floor(ms / day);//// Кількість днів
  const hours = Math.floor((ms % day) / hour);//// Кількість годин
  const minutes = Math.floor(((ms % day) % hour) / minute);//// Кількість хвилин
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);//// Кількість секунд

  return { days, hours, minutes, seconds };//Функція повертає об’єкт: { days, hours, minutes, seconds }.
}
//Функція addLeadingZero використовується для форматування чисел, щоб зробити їх двозначними (додавши провідний нуль). 
function addLeadingZero(value) {
  return String(value).padStart(2, "0");
}
//Ця функція оновлює текстовий вміст елементів на сторінці (дні, години, хвилини, секунди).Всі значення спочатку форматуються через addLeadingZero, а потім вставляються у відповідні елементи HTML.

function updateTimerUI({ days, hours, minutes, seconds }) {
  daysSpan.textContent = addLeadingZero(days);
  hoursSpan.textContent = addLeadingZero(hours);
  minutesSpan.textContent = addLeadingZero(minutes);
  secondsSpan.textContent = addLeadingZero(seconds);
}
//Ця функція запускає зворотний відлік і періодично оновлює інтерфейс.
function startCountdown() {
  startButton.disabled = true;// Вимикає кнопку "Start".
  datePicker.disabled = true;// Вимикає поле вибору дати.

  timerInterval = setInterval(() => {
    const now = new Date(); // Поточний час.
    const timeDifference = userSelectedDate - now;// Різниця в часі.

    if (timeDifference <= 0) {
      clearInterval(timerInterval);// Зупиняє таймер.
      updateTimerUI({ days: 0, hours: 0, minutes: 0, seconds: 0 });// Обнуляє значення.
      datePicker.disabled = false;// Дозволяє вибрати нову дату.
      return;
    }

    const timeLeft = convertMs(timeDifference);
    updateTimerUI(timeLeft); // Оновлює інтерфейс.
  }, 1000);// Оновлення кожну секунду.
}

startButton.addEventListener('click', startCountdown);//Викликає функцію startCountdown, яка починає зворотний відлік.
