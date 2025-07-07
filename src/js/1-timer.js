// Описаний в документації
import flatpickr from 'flatpickr';
// Додатковий імпорт стилів
import 'flatpickr/dist/flatpickr.min.css';

// Описаний у документації
import iziToast from 'izitoast';
// Додатковий імпорт стилів
import 'izitoast/dist/css/iziToast.min.css';

// Отримуємо посилання на елементи DOM
const datetimePicker = document.getElementById('datetime-picker');
const startButton = document.querySelector('[data-start]');
const daysValue = document.querySelector('[data-days]');
const hoursValue = document.querySelector('[data-hours]');
const minutesValue = document.querySelector('[data-minutes]');
const secondsValue = document.querySelector('[data-seconds]');

let userSelectedDate = null;
let countdownInterval = null;

function addLeadingZero(value) {
  return String(value).padStart(2, '0');
}


function convertMs(ms) {
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  // Remaining days
  const days = Math.floor(ms / day);
  // Remaining hours
  const hours = Math.floor((ms % day) / hour);
  // Remaining minutes
  const minutes = Math.floor(((ms % day) % hour) / minute);
  // Remaining seconds
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    userSelectedDate = selectedDates[0];

    
    if (userSelectedDate < new Date()) {
      iziToast.error({
        message: `<div class="error-icon"></div>Please choose a date in the future`,
        position: 'topRight',
        class: 'custom-izitoast',
        progressBar: false,
        close: false,
        timeout: 3000,
      });
      startButton.disabled = true; // Деактивуємо кнопку "Start"
    } else {
      startButton.disabled = false; // Активуємо кнопку "Start"
    }
  },
};

flatpickr(datetimePicker, options);

// Обробник події для кнопки "Start"
startButton.addEventListener('click', () => {
  // Деактивуємо кнопку "Start" та поле вибору дати
  startButton.disabled = true;
  datetimePicker.disabled = true;

  // Запускаємо інтервал оновлення таймера кожну секунду
  countdownInterval = setInterval(() => {
    const currentTime = new Date();
    const msRemaining = userSelectedDate.getTime() - currentTime.getTime();

    // Якщо час вийшов, зупиняємо таймер
    if (msRemaining <= 0) {
      clearInterval(countdownInterval);
      iziToast.success({
        title: 'Success',
        message: 'Countdown finished!',
        position: 'topRight',
        progressBar: false, // Вимикаємо індикатор прогресу
        close: false,
        timeout: 3000,
      });
      datetimePicker.disabled = false; // Активуємо поле вибору дати
      // Оновлюємо інтерфейс, щоб показати 00:00:00:00
      daysValue.textContent = '00';
      hoursValue.textContent = '00';
      minutesValue.textContent = '00';
      secondsValue.textContent = '00';
      return;
    }

    const { days, hours, minutes, seconds } = convertMs(msRemaining);

    // Оновлюємо інтерфейс
    daysValue.textContent = addLeadingZero(days);
    hoursValue.textContent = addLeadingZero(hours);
    minutesValue.textContent = addLeadingZero(minutes);
    secondsValue.textContent = addLeadingZero(seconds);
  }, 1000); // Оновлюємо кожну секунду (1000 мс)
});

startButton.disabled = true;


datetimePicker.classList.add('active-timer');


datetimePicker.classList.remove('active-timer');