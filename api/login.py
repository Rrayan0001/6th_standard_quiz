from http.server import BaseHTTPRequestHandler
import json
import os
import uuid
import psycopg

def get_db_url():
    url = os.environ.get("DATABASE_URL")
    return url.strip() if url else None

class handler(BaseHTTPRequestHandler):
    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()

    def do_POST(self):
        content_length = int(self.headers.get('Content-Length', 0))
        body = self.rfile.read(content_length)
        data = json.loads(body) if body else {}
        
        name = data.get('name', '').strip()
        roll_no = data.get('roll_no', '').strip()
        
        normalized_name = name.lower()
        normalized_roll = roll_no.lstrip('0') or '0'
        
        db_url = get_db_url()
        if not db_url:
            response = {"msg": "No DB", "student_id": str(uuid.uuid4()), "name": name}
            self._send_json(response)
            return
        
        try:
            with psycopg.connect(db_url, autocommit=True) as conn:
                with conn.cursor() as cur:
                    cur.execute(
                        "SELECT id, name FROM students WHERE LOWER(TRIM(name)) = %s AND LTRIM(roll_no, '0') = %s",
                        (normalized_name, normalized_roll)
                    )
                    res = cur.fetchone()
                    if res:
                        response = {"msg": "Logged in", "student_id": str(res[0]), "name": res[1]}
                    else:
                        new_id = uuid.uuid4()
                        cur.execute(
                            "INSERT INTO students (id, name, roll_no) VALUES (%s, %s, %s)",
                            (new_id, name, normalized_roll)
                        )
                        response = {"msg": "Registered", "student_id": str(new_id), "name": name}
            self._send_json(response)
        except Exception as e:
            self._send_json({"error": str(e)}, 500)

    def _send_json(self, data, status=200):
        self.send_response(status)
        self.send_header('Content-Type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()
        self.wfile.write(json.dumps(data).encode())
