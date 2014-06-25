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

    var hUnits = window.innerHeight / 450;
    var wUnits = window.innerWidth / 500;

    // Constructor function for our SlideShowView class
    function AddEventView() {

        View.apply(this, arguments);
        
        // this.inputFields = [];

        // this.viewSequence = new ViewSequence({
        //   array: this.inputFields
        // });

        // this.sequenceFrom(this.viewSequence);

        this.node = new RenderNode({

        });
        

        this.background = new Surface({
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

        // setTransform(Transform.translate(0,0,0), { duration: 300000, curve: Easing.inOutElastic});
        this.node.add(backgroundMod).add(this.background);
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
            transform: Transform.translate(0, 20 * hUnits, 0)
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
            align: [0.5, 0.1],
            transform: Transform.translate(0, 50 * hUnits, 0)
        });
        this.node.add(locationModifier).add(this.locationField);

        this.dateField = new InputSurface({
            placeholder: 'Date',
            type: 'date',
            size: [undefined, true],
            properties: {
                fontFamily: 'sans-serif',
                borderBottom: '1px solid lightgrey',
                color: 'red'
            }
        });
        var dateModifier = new Modifier({
            align: [0.5, 0.1],
            transform: Transform.translate(0, 80 * hUnits, 0)
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
            align: [0.5, 0.1],
            transform: Transform.translate(0, 110*hUnits, 0)
        });
        this.node.add(startLabelModifier).add(this.startLabel);

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
            align: [0.5, 0.1],
            transform: Transform.translate(0, 150*hUnits, 0)
        });
        this.node.add(endLabelModifier).add(this.endLabel);


        this.endField = new InputSurface({
            type: 'time',
            size: [undefined, true],
            properties: {
                backgroundColor: 'white',
                fontFamily: 'sans-serif',
                borderBottom: '1px solid lightgrey'
            }
        });
        var endFieldModifier = new Modifier({
            transform: Transform.translate(0, 175 * hUnits, 0),
            align: [0.5, 0.1]
        })
        this.node.add(endFieldModifier).add(this.endField);

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
        this.node.add(repeatFieldModifier).add(this.repeatField);

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
            Utility.saveEvent(_createEvent.call(this));
            mainModifier.setTransform(Transform.translate(0, 450* hUnits, 0), {duration: 990, curve: Easing.inOutExpo});
        }.bind(this));


        var saveModifier = new Modifier({
            transform: Transform.translate(0, 300 * hUnits, 0),
            align: [0.5, 0.1]
        });
        this.node.add(saveModifier).add(this.saveButton);

        var mainModifier = new Modifier({
            transform: Transform.translate(0, 450 * hUnits, 0)
        });

        this.add(mainModifier).add(this.node);


        //ANIMATIONS
        mainModifier.setTransform(Transform.translate(0,0,0), { duration: 990, curve: Easing.inOutExpo});

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
    function _createEvent(){
        return {
            title : this.titleField.getValue(),
            date : this.dateField.getValue(),
            location : this.locationField.getValue(),
            start : this.startField.getValue(),
            end : this.endField.getValue()
            // eventData.repeat = this.repeatField.getValue();
        };
    }



    module.exports = AddEventView;
});
