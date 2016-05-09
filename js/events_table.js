function EventsTable(events, handler) {
    this.events = events;
    this.handler = handler;
    this.sorted_events = $.extend({}, events);

// returns the html for a single event div element
// an event is an object with the following fields:
// 1. date (string for now)
// 2. location (string for now)
// 3. difficulty (number in range 0-15)
// 4. num (number) - number of participants 
// event_idx is an integer reference from the html object to the index of the event
// object list
    this.difficulty_list = ["VB","V0","V0+","V1","V2","V3","V4","V5","V6","V7","V8","V9","V10","V11","V12","V13","V14","V15","V16","V17","V18"];
this.render_event = function(event, event_idx) {
    //console.log("rendering event!");
    var time = event.date.toLocaleTimeString('en-US');
    date_field = $("<td></td>")
        .addClass("classWithPad")
        .css("width", "150px")
//        .append(event.date.toUTCString().substring(0,10) + '  ' + event.date.toUTCString().substring(11,13) + ':00');
//        .append(event.date.toISOString().substring(0,10) + '  ' + event.date.toISOString().substring(11,13) + ':00');
        .append(event.date.toLocaleDateString('en-US') + '  ' + time.substring(0,time.lastIndexOf(":")) + time.substring(time.lastIndexOf(" ")));
    //console.log(date_field);
    loc_field = $("<td></td>")
        .addClass("classWithPad")
        .css("width", "150px")
        .append(event.location + "<br>" + event.distance + " miles away");
    //console.log(loc_field);
    diff_field = $("<td></td>")
        .addClass("classWithPad")
        .addClass("text-center")
        .css("width", "150px")
        .append(this.difficulty_list[event.difficulty]);
    //console.log(diff_field);
    //num_field = $("<td></td>")
    //    .addClass("classWithPad")
    //    .css("width", "150px")
    //    .append(event.numParticipants + " Participants");
    //console.log(num_field);
    element = $('<a href="#"></a>').addClass("list-group-item").append(
        $('<table></table>').append(
            $('<tr></tr>')
                .append(date_field)
                .append(loc_field)
                .append(diff_field)
        //        .append(num_field)
        ))
        .attr("event_idx", event_idx);
    //console.log(element.html());
    return element;
};

// appends the event table, including header, to the parent element
this.append_event_table = function(parent, type) {
    var events = this.sorted_events[type];
    //console.log('events', events);
    table = $("<div></div>")
    .append(
    $("<table></table>")
        .append(
            $("<tr></tr>").attr("id", "sort_by_buttons")
            .append($("<td></td>").attr("id", "sort_by_date").addClass("classWithPad").addClass("text-center").css("width", "150px").html("Date and Time &#x25bc;"))
            .append($("<td></td>").attr("id", "sort_by_location").addClass("classWithPad").addClass("text-center").css("width", "150px").html("Location &#x25bc;"))
            .append($("<td></td>").attr("id", "sort_by_difficulty").addClass("classWithPad").addClass("text-center").css("width", "150px").html("Difficulty &#x25bc;"))
                //.append($("<td></td>").attr("id", "sort_by_num").addClass("classWithPad").addClass("text-center").css("width", "150px").html("Number of Participants"))
            ))
    .append(
        $("<div></div>").addClass("list-group").attr("id", "event_list"));

    $(parent).append(table);
    for (var i = 0; i < events.length; i++) {
        $("#event_list").append(this.render_event(events[i], i));
    }

    $("#event_list" ).on( "click", "a", function( event ) {
        $("#event_list a").removeClass("active");
        $(this).addClass("active");
        event.preventDefault();
    });

    var that = this;


    $("#sort_by_buttons").on("click", "td",
        function(e) {
            console.log("clicked on a sort by button");
            $("#sort_by_buttons td").css("font-weight", "");
        });

    // TODO click handlers for the sort button
    $("#sort_by_date").on("click", function(e) {
        that.sorted_events = $.extend({}, that.events);
        comp = function(a, b) {
            var a = a.date.getTime();
            var b = b.date.getTime();
            console.log(a + " " + b);
            if (a < b) {
                return -1;
            } else if (a == b){
                return 0;
            } else {
                return 1;
            }
        };
        that.sorted_events[type].sort(comp);
        // re-render
        $(parent).empty();
        that.append_event_table(parent, type);
        $("#sort_by_date").css('font-weight', 'bold');
    });

    $("#sort_by_location").on("click", function(e) {
        that.sorted_events = $.extend({}, that.events);
        comp = function(a, b) {
            var a = a.distance;
            var b = b.distance;
            if (a < b) {
                return -1;
            } else if (a == b){
                return 0;
            } else {
                return 1;
            }
        };
        that.sorted_events[type].sort(comp);
        // re-render
        $(parent).empty();
        that.append_event_table(parent, type);
        $("#sort_by_location").css('font-weight', 'bold');
    });

    $("#sort_by_difficulty").on("click", function(e) {
        that.sorted_events = $.extend({}, that.events);
        comp = function(a, b) {
            var a = a.difficulty;
            var b = b.difficulty;
            if (a < b) {
                return -1;
            } else if (a == b){
                return 0;
            } else {
                return 1;
            }
        };
        that.sorted_events[type].sort(comp);

        // re-render
        $(parent).empty();
        that.append_event_table(parent, type);
        $("#sort_by_difficulty").css('font-weight', 'bold');
    });

    $("#sort_by_num").on("click", function(e) {
        that.sorted_events = $.extend({}, that.events);
        comp = function(a, b) {
            var a = a.num;
            var b = b.num;
            if (a < b) {
                return -1;
            } else if (a == b){
                return 0;
            } else {
                return 1;
            }
        };
        that.sorted_events[type].sort(comp);
        // re-render
        $(parent).empty();
        that.append_event_table(parent, type);
        $(this).css('font-weight', 'bold');
        $("#sort_by_num").css('font-weight', 'bold');
    });

    $("#sort_by_buttons").on("mouseover", "td",
        function(e) {
            $("#sort_by_buttons td").css("text-decoration", "");
            $(this).css('text-decoration', 'underline');
        });

    $(parent).on("click", "a",
        function(e) {
            // find the reference to the event object
            event_idx = $(this).attr("event_idx");
            that.handler(that.events[type][event_idx], event_idx);
        }
    )
        .on("focusout", function(){
            console.log("Blur!");
            $("#event_list a").removeClass("active");
            //$("#rightpanel").removeClass("selectedPanel");
            $("#item-desc").removeClass("selectedPanel");
            //$("#rightpanel").hide();
        });

};

};




