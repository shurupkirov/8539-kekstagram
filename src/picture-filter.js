'use strict';

/** @constant*/
var CURRENT_DATE = new Date();
CURRENT_DATE = new Date(CURRENT_DATE.getFullYear(), CURRENT_DATE.getMonth(), CURRENT_DATE.getDate() - 4);

module.exports = {

  /**
  * фильтрация данныех согласно правилам
  */
  getFilteredPictures: function(picturesar, filter) {
    var picturesToFilter = picturesar.slice(0);
    switch(filter) {
      case 'filter-popular':
        break;
      case 'filter-new':
        picturesToFilter.sort(function(a, b) {
          var dateA = new Date(a.date);
          var dateB = new Date(b.date);
          return dateB - dateA;
        });
  /*использование filter вместо цикла for*/
        picturesToFilter = picturesToFilter.filter(function(itemnew) {
          var newdate = Date.parse(itemnew.date) / 1000;
          return newdate > Date.parse(CURRENT_DATE) / 1000;
        });
        break;
      case 'filter-discussed':
        picturesToFilter.sort(function(a, b) {
          return a.comments - b.comments;
        });
        break;
    }
    return picturesToFilter;
  }
};
