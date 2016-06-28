'use strict';

var heightBeforeBottomWindow = 14;

module.exports = {


/*
* Проверка возможности отрисовки следующей страницы
*/
  isNextPageAvailable: function(picturesar, page, pageSize) {
    return page < Math.floor(picturesar.length / pageSize);
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
