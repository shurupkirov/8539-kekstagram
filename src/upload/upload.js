/*
* global Resizer: true
*/

/**
 * @fileoverview
 * @author Igor Alexeenko (o0)
 */

'use strict';

/** Подключение зависимости библиотеки browser-cookies в переменную
 */
var browserCookies = require('browser-cookies');

var utilities = require('../utilities');
var Resizer = require('../resizer');

(function() {
  /** @enum {string} */
  var FileType = {
    'GIF': '',
    'JPEG': '',
    'PNG': '',
    'SVG+XML': ''
  };

  /** @enum {number} */
  var Action = {
    ERROR: 0,
    UPLOADING: 1,
    CUSTOM: 2
  };

  /**
   * Регулярное выражение, проверяющее тип загружаемого файла. Составляется
   * из ключей FileType.
   * @type {RegExp}
   */
  var fileRegExp = new RegExp('^image/(' + Object.keys(FileType).join('|').replace('\+', '\\+') + ')$', 'i');

  /**
   * @type {Object.<string, string>}
   */
  var filterMap;

  /**
   * Объект, который занимается кадрированием изображения.
   * @type {Resizer}
   */
  var currentResizer;

  /**
   * Удаляет текущий объект {@link Resizer}, чтобы создать новый с другим
   * изображением.
   */
  function cleanupResizer() {
    if (currentResizer) {
      currentResizer.remove();
      currentResizer = null;
    }
  }

  /**
   * Ставит одну из трех случайных картинок на фон формы загрузки.
   */
  function updateBackground() {
    var images = [
      'img/logo-background-1.jpg',
      'img/logo-background-2.jpg',
      'img/logo-background-3.jpg'
    ];

    var backgroundElement = document.querySelector('.upload');
    var randomImageNumber = Math.round(Math.random() * (images.length - 1));
    backgroundElement.style.backgroundImage = 'url(' + images[randomImageNumber] + ')';
  }

  /**
   * Входные данные инпутов формы
   */
  var leftPositionImage = document.querySelector('#resize-x');
  var topPositionImage = document.querySelector('#resize-y');
  var sideCropImage = document.querySelector('#resize-size');
  var buttonCropSubmit = document.querySelector('#resize-fwd');
  var sideCropImageMax;
  leftPositionImage.min = 0;
  topPositionImage.min = 0;
  sideCropImage.min = 1;
  /**
   * Проверка введенных данных в инпуты
   */
  var inputonchange;
  var inputChangeForm = function() {
    buttonCropSubmit.disabled = false;
    submitMessage.classList.add('invisible');
    inputonchange = event.target;
    switch(inputonchange.id) {
      case'resize-x' :
        if (sideCropImage.value !== '' && sideCropImage.validity.valid) {
          leftPositionImage.max = currentResizer._image.naturalWidth - sideCropImage.value;
        } else {
          leftPositionImage.max = currentResizer._image.naturalWidth - 1;
        }
        break;
      case 'resize-y':
        if (sideCropImage.value !== '' && sideCropImage.validity.valid) {
          topPositionImage.max = currentResizer._image.naturalHeight - sideCropImage.value;
        } else {
          topPositionImage.max = currentResizer._image.naturalHeight - 1;
        }
        break;
      case 'resize-size':
        if (leftPositionImage.value !== '' && topPositionImage.value !== '') {
          if (currentResizer._image.naturalWidth - leftPositionImage.value > currentResizer._image.naturalHeight - topPositionImage.value) {
            sideCropImage.max = currentResizer._image.naturalHeight - topPositionImage.value;
          } else {
            sideCropImage.max = currentResizer._image.naturalWidth - leftPositionImage.value;
          }
        } else if (leftPositionImage.value !== '' && currentResizer._image.naturalWidth - leftPositionImage.value < sideCropImageMax ) {
          sideCropImage.max = currentResizer._image.naturalWidth - leftPositionImage.value;
        } else if (topPositionImage.value !== '' && currentResizer._image.naturalHeight - topPositionImage < sideCropImageMax) {
          sideCropImage.max = currentResizer._image.naturalHeight - topPositionImage.value;
        } else {
          sideCropImage.max = sideCropImageMax;
        }
        break;
    }
    if (!event.target.validity.valid) {
      submitMessage.querySelector('.submit-message-container').innerHTML = resizeInputIsValid(event.target);
      submitMessage.classList.remove('invisible');
    } else {
      currentResizer.setConstraint(+leftPositionImage.value, +topPositionImage.value, +sideCropImage.value);
    }
  };

  /**
   * @type {HTMLElement}
   */
  var submitMessage = document.querySelector('.submit-message');

  /**
   * Проверяет правильноть элемента формы
   * и возвращает сообщение об ошибке
   */
  function resizeInputIsValid(varnameinput) {
    var messageinput;
    if (varnameinput.validity.valid) {
      messageinput = '';
    } else {
      messageinput = varnameinput.validationMessage;
    }
    return messageinput;
  }

  /**
   * Проверяет, валидны ли данные, в форме кадрирования.
   * @return {boolean}
   */

  function resizeFormIsValid() {
    if (leftPositionImage.value !== '' && topPositionImage.value !== '' && sideCropImage.value !== '' && leftPositionImage.validity.valid && topPositionImage.validity.valid && sideCropImage.validity.valid) {
      buttonCropSubmit.disabled = false; return true;
    } else {
      if (leftPositionImage.value === '' && topPositionImage.value === '' && sideCropImage.value === '') {
        submitMessage.querySelector('.submit-message-container').innerHTML = 'Поля "Слева", "Сверху", "Сторона" не могут быть пустыми';
      } else if(leftPositionImage.value === '' && topPositionImage.value === '') {
        submitMessage.querySelector('.submit-message-container').innerHTML = 'Поля "Слева" и "Сверху" не могут быть пустыми';
      } else if(leftPositionImage.value === '' && sideCropImage.value === '') {
        submitMessage.querySelector('.submit-message-container').innerHTML = 'Поля "Слева" и "Сторона" не могут быть пустыми';
      } else if (topPositionImage.value === '' && sideCropImage.value === '') {
        submitMessage.querySelector('.submit-message-container').innerHTML = 'Поля "Сверху" и "Сторона" не могут быть пустыми';
      } else if (leftPositionImage.value === '') {
        submitMessage.querySelector('.submit-message-container').innerHTML = 'Поле "Слева" не может быть пустым';
      } else if (topPositionImage.value === '') {
        submitMessage.querySelector('.submit-message-container').innerHTML = 'Поле "Сверху" не может быть пустым';
      } else {
        submitMessage.querySelector('.submit-message-container').innerHTML = 'Поле "Сторона" не может быть пустым';
      }
      submitMessage.classList.remove('invisible');
      buttonCropSubmit.disabled = true; return false;
    }

  }


  /**
   * Форма загрузки изображения.
   * @type {HTMLFormElement}
   */
  var uploadForm = document.forms['upload-select-image'];

  /**
   * Форма кадрирования изображения.
   * @type {HTMLFormElement}
   */
  var resizeForm = document.forms['upload-resize'];

  /**
   * Форма добавления фильтра.
   * @type {HTMLFormElement}
   */
  var filterForm = document.forms['upload-filter'];

  /**
   * @type {HTMLImageElement}
   */
  var filterImage = filterForm.querySelector('.filter-image-preview');

  /**
   * @type {HTMLElement}
   */
  var uploadMessage = document.querySelector('.upload-message');

  /**
   * @param {Action} action
   * @param {string=} message
   * @return {Element}
   */
  function showMessage(action, message) {
    var isError = false;

    switch (action) {
      case Action.UPLOADING:
        message = message || 'Кексограмим&hellip;';
        break;

      case Action.ERROR:
        isError = true;
        message = message || 'Неподдерживаемый формат файла<br> <a href="' + document.location + '">Попробовать еще раз</a>.';
        break;
    }

    uploadMessage.querySelector('.upload-message-container').innerHTML = message;
    uploadMessage.classList.remove('invisible');
    uploadMessage.classList.toggle('upload-message-error', isError);
    return uploadMessage;
  }

  function hideMessage() {
    uploadMessage.classList.add('invisible');
  }

  /**
   * Обработчик изменения изображения в форме загрузки. Если загруженный
   * файл является изображением, считывается исходник картинки, создается
   * Resizer с загруженной картинкой, добавляется в форму кадрирования
   * и показывается форма кадрирования.
   * @param {Event} evt
   */
  var uploadFormChange = function(evt) {
    var element = evt.target;
    if (element.id === 'upload-file') {
      // Проверка типа загружаемого файла, тип должен быть изображением
      // одного из форматов: JPEG, PNG, GIF или SVG.
      if (fileRegExp.test(element.files[0].type)) {
        var fileReader = new FileReader();

        showMessage(Action.UPLOADING);

        var fileReaderLoad = function() {
          cleanupResizer();

          currentResizer = new Resizer(fileReader.result);
          currentResizer.setElement(resizeForm);
          uploadMessage.classList.add('invisible');

          uploadForm.classList.add('invisible');
          resizeForm.classList.remove('invisible');
          if (currentResizer._image.naturalWidth > currentResizer._image.naturalHeight) {
            sideCropImageMax = currentResizer._image.naturalHeight;
          } else {
            sideCropImageMax = currentResizer._image.naturalWidth;
          }
          sideCropImage.max = sideCropImageMax;
          leftPositionImage.max = currentResizer._image.naturalWidth - 1;
          topPositionImage.max = currentResizer._image.naturalHeight - 1;
          hideMessage();
        };
        fileReader.addEventListener('load', fileReaderLoad);
        fileReader.readAsDataURL(element.files[0]);
      } else {
        // Показ сообщения об ошибке, если загружаемый файл, не является
        // поддерживаемым изображением.
        showMessage(Action.ERROR);
      }
    }
  };
  uploadForm.addEventListener('change', uploadFormChange);
  /**
   * Обработка сброса формы кадрирования. Возвращает в начальное состояние
   * и обновляет фон.
   * @param {Event} evt
   */
  var resizeFormReset = function(evt) {
    evt.preventDefault();

    cleanupResizer();
    updateBackground();

    resizeForm.classList.add('invisible');
    uploadForm.classList.remove('invisible');
  };

  /**
   * Обработка отправки формы кадрирования. Если форма валидна, экспортирует
   * кропнутое изображение в форму добавления фильтра и показывает ее.
   * @param {Event} evt
   */
  var resizeFormSubmit = function(evt) {
    evt.preventDefault();

    if (resizeFormIsValid()) {
      filterImage.src = currentResizer.exportImage().src;

      resizeForm.classList.add('invisible');
      filterForm.classList.remove('invisible');
      filterImage.className = 'filter-image-preview ' + browserCookies.get('filter');
      var inputactive = filterForm.querySelector('#upload-' + browserCookies.get('filter'));
      inputactive.checked = true;
    }
  };
  resizeForm.addEventListener('input', inputChangeForm);
  resizeForm.addEventListener('submit', resizeFormSubmit);
  resizeForm.addEventListener('reset', resizeFormReset);

  /**
   * Сброс формы фильтра. Показывает форму кадрирования.
   * @param {Event} evt
   */
  var filterFormReset = function(evt) {
    evt.preventDefault();
    filterForm.classList.add('invisible');
    resizeForm.classList.remove('invisible');
  };

  /**
   * Отправка формы фильтра. Возвращает в начальное состояние, предварительно
   * записав сохраненный фильтр в cookie.
   * @param {Event} evt
   */
  var filterFormSubmit = function(evt) {
    evt.preventDefault();

    cleanupResizer();
    updateBackground();

    filterForm.classList.add('invisible');
    uploadForm.classList.remove('invisible');
  };

  /**
   * Обработчик изменения фильтра. Добавляет класс из filterMap соответствующий
   * выбранному значению в форме.
   */
  var filterFormChange = function() {
    if (!filterMap) {
      // Ленивая инициализация. Объект не создается до тех пор, пока
      // не понадобится прочитать его в первый раз, а после этого запоминается
      // навсегда.
      filterMap = {
        'none': 'filter-none',
        'chrome': 'filter-chrome',
        'sepia': 'filter-sepia'
      };
    }

    var selectedFilter = [].filter.call(filterForm['upload-filter'], function(item) {
      return item.checked;
    })[0].value;

    // Класс перезаписывается, а не обновляется через classList потому что нужно
    // убрать предыдущий примененный класс. Для этого нужно или запоминать его
    // состояние или просто перезаписывать.
    filterImage.className = 'filter-image-preview ' + filterMap[selectedFilter];
    browserCookies.set('filter', filterMap[selectedFilter], {
      expires: utilities.getDayFromBirthday()
    });
  };
  filterForm.addEventListener('reset', filterFormReset);
  filterForm.addEventListener('submit', filterFormSubmit);
  filterForm.addEventListener('change', filterFormChange);
  cleanupResizer();
  updateBackground();
  var imageResizeChange = function() {
    var currentImage = currentResizer.getConstraint();
    var currentImageCoordinate = function() {
      leftPositionImage.value = Math.floor(currentImage.x);
      topPositionImage.value = Math.floor(currentImage.y);
      sideCropImage.value = Math.floor(currentImage.side);
    };
    currentImageCoordinate();
  };
  window.addEventListener('resizerchange', imageResizeChange);
})();
