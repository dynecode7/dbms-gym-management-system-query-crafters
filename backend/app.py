# app.py

from flask import Flask, render_template, jsonify
import mysql.connector

app = Flask(__name__)

def get_db():
    return mysql.connector.connect(
        host="localhost",
        user="root",
        password="root123",
        database="envgym_db"
)

# Routes

@app.route("/")
def home():
    return render_template("index.html")


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