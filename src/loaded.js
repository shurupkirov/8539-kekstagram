'use strict';

/**
* получение массива json, добавление класса загрузки картинок
* пока запрос выполняется. Если запрос завершился ошибкой
* или таймаутом - добавляем класс ошибки
*/
var loaded = function(url, loadtimeout, contain, callback) {
  var xhr = new XMLHttpRequest();
  xhr.timeout = loadtimeout;
  var loadDataTimeoutOrError = function() {
    contain.classList.add('pictures-failure');
    contain.classList.remove('pictures-loading');
  };
  contain.classList.add('pictures-loading');
  var loadDataStatus = function() {
    if(xhr.readyState === 4) {
      contain.classList.remove('pictures-loading');
    }
  };
  var loadDataStart = function(evt) {
    var loadedData = JSON.parse(evt.target.response);
    callback(loadedData);
  };
  xhr.open('GET', url);
  xhr.send();
  xhr.addEventListener('timeout', loadDataTimeoutOrError);
  xhr.addEventListener('error', loadDataTimeoutOrError);
  xhr.addEventListener('readystatechange', loadDataStatus);
  xhr.addEventListener('load', loadDataStart);
};

module.exports = loaded;
