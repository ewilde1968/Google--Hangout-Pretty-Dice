/*
 * Copyright (c) 2011 Google Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License. You may obtain
 * a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations under
 * the License.
 */

/**
 * @fileoverview Logic for the Talking Head App.
 * @author Tim Blasi (Google)
 */

/**
 * Whether to display debug information in the app.
 * @type {boolean}
 * @const
 */
var DEBUG = false;

/**
 * Syncs local copies of shared state with those on the server and renders the
 *     app to reflect the changes.
 * @param {!Array.<Object.<!string, *>>} add Entries added to the shared state.
 * @param {!Array.<!string>} remove Entries removed from the shared state.
 */
function updateLocalStateData(add, remove) {
	// Update the dynamic strings to show all rolls
	//		rollLogTA
	//		resultP
	//		rollsP
	for (var i = 0, iLen = add.length; i < iLen; ++i) {
		switch( add[i].key) {
		case "rollLogTA":
			DOM_.rollLogTA.val( add[i].value);
			break;
		case "resultP":
			DOM_.resultP.text( add[i].value);
			break;
		case "rollsP":
			DOM_.rollsP.text( add[i].value);
			break;
		}
	}

	// nothing to do for remove
}

/**
 * A list of the participants.
 * @type {Array.<gapi.hangout.Participant>}
 * @private
 */
var participants_ = null;
var myName = null;

/**
 * Syncs local copy of the participants list with that on the server and renders
 *     the app to reflect the changes.
 * @param {!Array.<gapi.hangout.Participant>} participants The new list of
 *     participants.
 */
function updateLocalParticipants(participants) {
	participants_ = participants;
}

/**
 * A map of names to jQuery elements which compose the app.
 * @type {Object.<string, jQuery>}
 * @private
 */
var DOM_ = {
  body: null,
  canvas: null,
  resultP: null,
  inputSingleRollTI: null,
  rollsP: null,
  showLogI: null,
  singleRollI: null,
  inputRollLogTI: null,
  rollLogTA: null,
  hideLogI: null,
  multiRollI: null,
  inputTI: null
};

/**
 * Create required DOM elements and listeners.
 */
function prepareAppDOM() {
  DOM_.resultP = $('<p />')
  	.attr('id', 'resultP');
  DOM_.inputSingleRollTI = $('<input />')
  	.attr({
  		'id': 'inputSingleRollTI',
  		'type': 'text' })
  	.keydown(function(event) {
  		KeyDown(event);
  	});
  DOM_.rollsP = $('<p />')
  	.attr('id', 'rollsP');
  DOM_.showLogI = $('<img />')
  	.attr({
  		'id': 'showLogI',
  		'alt': 'show log',
  		'src': '//sites.google.com/site/ewilde1968testbed/home/dice/static/discloseup.png'
  	})
  	.click(function() {
  		SwitchViews( true);
  	});
  DOM_.singleRollI = $('<img />')
  	.attr({
  		'id': 'singleRollI',
  		'src': '//sites.google.com/site/ewilde1968testbed/home/dice/static/DiceBackground.gif'
  	});
  DOM_.inputRollLogTI = $('<input />')
  	.attr({
  		'id':'inputRollLogTI',
  		'type': 'text' })
  	.keydown(function(event) {
  		KeyDown(event);
  	});
  DOM_.rollLogTA = $('<textarea />')
  	.attr({
  		'id':'rollLogTA',
  		'readonly':'true'
  	});
  DOM_.hideLogI = $('<img />')
  	.attr({
  		'id':'hideLogI',
  		'alt':'hide log',
  		'src': '//sites.google.com/site/ewilde1968testbed/home/dice/static/disclosedown.png'
  	})
  	.click(function() {
  		SwitchViews( false);
  	});
  DOM_.multiRollI = $('<img />')
  	.attr({
  		'id':'multiRollI',
  		'src': '//sites.google.com/site/ewilde1968testbed/home/dice/static/DiceLogBackground.gif'
  	});
  
  DOM_.canvas = $('<div />')
  	.attr('id', 'canvas')
  	.append(DOM_.singleRollI)
  	.append(DOM_.resultP)
  	.append(DOM_.inputSingleRollTI)
  	.append(DOM_.rollsP)
  	.append(DOM_.showLogI)
  	.append(DOM_.multiRollI)
  	.append(DOM_.inputRollLogTI)
  	.append(DOM_.rollLogTA)
  	.append(DOM_.hideLogI);
  
  DOM_.body = $('body')
      .append(DOM_.canvas);

  if (DEBUG) {
    DOM_.debugTable = $('<table />');
    DOM_.body.append(DOM_.debugTable);
  }
}

function SwitchViews( multiRoll) {
	if( multiRoll) {
		DOM_.singleRollI.hide();
		DOM_.resultP.hide();
		DOM_.inputSingleRollTI.hide();
		DOM_.rollsP.hide();
		DOM_.showLogI.hide();
	  	DOM_.multiRollI.show();
		DOM_.inputRollLogTI.show();
		DOM_.rollLogTA.show();
		DOM_.hideLogI.show();
		DOM_.inputTI = DOM_.inputRollLogTI;
	} else {
		DOM_.singleRollI.show();
		DOM_.resultP.show();
		DOM_.inputSingleRollTI.show();
		DOM_.rollsP.show();
		DOM_.showLogI.show();
	  	DOM_.multiRollI.hide();
		DOM_.inputRollLogTI.hide();
		DOM_.rollLogTA.hide();
		DOM_.hideLogI.hide();
		DOM_.inputTI = DOM_.inputSingleRollTI;
	}
}

function AddToLog(inputStr) {
	DOM_.rollLogTA.val( function(n,c) {
		return inputStr + c;
	});
}

function UpdateName() {
	var myID = gapi.hangout.getParticipantId();
	if( myID != null) {
		var myParticipant = gapi.hangout.getParticipantById( myID);
		if( myParticipant != null) {
			myName = myParticipant.person.displayName;
		}
	}
}


function SaveSharedState() {
    var state = {};
    state["rollLogTA"] = DOM_.rollLogTA.val();
    state["resultP"] = DOM_.resultP.text();
    state["rollsP"] = DOM_.rollsP.text();
	if (state) {
	    gapi.hangout.data.submitDelta(state, null);
	}
}

function SingleRoll() {
	var y = DOM_.inputTI.val();
	if( y != null & y.length > 0) {
		// generate the roll
		var roll = new Roll( y);
		DOM_.resultP.text( roll.value);
		DOM_.rollsP.text( roll.RollsString());

		// update name
		if( myName == null)
			UpdateName();
		
		// update the roll log
		var entry = new RollLogEntry( y, roll, myName);
		AddToLog( entry.toString());

		// save the shared state
		SaveSharedState();
	}
}

function KeyDown(e)
{
	var keynum;
	
	if( window.event) // IE
		keynum = e.keyCode;
	else if( window.which)	// Netscape, Firefox, Opera
		keynum = e.which;

	if( keynum == 13)	// enter key
		SingleRoll();
}

/**
 * Initialize the DOM and app data.
 */
(function() {
  if (gapi && gapi.hangout) {
    var initHangout = function(apiReadyEvent) {
      if (apiReadyEvent.isApiReady) {
        prepareAppDOM();
        SwitchViews( false);

        gapi.hangout.data.onStateChanged.add(function(stateChangeEvent) {
        	updateLocalStateData(stateChangeEvent.addedKeys,
        			stateChangeEvent.removedKeys);
        });
        gapi.hangout.onParticipantsChanged.add(function(partChangeEvent) {
        	updateLocalParticipants(partChangeEvent.participants);
        });

        gapi.hangout.onApiReady.remove(initHangout);
      }
    };

    gapi.hangout.onApiReady.add(initHangout);
  }
})();
