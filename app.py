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
    if(data):
        L.append(data[0]["name"])
    
    else:
        L.append('')
    
    cursor.execute("SELECT type FROM membershipplan WHERE plan_id = (SELECT plan_id FROM member WHERE member_id=%s)", (mid,))
    data = cursor.fetchall()
    if(data):
        L.append(data[0]["type"])
    
    else:
        L.append('')
    

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

@app.route('/giveInfo/<int:member_id>/<string:info_type>')
def giveInfo(member_id, info_type):

    conn = get_db()
    cursor = conn.cursor(dictionary=True)
    
    if info_type == "exerciseList":
        cursor.execute(
            "SELECT exercises FROM workoutplan WHERE member_id=%s",
            (member_id,)
        )
        data = cursor.fetchall()
        return jsonify(data)

    elif info_type == "historyList":
        cursor.execute(
            "SELECT date FROM attendance WHERE member_id=%s",
            (member_id,)
        )
        data = cursor.fetchall()
        return jsonify(data)
    
    elif info_type == "paymentList":
        cursor.execute(
            "SELECT amount, date FROM payment WHERE member_id=%s  AND status='Paid'",
            (member_id,)
        )
        data = cursor.fetchall()
        return jsonify(data)
    else:
        return jsonify({"error": "Invalid type"}), 400
    
    

    # elif info_type == "paymentList":
    #     # do payment work
    #     return "Payment Data"

    # else:
    #     return "Invalid request"


@app.route('/updateProfile/<int:member_id>', methods=['POST'])
def updateProfile(member_id):
    data = request.get_json()
    print(data)
    name = data['name']
    phone = data['phone']
    age = data['age']

    conn = get_db()
    cursor = conn.cursor()

    cursor.execute(
        "UPDATE member SET name=%s, phone=%s, age=%s WHERE member_id=%s",
        (name, phone, age, member_id)
    )

    conn.commit()

    return jsonify({"message": "Updated successfully"})


@app.route('/markPresent/<int:member_id>', methods=['POST'])
def markPresent(member_id):

    data = request.get_json()
    print(data)
    date = data['date']
    
    conn = get_db()
    cursor = conn.cursor(dictionary=True)

    # To check If the date Is already marked.

    cursor.execute(
        "SELECT * FROM attendance WHERE member_id=%s AND date=%s",
        (member_id, date)
    )
    existing = cursor.fetchone()
    if existing:
        return jsonify({"message": "Already marked"})

    #If date doesn't exist, add into mysql.

    cursor.execute(
        "INSERT INTO attendance (member_id, date) VALUES (%s, %s)",(member_id,date)
    )
    conn.commit()
    conn.close()
    return jsonify({"message": "Updated successfully"})


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