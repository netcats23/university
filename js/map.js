google.maps.event.addDomListener(window, 'load', initContactMap);

function initContactMap() {
    var coordinates = new google.maps.LatLng(62.822575, 90.604769);

    var mapOptions = {
        zoom:4,
        zoomControl: true,
        mapTypeControl: false,
        scaleControl: true,
        streetViewControl: false,
        rotateControl: false,
        fullscreenControl: false,
        center: coordinates,
        styles: [{
            "featureType": "administrative",
            "elementType": "labels.text.fill",
            "stylers": [{
                "color": "#444444"
            }]
        }, {
            "featureType": "landscape",
            "elementType": "all",
            "stylers": [{
                "color": "#f2f2f2"
            }]
        }, {
            "featureType": "poi",
            "elementType": "all",
            "stylers": [{
                "visibility": "off"
            }]
        }, {
            "featureType": "poi",
            "elementType": "labels.text",
            "stylers": [{
                "visibility": "off"
            }]

        }, {
            "featureType": "road",
            "elementType": "all",
            "stylers": [{
                "saturation": -100
            }, {
                "lightness": 45
            }]
        }, {
            "featureType": "road.highway",
            "elementType": "all",
            "stylers": [{
                "visibility": "simplified"
            }]
        }, {
            "featureType": "road.arterial",
            "elementType": "labels.icon",
            "stylers": [{
                "visibility": "off"
            }]
        }, {
            "featureType": "transit",
            "elementType": "all",
            "stylers": [{
                "visibility": "off"
            }]
        }, {
            "featureType": "water",
            "elementType": "all",
            "stylers": [{
                "color": "#dbdbdb"
            }, {
                "visibility": "on"
            }]
        }]
    };

    var mapElement = document.getElementById('js-filials');
    var map = new google.maps.Map(mapElement, mapOptions);

    setMarkers(locations);

    function setMarkers(locations) {
        for (i=0; i < locations.length; i++) {
            var location = locations[i];
            plotMarker(location);
        }
    }

    let  prev_infowindow = false;
    let  prev_marker = false;
    let  prev_filial = false;

    function deleteElement(id) {
        let postData = {
            'ELEMENT_ID': id,
            'USER_ID': BX.message('USER_ID'),
        };

        BX.ajax({
            url: '/local/ajax/deleteElement.php',
            method: 'POST',
            data: postData,

            onsuccess: function (result) {
                if (result == 1)
                    location.reload();
                else
                    console.error(result);
            }
        });
    }


    function plotMarker(location) {
        var markerIcon = (location.is_filial) ? 'pin.svg' : 'pin-small-hover.svg';
        var markerIcon = '/local/templates/crm_eos/asset/image/' + markerIcon;
        var marker = new markerWithLabel.MarkerWithLabel({
            position: new google.maps.LatLng(location.lat,  location.lng),
            icon: markerIcon,
            title: location.name,
            labelContent: location.city,
            labelAnchor: new google.maps.Point(-45, -20),
            labelClass: "map-labels",
            map: map
        });

        let edit_button='';
        let email = '';
        let phone = '';
        let inner_phone = '';
        let title = '';

        if(location.email){email = '<a href="mailto:'+location.email+'">'+location.email+'</a>';}
        if(location.phone){phone = '<a href="tel:'+location.phone+'">'+location.phone+'</a>';}
        if(location.inner_phone){inner_phone = '<p>Внутр. телефон: '+location.inner_phone+'</p>';}
        if(inner_phone!='' || phone!='' || email!=''){title='<div class="title">Контакты</div>';}
        if(location.allow_edit=="Y"){edit_button = '<span onclick="onEditFilial('+location.id+')" class="edit icon-settings"></span><span onclick="onDeleteFilial('+location.id+')" class="delete icon-trash"></span>';}

        var infowindow = new google.maps.InfoWindow({
            content: '<div class="map-info" data-id="'+location.id+'">'+edit_button+'<div class="name">'+location.name+'</div><div class="time">'+location.time+'</div><div class="content"><div class="title">Адрес</div><p>'+location.address+'</p></div><div class="content">'+title+inner_phone+email+phone+location.fio+'</div></div>',
        });


        /* marker.addListener("click", () => {
            infowindow.open({
                anchor: marker,
                map: map,
                shouldFocus: false,
            });

          if(location.is_filial){
                marker.setIcon("/local/templates/crm_eos/asset/image/pin-hover.svg");
            }else{
                marker.setIcon("/local/templates/crm_eos/asset/image/pin-small-hover.svg");
            }
        });*/

        google.maps.event.addListener(marker, 'click', function(){
            if( prev_infowindow ) {
                prev_infowindow.close();

                /*if(prev_filial){
                    prev_marker.setIcon("/local/templates/crm_eos/asset/image/pin.svg");
                }else{
                    prev_marker.setIcon("/local/templates/crm_eos/asset/image/pin-small.svg");
                }*/
            }

            prev_infowindow = infowindow;
            prev_marker = marker;
            prev_filial = location.is_filial;

            infowindow.open({
                anchor: marker,
                map: map,
                shouldFocus: false,
            });



            /*if(location.is_filial){

                marker.setIcon("/local/templates/crm_eos/asset/image/pin-hover.svg");

            }else{

                marker.setIcon("/local/templates/crm_eos/asset/image/pin-small-hover.svg");

            }*/

        });


        google.maps.event.addListener(map, "click", function(event) {
            infowindow.close();

            /*if(location.is_filial){

                marker.setIcon("/local/templates/crm_eos/asset/image/pin.svg");

            }else{

                marker.setIcon("/local/templates/crm_eos/asset/image/pin-small.svg");

            }*/
        });

    }

}
