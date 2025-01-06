//Імпортуємо бібліотеки Flatpickr та iziToast,Разом із бібліотеками ми імпортуємо їхні стилі (CSS).
import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";
import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";
//Оголошуємо об'єкт timer, який відповідає за логіку таймера
const timer = {
  deadline: null,//дата, до якої буде виконуватися зворотний відлік.
  intervalId: null,//ідентифікатор таймера для зупинки через clearInterval
  elements: {//об'єкт, що зберігає посилання на елементи в DOM, які відображають дні, години, хвилини й секунди.
    days: document.querySelector('[data-days]'),
    hours: document.querySelector('[data-hours]'),
    minutes: document.querySelector('[data-minutes]'),
    seconds: document.querySelector('[data-seconds]'),
  },
//Перевіряємо, чи є встановлена дата в deadline. Якщо ні – функція припиняється.
  start() {
    if (!this.deadline) return;
//Розраховується різниця між обраною датою (this.deadline) і поточним часом (Date.now()).
    this.intervalId = setInterval(() => {
      const diff = this.deadline - Date.now();
//Перевіряється, чи різниця між кінцевою датою таймера (this.deadline) та поточним часом (Date.now()) дорівнює нулю або стала від'ємною.
      if (diff <= 0) {
        this.stop();// Викликається метод stop(), який:Зупиняє таймер, очищуючи інтервал через clearInterval.Таймер більше не оновлює інтерфейс.
       this.updateUI({ days: 0, hours: 0, minutes: 0, seconds: 0 });//Інтерфейс оновлюється, встановлюючи всі значення таймера (дні, години, хвилини, секунди) у 0.
        iziToast.success({//Використовується бібліотека iziToast для відображення спливаючого повідомлення (toast) про успішне завершення таймера.
          title: "Success",
          message: "Countdown completed!",
          position: "topRight",
        });
        return;//Завершує виконання поточної функції.Це запобігає виконанню коду, який йде після цієї умови, адже таймер уже завершився
      }

      const timeComponents = this.getTimeComponents(diff);//Викликається метод getTimeComponents(diff), щоб перетворити різницю між кінцевою датою таймера (this.deadline) і поточним часом (Date.now()) на окремі компоненти часу: дні, години, хвилини, секунди.
      this.updateUI(timeComponents);//Викликається метод updateUI(timeComponents), щоб оновити значення на екрані.
    }, 1000);
  },
//метод зупиняє таймер
  stop() {
    clearInterval(this.intervalId);//Видаляє інтервал, встановлений методом setInterval. Це припиняє оновлення інтерфейсу.
    this.intervalId = null;//Скидає значення intervalId, щоб вказати, що таймер більше не працює.
  },

  setDeadline(selectedDate) {
    this.deadline = selectedDate;//метод встановлює кінцеву дату таймера (this.deadline) на передану дату (selectedDate), обрану через Flatpickr.
  },

  getTimeComponents(diff) {
    const second = 1000;
    const minute = second * 60;
    const hour = minute * 60;
    const day = hour * 24;

    const days = Math.floor(diff / day);
    const hours = Math.floor((diff % day) / hour);
    const minutes = Math.floor(((diff % day) % hour) / minute);
    const seconds = Math.floor((((diff % day) % hour) % minute) / second);

    return { days, hours, minutes, seconds };//Метод повертає об'єкт: { days, hours, minutes, seconds }.


  },

  pad(value) {
    return String(value).padStart(2, "0");//Ця функція додає провідні нулі до значення, якщо його довжина менша за 2 символи
  },

  updateUI({ days, hours, minutes, seconds }) {
    this.elements.days.textContent = this.pad(days);
    this.elements.hours.textContent = this.pad(hours);
    this.elements.minutes.textContent = this.pad(minutes);
    this.elements.seconds.textContent = this.pad(seconds);
  },
};

// Інтеграція Flatpickr.Використовується бібліотека Flatpickr для вибору дати й часу:
flatpickr("#datetime-picker", {
  enableTime: true,//Дозволяє вибирати час
  time_24hr: true,//Встановлює 24-годинний формат
  defaultDate: new Date(),//Встановлює поточну дату за замовчуванням
  minuteIncrement: 1,//Дозволяє змінювати хвилини з кроком 1.
  onClose(selectedDates) {//Викликається, коли користувач закриває календар
    const selectedDate = selectedDates[0];
    const startButton = document.querySelector('button[data-start]');

    if (selectedDate <= new Date()) {//Якщо вибрана дата менша або дорівнює поточній, показується помилка через iziToast
      iziToast.error({
        title: "Error",
        message: "Please choose a date in the future",
        position: "topRight",
      });
      startButton.disabled = true;
    } else {//Інакше встановлюється кінцева дата через timer.setDeadline().
      timer.setDeadline(selectedDate);
      startButton.disabled = false;
    }
  },
});

// Подія для кнопки старту
document.querySelector('button[data-start]').addEventListener("click", () => {
  timer.start();
  document.getElementById("datetime-picker").disabled = true;//Поле вибору дати (#datetime-picker) блокується (disabled = true).
  document.querySelector('button[data-start]').disabled = true;//Кнопка "Start" також блокується (disabled = true), щоб уникнути повторного запуску
});
