'use strict';

var heightBeforeBottomWindow = 14;

/** Дата рождения @constant {date} */
var BIRTHDAY_DATE = new Date('1978', '9', '26');

module.exports = {

/*
* Проверка возможности отрисовки следующей страницы
*/
  isNextPageAvailable: function(picturesar, page, pageSize) {
    return page < Math.floor(picturesar.length / pageSize);
  },

  /*Функция вычисления количества дней с ближайщего дня рождения*/
  getDayFromBirthday: function() {
    var currentDate = new Date();
    currentDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate());
    if (currentDate.getMonth() >= BIRTHDAY_DATE.getMonth()) {
      if (currentDate.getDate() < BIRTHDAY_DATE.getDate()) {
        BIRTHDAY_DATE.setFullYear(currentDate.getFullYear() - 1);
      } else {
        BIRTHDAY_DATE.setFullYear(currentDate.getFullYear());
      }
    } else {
      BIRTHDAY_DATE.setFullYear(currentDate.getFullYear() - 1);
    }
    var lastDayFromBirthday = Math.floor((currentDate - BIRTHDAY_DATE) / (1000 * 60 * 60 * 24));
    return lastDayFromBirthday;
  },

/*
*Проверка достижения конца отрисовки
*/
  isBottomPage: function(element) {
    var picturesPosition = element.getBoundingClientRect();
    return picturesPosition.bottom - window.innerHeight - heightBeforeBottomWindow <= 0;
  },

  throttle: function(optimizeFunc, throttledelay) {
    return function() {
      clearTimeout(optimizeFunc._throttledelayID);
      optimizeFunc._throttledelayID = setTimeout(optimizeFunc, throttledelay);
    };
  }
};
