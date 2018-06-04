import sys
import json
from flask import Response, Flask, render_template
from requests import get
from shapely.geometry import Polygon, Point

app = Flask(__name__)

key = ''
count = 0


@app.route('/')
def main():
    return render_template('index.htm')


@app.route('/tiles/<z>/<x>/<y>')
def tiles(z, x, y):

    global count

    if count == 0:
        return Response(
            response='Reached maxiumum requests amount.',
            status=403,
        )

    count -= 1

    MAPTILER_BASE_URL = 'https://maps.tilehosting.com/styles/streets'
    url = MAPTILER_BASE_URL + '/' + z + '/' + x + '/' + y + '.png?key=' + key
    return get(url).content


@app.route('/polygon/<cityname>')
def get_city_polygon(cityname):

    coordinates = []

    with open(cityname + ".poly", "r") as reader:
        for index, line in enumerate(reader):

            # FIXME: does not work with nested/multiple polygons file

            pattern = line.split()

            if index <= 1 or pattern[0] == "END":
                continue

            coordinates.append(pattern[0] + ";" + pattern[1])

    return Response(
        json.dumps(coordinates),
        mimetype=u'application/json',
    )


@app.route('/is-inside-polygon/<cityname>/<latitude>/<longitude>')
def is_inside_polygon(
    cityname,
    latitude,
    longitude,
):

    coordinates = []

    with open(cityname + ".poly", "r") as reader:
        for index, line in enumerate(reader):

            # FIXME: does not work with nested/multiple polygons file

            pattern = line.split()

            if index <= 1 or pattern[0] == "END":
                continue

            coordinates.append((float(pattern[0]), float(pattern[1])))

    polygon = Polygon(coordinates)

    return Response(
        json.dumps(
            polygon.contains(
                Point(
                    float(longitude),
                    float(latitude),
                )
            )
        ),
        mimetype=u'application/json',
    )


if __name__ == '__main__':
    key = sys.argv[1]
    count = int(sys.argv[2])
    app.run()
