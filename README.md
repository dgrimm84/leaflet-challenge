# leaflet-challenge
## Leaflet-Part-1
In this directory are the below files and their functions:
  - Leaflet-Part-1/static/css/styles.css - this file sets the default style of the map display for the HTML to pull from
  - Leaflet-Part-1/static/index.html - this file contains the HTML code to initialize and utilize Leaflet and set the styles for the title, header, and body of the HTML page.  It also calls the logic.js file in the js folder
  - Leaflet-Part-1/static/js/logic.js - this is the file that contains the mains code of the project.  It's function is:
    > - Set coordinates for the center of the globe
    > - initialize the map centering on the coordintes and setting the proper zoom
    > - Add a map layer from arcgisonline.com
    > - initialize the earthquake markers function to set the size of the markers based on the magnitude of the earthquake
    > - assign colors to each depth range of the earthquakes
    > - fetch the earthquake data from the USGS earthquake data
    > - The dataset I am pulling from is "All Earthquakes Across the Globe Over the Last 7 Days"
    > - The code loops through each feature of the dataset capturing longitude, latitude, depth, earthquake magnitude, earthquake title (which is then split to capture the location of this earthquake to properly display on the marker popup)
    > - In this loop, the circle marker is then initialized and the current feature info is passed in the markerSize and markerColor functions to properly set the size and color of the marker based on that specific earthquake data line
    > - A legend is added to the map, styles are set for best readability
    > - the depth ranges and their associated colors are declared in arrays and then these arrays are looped through assigning the appropriate color to the appropriate depth range
    > - The legend is added to the map
    > - When the index.html file is run, this is the output:<br><br>
    > ![image](https://github.com/user-attachments/assets/6205f90f-da40-4759-98c6-eec3c6943ffe)<br><br>

