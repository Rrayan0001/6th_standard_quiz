from http.server import BaseHTTPRequestHandler
import json
import os
import psycopg

GLOBAL_Q_MAP = {}

def load_questions():
    global GLOBAL_Q_MAP
    try:
        base_path = os.path.dirname(os.path.abspath(__file__))
        json_path = os.path.join(base_path, "data", "questions.json")
        
        with open(json_path, "r") as f:
            data = json.load(f)
            for subject, q_list in data.items():
                for q in q_list:
                    uid = f"{subject}_{q['id']}"
                    q['unique_id'] = uid
                    q['section'] = subject
                    GLOBAL_Q_MAP[uid] = q
    except Exception as e:
        print(f"Error loading questions: {e}")

load_questions()

def get_db_url():
    url = os.environ.get("DATABASE_URL")
    return url.strip() if url else None

def get_groq_key():
    key = os.environ.get("GROQ_API_KEY")
    return key.strip() if key else None

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
        
        student_id = data.get('student_id', '')
        subject = data.get('subject', 'Unified Test')
        answers = data.get('answers', {})
        
        score = 0
        total_questions = 30
        
        section_scores = {"Maths": 0, "Science": 0, "Social": 0}
        section_totals = {"Maths": 0, "Science": 0, "Social": 0}

        for unique_id, ans in answers.items():
            q_obj = GLOBAL_Q_MAP.get(unique_id)
            if q_obj:
                sec = q_obj.get('section', 'General')
                if 'Math' in sec: sec_key = 'Maths'
                elif 'Science' in sec and 'Social' not in sec: sec_key = 'Science'
                elif 'Social' in sec: sec_key = 'Social'
                else: sec_key = 'General'

                if sec_key not in section_scores:
                    section_scores[sec_key] = 0
                    section_totals[sec_key] = 0
                
                section_totals[sec_key] += 1

                if q_obj['correct_answer'].strip() == ans.strip():
                    score += 1
                    section_scores[sec_key] += 1
        
        student_name = "Student"
        db_url = get_db_url()
        if db_url:
            try:
                with psycopg.connect(db_url) as conn:
                    with conn.cursor() as cur:
                        cur.execute("SELECT name FROM students WHERE id = %s", (student_id,))
                        res = cur.fetchone()
                        if res:
                            student_name = res[0]
            except Exception as e:
                print(f"Name fetch error: {e}")

        report = f"शाबास {student_name}! तुम्ही {score}/{total_questions} गुण मिळवले. सराव सुरू ठेवा!"
        groq_key = get_groq_key()
        
        if groq_key:
            try:
                from groq import Groq
                client = Groq(api_key=groq_key)
                
                section_analysis = []
                for sec, sc in section_scores.items():
                    total = section_totals.get(sec, 1)
                    pct = (sc / total * 100) if total > 0 else 0
                    sec_name = "गणित" if sec == "Maths" else "विज्ञान" if sec == "Science" else "समाजशास्त्र"
                    level = "उत्कृष्ट" if pct >= 80 else "चांगले" if pct >= 60 else "सराव करा" if pct >= 40 else "लक्ष द्या"
                    section_analysis.append(f"{sec_name}: {sc}/{total} ({pct:.0f}%) - {level}")

                prompt = (
                    f"इयत्ता ६वी विद्यार्थ्यासाठी मराठीमध्ये एक तपशीलवार कामगिरी अहवाल तयार करा.\n\n"
                    f"**विद्यार्थी माहिती:**\n"
                    f"- नाव: {student_name}\n"
                    f"- एकूण गुण: {score}/{total_questions} ({(score/total_questions*100):.1f}%)\n\n"
                    f"**विषयनिहाय कामगिरी:**\n"
                    + "\n".join([f"- {s}" for s in section_analysis]) + "\n\n"
                    "**अहवाल आवश्यकता:**\n"
                    "1. विद्यार्थ्याच्या नावाने वैयक्तिक अभिवादन सुरू करा.\n"
                    "2. एकूण कामगिरीबद्दल 'सारांश' विभाग (2-3 वाक्ये) द्या.\n"
                    "3. प्रत्येक विषयासाठी विशिष्ट अभिप्राय असलेला 'विषय विश्लेषण' विभाग द्या.\n"
                    "4. 3 उपयुक्त अभ्यास टिप्स असलेला 'शिफारसी' विभाग द्या.\n"
                    "5. प्रोत्साहनात्मक समारोप संदेशाने समाप्त करा.\n"
                    "6. ६वी इयत्तेच्या मुलांसाठी योग्य सोप्या भाषेत लिहा.\n"
                    "7. [शिक्षकाचे नाव] सारखे कोणतेही प्लेसहोल्डर वापरू नका.\n"
                    "8. स्पष्ट विभाग शीर्षके वापरा.\n"
                    "9. एकूण लांबी: अंदाजे 200-250 शब्द.\n"
                    "10. संपूर्ण अहवाल मराठी भाषेत असावा.\n"
                )
                
                resp = client.chat.completions.create(
                    model="llama-3.1-8b-instant",
                    messages=[{"role": "user", "content": prompt}]
                )
                report = resp.choices[0].message.content
            except Exception as e:
                print(f"Groq Error: {e}")

        if db_url:
            try:
                with psycopg.connect(db_url, autocommit=True) as conn:
                    with conn.cursor() as cur:
                        cur.execute(
                            "INSERT INTO test_results (student_id, subject, score, total_questions, answers, report) VALUES (%s, %s, %s, %s, %s, %s)",
                            (student_id, subject, score, total_questions, json.dumps(answers), report)
                        )
            except Exception as e:
                print(f"DB save error: {e}")

        response = {
            "score": score,
            "total": total_questions,
            "percentage": (score/total_questions)*100 if total_questions > 0 else 0,
            "report": report
        }
        self._send_json(response)

    def _send_json(self, data, status=200):
        self.send_response(status)
        self.send_header('Content-Type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()
        self.wfile.write(json.dumps(data).encode())
