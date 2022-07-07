var mapOptions = {
  center: [42.163, 19.522], //set center
  zoom: 10 , //set initial zoom
  maxZoom : 17,  //set max zoom
  minZoom : 6,
  maxBounds: [ [-90, -180] , [90,180] ],
  tap: false
  }

var map = L.map('map', mapOptions);
L.control.pan().addTo(map);


var  Esri_WorldImagery = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
  }).addTo(map);

function popUp(f,l) {
  var out = [];
  //adds spaces in between entries
  if (f.properties) {
    out.push('<b>Name: </b>' + f.properties.NAME2);
    out.push('<b>Site Number: </b>' + f.properties.Site_Numbe);
    out.push('<b>Era: </b>' + f.properties.era);
    l.bindPopup(out.join("<br />"));
  }
};

function getColor(era) {
return  era == "Neolithic"  ? '#880808' :
        era == "Early Bronze Age"  ? '#969696' :
        era == "Middle Bronze Age"  ? '#081d58' :
        era == "Late Bronze Age"  ? '#006837' :
        era == "Early Iron Age"  ? '#fed976' :
                        '#252525';
}

function lineStyle(feature) {
return{color:'#00008b'}
};

function lakeStyle(feature) {
  switch (feature.properties.Shape_Area) {
    case '989181106.13300001621': return {color: "#ADD8E6"};
    case '1432209104.69000005722' : return {color: "#C4A484"};
    case '694464302.17200005054' : return {color: "#008D97"};
  }

};

  var allsites =  L.geoJSON(sites, {
      onEachFeature:popUp,
      pointToLayer: function (feature, latlng) {
        var markerStyle = {
            fillColor: getColor(feature.properties.era),
            color: "#FFF",
            fillOpacity: 1,
            opacity: 0.5,
            weight: 1,
            radius: 10
        };
        return L.circleMarker(latlng, markerStyle);
    },
    filter:
    function(feature, layer) {
      return (feature.properties.era == 'Neolithic');
    }
  }).addTo(map);

  var currentlake = L.geoJSON(modernLake, {
    style: {color: "#000000", fillColor: "#0000ff", weight: 1}, //blue
  }).addTo(map);

  var river = L.geoJSON(braidedRiver, {
    style: {color:'#00008b'},
  }

  ).addTo(map);

  var swamp = L.geoJSON(swampMarsh, {
    style: {color: "#000000", fillcolor: "green", weight: 1},
  }).addTo(map);

  var medLake = L.geoJSON(med_Lake, {
    style: {color: "#000000", fillcolor: "blue", weight: 1},
  }).addTo(map);


  const legend = L.control.Legend({
  				position: "bottomright",
  				collapsed: false,
  				symbolWidth: 24,
  				opacity: 1,
  				column: 2,
  				legends: [{
  						label: "Neolithic",
  						type: "circle",
              fillColor: "#880808"
  				}, {
  						label: "Early Bronze Age",
  						type: "circle",
  						fillColor: "#969696"
  				}, {
  						label: "Middle Bronze Age",
  						type: "circle",
  						fillColor: "#081d58"
  				}, {
  						label: "Late Bronze Age",
  						type: "circle",
  						fillColor: "#006837"
  				}, {
  						label: "Early Iron Age",
  						type: "circle",
  						fillColor: "#fed976"
  				}]
  		})
  		.addTo(map);

      var eraSlider = document.getElementById('slider');
      noUiSlider.create(eraSlider, {
          start: [0],
      		step:1,
          range: {
              'min': [0],
              'max': [4]
          },
          tooltips:true,
          format: {
            to: function(value) {
            // Math.round and -1, so 1.00 => 0, 2.00 => 2, etc.
            return ["Neolithic","Early Bronze Age","Middle Bronze Age","Late Bronze Age","Early Iron Age"][Math.round(value)];
          },
          from: Number
          }
      });
      var eraValues = [
      	document.getElementById('era-hidden')
      ];
      eraSlider.noUiSlider.on('change', function (values, handle) {
          eraFilter = values[handle];
          console.log(eraFilter);
          map.removeLayer(allsites);

          allsites = new L.geoJson(sites,{
            onEachFeature:popUp,
            pointToLayer: function (feature, latlng) {
              var markerStyle = {
                  fillColor: getColor(feature.properties.era),
                  color: "#FFF",
                  fillOpacity: 1,
                  opacity: 0.5,
                  weight: 1,
                  radius: 10
              };
              return L.circleMarker(latlng, markerStyle);
            },
            filter:
            function(feature, layer) {
      				return (feature.properties.era == eraFilter);
      			}
        }).addTo(map);
      });


function turnOnAllSites(){
  map.removeLayer(allsites);
  allsites = new L.geoJson(sites,{
    onEachFeature:popUp,
    pointToLayer: function (feature, latlng) {
      var markerStyle = {
          fillColor: getColor(feature.properties.era),
          color: "#FFF",
          fillOpacity: 1,
          opacity: 0.5,
          weight: 1,
          radius: 10
      };
      return L.circleMarker(latlng, markerStyle);
    }
  }).addTo(map);

}

//disable panning while sliding
      slider.addEventListener('mouseover', function () {
              map.dragging.disable();
          });

          // Re-enable dragging when user's cursor leaves the element
      slider.addEventListener('mouseout', function () {
            map.dragging.enable();
          });
