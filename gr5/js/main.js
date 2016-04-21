/**
 * Created by Kevin on 4/20/16.
 */

//API key Googlemaps: AIzaSyAPnL9JbDXzSqEi1wkTM_-_STWSamGH5OA
var goingToAttendEvents = [{
    date: "Saturday 5pm<br>October 22",
    location: "22 everett st. cambridge, ma 02138",
    difficulty: 6,
    numParticipants: 5,
    host: "Bill"
}];
var pastEvents = [{
    date: "Monday 3pm<br>November 19",
    location: "130 bowery st. new york, NY 10013",
    difficulty: 3,
    numParticipants: 13,
    host: "Tommy"
}];
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


var currentSelectionIndex = -1;
//var currentSelectionYourEventIndex = -1;
var yourEventsType = 0;
var upcomingEventsType = 1;
var historyEventsType = 2;

var allEvents = {0: goingToAttendEvents, 1: upcomingEvents, 2: pastEvents};

var upcomingTable;
var yourEventsTable;

$(document).ready(function(){

    $("#nav-placeholder").load('nav.html', function(){

        handler = function(event, eventIdx){
            changeRightPanel(event, eventIdx);
            currentSelectionIndex = eventIdx;
        };
        eventsTable = new EventsTable(allEvents, handler);
        eventsTable.append_event_table("#events_table_pane", yourEventsType);

        $("#yourEventsNav").click(function(){

            showPage(yourEventsType);
            // Populate table with goingToAttendEvents
            refreshTable(yourEventsType);

            emptyEventDetails();
        });

        $("#upcomingNav").on("click", function(){

            showPage(upcomingEventsType);
            // Populate table with upcomingEvents
            refreshTable(upcomingEventsType);

            emptyEventDetails();
        });

        $("#historyNav").on("click", function(){
            showPage(historyEventsType);
            // Populate table with pastEvents
            refreshTable(historyEventsType);



        });

        // Show only your events initially
        $(".yourEventsHome").show();
        $(".upcomingHome").hide();
        $(".historyHome").hide();

    });

    $("#modal-placeholder").load('createEventModal.html');



});
function refreshTable(type){
    $("#events_table_pane").empty();
    eventsTable.append_event_table("#events_table_pane", type);
}

function showPage(type){
    switch(type){
        case yourEventsType:
            $(".yourEventsHome").show();
            $(".upcomingHome").hide();
            $(".historyHome").hide();
            $("#nonhistory-rightpanel").show();
            $("#history-rightpanel").hide();
            break;
        case upcomingEventsType:
            $(".yourEventsHome").hide();
            $(".historyHome").hide();
            $(".upcomingHome").show();
            $("#nonhistory-rightpanel").show();
            $("#history-rightpanel").hide();
            break;
        case historyEventsType:
            $(".yourEventsHome").hide();
            $(".historyHome").show();
            $(".upcomingHome").hide();
            $("#nonhistory-rightpanel").hide();
            $("#history-rightpanel").show();
            break;

    }
}

function emptyEventDetails(){
    $("#host").empty();
    $("#diff").empty();
    $("#time").empty();
}

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
$("#join").on("click", function(){
    console.log(currentSelectionIndex);
    if(currentSelectionIndex != -1){
        // Move selected event from upcoming events into goingToAttendEvents
        allEvents[yourEventsType].push(allEvents[upcomingEventsType][currentSelectionIndex]);
        allEvents[upcomingEventsType].splice(currentSelectionIndex, 1);

        refreshTable(upcomingEventsType);
    }


});


function changeRightPanel(d, type) {
    if(d == undefined){
        console.log("Wrong");
        return;
    }


    $("#host").html(d.host);
    $("#diff").html(d.difficulty);
    $("#time").html(d.date);




    initializeMap(d.location, type);
}
