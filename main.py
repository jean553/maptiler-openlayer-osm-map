import sys
from flask import Flask, render_template

app = Flask(__name__)

key = ''


@app.route('/')
def main():
    return render_template('index.htm')


if __name__ == '__main__':
    key = sys.argv[1]
    app.run(host='0.0.0.0')
