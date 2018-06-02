# maptiler-openlayer-osm-map

## Objectives

* display map tiles
* add marker on the map
* draw polygon from list of coordinates
* check if a given point is into a polygon
* manually draw a polygon and save its properties
* get cities polygons
* get geolocation information

## Build the project

```sh
vagrant up
```

## Run the project

Connect to the container:

```sh
vagrant ssh
```

Start the server:

```sh
FLASK_APP=main.py flask run --host=0.0.0.0
```

Open the following address into your browser:

```sh
python3 main.py --maptiler-key your_maptiler_key
```
