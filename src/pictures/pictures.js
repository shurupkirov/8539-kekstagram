'use strict';

//var ACTIVE_FILTER_CLASSNAME = 'hotel-filter-active';
var gallery = require('../gallery');
var getPictureElement = require('./get-pictures-element');
var utilities = require('../utilities');

var Picture = function(data, container) {
  this.data = data;
  this.element = getPictureElement(this.data, container);
  this.onPictureClick = function(evt) {
    if (evt.target.tagName === 'IMG') {
      evt.preventDefault();
      console.log(data);
//      gallery.showPhoto(data);
      location.hash = '#photo/' + data.url;
    }
  };
  this.onPictureKeydown = function(evt) {
    if(utilities.isDeactivationEvent(evt)) {
      evt.preventDefault();
      gallery.hidePhoto();
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
