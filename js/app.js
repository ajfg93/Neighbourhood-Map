//Create global variable
var locationsRaw = 
[
{
    title: 'A',
    lat: -25.363,
    lng: 131.044,
},
{
    title: 'B',
    lat: -29.149521,
    lng: 131.609970,
},
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
        zoom: 4
    });

    for (var i = 0; i < locationsRaw.length; i++) {
        var location = getMarkerInfo(locationsRaw[i]);
        addMarker(location);
    }

    setMapOnAll(map);   

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
                console.log("IN ERROR");
            }

        }
    }
};

var app = new Vue(vm);   



