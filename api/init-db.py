from http.server import BaseHTTPRequestHandler
import json
import os
import psycopg

def get_db_url():
    url = os.environ.get("DATABASE_URL")
    return url.strip() if url else None

class handler(BaseHTTPRequestHandler):
    def do_GET(self):
        db_url = get_db_url()
        if not db_url:
            self._send_json({"error": "DATABASE_URL not set"}, 500)
            return
        
        try:
            with psycopg.connect(db_url, autocommit=True) as conn:
                with conn.cursor() as cur:
                    cur.execute("""
                        CREATE TABLE IF NOT EXISTS students (
                            id UUID PRIMARY KEY,
                            name TEXT NOT NULL,
                            roll_no TEXT NOT NULL,
                            created_at TIMESTAMP DEFAULT NOW()
                        );
                    """)
                    cur.execute("""
                        CREATE TABLE IF NOT EXISTS test_results (
                            id SERIAL PRIMARY KEY,
                            student_id UUID REFERENCES students(id),
                            subject TEXT,
                            score INTEGER,
                            total_questions INTEGER,
                            answers JSONB,
                            report TEXT,
                            created_at TIMESTAMP DEFAULT NOW()
                        );
                    """)
            self._send_json({"success": True, "message": "Database tables initialized"})
        except Exception as e:
            self._send_json({"error": str(e)}, 500)

    def _send_json(self, data, status=200):
        self.send_response(status)
        self.send_header('Content-Type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()
        self.wfile.write(json.dumps(data).encode())
