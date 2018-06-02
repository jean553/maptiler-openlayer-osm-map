import sys
from flask import Response, Flask, render_template
from requests import get

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


if __name__ == '__main__':
    key = sys.argv[1]
    count = int(sys.argv[2])
    app.run()
