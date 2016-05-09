/**
 * Created by Kevin on 4/20/16.
 */

//API key Googlemaps: AIzaSyAPnL9JbDXzSqEi1wkTM_-_STWSamGH5OA
var goingToAttendEvents = [{
    date: new Date("2016/5/4 14:00"),
    location: "22 Everett St. Cambridge, MA 02138",
    distance: 2,
    difficulty: 6,
    host: "Bill",
    type: 0
}];
var pastEvents = [{
    date: new Date("2016/3/23 13:00"),
    location: "130 Bowery St. New York, NY 10013",
    distance: 400,
    difficulty: 3,
    host: "Tommy",
    type: 2,
    comments: "That was a great climb!"
},
{
    date: new Date(),
    location: "791 Walnut St, Newton Centre, MA 02459",
    distance: 35,
    difficulty: 3,
    host: "Cassandra",
    type: 2,
    comments: "Too easy and too short."
},
{
    date: new Date(),
    location: "235 College St, Burlington, VT 05401",
    distance: 243,
    difficulty: 8,
    host: "Richard",
    type: 2,
    comments: "Difficult but well worth it"
}];
var upcomingEvents = [{
    date: new Date("2016/6/1 15:00"),
    location: "26 Everett St. Cambridge, MA 02138",
    distance: 2,
    difficulty: 10,
    host: "Andrew",
    type: 1
}, {
    date: new Date("2016/7/3 11:00"),
    date: new Date(),
    location: "132 Bowery St. New York, NY 10013",
    distance: 400,
    difficulty: 4,
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
var difficultyDict = {

    0: "B",
        1: "0",
        2: "0+",
    3:"1",4:"2",5:"3",6:"4",7:"5",8:"6",9:"7",10:"8",11:"9",12:"10",13:"11",14:"12",15:"13",16:"14",17:"15",18:"16"

    //<option label="V1" value="3">V1</option>
    //<option label="V2" value="4">V2</option>
    //<option label="V3" value="5">V3</option>
    //<option label="V4" value="6">V4</option>
    //
    //<option label="V5" value="7">V5</option>
    //<option label="V6" value="8">V6</option>
    //<option label="V7" value="9">V7</option>
    //<option label="V8" value="10">V8</option>
    //
    //<option label="V9" value="11">V9</option>
    //<option label="V10" value="12">V10</option>
    //<option label="V11" value="13">V11</option>
    //<option label="V12" value="14">V12</option>
    //
    //<option label="V13" value="15">V13</option>
    //<option label="V14" value="16">V14</option>
    //<option label="V15" value="17">V15</option>
    //<option label="V16" value="18">V16</option>
};

$(document).ready(function(){

    $("#nav-placeholder").load('nav.html', function(){

        handler = function(event, eventIdx){
            changeRightPanel(event, eventIdx);
            currentSelectionIndex = eventIdx;
        };
        eventsTable = new EventsTable(allEvents, handler);
        eventsTable.append_event_table("#events_table_pane", yourEventsType);
        $("#rightpanel").hide();

        navbar_active_toggle = function(current) {
            $(".nav").find(".active").removeClass("active");
            $(current).parent().addClass("active");
        };

        $("#yourEventsNav").click(function(){
            navbar_active_toggle(this);
            showPage(yourEventsType);
            // Populate table with goingToAttendEvents
            refreshTable(yourEventsType);
            emptyEventDetails();
        });

        $("#upcomingNav").on("click", function(){
            navbar_active_toggle(this);
            showPage(upcomingEventsType);
            // Populate table with upcomingEvents
            refreshTable(upcomingEventsType);
            emptyEventDetails();
        });

        $("#historyNav").on("click", function(){
            navbar_active_toggle(this);
            showPage(historyEventsType);
            // Populate table with pastEvents
            refreshTable(historyEventsType);
            //emptyEventDetails();
        });

        // Show only your events initially
        $(".yourEventsHome").show();
        $(".upcomingHome").hide();
        $(".historyHome").hide();

    });

    // toggle active inactive state
    $(".nav").on("click", function(){
    });

    // Modal for create new event
    $("#modal-placeholder").load('createEventModal.html', function(){

        var date = new Date();
        var dateString = date.toLocaleDateString("en-US");

        $('.datepicker').daterangepicker({
            "singleDatePicker": true,
            "timePicker": true,
            "timePicker24Hour": false,
            "timePickerIncrement": 15,
            "startDate": dateString,
            locale: {
                format: 'MM/DD/YYYY h:mm'
            }
        });
        //}, function(start, end, label) {
        //    console.log("New date range selected: ' + start.format('YYYY-MM-DD') + ' to ' + end.format('YYYY-MM-DD') + ' (predefined range: ' + label + ')");
        //});

        $("#newEventSubmit").on("click", function(){
            swal({   title: "Created a New Event!",
            timer: 1200,
            type: 'success',
            showConfirmButton: false });
            console.log('diff dict:',difficultyDict[$("#difficulty_newEvent").val()]);

            allEvents[upcomingEventsType].push({
                date: new Date(Date.parse($(".datepicker").val().replace(/-/g,"/"))),
                location: $("#location_newEvent").val(),
                distance: Math.floor(Math.random() * 40),
                difficulty: $("#difficulty_newEvent").val(),//$("#difficulty_newEvent").val(),
                host: "Andrew",
                type: upcomingEventsType
            });
            $("#upcomingNav").click();

            //refreshTable(upcomingEventsType);
            //emptyEventDetails();
        });
    });

    // Modal for historical event
    $("#history-modal-placeholder").load('createHistoricalEvent.html', function(){

        var date = new Date();
        var dateString = date.toLocaleDateString("en-US");

        $('.datepicker-historical').daterangepicker({
            "singleDatePicker": true,
            "timePicker": true,
            "timePicker24Hour": true,
            "timePickerIncrement": 15,
            "endDate": dateString,
            "maxDate": dateString,
            locale: {
                format: 'MM/DD/YYYY h:mm'
            }
        });

        $("#newHistoricalEventSubmit").on("click", function(){
            swal({   title: "Added Historical Event!",
                timer: 1200,
                type: 'success',
                showConfirmButton: false });
            console.log($("#difficulty_historicalEvent").val());
            console.log($("#location_historicalEvent").val());
            console.log($("#timepicker").val());
            console.log($(".datepicker-historical").val());
            allEvents[historyEventsType].push({
                date: new Date(Date.parse($(".datepicker-historical").val())), //.replace(/-/g,"/"))),
                location: $("#location_historicalEvent").val(),
                distance: Math.floor(Math.random() * 40),
                difficulty: $("#difficulty_historicalEvent").val(),
                host: "Andrew",
                type: historyEventsType,
                comments: ""
            });
            $("#historyNav").click();
        });
    });


    $('#edit-comment').click(function() {
        var $text = $("#comment-area"),
            $input = $('<textarea id="comment-area1" class="table-responsive" style="resize:none"/>')

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

    $('#comment-save').click(function () {
        var $text = $("#comment-area"),
            $input = $('#comment-area1')

        $input.hide();
        $text.html($input.val())
            .show();
        // TODO: save the comment in the local storage object
        pastEvents[currentSelectionIndex].comments = $input.val();
    })


});

function refreshTable(type){
    $("#events_table_pane").empty();
    eventsTable.append_event_table("#events_table_pane", type);
}

function showPage(type){
    switch(type){
        case yourEventsType:
            //$("#yourEventsNav").addClass("active-nav");
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
    $("#rightpanel").hide();
    $("#item-desc").hide();
}

function initializeMap(location) {

    var mapOptions = {
        zoom: 8,
        center: {lat: -34.397, lng: 150.644}
    };

    var map = new google.maps.Map(document.getElementById('map'), mapOptions);
    var map_history = new google.maps.Map(document.getElementById('map-history'), mapOptions);

    // Convert address to long/latitude
    var geocoder = new google.maps.Geocoder();
    setTimeout(geocodeAddress(geocoder, map, location), 100);
    //geocodeAddress(geocoder, map, location);

    var geocoderHistory = new google.maps.Geocoder();
    setTimeout(geocodeAddress(geocoderHistory, map_history, location), 100);

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
                //alert('Geocode was not successful for the following reason: ' + status);
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
    $("#rightpanel").hide();
    swal({   title: "Joined the event!",   
        timer: 1200,
        type: 'success',   
        showConfirmButton: false });
    if(currentSelectionIndex != -1){
        // Move selected event from upcoming events into goingToAttendEvents
        allEvents[yourEventsType].push(allEvents[upcomingEventsType][currentSelectionIndex]);
        allEvents[upcomingEventsType].splice(currentSelectionIndex, 1);
        refreshTable(upcomingEventsType);
    }
});

$("#cancel").on("click", function(){
    $("#rightpanel").hide();
    swal({   title: "Cancelled the event!",   
        timer: 1000,   
        type: 'success',
        showConfirmButton: false });
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

    // console.log('event type:',d.type);

    if ($(".history-rightpanel").is(":visible")) {
        $("#item-desc-content").show()
        $("#comment-area").text(d.comments);
        $("#item-desc").show();
        $("#item-desc").addClass("selectedPanel");
        initializeMap(d.location);
    } else {
        //Non history event
        if(d.type == yourEventsType || d.type == upcomingEventsType){
            var time = d.date.toLocaleTimeString('en-US');
            $("#rightpanel").show();
            $("#host").html(d.host);
            console.log("d.difficulty=", d.difficulty);
            $("#diff").html('V' + difficultyDict[d.difficulty]);
            $("#time").html(d.date.toLocaleDateString('en-US') + '  ' + time.substring(0,time.lastIndexOf(":")) + time.substring(time.lastIndexOf(" ")));
            initializeMap(d.location);
            $("#rightpanel").addClass("selectedPanel");
        }
    }
}
$(document).mouseup(function (e)
{
    var container = $("#rightpanel");

    if (!container.is(e.target) // if the target of the click isn't the container...
        && container.has(e.target).length === 0) // ... nor a descendant of the container
    {
        console.log("Hide right!");
        container.hide();
    }
});