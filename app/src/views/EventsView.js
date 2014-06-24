/*** EventsView.js ***/

define(function(require, exports, module) {
  var View            = require('famous/core/View');
  var Surface         = require('famous/core/Surface');
  var Transform       = require('famous/core/Transform');
  var StateModifier   = require('famous/modifiers/StateModifier');
  var Event = require('views/EventView');
  
  function EventsView() {
    View.apply(this, arguments);
    this.add(new Surface({
      size: [true, true],

    }))

  }

  function supports_html5_storage() {
    try {
      return 'localStorage' in window && window['localStorage'] !== null;
    } catch (e) {
      return false;
    }
  }

  function saveEvent(newEvent) {

    //Retrieve events for date from local storage
    var events = window.localStorage.getItem(eventDate);

    //Check if any events exist
    if(events === null){
      //Initialize events to array
      events = [];
    }else{
      //Parse events array from string
      events = JSON.parse(events);
    }

    //create new event object from input - TBD in Calling Function

    //Object schema:
    //{date: eventToBeSaved.date, 
      // start: eventToBeSaved.start, 
      // end: eventEndTime, 
      // title: eventTitle, 
      // description: eventBody};
    
    //add new event to events array
    events.push(newEvent);
    //Store updated events array in local storage
    window.localStorage.setItem(eventDate, JSON.stringify(events));
  }

  function getEvents(date){
    //returns events array for given date
    return JSON.parse(window.localStorage.getItem(date));
  }

  EventsView.DEFAULT_OPTIONS = {};
  
  EventsView.prototype = Object.create(View.prototype);
  EventsView.prototype.constructor = EventsView;
  
  
  module.exports = EventsView;
});
