//Імпортуємо бібліотеки Flatpickr та iziToast,Разом із бібліотеками ми імпортуємо їхні стилі (CSS).
import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";
import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";
//Оголошуємо об'єкт timer, який відповідає за логіку таймера
const timer = {
  deadline: null,//дата, до якої буде виконуватися зворотний відлік.Зберігає кінцеву дату
  intervalId: null,//ідентифікатор таймера для зупинки через clearInterval
  elements: {//об'єкт, що зберігає посилання на елементи в DOM, які відображають дні, години, хвилини й секунди.
    days: document.querySelector('[data-days]'),//Зберігає посилання на HTML-елементи таймера:days: елемент для відображення кількості днів (data-days).
    hours: document.querySelector('[data-hours]'),//hours: елемент для відображення годин (data-hours)
    minutes: document.querySelector('[data-minutes]'),//minutes: елемент для відображення хвилин (data-minutes).
    seconds: document.querySelector('[data-seconds]'),//seconds: елемент для відображення секунд (data-seconds)
  },
//Перевіряємо, чи є встановлена дата в deadline. Якщо ні – функція припиняється.
  start() {
    if (!this.deadline) return;//// Якщо немає кінцевої дати, нічого не робимо
    if (this.isPaused) {
      // Якщо таймер був на паузі (this.isPaused === true), розраховуємо нову кінцеву дату.
      this.deadline = new Date(Date.now() + this.remainingTime);//this.remainingTime зберігає кількість мілісекунд, що залишились до кінця. Date.now() — це поточний час у мілісекундах. Date.now() + this.remainingTime розраховує нову кінцеву дату, враховуючи час паузи.
      //Що робить setInterval:Запускає функцію, яка виконується кожну секунду.Вираховує, скільки часу залишилося
      this.isPaused = false;
    }
//Розраховується різниця між обраною датою (this.deadline) і поточним часом (Date.now()).
    this.intervalId = setInterval (() => { // Запускаємо таймер, який працює кожну секунду. Обчислює, скільки часу залишилось.Оновлює HTML.

      const diff = this.deadline - Date.now();// Кінцева дата - поточна дата

      if (diff <= 0) { //Перевіряється, чи різниця між кінцевою датою таймера (this.deadline) та поточним часом (Date.now()) дорівнює нулю або стала від'ємною.
        this.stop();// Викликається метод stop(), який:Зупиняє таймер, очищуючи інтервал через clearInterval.Таймер більше не оновлює інтерфейс.
       this.updateUI({ days: 0, hours: 0, minutes: 0, seconds: 0 });//Інтерфейс оновлюється, встановлюючи всі значення таймера (дні, години, хвилини, секунди) у 0.
        iziToast.success({//Використовується бібліотека iziToast для відображення спливаючого повідомлення (toast) про успішне завершення таймера.
          title: "Success",
          message: "Countdown completed!",
          position: "topRight",
        });
        document.getElementById("alarm-sound").play(); // Відтворює звуковий сигнал завершення.
        return;//Завершує виконання поточної функції.Це запобігає виконанню коду, який йде після цієї умови, адже таймер уже завершився
      }
       this.remainingTime = diff; // Оновлюємо час, що залишився
      const timeComponents = this.getTimeComponents(diff);//Викликається метод getTimeComponents(diff), щоб перетворити різницю між кінцевою датою таймера (this.deadline) і поточним часом (Date.now()) на окремі компоненти часу: дні, години, хвилини, секунди.
      this.updateUI(timeComponents);//Викликається метод updateUI(timeComponents), щоб оновити значення на екрані.
    }, 1000);
  },
//метод зупиняє таймер
  stop() {
    clearInterval(this.intervalId);//Зупиняє виконання функції, яка працює через setInterval.Видаляє інтервал, встановлений методом setInterval. Це припиняє оновлення інтерфейсу.
    this.intervalId = null;//Скидає значення intervalId, щоб вказати, що таймер більше не працює.Змінна intervalId встановлюється у null, щоб показати, що таймер більше не працює
    document.getElementById("datetime-picker").disabled = false;//Змінює властивість disabled HTML-елемента input з ID datetime-picker на false//Це дозволяє користувачу знову вибирати дату після завершення таймера. 
    document.querySelector("button[data-pause]").disabled = true;//Деактивує (блокує) кнопку "Pause/Resume", змінюючи її властивість disabled на true.
  },

  setDeadline(selectedDate) {
    this.deadline = selectedDate;//метод встановлює кінцеву дату таймера (this.deadline) на передану дату (selectedDate), обрану через Flatpickr.
    this.remainingTime = selectedDate - Date.now();//Розрахунок залишкового часу:
  },

  getTimeComponents(diff) {
    const second = 1000;
    const minute = second * 60;
    const hour = minute * 60;
    const day = hour * 24;

    const days = Math.floor(diff / day);// Кількість днів.Округлює значення вниз до цілого числа
    const hours = Math.floor((diff % day) / hour);// Залишкові години. Допомагає обчислити залишковий час для менших одиниць.
    const minutes = Math.floor(((diff % day) % hour) / minute);// Залишкові хвилини
    const seconds = Math.floor((((diff % day) % hour) % minute) / second);// Залишкові секунди

    return { days, hours, minutes, seconds };//Метод повертає об'єкт: { days, hours, minutes, seconds }.


  },
// Форматування чисел із провідними нулями
  pad(value) {
    return String(value).padStart(2, "0");//Ця функція додає провідні нулі до значення, якщо його довжина менша за 2 символи
  },

  updateUI({ days, hours, minutes, seconds }) {
    this.elements.days.textContent = this.pad(days);// this.elements.days.textContent: оновлює текстовий вміст елемента data-days.Оновлює дні.Додає нулі до чисел
    this.elements.hours.textContent = this.pad(hours);// Оновлює години
    this.elements.minutes.textContent = this.pad(minutes);// Оновлює хвилини
    this.elements.seconds.textContent = this.pad(seconds);// Оновлює секунди
  },
};

// Інтеграція Flatpickr.Використовується бібліотека Flatpickr для вибору дати й часу:
flatpickr("#datetime-picker", {
  enableTime: true,//Дозволяє вибирати час
  time_24hr: true,//Встановлює 24-годинний формат
  defaultDate: new Date(),//Встановлює поточну дату за замовчуванням
  minuteIncrement: 1,//Дозволяє змінювати хвилини з кроком 1.
  onClose(selectedDates) {//Викликається, коли користувач закриває календар.Спрацьовує, коли користувач обирає дату.
    const selectedDate = selectedDates[0];
    const startButton = document.querySelector('button[data-start]');

    if (selectedDate <= new Date()) {//Якщо вибрана дата менша або дорівнює поточній, показується помилка через iziToast
      iziToast.error({ // Показує помилку
        title: "Error",
        message: "Please choose a date in the future",
        position: "topRight",
      });
      startButton.disabled = true;// Заблокувати кнопку
    } else {//Інакше встановлюється кінцева дата через timer.setDeadline().
      timer.setDeadline(selectedDate);
      startButton.disabled = false;// Активувати кнопку
    }
  },
});
// Функція для відображення часу завершення
function displayEndTime(deadline) {
  const endTimeElement = document.getElementById("end-time");
  const endTime = new Date(deadline);

  const hours = String(endTime.getHours()).padStart(2, "0");
  const minutes = String(endTime.getMinutes()).padStart(2, "0");
  const seconds = String(endTime.getSeconds()).padStart(2, "0");

  endTimeElement.textContent = `Timer ends at: ${hours}:${minutes}:${seconds}`;
}
// Подія для кнопки старту
document.querySelector('button[data-start]').addEventListener("click", () => {
  timer.start();//Коли користувач натискає "Start".Запускається timer.start().Поле вибору дати та кнопка "Start" блокуються, щоб уникнути повторного запуску.
  document.getElementById("datetime-picker").disabled = true;//Поле вибору дати (#datetime-picker) блокується (disabled = true).
  document.querySelector('button[data-start]').disabled = true;//Кнопка "Start" також блокується (disabled = true), щоб уникнути повторного запуску
  document.querySelector("button[data-pause]").disabled = false; // Активуємо кнопку паузи
});
// Обробник кнопки паузи/продовження
document.querySelector("button[data-pause]").addEventListener("click", () => {//Шукає HTML-елемент із атрибутом data-pause. Це кнопка для зупинки/продовження таймера.Коли користувач натискає кнопку, виконується функція.
  const pauseButton = document.querySelector("button[data-pause]");
  if (timer.isPaused) {
    timer.start(); // Продовжуємо таймер
    pauseButton.textContent = "Pause";
  } else {
    clearInterval(timer.intervalId); // Ставимо на паузу
    timer.isPaused = true;
    document.querySelector("button[data-pause]").textContent = "Resume";
  }
});
