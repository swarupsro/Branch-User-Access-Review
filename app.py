from flask import Flask, render_template, request, redirect, url_for, flash, session
from flask_ldap3_login import LDAP3LoginManager
from flask_ldap3_login.forms import LDAPLoginForm
from flask_sqlalchemy import SQLAlchemy
import pandas as pd
import os

app = Flask(__name__)

# Configuration
app.config['SECRET_KEY'] = 'your_secret_key'
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///data.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['LDAP_HOST'] = 'your_ldap_host'
app.config['LDAP_BASE_DN'] = 'DC=example,DC=com'
app.config['LDAP_USER_DN'] = 'CN=Users'
app.config['LDAP_GROUP_DN'] = 'OU=Groups'
app.config['LDAP_BIND_USER_DN'] = 'CN=bind_user,CN=Users,DC=example,DC=com'
app.config['LDAP_BIND_USER_PASSWORD'] = 'bind_user_password'

ldap_manager = LDAP3LoginManager(app)
db = SQLAlchemy(app)

# Models
class Employee(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    role = db.Column(db.String(50), nullable=False)

# Routes
@app.route('/')
def index():
    if 'username' not in session:
        return redirect(url_for('login'))
    return render_template('index.html')

@app.route('/login', methods=['GET', 'POST'])
def login():
    form = LDAPLoginForm()
    if form.validate_on_submit():
        username = form.username.data
        session['username'] = username
        # Check if user is a manager
        user = Employee.query.filter_by(email=username).first()
        if user and user.role == 'Manager':
            flash('Logged in successfully!', 'success')
            return redirect(url_for('index'))
        else:
            flash('Access denied: You must be a manager.', 'danger')
            return redirect(url_for('logout'))
    return render_template('login.html', form=form)

@app.route('/logout')
def logout():
    session.pop('username', None)
    flash('You have been logged out.', 'info')
    return redirect(url_for('login'))

@app.route('/upload', methods=['GET', 'POST'])
def upload():
    if 'username' not in session:
        return redirect(url_for('login'))
    if request.method == 'POST':
        file = request.files['file']
        if file and file.filename.endswith('.csv'):
            filepath = os.path.join('uploads', file.filename)
            file.save(filepath)
            import_csv(filepath)
            flash('File uploaded and processed successfully.', 'success')
            return redirect(url_for('index'))
        else:
            flash('Invalid file format. Please upload a CSV file.', 'danger')
    return render_template('upload.html')

@app.route('/options', methods=['GET', 'POST'])
def options():
    if 'username' not in session:
        return redirect(url_for('login'))
    if request.method == 'POST':
        selected_option = request.form.get('dropdown')
        flash(f'Option "{selected_option}" selected.', 'success')
        return redirect(url_for('index'))
    options_list = ['Option 1', 'Option 2', 'Option 3']
    return render_template('options.html', options=options_list)

# Helper Functions
def import_csv(filepath):
    df = pd.read_csv(filepath)
    for _, row in df.iterrows():
        employee = Employee(name=row['Name'], email=row['Email'], role=row['Role'])
        db.session.add(employee)
    db.session.commit()

if __name__ == '__main__':
    if not os.path.exists('data.db'):
        db.create_all()
    if not os.path.exists('uploads'):
        os.makedirs('uploads')
    app.run(debug=True)
