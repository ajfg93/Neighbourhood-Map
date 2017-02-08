//Create global variable
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

function initMap() {
    //Create a map center.
    var center = getMarkerInfo(locationsRaw[0]);

    // Create a map object and specify the DOM element for display.
    map = new google.maps.Map(document.getElementById('map'), {
        center: center,
        scrollwheel: false,
        zoom: 14,
    });

    for (var i = 0; i < locationsRaw.length; i++) {
        var location = getMarkerInfo(locationsRaw[i]);
        addMarker(location);
    }

    setMapOnAll(map);  

    //bind 3rd party info to marker
    var infowindow = new google.maps.InfoWindow({});
    for (var i = 0; i < markers.length; i++) {
        //send ajax here
        var lat = markers[i].position.lat();
        var lng = markers[i].position.lng();
        var FoursqureUrl = 'https://api.foursquare.com/v2/venues/explore?ll=' + lat + ',' + lng + '&client_id=KNHA2K4JFSVIEKZABFECB1ROVE13KJ3YEGQZVLWLANGCL1GP&client_secret=ED2KGLEWTQLCMZW1OFXBXIOEKGILIKL1DUA1EE5WAN1USQBB&v=20170208&setion=drinks&limit=1&price=1,2,3,4'
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
            console.log('errro msg');
            console.log(error);
        })
        .always(function(){
        });        

    }
}


function Foo(){
    console.log('123');
}


var vm = {
    el: '#sidebar',
    data:{
        locationsRaw: locationsRaw,
        inputFilter: "",
        markers: markers,
        filterLocationsRaw: [],
    },
    computed:{
        filterLocations: function(){
            var re = [];
            for (var i = 0; i < this.locationsRaw.length; i++) {
                if (this.locationsRaw[i].title.match(new RegExp(this.inputFilter, 'g'))){
                    re.push(this.locationsRaw[i]);
                }
            }
            this.filterLocationsRaw = re.slice();
            return re;
        },
    },
    methods: {
        initMap: initMap,
    },
    watch: {
        filterLocationsRaw: function(){
            try{
                deleteMarkers();
                for (var i = 0; i < this.filterLocationsRaw.length; i++) {
                    var marker = getMarkerInfo(this.filterLocationsRaw[i]);
                    addMarker(marker);
                } 
                setMapOnAll(map);
            }
            catch(error){
                console.log("IN WATCH ERROR");
            }

        }
    }
};

var app = new Vue(vm);   


