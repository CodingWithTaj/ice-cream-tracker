let map;
let service;
let infowindow;



function initMap() {
    // Show the loading spinner
    document.getElementById("loading").style.display = 'block';

    // centers the map  at users location
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
            const userLocation = {
                lat: position.coords.latitude,
                lng: position.coords.longitude,
            };

            map = new google.maps.Map(document.getElementById("map"), {
                center: userLocation,
                zoom: 15,
            });

            const marker = new google.maps.Marker({
                position: userLocation,
                map: map,
                title: "You are here!",
            });

            infowindow = new google.maps.InfoWindow();
            service = new google.maps.places.PlacesService(map);

            // Remove the loading spinner once the map is fully loaded
            google.maps.event.addListenerOnce(map, 'idle', () => {
                document.getElementById("loading").style.display = 'none';
            });
        }, () => {
            alert("Unable to retrieve your location.");
            document.getElementById("loading").style.display = 'none'; // Remove spinner if location retrieval fails
        });
    } else {
        alert("Geolocation is not supported by this browser.");
        document.getElementById("loading").style.display = 'none'; // Remove spinner if geolocation is not supported
    }
}

function findIceCream() {
    const userLocation = map.getCenter();

    const request = {
        location: userLocation,
        radius: '5000',
        keyword: 'ice cream',
    };

    service.nearbySearch(request, (results, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
            document.getElementById("placesList").innerHTML = "";

            results.forEach((place) => {
                createMarker(place);

                // Calculate distance between user location and the place
                const placeLocation = place.geometry.location;
                const distance = google.maps.geometry.spherical.computeDistanceBetween(userLocation, placeLocation);
                const distanceInKm = (distance / 1000).toFixed(2); // Convert to kilometers and round off

                // Create list with distance
                const listItem = document.createElement("li");
                listItem.textContent = `${place.name} - ${place.vicinity}      (           ${distanceInKm} km away)`;
                listItem.style.cursor = 'pointer';

                // Add click event to open Google Maps directions`
                listItem.addEventListener('click', () => {
                    const destination = `${placeLocation.lat()},${placeLocation.lng()}`;
                    const url = `https://www.google.com/maps/dir/?api=1&origin=${userLocation.lat()},${userLocation.lng()}&destination=${destination}&travelmode=driving`;
                    window.open(url, '_blank');
                });

                document.getElementById("placesList").appendChild(listItem);
            });
        } else {
            document.getElementById("output").innerText = "No ice cream stores found!";
            document.getElementById("placesList").innerHTML = "";
        }
    });
}



// Function to create marker 
function createMarker(place) {
    const placeLoc = place.geometry.location;
    const marker = new google.maps.Marker({
        map: map,
        position: placeLoc,
    });
// click event for the marker
    google.maps.event.addListener(marker, 'click', () => {
        infowindow.setContent(place.name);
        infowindow.open(map, marker);
    });
}

window.onload = initMap;
