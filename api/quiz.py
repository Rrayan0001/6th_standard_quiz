from http.server import BaseHTTPRequestHandler
import json
import os
import random

QUESTIONS_DB = {}
GLOBAL_Q_MAP = {}

def load_questions():
    global QUESTIONS_DB, GLOBAL_Q_MAP
    try:
        base_path = os.path.dirname(os.path.abspath(__file__))
        json_path = os.path.join(base_path, "data", "questions.json")
        
        with open(json_path, "r") as f:
            data = json.load(f)
            QUESTIONS_DB = data
            
            for subject, q_list in data.items():
                for q in q_list:
                    uid = f"{subject}_{q['id']}"
                    q['unique_id'] = uid
                    q['section'] = subject
                    GLOBAL_Q_MAP[uid] = q
    except Exception as e:
        print(f"Error loading questions: {e}")
        QUESTIONS_DB = {}

load_questions()

class handler(BaseHTTPRequestHandler):
    def do_GET(self):
        if not QUESTIONS_DB:
            self._send_json({"questions": [], "error": "No questions loaded"})
            return

        combined = []
        
        def get_random(subject, count):
            qs = QUESTIONS_DB.get(subject, [])
            return random.sample(qs, min(len(qs), count))

        maths = get_random("Maths", 10)
        science = get_random("Science", 10)
        social = get_random("Social Science", 10)
        
        combined.extend(maths)
        combined.extend(science)
        combined.extend(social)
        
        final_questions = []
        for q in combined:
            # Convert options from dict {"A": "val", ...} to array ["A) val", "B) val", ...]
            opts = q.get('options', {})
            if isinstance(opts, dict):
                options_array = [f"{k}) {v}" for k, v in sorted(opts.items())]
            else:
                options_array = opts  # Already an array
            
            final_questions.append({
                "id": q['unique_id'],
                "question": q['question'],
                "options": options_array,
                "section": q.get('section', 'General')
            })
        
        self._send_json({
            "questions": final_questions,
            "subject": "Unified Entrance Test"
        })

    def _send_json(self, data, status=200):
        self.send_response(status)
        self.send_header('Content-Type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()
        self.wfile.write(json.dumps(data).encode())
