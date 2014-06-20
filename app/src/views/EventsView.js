/*** EventsView.js ***/

define(function(require, exports, module) {
  var View            = require('famous/core/View');
  var Surface         = require('famous/core/Surface');
  var Transform       = require('famous/core/Transform');
  var StateModifier   = require('famous/modifiers/StateModifier');
  
  function EventsView() {
    View.apply(this, arguments);
  }
  
  EventsView.prototype = Object.create(View.prototype);
  EventsView.prototype.constructor = EventsView;
  
  EventsView.DEFAULT_OPTIONS = {};
  
  module.exports = EventsView;
});
