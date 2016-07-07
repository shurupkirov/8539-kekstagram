function getMessage(a,b) {
var resultString='Ошибка в коде функции';
var aType=typeof a;
var bType=typeof b;
  if(aType=='boolean'&&a==true) {
    resultString='Переданное GIF-изображение анимировано и содержит ' + b + ' кадров';
  }
  else if(aType=='boolean'&&a==false){
    resultString='Переданное GIF-изображение не анимировано';
  }
  else if(aType=='number') {
    resultString='Переданное SVG-изображение содержит ' + a + ' объектов и ' + (b*4) + ' атрибутов';
  }
  else if(Array.isArray(a)&&!Array.isArray(b)) {
    var sum = 0;
    for (var i = 0; i < a.length; i++) {
      sum=sum + a[i];
    }
    resultString='Количество красных точек во всех строчках изображения: ' + sum;
  }
  else if(Array.isArray(a)&&Array.isArray(b)) {
    var square = 0;
    for (var i = 0; i < a.length; i++) {
      square=square + a[i]*b[i];
    }
    resultString='Общая площадь артефактов сжатия: ' + square + ' пикселей';
  }
  return resultString;
}
