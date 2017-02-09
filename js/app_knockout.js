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

//Configure Knockout js.

var ViewModel = function(){
    var self = this;
    this.locationsRaw = locationsRaw;
    this.inputFilter = ko.observable("");
    this.filterLocations = ko.computed(function(){
        var re = [];
        var filter = this.inputFilter();
        for (var i = 0; i < this.locationsRaw.length; i++) {
            if (this.locationsRaw[i].title.match(new RegExp(filter, 'g'))){
                re.push(this.locationsRaw[i]);
            }
        }
        return re;
    }, this);

    this.filterLocationsWatcher = ko.computed(function(){
        clearMarkers();
        var titles = [];

        for (var i = 0; i < this.filterLocations().length; i++) {
            titles.push(getMarkerInfo(this.filterLocations()[i]).title);
        } 
        
        for (var i = 0; i < markers.length; i++) {
            for (var j = 0; j < titles.length; j++) {
                if(markers[i].title === titles[j]){
                    markers[i].setMap(map);
                }
            }
        }
    }, this);

    this.openInfoWindow = function(element){
        for (var i = 0; i < markers.length; i++) {
            if(markers[i].title === element.title){
                google.maps.event.trigger(markers[i], 'click');
                break;
            }
        }
    }
}



ko.applyBindings(new ViewModel());