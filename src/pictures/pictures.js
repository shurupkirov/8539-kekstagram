'use strict';

//var ACTIVE_FILTER_CLASSNAME = 'hotel-filter-active';
var gallery = require('../gallery');
var getPictureElement = require('./get-pictures-element');

var Picture = function(data, container) {
  this.data = data;
  this.element = getPictureElement(this.data, container);
  this.onPictureClick = function(evt) {
    if (evt.target.tagName === 'IMG') {
      evt.preventDefault();
      gallery.showPhoto(data);
    }
  };
  this.remove = function() {
    this.element.removeEventListener('click', this.onPictureClick);
    this.element.removeEventListener('keydown', this.onPictureKeydown);
    this.element.parentNode.removeChild(this.element);
  };
  this.element.addEventListener('click', this.onPictureClick);
  this.element.addEventListener('keydown', this.onPictureKeydown);
  container.appendChild(this.element);
};
module.exports = Picture;
