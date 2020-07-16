from flask import Blueprint, request, session, render_template, flash, redirect, url_for
from flask_login import login_user, logout_user

from app.models import db, User
from app.forms import RegisterForm, LogInForm

auth = Blueprint('auth', __name__)

@auth.route('/register', methods=['GET', 'POST'])
def register():
    register_form = RegisterForm()

    if register_form.validate_on_submit():
        if User.query.filter_by(username=register_form.username.data).first() is None:
            account = User(register_form.username.data, register_form.password.data)
            db.session.add(account)
            db.session.commit()
            flash('Account created!', 'success')
            return redirect(url_for('auth.login'))
        else:
            flash('Username taken!', 'danger')
    elif request.method == 'POST':
        flash('Account creation failed!', 'danger')

    return render_template('register.html', form=register_form)


@auth.route('/login', methods=['GET', 'POST'])
def login():
    login_form = LogInForm()

    if login_form.validate_on_submit():
        user = User.query.filter_by(username=login_form.username.data).first()
        if user is None:
            flash('Username does not exist!', 'warning')
        elif user.password != login_form.password.data:
            flash('Incorrect password!', 'danger')
        else:
            login_user(user, force = True, remember = True)
            flash('Logged in successfully!', 'success')
            return redirect(url_for('root'))
    elif request.method == 'POST':
        flash('Authentication failed!', 'danger')

    return render_template('login.html', form=login_form)


@auth.route('/logout', methods=['GET', 'POST'])
def logout():
    session.clear()
    logout_user()
    flash('Logged out successfully', 'success')
    return redirect(url_for('root'))