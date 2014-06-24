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
    var Utility = require('utilities');

    var utility = new Utility();

    var hUnits = window.innerHeight / 500;
    var wUnits = window.innerWidth / 500;

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
                backgroundColor: '#FAFAFA'
            }
        });
        var backgroundMod = new Modifier({
            transform: Transform.behind,
        });
        this.add(backgroundMod).add(this.background)
        //Focus Title Field

        //Access app header??? But not this:
        this.header = new Surface({
            content:'Add Event',
            size: [true, undefined],
            properties: {
                textAlign: 'center',
                fontFamily: 'sans-serif',
                borderBottom: '1px solid lightgrey'
            }
        });
        var headerMod = new Modifier({
            origin : [0.5, 0.5],
            align: [0.5, 0.5]
        })

        //TBD: Add Cancel and Done buttons on Header

        this.add(headerMod).add(this.header);

        this.titleField = new InputSurface({
            placeholder: 'Title',
            type: 'text',
            properties: {
                // backgroundColor: 'red'
                fontFamily: 'sans-serif',
                borderBottom: '1px solid lightgrey'
            },
            size: [undefined, true]
        });
        var titleFieldModifier = new Modifier({
            origin: [0.5, 0.5],
            align: [0.5, 0.1]
        });
        this.add(titleFieldModifier).add(this.titleField);

        //Focus in title field
        this.titleField.focus();

        this.locationField = new InputSurface({
            placeholder: 'Location',
            type: 'text',
            size: [undefined, true],
            properies: {
                fontFamily: 'sans-serif',
                borderBottom: '1px solid lightgrey'
            }
        });
        var locationModifier = new Modifier({
            align: [0.5, 0.1],
            transform: Transform.translate(0, 50 * hUnits, 0)
        });
        this.add(locationModifier).add(this.locationField);

        this.dateField = new InputSurface({
            placeholder: 'Date',
            type: 'date',
            size: [undefined, true],
            properties: {
                fontFamily: 'sans-serif',
                borderBottom: '1px solid lightgrey'
            }
        });
        var dateModifier = new Modifier({
            align: [0.5, 0.1],
            transform: Transform.translate(0, 75 * hUnits, 0)
        });
        this.add(dateModifier).add(this.dateField);

        this.startField = new InputSurface({
            type: 'time',
            size: [undefined, true],
            properties: {
                fontFamily: 'sans-serif',
                borderBottom: '1px solid lightgrey'
            }
        });
        var startFieldModifier = new Modifier({
            align: [0.5, 0.1],
            transform: Transform.translate(0, 125 * hUnits, 0)
        })
        this.add(startFieldModifier).add(this.startField);

        this.endField = new InputSurface({
            placeholder: 'Ends',
            type: 'time',
            size: [undefined, true],
            properties: {
                backgroundColor: 'white',
                fontFamily: 'sans-serif',
                borderBottom: '1px solid lightgrey'
            }
        });
        var endFieldModifier = new Modifier({
            transform: Transform.translate(0, 150 * hUnits, 0),
            align: [0.5, 0.1]
        })
        this.add(endFieldModifier).add(this.endField);

        this.repeatField = new Surface({
            content: 'Repeat     Never >',
            size: [undefined, true],
            properties: {
                backgroundColor: 'white',
                fontFamily: 'sans-serif',
                borderBottom: '1px solid lightgrey'
            }
            //Is there a true/false input type?
            //Or implement as link to new view  like in iOS cal
        });
        var repeatFieldModifier = new Modifier({
            transform: Transform.translate(0, 200 * hUnits, 0),
            align: [0.5, 0.1],
            properties: {
                fontFamily: 'sans-serif'
            }
        });
        this.add(repeatFieldModifier).add(this.repeatField);

        //On Save
        //newEvent = createEvent.call(this);

        //saveEvent(newEvent);

        this.saveButton = new InputSurface({
            type: 'button',
            size: [undefined, true],
            value: 'Save',
            properties: {
                backgroundColor: 'white',
                fontFamily: 'sans-serif'
            }
        });
        this.saveButton.on('click', function(){
            utility.saveEvent(createEvent.call(this));
        }.bind(this));


        var saveModifier = new Modifier({
            transform: Transform.translate(0, 250 * hUnits, 0),
            align: [0.5, 0.1]
        })
        this.add(saveModifier).add(this.saveButton);

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
        eventData.date = this.dateField.getValue();
        eventData.location = this.locationField.getValue();
        eventData.start = this.startField.getValue();
        eventData.end = this.endField.getValue();
        // eventData.repeat = this.repeatField.getValue();

        return eventData;
    }

    function saveEvent(newEvent) {
      var eventDate = newEvent.date;
      console.log(eventDate);

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
