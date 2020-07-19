from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()


class Room(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(64), nullable=False)
    user1 = db.Column(db.String(64))
    user2 = db.Column(db.String(64))
    state = db.Column(db.String(64))

    def __init__(self, user, name):
        self.user1 = user
        self.name = name
        self.state = 'rnbqkbnr/pppppppp/......../......../......../......../PPPPPPPP/RNBQKBNR w KQkq -'
