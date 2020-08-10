import os
from functools import wraps

from flask import Flask, render_template, request, flash, redirect, url_for
from flask_socketio import SocketIO, emit, join_room, leave_room

from app.models import db, Room

app = Flask(__name__)
app.secret_key = os.urandom(32)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///./static/data/database.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = 'False'
socketio = SocketIO(app)

db.init_app(app)
with app.app_context():
    db.create_all()

current_user = None
def authenticate_user(route):
    @wraps(route)
    def authenticate(*args, **kwargs):
        if current_user is None:
            flash('You are not logged in.', 'warning')
            return redirect(url_for('root'))
        return route(*args, **kwargs)
    return authenticate

def get_room(room):
    return Room.query.filter_by(name=room).first()

@app.route('/', methods=['GET', 'POST'])
def root():
    global current_user
    if 'name' in request.form:
        user = request.form['name']
        room = request.form['room']
        query = get_room(room)
        if query is not None:
            if query.user2 is None and user != query.user1:
                query.user2 = user
                db.session.commit()
                current_user = user
                return redirect(url_for('game', room=room))
            elif query.user1 != user and query.user2 != user:
                flash('The room is full.', 'danger')
            else:
                current_user = user
                return redirect(url_for('game', room=room))
        else:
            new_room = Room(user, room)
            db.session.add(new_room)
            db.session.commit()
            current_user = user
            return redirect(url_for('game', room=room))
    return render_template('index.html')

@app.route('/game/<room>')
@authenticate_user
def game(room):
    query = get_room(room)
    user2 = query.user2 if query.user2 is not None else 'Waiting for opponent ...'
    if current_user == user2:
        return render_template('game.html', room=query.name, user1=user2, user2=query.user1, state=query.state, flip=1)
    else:
        return render_template('game.html', room=query.name, user1=query.user1, user2=user2, state=query.state, flip=0)

@socketio.on('join')
def join(room):
    query = get_room(room)
    join_room(room)
    emit('update_opponent', query.user2, room=room)

@socketio.on('move')
def handle_move(data):
    room = get_room(data['room'])
    room.state = data['board']
    db.session.commit()
    emit('update', (data['user'], data['board'], data['move']), room=data['room'])

@socketio.on('endgame')
def end_game(data):
    if data['type'] == 'checkmate':
        room = get_room(data['room'])
        if data['loser'] == 1:
            emit('checkmate', room.user1, room=data['room'])
        else:
            emit('checkmate', room.user2, room=data['room'])
    else:
        emit('draw', room=data['room'])

if __name__ == "__main__":
    app.debug = True
    socketio.run(app)
