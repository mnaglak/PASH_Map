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
    return  era == "Early Mesolithic" ? '#000000' :
        era == "Late Neolithic"  ? '#880808' :
        era == "Eneolithic" ? '#BF40BF' :
        era == "Early Bronze Age"  ? '#969696' :
        era == "Middle Bronze Age"  ? '#081d58' :
        era == "Late Bronze Age"  ? '#006837' :
        era == "Iron Age"  ? '#fed976' :
                        '#252525';
}

function lineStyle(feature) {
  return{color:'#00008b'}
};

var river = L.geoJSON(braidedRiver, {
  style: {color:'#ADD8E6'},
}).addTo(map);


/*var swamp = L.geoJSON(swampMarsh, {
  style: {color: "#000000", fillColor: "blue", weight: 1},
}).addTo(map);*/
var backgroundLake = L.geoJSON(modernLake, {style: {fillColor:"#015E57", fillOpacity:1, opacity:0}}).addTo(map);

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
      return (feature.properties.era == 'Eneolithic');
    }
  }).addTo(map);

  var patternShape = new L.PatternPath({
        d: "M10,10C21.805555555555557,10.416666666666666,40.97222222222223,19.916666666666664,66.66666666666667,12C92.36111111111111,4.083333333333334,105.55555555555557,-30.291666666666668,133.33333333333334,-28C161.11111111111111,-25.708333333333332,172.22222222222223,20.916666666666668,200,23C227.77777777777777,25.083333333333332,238.8888888888889,-19.25,266.6666666666667,-18C294.44444444444446,-16.75,305.5555555555556,25.666666666666668,333.33333333333337,29C361.11111111111114,32.333333333333336,372.22222222222223,-6.583333333333333,400,-2C427.77777777777777,2.583333333333333,438.8888888888889,53.5,466.6666666666667,51C494.44444444444446,48.5,505.5555555555556,-11.916666666666666,533.3333333333334,-14C561.1111111111111,-16.083333333333332,572.2222222222222,40.583333333333336,600,41C627.7777777777778,41.416666666666664,638.8888888888889,-10.333333333333334,666.6666666666667,-12C694.4444444444446,-13.666666666666666,707.6388888888889,28.416666666666668,733.3333333333334,33C759.0277777777778,37.583333333333336,778.1944444444445,14.791666666666668,790,10",
        fill: true,
        stroke: "black"
    });

var marshPattern = new L.Pattern({width:50, height:40, patternTransform: "1,0,0,1,0,-171.98981285095215"});
    marshPattern.addShape(patternShape);
    marshPattern.addTo(map);

    var swampPatternShape = new L.PatternPath({
          d: 'M10 0 L7 20 L25 20 Z',
          fill: true,
          color: '#4CBB17'
      });

      var swampPattern = new L.Pattern({width:20, height:10, angle:180});
          swampPattern.addShape(swampPatternShape);
          swampPattern.addTo(map);

          var swamp = L.geoJSON(modernLake, {
            style: {fillPattern: swampPattern ,  color: "#000000", weight: 1, fillOpacity:1}, //blue
          }).addTo(map);


  var marsh = L.geoJSON(modernLake, {
    style: {fillPattern: marshPattern ,  color: "#000000", weight: 1, fillOpacity:1}, //blue
  });

  const legend = L.control.Legend({
  				position: "bottomright",
  				collapsed: false,
  				symbolWidth: 24,
  				opacity: 1,
  				column: 2,
  				legends: [{
              label: "Early Mesolithic",
              type: "circle",
              fillColor: "#000000"
          },{
  						label: "Late Neolithic",
  						type: "circle",
              fillColor: "#880808"
  				},  {
              label: "Eneolithic",
              type: "circle",
              fillColor: "#BF40BF"
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
  						label: "Iron Age",
  						type: "circle",
  						fillColor: "#fed976"
  				}, {
              label: "Marsh",
              type: "image",
              url: "marsh.png"
          }, {
            label: "Swamp",
            type: "image",
            url: "swamp.png"

          }]
  		})
  		.addTo(map);

      var eraSlider = document.getElementById('slider');
      noUiSlider.create(eraSlider, {
          start: [3],
      		step:1,
          range: {
              'min': [0],
              'max': [7]
          },
          tooltips:true,
          format: {
            to: function(value) {
            // Math.round and -1, so 1.00 => 0, 2.00 => 2, etc.
            return ["Paleolithic","Early Mesolithic","Late Neolithic","Eneolithic","Early Bronze Age","Middle Bronze Age","Late Bronze Age","Iron Age"][Math.round(value)];
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
          waterFeature(eraFilter);
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

function waterFeature(era) {
  map.removeLayer(river);
  map.removeLayer(swamp);
  map.removeLayer(marsh);
  map.removeLayer(backgroundLake);
  if(era == "Paleolithic") {
    river.addTo(map);

  }
  else if (era == "Early Mesolithic") {
    river.addTo(map);
    backgroundLake.addTo(map);
    marsh.addTo(map);
  }
  else if (era == "Late Neolithic") {
    river.addTo(map);
    backgroundLake.addTo(map);
    marsh.addTo(map);
  }
  else {
    river.addTo(map);
    backgroundLake.addTo(map);
    swamp.addTo(map);
  }

}

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
