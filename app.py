# app.py

from flask import Flask, render_template, jsonify, redirect, url_for, request
import mysql.connector

app = Flask(__name__)

def get_db():
    return mysql.connector.connect(
        host="localhost",
        user="root",
        password="root123",
        database="envgym_db"
)

    L = []
    conn = get_db()
    cursor = conn.cursor(dictionary=True)

    cursor.execute("SELECT name, phone, age FROM member WHERE member_id=%s", (mid,))
    data = cursor.fetchall()
    L.append(data[0]["name"])
    L.append(data[0]["phone"])
    L.append(data[0]["age"])

    cursor.execute("SELECT name FROM trainer WHERE trainer_id = (SELECT trainer_id FROM member WHERE member_id=%s)", (mid,))
    data = cursor.fetchall()
    L.append(data[0]["name"])

    cursor.execute("SELECT type FROM membershipplan WHERE plan_id = (SELECT plan_id FROM member WHERE member_id=%s)", (mid,))
    data = cursor.fetchall()
    L.append(data[0]["type"])

    cursor.execute("SELECT COUNT(*) AS days FROM attendance WHERE member_id=%s", (mid,))
    data = cursor.fetchone()
    L.append(data["days"])

    conn.close()
    return L 

def onboarding(mid):
    L = []
    conn = get_db()
    cursor = conn.cursor(dictionary=True)

    cursor.execute("SELECT name, phone, age FROM member WHERE member_id=%s", (mid,))
    data = cursor.fetchall()
    L.append(data[0]["name"])
    L.append(data[0]["phone"])
    L.append(data[0]["age"])

    cursor.execute("SELECT name FROM trainer WHERE trainer_id = (SELECT trainer_id FROM member WHERE member_id=%s)", (mid,))
    data = cursor.fetchall()
    L.append(data[0]["name"])

    cursor.execute("SELECT type FROM membershipplan WHERE plan_id = (SELECT plan_id FROM member WHERE member_id=%s)", (mid,))
    data = cursor.fetchall()
    L.append(data[0]["type"])

    cursor.execute("SELECT COUNT(*) AS days FROM attendance WHERE member_id=%s", (mid,))
    data = cursor.fetchone()
    L.append(data["days"])

    conn.close()
    return L

# Routes

@app.route("/")
def auth_page():
    return render_template('auth.html')

@app.route('/signup', methods=['POST'])
def signup():
    data = request.get_json()

    name = data['name']
    age = data['age']
    gender = data['gender']
    phone = data['phone']
    password = data['password']

    # insert into DB
    conn = get_db()
    cursor = conn.cursor(dictionary=True)
    cursor.execute(
        "INSERT INTO member (name, age, gender, phone, password) VALUES (%s, %s, %s, %s, %s)",
        (name, age, gender, phone, password)
    )
    conn.commit()

    # get last inserted id
    member_id = cursor.lastrowid

    return redirect(url_for('dashboard', member_id=member_id))


@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()

    phone = data['phone']
    password = data['password']

    conn = get_db()
    cursor = conn.cursor(dictionary=True)
    cursor.execute(
        "SELECT member_id FROM member WHERE phone=%s AND password=%s",
        (phone, password)
    )

    user = cursor.fetchone()

    if user:
        member_id = user["member_id"]
        return redirect(url_for('dashboard', member_id=member_id))
    else:
        return jsonify({"error": "Invalid credentials"}), 401


@app.route('/home/<int:member_id>')
def dashboard(member_id):
    return render_template('index.html')

@app.route('/givedetail/<int:member_id>')
def give_detail(member_id):
    data = onboarding(member_id)
    return jsonify(data)



@app.route("/workout")
def workout():
    conn = get_db()
    cursor = conn.cursor(dictionary=True)

    cursor.execute("SELECT exercises FROM workoutplan WHERE member_id = 1")

    data = cursor.fetchall()

    conn.close()

    return jsonify(data)
    


@app.route("/attendance")
def attendance():
    conn = get_db()
    cursor = conn.cursor(dictionary=True)

    cursor.execute("SELECT COUNT(*) AS days FROM attendance WHERE member_id = 1")
    data = cursor.fetchone()

    conn.close()

    return jsonify(data)


@app.route("/payments")
def payments():
    conn = get_db()
    cursor = conn.cursor(dictionary=True)

    cursor.execute("SELECT amount, date, status FROM payment WHERE member_id = 1 ORDER BY date DESC")

    data = cursor.fetchall()

    conn.close()

    return jsonify(data)


app.run(debug=True)