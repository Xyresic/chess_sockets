import os

from flask import Flask, render_template, request, flash, jsonify
from flask_socketio import SocketIO, join_room, leave_room

app = Flask(__name__)
app.secret_key = os.urandom(32)
socketio = SocketIO(app)

@app.route('/')
def root():
    return render_template('index.html')

@socketio.on('my event')
def handle_connect(msg):
    print(msg)

if __name__ == "__main__":
    app.debug = True
    socketio.run(app)