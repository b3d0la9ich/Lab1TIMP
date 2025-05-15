from flask import Flask, request, jsonify
from flask_cors import CORS
import json
import os
from datetime import datetime
import hashlib
import secrets

app = Flask(__name__)
CORS(app)

INCIDENTS_FILE = 'incidents.json'
USERS_FILE = 'users.json'
SESSIONS = {}  

@app.route('/')
def index():
    return 'Сервер работает! Используй /api/... для запросов.'

def load_incidents():
    if not os.path.exists(INCIDENTS_FILE):
        with open(INCIDENTS_FILE, 'w') as f:
            json.dump([], f)
    with open(INCIDENTS_FILE, 'r') as f:
        return json.load(f)

def save_incidents(incidents):
    with open(INCIDENTS_FILE, 'w') as f:
        json.dump(incidents, f, indent=2, ensure_ascii=False)

def get_next_id(incidents):
    return max((i["id"] for i in incidents), default=0) + 1

def ensure_admin():
    if not os.path.exists(USERS_FILE):
        users = []
    else:
        with open(USERS_FILE, 'r') as f:
            try:
                users = json.load(f)
            except:
                users = []

    if not any(u['username'] == 'admin' for u in users):
        users.append({
            "username": "admin",
            "password": hash_password("Pa$$w0rd!"),
            "role": "admin"
        })
        with open(USERS_FILE, 'w') as f:
            json.dump(users, f, indent=2)

def load_users():
    with open(USERS_FILE, 'r') as f:
        return json.load(f)

def save_users(users):
    with open(USERS_FILE, 'w') as f:
        json.dump(users, f, indent=2, ensure_ascii=False)

def hash_password(password):
    return hashlib.sha256(password.encode()).hexdigest()

def get_current_user():
    token = request.headers.get('Authorization')
    print("[DEBUG] Токен из запроса:", token)
    print("[DEBUG] Все сессии:", SESSIONS)

    if token and token in SESSIONS:
        return SESSIONS[token]
    return None

@app.route('/api/login', methods=['POST'])
def login():
    data = request.json
    username = data.get('username')
    password = hash_password(data.get('password', ''))

    users = load_users()
    for user in users:
        if user['username'] == username and user['password'] == password:
            token = secrets.token_hex(16)
            SESSIONS[token] = user
            return jsonify({'success': True, 'token': token, 'role': user['role']})

    return jsonify({'success': False, 'error': 'Неверные данные'}), 401

@app.route('/api/scan_baggage', methods=['POST'])
def scan_baggage():
    data = request.json
    contents = data.get('contents', '').lower()
    forbidden_items = ['нож', 'пистолет', 'взрывчатка']
    if any(item in contents for item in forbidden_items):
        incidents = load_incidents()
        new_incident = {
            'id': get_next_id(incidents),
            'type': 'Багаж',
            'description': 'Обнаружен запрещённый предмет',
            'timestamp': datetime.utcnow().isoformat(),
            'resolved': False,
            'status': 'новый'  # 👈 добавлено
        }
        incidents.append(new_incident)
        save_incidents(incidents)
        return jsonify({'result': 'Обнаружен запрещённый предмет', 'incident': True})
    return jsonify({'result': 'Багаж чистый', 'incident': False})

@app.route('/api/scan_person', methods=['POST'])
def scan_person():
    import random
    if random.random() < 0.3:
        incidents = load_incidents()
        new_incident = {
            'id': get_next_id(incidents),
            'type': 'Человек',
            'description': 'Сканер сработал на подозрение',
            'timestamp': datetime.utcnow().isoformat(),
            'resolved': False,
            'status': 'новый'  # 👈 добавлено
        }
        incidents.append(new_incident)
        save_incidents(incidents)
        return jsonify({'result': 'Сканер сработал!', 'incident': True})
    return jsonify({'result': 'Проверка пройдена', 'incident': False})

@app.route('/api/incidents', methods=['GET'])
def get_incidents():
    incidents = load_incidents()
    sorted_incidents = sorted(incidents, key=lambda x: x["timestamp"], reverse=True)
    return jsonify(sorted_incidents)

@app.route('/api/resolve/<int:incident_id>', methods=['POST'])
def resolve_incident(incident_id):
    user = get_current_user()
    if not user or user['role'] != 'admin':
        return jsonify({'success': False, 'error': 'Доступ запрещён'}), 403
    incidents = load_incidents()
    for i in incidents:
        if i['id'] == incident_id:
            i['resolved'] = True
            save_incidents(incidents)
            return jsonify({'success': True})
    return jsonify({'success': False, 'error': 'Инцидент не найден'}), 404  

@app.route('/api/incidents/<int:incident_id>', methods=['PATCH'])
def update_incident(incident_id):
    user = get_current_user()
    if not user or user['role'] != 'admin':
        return jsonify({'success': False, 'error': 'Доступ запрещён'}), 403
    data = request.json
    incidents = load_incidents()
    for incident in incidents:
        if incident['id'] == incident_id:
            if 'status' in data:
                incident['status'] = data['status']
                save_incidents(incidents)
                return jsonify({'success': True})
            return jsonify({'success': False, 'error': 'Нет поля status'}), 400
    return jsonify({'success': False, 'error': 'Инцидент не найден'}), 404


def resolve_incident(incident_id):
    user = get_current_user()
    if not user or user['role'] != 'admin':
        return jsonify({'success': False, 'error': 'Доступ запрещён'}), 403

    incidents = load_incidents()
    for i in incidents:
        if i['id'] == incident_id:
            i['resolved'] = True
            save_incidents(incidents)
            return jsonify({'success': True})
    return jsonify({'success': False, 'error': 'Инцидент не найден'}), 404

def load_incidents():
    if not os.path.exists(INCIDENTS_FILE):
        with open(INCIDENTS_FILE, 'w') as f:
            json.dump([], f)
    try:
        with open(INCIDENTS_FILE, 'r') as f:
            return json.load(f)
    except json.JSONDecodeError:
        print("Файл incidents.json повреждён")
        with open(INCIDENTS_FILE, 'w') as f:
            json.dump([], f)
        return []
    
@app.route('/api/delete/<int:incident_id>', methods=['DELETE'])
def delete_incident(incident_id):
    user = get_current_user()
    if not user or user['role'] != 'admin':
        return jsonify({'success': False, 'error': 'Доступ запрещён'}), 403

    incidents = load_incidents()
    updated = [i for i in incidents if i['id'] != incident_id]
    if len(incidents) == len(updated):
        return jsonify({'message': 'Инцидент не найден'}), 404
    save_incidents(updated)
    return jsonify({'message': f'Инцидент #{incident_id} удалён'})

ensure_admin()

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)