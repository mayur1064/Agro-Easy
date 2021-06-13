
mapboxgl.accessToken = mapToken;
var map = new mapboxgl.Map({
container: 'map', // container ID
style: 'mapbox://styles/mapbox/streets-v11', // style URL
center: product.geometry.coordinates, // starting position [lng, lat]
zoom:  10// starting zoom
});

var marker = new mapboxgl.Marker()
.setLngLat(product.geometry.coordinates)
.setPopup(
    new mapboxgl.Popup({offset:25})
    .setHTML(
        `<h6>${product.address}</h6>`
    )
)
.addTo(map);


// let map;

// function initMap() {
//   map = new google.maps.Map(document.getElementById("map"), {
//     center: { lat: -34.397, lng: 150.644 },
//     zoom: 8,
//   });
// }


