# maptiler-openlayer-osm-map

## Objectives

* display map tiles
* add marker on the map
* draw polygon from list of coordinates
* check if a given point is into a polygon
* manually draw a polygon and save its properties
* get cities polygons
* get geolocation information

## Notes

The server is blocking mono-threaded. So it should be used for development purposes only.
In fact, if one request blocks, all the requests block.

## Build the project

```sh
vagrant up
```

## Run the project

Connect to the container:

```sh
vagrant ssh
```

Start the server with the options `maptiler_key` and `max_requests_amount`.

```sh
python3 main.py maptiler_key max_requests_amount
```

Open the following address into your browser:

```sh
http://0.0.0.0:8080/
```
