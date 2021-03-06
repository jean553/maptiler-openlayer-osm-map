# maptiler-openlayer-osm-map

![Image 1](images/screenshot1.png)
![Image 2](images/screenshot2.png)

## Table of content
 * [Features](#features)
 * [Run the project](#run-the-project)
    - [Build the Nominatim server](#build-the-nominatim-server)
    - [Build the project](#build-the-project)
    - [Run the project](#run-the-project)
 * [Self signed certificate for geolocation](#self-signed-certificate-for-geolocation)

## Features

* display map tiles
* add marker on the map
* draw polygon from list of coordinates
* check if a given point is into a polygon
* manually draw a polygon and save its properties
* get cities polygons
* get geolocation information
* limit requests to MapTiler (tiles provider)

## Run the project

The three steps are:
 * build the Nominatim server image (data for geocoding)
 * start the Nominatim and server container
 * start the service process and use the POC into a web-browser

### Build the Nominatim server

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

### Build the project

```sh
vagrant up
```

### Run the project

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
http://localhost:8000/
```

(or using https if configured):

```sh
https://localhost:8003/
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
