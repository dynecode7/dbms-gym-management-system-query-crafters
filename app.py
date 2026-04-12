
from flask import Flask, render_template, jsonify, redirect, url_for, request, session
from datetime import date
import mysql.connector
import os

app = Flask(__name__)
app.secret_key = os.urandom(24)



def get_db():
    return mysql.connector.connect(
        host="localhost",
        user="root",
        password="root123",
        database="envgym_db"
)

def getMemberData(mid):
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

def TraineeDetails(tid):
    L = []
    L2=[]
    conn = get_db()
    cursor = conn.cursor(dictionary=True)
    
    cursor.execute("SELECT m.member_id, m.name, m.age, p.type FROM member m JOIN membershipplan p ON m.plan_id = p.plan_id WHERE m.trainer_id = %s", (tid,))
    L = cursor.fetchall()
    L2.append(L)
    # print(L)

    cursor.execute("""
    SELECT 
        SUM(
            CASE 
                WHEN mp.type = 'Monthly' THEN mp.price * 0.30
                WHEN mp.type = 'Quarterly' THEN mp.price * 0.50
                WHEN mp.type = 'Yearly' THEN mp.price * 0.60
            END
        ) AS total_trainer_earning
    FROM member m
    JOIN membershipplan mp ON m.plan_id = mp.plan_id
    WHERE m.trainer_id = %s
    """, (tid,))
    result = cursor.fetchone()
    if(result['total_trainer_earning']):
        earning = float(result['total_trainer_earning'])
    else: earning = 0
    L2.append(earning)
    
    print(L2)
    conn.close()
    return L2
    


# ----------------------------------------- MEMBER _______ ROUTES ----------------------------------------------

@app.route("/")
def auth_page():
    return render_template('authorization/auth.html')

@app.route('/signup', methods=['POST'])
def signup():

    data = request.get_json()

    name = data['name']
    age = data['age']
    gender = data['gender']
    phone = data['phone']
    password = data['password']

    today_date = date.today().strftime('%Y-%m-%d')
    print(today_date)

    # insert into DB
    conn = get_db()
    cursor = conn.cursor(dictionary=True)
    cursor.execute(
        "INSERT INTO member (name, age, gender, phone, password,join_date) VALUES (%s, %s, %s, %s, %s, %s)",
        (name, age, gender, phone, password, today_date)
    )
    conn.commit()

    # get last inserted id
    member_id = cursor.lastrowid

    return redirect(url_for('auth_page'))

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

@app.route('/LoadPTM')
def LoadPlansTrainersPayments():
    L = []
    conn = get_db()
    cursor = conn.cursor(dictionary=True)

    cursor.execute("SELECT name, trainer_id, specialization FROM trainer")
    data = cursor.fetchall()
    L.append(data)

    cursor.execute("SELECT type, plan_id, price FROM membershipplan")
    data = cursor.fetchall()
    L.append(data)
    
    return jsonify(L)

@app.route('/home/<int:member_id>')
def dashboard(member_id):
    return render_template('member/index.html')
    
@app.route('/givedetail/<int:member_id>')
def give_detail(member_id):
    data = getMemberData(member_id)
    return jsonify(data)

@app.route('/giveInfo/<int:member_id>/<string:info_type>')
def giveInfo(member_id, info_type):

    conn = get_db()
    cursor = conn.cursor(dictionary=True)
    
    if info_type == "exerciseList":
        cursor.execute(
            "SELECT exercises, date FROM workoutplan WHERE member_id=%s ORDER BY date DESC",
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
    
@app.route('/updateProfile/<int:member_id>', methods=['POST'])
def updateProfile(member_id):
    data = request.get_json()
    # print(data)
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


@app.route('/makePayment', methods=['POST'])
def makePayment():
    
    data = request.get_json()
    conn = get_db()
    cursor = conn.cursor(dictionary=True)
    cursor.execute(
       "UPDATE member SET trainer_id = %s, plan_id = %s WHERE member_id = %s",
        (data['trainer'], data['plan'], data['member'])
    )
    conn.commit()
    cursor.execute(
        "INSERT INTO payment (member_id, amount, date, status) VALUES (%s, %s, %s, 'Paid')",
        (data['member'], data['amount'], data['date'])
    )
    conn.commit()
    return jsonify({"url": url_for('dashboard', member_id=data['member'])
})

# ----------------------------------------- TRAINER _______ ROUTES ---------------------------------------------


@app.route('/trainer/login', methods=['POST'])
def Trainerlogin():
    data = request.get_json()
    if not data or 'phone' not in data:
        return jsonify({"error": "No data"}), 400
    
    phone = data['phone']
    password = data['password']
    
    conn = get_db()
    cursor = conn.cursor(dictionary=True)
    cursor.execute(
        "SELECT trainer_id FROM trainer WHERE phone=%s AND password=%s",
        (phone, password)
    )

    user = cursor.fetchone()

    if user:
        trainer_id = user["trainer_id"]
        return redirect(url_for('TrainerDashboard', trainer_id=trainer_id))
        
    else:
        return jsonify({"error": "Invalid credentials"}), 401

@app.route('/trainer/signup', methods=['POST'])
def Trainersignup():

    data = request.get_json()

    name = data['name']
    phone = data['phone']
    password = data['password']
    specialization = data['spec']

    # insert into DB
    conn = get_db()
    cursor = conn.cursor(dictionary=True)
    cursor.execute(
        "INSERT INTO trainer (name, specialization, phone, password) VALUES (%s, %s, %s, %s)",
        (name, specialization, phone, password)
    )
    conn.commit()

    # get last inserted id
    trainer_id = cursor.lastrowid

    return redirect(url_for('TrainerDashboard', trainer_id=trainer_id))


@app.route('/home/trainer/<int:trainer_id>')
def TrainerDashboard(trainer_id):
    return render_template('trainer/index.html')

@app.route('/trainer/givedetails/<int:trainer_id>')
def TrainerOnboarding(trainer_id):

    traineeList = TraineeDetails(trainer_id)
    allDetails = []
    conn = get_db()
    cursor = conn.cursor(dictionary=True)
    
    cursor.execute("SELECT name, specialization from trainer where trainer_id = %s", (trainer_id,))
    profileDetail = cursor.fetchone()

    allDetails = [profileDetail['name'], profileDetail['specialization'], traineeList[0], traineeList[1]]
    # print(allDetails)
    return jsonify(allDetails)

@app.route('/assignWorkout/<int:member_id>', methods=['POST'])
def assignWorkoutToMember(member_id):

    data = request.get_json()
    exercises = ",".join(data['exercises'])
    date = data['date']
    mid = data['mid']

    conn = get_db()
    cursor = conn.cursor()

    #IF A WORKOUTPLAN IS ALREADY ASSIGNED TO ONE MEMBER_ID ON THE SAME DAY, RETURN ALREADY MARKED, OTHERWISE ADD TO DATABASE.

    cursor.execute(
        "SELECT * FROM workoutplan WHERE member_id=%s AND date=%s",
        (member_id, date)
    )
    existing = cursor.fetchone()
    if existing:
        return jsonify({"message": "Exercise already assigned for today", "status":0})

    cursor.execute(
        "INSERT INTO workoutplan (member_id, trainer_id, exercises, date) VALUES (%s,(SELECT trainer_id FROM member WHERE member_id = %s), %s, %s)", (mid, mid, exercises,date)
    )
    conn.commit()
    return jsonify({"message": "Assined Exercise successfully", "status": 1})



#To clear browser cache

@app.route('/logout')
def logout():
    session.clear()
    return redirect('/')

@app.after_request
def add_header(response):
    response.headers["Cache-Control"] = "no-store, no-cache, must-revalidate, max-age=0"
    response.headers["Pragma"] = "no-cache"
    response.headers["Expires"] = "0"
    return response


app.run(debug=True)