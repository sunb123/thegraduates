/**
 * Created by Kevin on 4/20/16.
 */

//API key Googlemaps: AIzaSyAPnL9JbDXzSqEi1wkTM_-_STWSamGH5OA
var goingToAttendEvents = [];
var pastEvents = [];
var upcomingEvents = [{
    date: "Saturday 5pm<br>October 12",
    location: "26 everett st. cambridge, ma 02138",
    difficulty: 10,
    numParticipants: 2,
    host: "Andrew"
}, {
    date: "Monday 3pm<br>November 1",
    location: "132 bowery st. new york, NY 10013",
    difficulty: 4,
    numParticipants: 10,
    host: "Bob"
}];

var currentSelectionFindIndex = -1;
var currentSelectionYourEventIndex = -1;
var yourEventsType = 0;
var upcomingEventsType = 1;
var upcomingTable;
var yourEventsTable;

$(document).ready(function(){

    $("#nav-placeholder").load('nav.html');
    $("#modal-placeholder").load('createEventModal.html');
    
    // Handles events in the future
    find_handler = function(find_event, find_event_index) {
        console.log(find_event);

        // Find the index of upcoming event selected by user
        currentSelectionFindIndex = find_event_index;

        // Change the right panel of upcoming events after user selects event
        changeRightPanel(find_event, upcomingEventsType);
    };
    upcomingTable = new EventsTable(upcomingEvents, find_handler);
    $("#upcoming_events_table_pane").empty();
    upcomingTable.append_event_table("#upcoming_events_table_pane");

    // Events you're attending
    yourEventsHandler = function(your_event, your_event_index) {

        // Find the index of upcoming event selected by user
        currentSelectionYourEventIndex = find_your_event_indexevent_index;

        // Change the right panel of upcoming events after user selects event
        changeRightPanel(your_event, yourEventsType);
    };
    yourEventsTable = new EventsTable(goingToAttendEvents, yourEventsHandler);
    $("#your_events_table_pane").empty();
    yourEventsTable.append_event_table("#your_events_table_pane");
    console.log('goingtoattend',goingToAttendEvents);
    console.log('upcoming',upcomingEvents);
    // Initial view, show first event
    changeRightPanel(upcomingEvents[0], upcomingEventsType);

});

function initializeMap(location, type) {

    var mapOptions = {
        zoom: 8,
        center: {lat: -34.397, lng: 150.644}
    };

    var map;
    if(type == upcomingEventsType){
        if(document.getElementById('find_map') == null){
            return;
        }
        map = new google.maps.Map(document.getElementById('find_map'), mapOptions);
    }else if(type == yourEventsType){
        if(document.getElementById('your_map') == null){
            return;
        }
        map = new google.maps.Map(document.getElementById('your_map'), mapOptions);
    }


    // Convert address to long/latitude
    var geocoder = new google.maps.Geocoder();
    geocodeAddress(geocoder, map, location);

}

function geocodeAddress(geocoder, resultsMap, location) {
    var address = location;
    geocoder.geocode({'address': address}, function(results, status) {
        if (status === google.maps.GeocoderStatus.OK) {
            resultsMap.setCenter(results[0].geometry.location);
            var marker = new google.maps.Marker({
                map: resultsMap,
                position: results[0].geometry.location
            });
        } else {
            alert('Geocode was not successful for the following reason: ' + status);
        }
    });
}
$("#find_join").on("click", function(){
    console.log(currentSelectionFindIndex);
    if(currentSelectionFindIndex != -1){
        // Move selected event from upcoming events into goingToAttendEvents
        goingToAttendEvents.push(upcomingEvents[currentSelectionFindIndex]);
        upcomingEvents.splice(currentSelectionFindIndex, 1);

        $("#upcoming_events_table_pane").empty();
        upcomingTable.append_event_table("#upcoming_events_table_pane");

        $("#your_events_table_pane").empty();
        yourEventsTable.append_event_table("#your_events_table_pane");
    }

});

function changeRightPanel(d, type) {
    if(d == undefined){
        console.log("Wrong");
        return;
    }

    if(type == upcomingEventsType){
        $("#find_host").html(d.host);
        $("#find_diff").html(d.difficulty);
        $("#find_time").html(d.date);
    }else if(type == yourEventsType){
        $("#your_host").html(d.host);
        $("#your_diff").html(d.difficulty);
        $("#your_time").html(d.date);
    }


    initializeMap(d.location, type);
}
