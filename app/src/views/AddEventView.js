/*** AddEventView ***/

// define this module in Require.JS
define(function(require, exports, module) {

    // Import additional modules to be used in this view 
    var View = require('famous/core/View');
    var Surface = require('famous/core/Surface');
    var Transform = require('famous/core/Transform');
    var StateModifier = require('famous/modifiers/StateModifier');
    var InputSurface = require('famous/surfaces/InputSurface');
    var ScrollView = require('famous/views/Scrollview');
    var Modifier = require('famous/core/Modifier');

    // Constructor function for our SlideShowView class
    function AddEventView() {

        // Applies View's constructor function to AddEventView class
        // View.apply(this, arguments);


        View.apply(this, arguments);
        
        // this.inputFields = [];

        // this.viewSequence = new ViewSequence({
        //   array: this.inputFields
        // });

        // this.sequenceFrom(this.viewSequence);
        

        this.background = new Surface({
            size: [undefined, undefined],
            properties: {
                backgroundColor: 'white'
            }
        });
        var backgroundMod = new Modifier({
            transform: Transform.behind
        });
        this.add(backgroundMod).add(this.background)
        //Focus Title Field

        //Access app header??? But not this:
        this.header = new Surface({
            content:'Add Event'
        });

        //TBD: Add Cancel and Done buttons on Header

        this.add(this.header);

        this.titleField = new InputSurface({
            placeholder: 'Title',
            type: 'text',
            properties: {
                // backgroundColor: 'red'
            },
            size: [100, true]
        });
        var titleFieldModifier = new Modifier({
            origin: [0.5, 0.5],
            align: [0.1, 0.1]
        });
        this.add(titleFieldModifier).add(this.titleField);

        //Focus in title field
        this.titleField.focus();

        this.locationField = new InputSurface({
            placeholder: 'Location',
            type: 'text',
            size: [100, true],
        });
        var locationModifier = new Modifier({
            align: [0.1, 0.1],
            transform: Transform.translate(0, 50, 0)
        });
        this.add(locationModifier).add(this.locationField);

        this.dateField = new InputSurface({
            placeholder: 'Date',
            type: 'date',
            size: [100, true],
        });
        var dateModifier = new Modifier({
            align: [0.1, 0.1],
            transform: Transform.translate(0, 75, 0)
        });
        this.add(dateModifier).add(this.dateField);

        this.startField = new InputSurface({
            // placeholder: 'Starts',
            type: 'time',
            size: [100, true],
        });
        var startFieldModifier = new Modifier({
            align: [0.1, 0.1],
            transform: Transform.translate(0, 125, 0)
        })
        this.add(startFieldModifier).add(this.startField);

        this.endField = new InputSurface({
            placeholder: 'Ends',
            type: 'time',
            size: [100, true],
            properties: {
                backgroundColor: 'white'
            }
        });
        var endFieldModifier = new Modifier({
            transform: Transform.translate(0, 150, 0),
            align: [0.1, 0.1]
        })
        this.add(endFieldModifier).add(this.endField);

        this.repeatField = new Surface({
            content: 'Repeat     Never >',
            size: [100, true],
            properties: {
                backgroundColor: 'white'
            }
            //Is there a true/false input type?
            //Or implement as link to new view  like in iOS cal
        });
        var repeatFieldModifier = new Modifier({
            transform: Transform.translate(0, 200, 0),
            align: [0.1, 0.1]
        });
        this.add(repeatFieldModifier).add(this.repeatField);

        //On Save
        //newEvent = createEvent.call(this);

        //saveEvent(newEvent);

    }

    // Establishes prototype chain for AddEventView class to inherit from View
    AddEventView.prototype = Object.create(View.prototype);
    AddEventView.prototype.constructor = AddEventView;

    // Default options for AddEventView class
    AddEventView.DEFAULT_OPTIONS = {};

    // Define your helper functions and prototype methods here
    function createEvent(){
        var eventData = {};
        eventData.title = this.titleField.getValue();
        eventData.location = this.titleField.getValue();
        eventData.start = this.startField.getValue();
        eventData.end = this.endField.getValue();
        eventData.repeat = this.repeatField.getValue();

        return eventData;
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

    module.exports = AddEventView;
});
