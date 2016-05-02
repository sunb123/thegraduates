/**
 * Created by Kevin on 4/20/16.
 */

//API key Googlemaps: AIzaSyAPnL9JbDXzSqEi1wkTM_-_STWSamGH5OA
var goingToAttendEvents = [{
    date: new Date(),
    location: "22 everett st. cambridge, ma 02138",
    difficulty: 6,
    numParticipants: 5,
    host: "Bill",
    type: 0
}];
var pastEvents = [{
    date: new Date(),
    location: "130 bowery st. new york, NY 10013",
    difficulty: 3,
    numParticipants: 13,
    host: "Tommy",
    type: 2,
    comments: "That was a great climb!"
}];
var upcomingEvents = [{
    date: new Date(),
    location: "26 everett st. cambridge, ma 02138",
    difficulty: 10,
    numParticipants: 2,
    host: "Andrew",
    type: 1
}, {
    date: new Date(),
    location: "132 bowery st. new york, NY 10013",
    difficulty: 4,
    numParticipants: 10,
    host: "Bob",
    type: 1
}];
var addresses = {};
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

    // Modal for create new event
    $("#modal-placeholder").load('createEventModal.html', function(){


        $('.datepicker').daterangepicker({
            "singleDatePicker": true,
            "timePicker": true,
            "timePicker24Hour": true,
            "timePickerIncrement": 15,
            "startDate": "04/16/2016",
            locale: {
                format: 'MM/DD/YYYY h:mm'
            }
            //"endDate": "04/22/2016"
        });
        //}, function(start, end, label) {
        //    console.log("New date range selected: ' + start.format('YYYY-MM-DD') + ' to ' + end.format('YYYY-MM-DD') + ' (predefined range: ' + label + ')");
        //});

        $("#newEventSubmit").on("click", function(){
            console.log($("#difficulty_newEvent").val());
            console.log($("#location_newEvent").val());
            console.log($("#timepicker").val());
            console.log($(".datepicker").val());
            allEvents[upcomingEventsType].push({
                date: new Date(Date.parse($(".datepicker").val().replace(/-/g,"/"))),
                location: $("#location_newEvent").val(),
                difficulty: $("#difficulty_newEvent").val(),
                host: "Andrew",
                type: upcomingEventsType
            });

            //refreshTable(upcomingEventsType);
            //emptyEventDetails();
        });

    });

    $('#edit-comment').click(function() {
        var $text = $("#comment-area"),
            $input = $('<textarea id="comment-area" class="table-responsive" style="resize:none"/>')

        $text.hide()
            .after($input);

        $input.val($text.html()).show().focus()
            .keypress(function(e) {
                var key = e.which
                if (key == 13) // enter key
                {
                    $input.hide();
                    $text.html($input.val())
                        .show();
                    // TODO: save the comment in the local storage object
                    pastEvents[currentSelectionIndex].comments = $input.val();
                    return false;
                }
            })
            .focusout(function() {
                $input.hide();
                $text.show();
            })
    });




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
            $(".nonhistory-rightpanel").show();
            $(".history-rightpanel").hide();
            break;
        case upcomingEventsType:
            $(".yourEventsHome").hide();
            $(".historyHome").hide();
            $(".upcomingHome").show();
            $(".nonhistory-rightpanel").show();
            $(".history-rightpanel").hide();
            break;
        case historyEventsType:
            $(".yourEventsHome").hide();
            $(".historyHome").show();
            $(".upcomingHome").hide();
            $(".nonhistory-rightpanel").hide();
            $(".history-rightpanel").show();
            break;

    }
}

function emptyEventDetails(){
    $("#host").empty();
    $("#diff").empty();
    $("#time").empty();
}

function initializeMap(location) {

    var mapOptions = {
        zoom: 8,
        center: {lat: -34.397, lng: 150.644}
    };

    var map = new google.maps.Map(document.getElementById('map'), mapOptions);
    // Convert address to long/latitude
    var geocoder = new google.maps.Geocoder();
    setTimeout(geocodeAddress(geocoder, map, location), 100);
    //geocodeAddress(geocoder, map, location);

}

function geocodeAddress(geocoder, resultsMap, location) {
    var address = location;

    if(!(address in addresses)){
        geocoder.geocode({'address': address}, function(results, status) {
            if (status === google.maps.GeocoderStatus.OK) {
                addresses[address.toString()] = results;
                resultsMap.setCenter(addresses[address][0].geometry.location);
                var marker = new google.maps.Marker({
                    map: resultsMap,
                    position: addresses[address][0].geometry.location
                });
            } else {
                alert('Geocode was not successful for the following reason: ' + status);
            }
        });
    }else{
        resultsMap.setCenter(addresses[address][0].geometry.location);
        var marker = new google.maps.Marker({
            map: resultsMap,
            position: addresses[address][0].geometry.location
        });
    }



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

$("#cancel").on("click", function(){
    console.log(currentSelectionIndex);
    if(currentSelectionIndex != -1){
        // Move selected event from upcoming events into goingToAttendEvents
        allEvents[upcomingEventsType].push(allEvents[yourEventsType][currentSelectionIndex]);
        allEvents[yourEventsType].splice(currentSelectionIndex, 1);

        refreshTable(yourEventsType);
    }
});


function changeRightPanel(d, eventIdx) {
    if(d == undefined){
        console.log("Wrong");
        return;
    }
    //console.log('event type:',d.type);
    // Non history event
    if(d.type == yourEventsType || d.type == upcomingEventsType){
        $("#host").html(d.host);
        $("#diff").html(d.difficulty);
        $("#time").html(d.date);
        initializeMap(d.location);
        $("#rightpanel").toggleClass("selectedPanel");
    }else{// History event
        $("#comment-area").text(d.comments);
    }



}
