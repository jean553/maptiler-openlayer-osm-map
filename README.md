# maptiler-openlayer-osm-map

## Table of content
 * [Objectives](#objectives)
 * [Notes](#notes)
 * [Build the Nominatim server](#build-the-nominatim-server)
 * [Build the project](#build-the-project)
 * [Run the project](#run-the-project)
 * [Self signed certificate for geolocation](#self-signed-certificate-for-geolocation)

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

## Build the Nominatim server

A Nominatim server instance is required to ensure geocoding features.
Full explanation to build a Docker Nominatim server can be found [here](https://github.com/mediagis/nominatim-docker).

Update the Dockerfile with the data you need:

```Dockerfile
ENV PBF_DATA http://download.geofabrik.de/europe/monaco-latest.osm.pbf
```

(keep `monaco-latest` in order to have a fast image building process,
downloading from geofrabik takes time, exspecially for big files)

Build the image:

```sh
docker build -t nominatim .
```

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

(or using https if configured):

```sh
https://0.0.0.0:8083/
```

## Self signed certificate for geolocation

Secured connection must be establish between the client and the server
in order to let the browser enabled client geolocation.

Simple self-signed certificate generation procedure can be found [here](https://www.digitalocean.com/community/tutorials/how-to-create-an-ssl-certificate-on-nginx-for-ubuntu-14-04).

The following lines must be added to `/etc/nginx/nginx.conf`:

```sh
server {

    ...

    listen 443 ssl;

    ssl_certificate your_certificate_path;
    ssl_certificate_key your_key_path;
}
```
