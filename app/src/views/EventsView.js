/*** EventsView.js ***/

define(function(require, exports, module) {
  var View            = require('famous/core/View');
  var Surface         = require('famous/core/Surface');
  var Transform       = require('famous/core/Transform');
  var StateModifier   = require('famous/modifiers/StateModifier');
  var Event = require('views/EventView');
  var Utilities = require('utilities');

  var utilities = new Utilities();
  
  function EventsView() {
    View.apply(this, arguments);
  
    var newEvent;

    var eventsArray = getEvents(); //How to get date ???

    //Instantiate Event views from local storage
    for (var i = 0; i < eventsArray.length; i++){
      newEvent = new Event();
      newEvent.setContent('<p>eventsArray[i].title</p>');
      this.add(newEvent);

    }
  }


  //Checks for local storage support ... Where to put this?
  function supports_html5_storage() {
    try {
      return 'localStorage' in window && window['localStorage'] !== null;
    } catch (e) {
      return false;
    }
  }


  EventsView.DEFAULT_OPTIONS = {};
  
  EventsView.prototype = Object.create(View.prototype);
  EventsView.prototype.constructor = EventsView;
  
  
  module.exports = EventsView;
});
