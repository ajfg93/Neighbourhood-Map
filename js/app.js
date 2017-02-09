//App data.
var locationsRaw = 
[
{
    title: 'Shenzhen University',
    lat: 22.535201,
    lng: 113.934746,
},
{
    title: 'Qianhai Road',
    lat: 22.517509,
    lng: 113.912207,
},
{
    title: 'Baishi Road',
    lat: 22.529148,
    lng: 113.971412,
},
{
    title: 'Shenzhen Bay Port',
    lat: 22.501832,
    lng: 113.949478
},
{
    title: 'Guimiao Road',
    lat: 22.523282,
    lng: 113.917365,
}
];

var markers = [];
var map = null;

//Map manipulate functions.

function getMarkerInfo(locationRaw){
    return {title: locationRaw.title, lat: locationRaw.lat, lng: locationRaw.lng};
}

function addMarker(location){
    var marker = new google.maps.Marker({
        position: {lat: location.lat, lng: location.lng},
        map: map,
        title: location.title,
    });
    markers.push(marker);
}

function setMapOnAll(map){
    for (var i = 0; i < markers.length; i++) {
        markers[i].setMap(map);
    }
}

function clearMarkers(){
    setMapOnAll(null);
}

function showMarkers() {
  setMapOnAll(map);
}

function deleteMarkers(){
    clearMarkers();
    markers = [];
}


//Google map jsonp callback.
function initMap() {
    //Create a map center.
    var center = getMarkerInfo(locationsRaw[0]);

    // Create a map object and specify the DOM element for display.
    map = new google.maps.Map(document.getElementById('map'), {
        center: center,
        scrollwheel: false,
        zoom: 14,
    });

    //Initialize markers.
    for (var i = 0; i < locationsRaw.length; i++) {
        var location = getMarkerInfo(locationsRaw[i]);
        addMarker(location);
    }

    //Display markers on the map.
    setMapOnAll(map);  

    //Create 1 infowindow and bind 3rd party info to each marker.
    var infowindow = new google.maps.InfoWindow({});
    for (var i = 0; i < markers.length; i++) {
        //get api query needed info, latitude and longtitude
        var lat = markers[i].position.lat();
        var lng = markers[i].position.lng();
        //concat request url, get 1 nearby drink shop
        var FoursqureUrl = 'https://api.foursquare.com/v2/venues/explore?ll=' + lat + ',' + lng + '&client_id=KNHA2K4JFSVIEKZABFECB1ROVE13KJ3YEGQZVLWLANGCL1GP&client_secret=ED2KGLEWTQLCMZW1OFXBXIOEKGILIKL1DUA1EE5WAN1USQBB&v=20170208&setion=drinks&limit=1&price=1,2,3,4'

        //ajax call, using closure to pass `currentMarker`        
        $.ajax(FoursqureUrl)
        .done((function(currentMarker){
            return function(data){
             var items = data.response.groups[0].items;
             var venue = items[0].venue;

             var venueName = venue.name;
             var venueRating = venue.rating;
             var venuePrice = venue.price.message;
             var venueId = venue.id;
             var venueUrl = 'https://foursquare.com/v/' + venueId;

             currentMarker.addListener('click', function(){
                //concat content string
                var contentStr = 
                '<div id="content">'+
                '<div id="siteNotice">'+
                '</div>'+
                '<h1 id="firstHeading" class="firstHeading">' + this.title + '</h1>'+
                '<div id="bodyContent">'+
                '<p>Drinks:</p>' + 
                '<ul>' + 
                '<li>' + 
                'name:' + venueName +
                '</li>' +
                '<li>' + 
                'price:' + venuePrice +
                '</li>' +
                '<li>' + 
                'rating:' + venueRating +
                '</li>' +
                '<li>' + 
                'url:' + '<a target="_blank" href="' + venueUrl + '">' + venueUrl +'</a>' + 
                '</li>' +
                '</ul>' +
                '</div>'+
                '</div>';
                infowindow.setContent(contentStr);
                infowindow.open(map, currentMarker);
            });         
         }    
     })(markers[i]))
        .fail(function(error){
            alert("A error occured, try refresh or call the web admnistrator");
            console.log(error);
        })
        .always(function(){
            console.log("Ajax request completed");
        });        

    }
}

//Configure Vue js.

var vm = {
    el: '#sidebar',
    data:{
        locationsRaw: locationsRaw,
        inputFilter: "",
        filterLocationsRaw: [],
    },
    computed:{
        // return a computed property, not modifying original raw data.
        filterLocations: function(){
            var re = [];
            for (var i = 0; i < this.locationsRaw.length; i++) {
                if (this.locationsRaw[i].title.match(new RegExp(this.inputFilter, 'g'))){
                    re.push(this.locationsRaw[i]);
                }
            }
            // store the result into a two-way binding data property for later watching events.
            this.filterLocationsRaw = re.slice();
            return re;
        },
    },
    methods: {

    },
    watch: {
        //every time the `filterLocationsRaw` property changes, this function would get called.
        filterLocationsRaw: function(){
                //every time the filtered result changes, clear all the markers on the map.
                clearMarkers();
                var titles = [];

                //get titles of the filtered results, use them to choose which marker should be display again.
                for (var i = 0; i < this.filterLocationsRaw.length; i++) {
                    titles.push(getMarkerInfo(this.filterLocationsRaw[i]).title);
                } 
                
                //display filtered markers again.
                for (var i = 0; i < markers.length; i++) {
                    for (var j = 0; j < titles.length; j++) {
                        if(markers[i].title === titles[j]){
                            markers[i].setMap(map);
                        }
                    }
                }
        }
    }
};


var app = new Vue(vm);   


