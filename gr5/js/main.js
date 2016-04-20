/**
 * Created by Kevin on 4/20/16.
 */

$(document).ready(function(){

    $("#nav-placeholder").load('nav.html');
    $("#modal-placeholder").load('createEventModal.html');

});

function shuffle(array) {
    var counter = array.length;
    // While there are elements in the array
    while (counter > 0) {
        // Pick a random index
        var index = Math.floor(Math.random() * counter);
        // Decrease counter by 1
        counter--;
        // And swap the last element with it
        var temp = array[counter];
        array[counter] = array[index];
        array[index] = temp;
    }
    return array;
}

function initialize() {
    var myLatlng1 = new google.maps.LatLng(42.36, 71.05);
    var mapOptions = {
        zoom: 10,
        center: myLatlng1,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    var map = new google.maps.Map(document.getElementById('map'),
        mapOptions);
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
            initialLocation = new google.maps.LatLng(Math.random()  * 50, Math.random() /10);
            map.setCenter(initialLocation);
        });
    }
}

function change() {
    var map;
    var hosts = ['Bob Smith', 'Dan Hoversan', 'Johnson Cliff'];
    var dif = ['v1', 'v3', 'v5', 'v7'];
    var time = ['2016/04/28 11:00 - 13:00', '2016/05/24 15:00 - 17:00', '2016/05/14 10:00 - 12:00'];
    var intro = ['Newbee in climing', 'Experienced climber with 3-year experience', 'Passinate about climbing', 'climbing lover'];
    var host_chosen = shuffle(hosts).slice(0, 2);
    var intro_chosen = shuffle(intro).slice(0,2);
    var host= document.getElementById("host");
    host.innerHTML = host_chosen[0];
    var u1 = document.getElementById("user1");
    u1.innerHTML =  host_chosen[0];
    var diff = document.getElementById("diff");
    diff.innerHTML = shuffle(dif).slice(0, 1);
    var tim = document.getElementById("time");
    tim.innerHTML = shuffle(time).slice(0, 1);
    var u2 = document.getElementById("user2");
    u2.innerHTML = host_chosen[1];
    var exp1 = document.getElementById("exp_1");
    exp1.innerHTML = intro_chosen[0];
    var exp2 = document.getElementById("exp_2");
    exp2.innerHTML = intro_chosen[1];
    initialize();
}

change(); 

$("#join").click(function(){
    $("#modal").modal('hide');
    Lobibox.notify('success',{
        size: 'normal',
        rounded: 'false',
        delay: false,
        position: 'center top',
        msg: "Congratulations! You've sign up for an event!",
        sound: false,
        icon: false,
    });
});

