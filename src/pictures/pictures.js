'use strict';

//var ACTIVE_FILTER_CLASSNAME = 'hotel-filter-active';

var getPictureElement = require('./get-pictures-element');

var Picture = function(data, container) {
  this.data = data;
  this.element = getPictureElement(this.data, container);
  container.appendChild(this.element);
};
module.exports = Picture;
