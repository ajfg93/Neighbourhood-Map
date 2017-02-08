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
    return {title: locationRaw.title,  lat: locationRaw.lat, lng: locationRaw.lng};
}

function addMarker(location){
    var marker = new google.maps.Marker({
        position: location,
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
        scrollwheel: true,
        zoom: 14
    });

    for (var i = 0; i < locationsRaw.length; i++) {
        var location = getMarkerInfo(locationsRaw[i]);
        console.log(location);
        addMarker(location);
    }

    setMapOnAll(map);  

    //bind 3rd party info to marker
    var infowindow = new google.maps.InfoWindow({});
    for (var i = 0; i < markers.length; i++) {
        markers[i].addListener('click', (function(titleCopy, markerCopy){
            return function(){
                infowindow.setContent(titleCopy);
                console.log('LOOP CLOSURE!');
                infowindow.open(map, markerCopy);
            }
        })(markers[i].title, markers[i]));
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



