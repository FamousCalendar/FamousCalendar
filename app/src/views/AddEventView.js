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
    var Easing = require('famous/transitions/Easing');
    var RenderNode = require('famous/core/RenderNode');
    var Transitionable = require('famous/transitions/Transitionable');
    var EventView = require('views/EventView');

    var hUnits = window.innerHeight / 450;
    var wUnits = window.innerWidth / 500;


    //Create repeat selector to access value
    var repeatValue = document.createElement('select');
    repeatValue.innerHTML = '<option value="false">Never</option><option value="daily">Daily</option><option value="weekly">Weekly</option><option value="monthly">Monthly</option><option value="yearly">Yearly</option>';

    // Constructor function for our SlideShowView class
    function AddEventView() {

        View.apply(this, arguments);
        
        Utility.getCalendar();
        this.node = new RenderNode({

        });
        


        this.back = new Surface({
            size: [undefined, undefined],
            position: [100, 100],
            properties: {
                backgroundColor: '#FAFAFA'
            }
        });
        var backgroundMod = new Modifier({
            origin: [0.5, 0.5],
            align: [0.5, 0.5],
        });

        this.node.add(backgroundMod).add(this.back);

        var cancelIcon = new Surface({
          size: [true, true],
          content:'Cancel',
          properties: {
            color: 'red',
            fontFamily: 'sans-serif',
            cursor: 'pointer'
          }
        });

        var cancelIconModifier = new Modifier({
          align: [0.04, 0.03],
          origin: [0, 0]
        });



        this.node.add(cancelIconModifier).add(cancelIcon);
        //Focus Title Field

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

        this.node.add(headerMod).add(this.header);

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
            align: [0.5, 0.1],
            transform: Transform.translate(0, 0, 0)
        });
        this.node.add(titleFieldModifier).add(this.titleField);

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
            align: [0.5, 0.2],
            transform: Transform.translate(0, 0, 0)
        });
        this.node.add(locationModifier).add(this.locationField);

        this.dateField = new InputSurface({
            placeholder: 'Date',
            type: 'date',
            size: [undefined, true],
            properties: {
                fontFamily: 'sans-serif',
                borderBottom: '1px solid lightgrey',
                color: 'red',
                cursor: 'pointer',
                // display: 'block',
                // letterSpacing: '4px',     
                // textShadow: "0 0 2px black",       
                // wordSpacing: '20px'    
            }
        });
        var dateModifier = new Modifier({
            align: [0.5, 0.3],
            transform: Transform.translate(0, 0, 0)
        });
        this.node.add(dateModifier).add(this.dateField);

        this.startLabel = new Surface({
            content: 'Starts at:',
            properties: {
                fontFamily: 'sans-serif',
                borderBottom: '1px solid lightgrey'
            },
            size: [undefined, true]
        });
        var startLabelModifier = new Modifier({
            origin: [0.5, 0.5],
            align: [0.5, 0.38],
            transform: Transform.translate(0, 0, 0)
        });
        this.node.add(startLabelModifier).add(this.startLabel);

        this.startField = new InputSurface({
            type: 'time',
            size: [undefined, true],
            properties: {
                fontFamily: 'sans-serif',
                borderBottom: '1px solid lightgrey',
                color: 'red'
            }
        });
        var startFieldModifier = new Modifier({
            align: [0.5, 0.43],
            transform: Transform.translate(0, 0, 0)
        })
        this.node.add(startFieldModifier).add(this.startField);



        this.endLabel = new Surface({
            content: 'Ends at:',
            properties: {
                fontFamily: 'sans-serif',
                borderBottom: '1px solid lightgrey'
            },
            size: [undefined, true]
        });
        var endLabelModifier = new Modifier({
            origin: [0.5, 0.5],
            align: [0.5, 0.5],
            transform: Transform.translate(0, 0, 0)
        });
        this.node.add(endLabelModifier).add(this.endLabel);


        this.endField = new InputSurface({
            type: 'time',
            size: [undefined, true],
            properties: {
                backgroundColor: 'white',
                fontFamily: 'sans-serif',
                borderBottom: '1px solid lightgrey',
                color: 'red'
            }
        });
        var endFieldModifier = new Modifier({
            transform: Transform.translate(0, 0, 0),
            align: [0.5, 0.55]
        })
        this.node.add(endFieldModifier).add(this.endField);

        this.repeatLabel = new Surface({
            content: 'Repeat:',
            properties: {
                fontFamily: 'sans-serif',
                borderBottom: '1px solid lightgrey'
            },
            size: [undefined, true]
        });
        var repeatLabelModifier = new Modifier({
            origin: [0.5, 0.5],
            align: [0.5, 0.63],
            transform: Transform.translate(0, 0, 0)
        });
        this.node.add(repeatLabelModifier).add(this.repeatLabel);

        this.repeatField = new Surface({
            content: repeatValue,
            size: [undefined, true],
            properties: {
                backgroundColor: 'white',
                fontFamily: 'sans-serif',
                borderBottom: '1px solid lightgrey'
            }
        });
        var repeatFieldModifier = new Modifier({
            transform: Transform.translate(0, 0, 0),
            align: [0.5, 0.7],
            properties: {
            }
        });
        this.node.add(repeatFieldModifier).add(this.repeatField);

        this.saveButton = new InputSurface({
            type: 'button',
            size: [undefined, true],
            value: 'Save',
            properties: {
                backgroundColor: 'white',
                fontFamily: 'sans-serif',
                cursor: 'pointer'
            }
        });
        this.saveButton.on('click', function(){
            Utility.saveEvent(_createEvent.call(this));

            //*****For Testing Only
            this.node.add(new EventView(_createEvent.call(this)));

            //Uncomment this ********
            // _outTransition.call(this);
        }.bind(this));

        cancelIcon.on('click', function(){
            _outTransition.call(this);
        }.bind(this));


        var saveModifier = new Modifier({
            transform: Transform.translate(0, 0, 0),
            align: [0.5, 0.8]
        });
        this.node.add(saveModifier).add(this.saveButton);

        this.mainModifier = new Modifier({
            transform: Transform.translate(0, 450 * hUnits, 0)

        });


        this.add(this.mainModifier).add(this.node);


        //ANIMATIONS
        this.mainModifier.setTransform(Transform.translate(0,0,0), { duration: 990, curve: Easing.inOutExpo});

    }

    // Establishes prototype chain for AddEventView class to inherit from View
    AddEventView.prototype = Object.create(View.prototype);
    AddEventView.prototype.constructor = AddEventView;

    // Default options for AddEventView class
    AddEventView.DEFAULT_OPTIONS = {
        transition: {
            duration: 300,
            curve: Easing.inOutElastic
        }
    };

    // Define your helper functions and prototype methods here
    function _outTransition(){
        this.mainModifier.setTransform(Transform.translate(0, 450 * hUnits, 0), {duration: 990, curve: Easing.inOutExpo});
    }

    function _createEvent(){
        return {
            title : this.titleField.getValue(),
            date : this.dateField.getValue(),
            location : this.locationField.getValue(),
            start : this.startField.getValue(),
            end : this.endField.getValue(),
            repeat : repeatValue.value
            // eventData.repeat = this.repeatField.getValue();
        };
    }



    module.exports = AddEventView;
});
