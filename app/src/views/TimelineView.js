/*** TimelineView.js ***/

define(function(require, exports, module) {
  var View            = require('famous/core/View');
  var Surface         = require('famous/core/Surface');
  var Transform       = require('famous/core/Transform');
  var StateModifier   = require('famous/modifiers/StateModifier');
  
  function TimelineView() {
    View.apply(this, arguments);
  }
  
  TimelineView.prototype = Object.create(View.prototype);
  TimelineView.prototype.constructor = TimelineView;
  
  TimelineView.DEFAULT_OPTIONS = {};
  
  module.exports = TimelineView;
});
