import { useState, useEffect } from "react";

const API_URL = "/api/chat";

const CURRICULUM = {
  SS1: [
    "The Call of Abraham and God's Covenant",
    "Moses and the Exodus",
    "The Ten Commandments",
    "Joshua and the Promised Land",
    "The Judges of Israel",
    "Samuel and the Beginning of the Monarchy",
    "The Sermon on the Mount",
    "The Miracles of Jesus",
    "The Parables of Jesus",
  ],
  SS2: [
    "David: A Man After God's Heart",
    "Solomon and the Temple",
    "The Prophets: Elijah and Elisha",
    "Isaiah's Prophecy of the Messiah",
    "Jeremiah and the New Covenant",
    "The Birth and Early Life of Jesus",
    "The Ministry of John the Baptist",
    "Jesus and the Kingdom of God",
    "The Last Supper and the Passion",
  ],
  SS3: [
    "The Resurrection and Ascension",
    "Pentecost and the Early Church",
    "Paul's Missionary Journeys",
    "Faith, Grace and Salvation",
    "Christian Ethics and Social Justice",
    "The Church and Nation Building",
    "Christian Marriage and Family Life",
    "Stewardship and Christian Service",
    "Eschatology: Last Things",
  ],
};

const MINISTERS = [
  "Pastor E.A. Adeboye",
  "Bishop David Oyedepo",
  "Pastor W.F. Kumuyi",
  "Pastor Chris Oyakhilome",
  "Archbishop Benson Idahosa (legacy)",
];

async function callClaude(systemPrompt, userPrompt) {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ system: systemPrompt, user: userPrompt }),
  });
  const data = await res.json();
  return data.text || "Unable to generate content.";
}

const COLORS = {
  bg: "#0a0f1e",
  card: "#111827",
  cardBorder: "#1e3a5f",
  gold: "#f0a500",
  goldLight: "#ffd166",
  blue: "#1e6fb5",
  blueLight: "#3b9edd",
  green: "#06d6a0",
  red: "#ef476f",
  text: "#e8f0fe",
  muted: "#8899aa",
  accent: "#7b2fff",
};

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700;900&family=Nunito:wght@400;600;700&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: #0a0f1e; color: #e8f0fe; font-family: 'Nunito', sans-serif; }
  .app { min-height: 100vh; max-width: 480px; margin: 0 auto; padding-bottom: 80px; }
  .header { background: linear-gradient(135deg, #0a0f1e 0%, #1a1040 100%); padding: 20px 16px 12px; border-bottom: 1px solid #1e3a5f; position: sticky; top: 0; z-index: 100; }
  .header-title { font-family: 'Cinzel', serif; font-size: 18px; color: #f0a500; letter-spacing: 1px; }
  .header-sub { font-size: 11px; color: #8899aa; margin-top: 2px; }
  .class-tabs { display: flex; gap: 8px; margin-top: 12px; }
  .class-tab { flex: 1; padding: 6px; border-radius: 8px; border: 1px solid #1e3a5f; background: transparent; color: #8899aa; font-size: 13px; font-family: 'Nunito', sans-serif; cursor: pointer; transition: all 0.2s; }
  .class-tab.active { background: #f0a500; color: #000; border-color: #f0a500; font-weight: 700; }
  .nav { position: fixed; bottom: 0; left: 50%; transform: translateX(-50%); width: 100%; max-width: 480px; background: #0d1626; border-top: 1px solid #1e3a5f; display: flex; z-index: 100; }
  .nav-btn { flex: 1; padding: 12px 4px 8px; border: none; background: transparent; color: #8899aa; font-size: 10px; font-family: 'Nunito', sans-serif; cursor: pointer; display: flex; flex-direction: column; align-items: center; gap: 3px; transition: color 0.2s; }
  .nav-btn.active { color: #f0a500; }
  .nav-icon { font-size: 20px; }
  .section { padding: 16px; }
  .card { background: #111827; border: 1px solid #1e3a5f; border-radius: 12px; padding: 14px; margin-bottom: 12px; }
  .topic-card { cursor: pointer; transition: border-color 0.2s, transform 0.1s; }
  .topic-card:active { transform: scale(0.98); }
  .topic-card:hover { border-color: #1e6fb5; }
  .topic-num { font-size: 10px; color: #f0a500; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; }
  .topic-title { font-size: 14px; font-weight: 700; margin-top: 4px; color: #e8f0fe; }
  .page-title { font-family: 'Cinzel', serif; font-size: 16px; color: #f0a500; margin-bottom: 4px; }
  .page-sub { font-size: 12px; color: #8899aa; margin-bottom: 16px; }
  .btn { width: 100%; padding: 12px; border-radius: 10px; border: none; font-family: 'Nunito', sans-serif; font-size: 14px; font-weight: 700; cursor: pointer; margin-bottom: 10px; transition: opacity 0.2s; }
  .btn:active { opacity: 0.8; }
  .btn-gold { background: #f0a500; color: #000; }
  .btn-blue { background: #1e6fb5; color: #fff; }
  .btn-outline { background: transparent; color: #f0a500; border: 1px solid #f0a500; }
  .loading { text-align: center; padding: 32px; color: #8899aa; }
  .spinner { font-size: 32px; animation: spin 1s linear infinite; display: inline-block; }
  @keyframes spin { to { transform: rotate(360deg); } }
  .ai-text { font-size: 14px; line-height: 1.8; color: #e8f0fe; white-space: pre-wrap; }
  .section-label { font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 2px; color: #f0a500; margin-bottom: 8px; }
  .faith-card { background: linear-gradient(135deg, #1a0f3a 0%, #0d1a3a 100%); border: 1px solid #3b1f7f; }
  .quiz-option { width: 100%; padding: 12px 14px; border-radius: 10px; border: 1px solid #1e3a5f; background: #111827; color: #e8f0fe; font-family: 'Nunito', sans-serif; font-size: 13px; cursor: pointer; margin-bottom: 8px; text-align: left; transition: all 0.2s; }
  .quiz-option.correct { border-color: #06d6a0; background: #0a2a1a; color: #06d6a0; }
  .quiz-option.wrong { border-color: #ef476f; background: #2a0a14; color: #ef476f; }
  .score-badge { display: inline-block; padding: 4px 12px; border-radius: 20px; background: #f0a500; color: #000; font-weight: 700; font-size: 13px; }
  .back-btn { display: flex; align-items: center; gap: 6px; color: #f0a500; font-size: 13px; font-weight: 700; cursor: pointer; margin-bottom: 16px; background: none; border: none; font-family: 'Nunito', sans-serif; }
  .home-hero { background: linear-gradient(135deg, #1a1040 0%, #0a1628 50%, #0a0f1e 100%); padding: 24px 16px; margin-bottom: 4px; border-bottom: 1px solid #1e3a5f; }
  .hero-emoji { font-size: 48px; text-align: center; display: block; margin-bottom: 12px; }
  .hero-title { font-family: 'Cinzel', serif; font-size: 22px; color: #f0a500; text-align: center; line-height: 1.3; }
  .hero-sub { font-size: 13px; color: #8899aa; text-align: center; margin-top: 8px; }
  .stats-row { display: flex; gap: 8px; margin-top: 16px; }
  .stat-box { flex: 1; background: rgba(255,255,255,0.05); border-radius: 10px; padding: 10px; text-align: center; }
  .stat-num { font-family: 'Cinzel', serif; font-size: 20px; color: #f0a500; }
  .stat-label { font-size: 10px; color: #8899aa; margin-top: 2px; }
  .tag { display: inline-block; padding: 3px 8px; border-radius: 6px; font-size: 10px; font-weight: 700; margin-right: 4px; margin-bottom: 4px; }
  .tag-blue { background: #1a3a5c; color: #3b9edd; }
  .tag-gold { background: #3a2a00; color: #f0a500; }
  .lesson-plan-card { border-left: 3px solid #f0a500; }
  textarea { width: 100%; padding: 12px; border-radius: 10px; border: 1px solid #1e3a5f; background: #111827; color: #e8f0fe; font-family: 'Nunito', sans-serif; font-size: 13px; resize: none; outline: none; }
  textarea:focus { border-color: #1e6fb5; }
  .chat-bubble { padding: 10px 14px; border-radius: 12px; font-size: 13px; line-height: 1.7; margin-bottom: 8px; white-space: pre-wrap; }
  .chat-user { background: #1e6fb5; color: #fff; margin-left: 24px; border-bottom-right-radius: 2px; }
  .chat-ai { background: #111827; border: 1px solid #1e3a5f; color: #e8f0fe; margin-right: 24px; border-bottom-left-radius: 2px; }
`;


function Loading({ text = "AI is thinking..." }) {
  return (
    <div className="loading">
      <div className="spinner">✝️</div>
      <p style={{ marginTop: 12, fontSize: 13 }}>{text}</p>
    </div>
  );
}

function TopicList({ classLevel, onSelect }) {
  const topics = CURRICULUM[classLevel];
  return (
    <div className="section">
      <p className="page-title">📖 {classLevel} Topics</p>
      <p className="page-sub">Nigerian CRS Curriculum · Tap to learn</p>
      {topics.map((t, i) => (
        <div key={i} className="card topic-card" onClick={() => onSelect(t)}>
          <div className="topic-num">Topic {i + 1}</div>
          <div className="topic-title">{t}</div>
        </div>
      ))}
    </div>
  );
}

function TopicLesson({ topic, classLevel, onBack }) {
  const [tab, setTab] = useState("lesson");
  const [lesson, setLesson] = useState(null);
  const [quiz, setQuiz] = useState(null);
  const [faith, setFaith] = useState(null);
  const [loading, setLoading] = useState(false);
  const [answers, setAnswers] = useState({});
  const [chatMsg, setChatMsg] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [chatLoading, setChatLoading] = useState(false);

  useEffect(() => { loadLesson(); }, [topic]);

  async function loadLesson() {
    setLoading(true);
    setLesson(null); setQuiz(null); setFaith(null); setAnswers({});
    const sys = `You are an expert Nigerian CRS teacher for ${classLevel} students. Respond in clear, engaging language suitable for Nigerian secondary school students. Be academically sound and spiritually enriching. Always reference the Bible with specific verses.`;
    const text = await callClaude(sys,
      `Teach the CRS topic: "${topic}" for ${classLevel}.
Format your response exactly like this:

📚 OVERVIEW
[2-3 sentences introducing the topic]

📖 BIBLE PASSAGE
[Key Bible passage with reference, then a simplified explanation in everyday Nigerian student language]

🎯 KEY LESSONS
1. [lesson]
2. [lesson]
3. [lesson]

🌍 REAL-LIFE APPLICATION
[How this applies to a Nigerian student's daily life]

✏️ EXAM TIPS
[2-3 bullet points on what WAEC/NECO often ask about this topic]`
    );
    setLesson(text);
    setLoading(false);
  }

  async function loadQuiz() {
    if (quiz) return;
    setLoading(true);
    const sys = `You are a Nigerian CRS exam question setter. Generate quiz questions exactly in the JSON format requested. No extra text.`;
    const raw = await callClaude(sys,
      `Generate 5 multiple choice questions on "${topic}" for ${classLevel} students (WAEC/NECO style).
Return ONLY valid JSON:
[{"q":"Question?","options":["A. opt1","B. opt2","C. opt3","D. opt4"],"answer":"A. opt1","explanation":"Why correct."}]`
    );
    try {
      const cleaned = raw.replace(/\`\`\`json|\`\`\`/g, "").trim();
      setQuiz(JSON.parse(cleaned));
    } catch {
      setQuiz([{ q: "Quiz generation error. Try again.", options: [], answer: "", explanation: raw }]);
    }
    setLoading(false);
  }

  async function loadFaith() {
    if (faith) return;
    setLoading(true);
    const minister = MINISTERS[Math.floor(Math.random() * MINISTERS.length)];
    const sys = `You are creating Faith Insight content for a Nigerian Christian students CRS app. Be spiritually enriching and encouraging.`;
    const text = await callClaude(sys,
      `Create a Faith Insight for "${topic}" for ${classLevel} students.

🙏 FAITH INSIGHT
[2-3 sentence spiritual reflection]

💬 MINISTER'S WISDOM
[Inspiring teaching in the style of ${minister}. Label: "In the spirit of ${minister}:" Write original inspiration, not fabricated quotes.]

✨ POSITIVE CONFESSION
[Scripture-based declaration. Start with "I declare..."]

📅 DAILY DEVOTIONAL PROMPT
[Short devotional thought and one reflection question]`
    );
    setFaith(text);
    setLoading(false);
  }

  function handleTab(t) {
    setTab(t);
    if (t === "quiz") loadQuiz();
    if (t === "faith") loadFaith();
  }

  function selectAnswer(qi, opt) {
    if (answers[qi] !== undefined) return;
    setAnswers(prev => ({ ...prev, [qi]: opt }));
  }

  async function sendChat() {
    if (!chatMsg.trim() || chatLoading) return;
    const msg = chatMsg.trim();
    setChatMsg("");
    setChatHistory(h => [...h, { role: "user", text: msg }]);
    setChatLoading(true);
    const sys = `You are a friendly Nigerian CRS tutor helping a ${classLevel} student understand "${topic}". Be clear, concise, encouraging. Keep responses under 150 words.`;
    const history = chatHistory.map(c => `${c.role === "user" ? "Student" : "Tutor"}: ${c.text}`).join("\n");
    const reply = await callClaude(sys, `${history}\nStudent: ${msg}`);
    setChatHistory(h => [...h, { role: "ai", text: reply }]);
    setChatLoading(false);
  }

  const tabs = [
    { id: "lesson", label: "📚 Lesson" },
    { id: "quiz", label: "🧠 Quiz" },
    { id: "faith", label: "✝️ Faith" },
    { id: "ask", label: "💬 Ask AI" },
  ];

  const score = quiz
    ? Object.keys(answers).filter(i => answers[i] === quiz[i]?.answer).length
    : 0;

  return (
    <div className="section">
      <button className="back-btn" onClick={onBack}>← Back to Topics</button>
      <p className="page-title" style={{ fontSize: 14, marginBottom: 2 }}>{topic}</p>
      <span className="tag tag-blue">{classLevel}</span>
      <span className="tag tag-gold">CRS</span>
      <div style={{ display: "flex", gap: 6, margin: "14px 0 16px", overflowX: "auto" }}>
        {tabs.map(t => (
          <button key={t.id} onClick={() => handleTab(t.id)}
            style={{ whiteSpace: "nowrap", padding: "7px 12px", borderRadius: 8, border: "1px solid", fontFamily: "Nunito,sans-serif", fontSize: 12, cursor: "pointer", fontWeight: 700, background: tab === t.id ? "#f0a500" : "transparent", color: tab === t.id ? "#000" : "#8899aa", borderColor: tab === t.id ? "#f0a500" : "#1e3a5f" }}>
            {t.label}
          </button>
        ))}
      </div>

      {tab === "lesson" && (loading ? <Loading text="Generating your CRS lesson..." /> : lesson ? <div className="card"><div className="ai-text">{lesson}</div></div> : null)}

      {tab === "quiz" && (loading ? <Loading text="Preparing quiz questions..." /> : quiz ? (
        <div>
          {Object.keys(answers).length === quiz.length && (
            <div className="card" style={{ textAlign: "center", marginBottom: 12 }}>
              <div style={{ fontSize: 12, color: "#8899aa" }}>Your Score</div>
              <div style={{ fontSize: 32, fontFamily: "Cinzel,serif", color: "#f0a500", margin: "6px 0" }}>{score}/{quiz.length}</div>
              <span className="score-badge">{score === quiz.length ? "🏆 Perfect!" : score >= 3 ? "✅ Good Job!" : "📖 Keep Studying"}</span>
            </div>
          )}
          {quiz.map((q, i) => (
            <div key={i} className="card" style={{ marginBottom: 12 }}>
              <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 10 }}>{i + 1}. {q.q}</div>
              {q.options.map((opt, j) => {
                const chosen = answers[i];
                const isChosen = chosen === opt;
                const isCorrect = opt === q.answer;
                let cls = "quiz-option";
                if (chosen !== undefined) {
                  if (isCorrect) cls += " correct";
                  else if (isChosen) cls += " wrong";
                }
                return <button key={j} className={cls} onClick={() => selectAnswer(i, opt)}>{opt}</button>;
              })}
              {answers[i] !== undefined && (
                <div style={{ marginTop: 8, fontSize: 12, color: "#8899aa", background: "#0a1628", padding: "8px 10px", borderRadius: 8 }}>
                  💡 {q.explanation}
                </div>
              )}
            </div>
          ))}
        </div>
      ) : null)}

      {tab === "faith" && (loading ? <Loading text="Preparing Faith Insight..." /> : faith ? <div className="card faith-card"><div className="ai-text">{faith}</div></div> : null)}

      {tab === "ask" && (
        <div>
          <div style={{ marginBottom: 12 }}>
            {chatHistory.length === 0 && (
              <div className="card" style={{ textAlign: "center" }}>
                <div style={{ fontSize: 24 }}>💬</div>
                <div style={{ fontSize: 13, color: "#8899aa", marginTop: 6 }}>Ask me anything about <strong style={{ color: "#e8f0fe" }}>{topic}</strong></div>
              </div>
            )}
            {chatHistory.map((c, i) => (
              <div key={i} className={`chat-bubble ${c.role === "user" ? "chat-user" : "chat-ai"}`}>{c.text}</div>
            ))}
            {chatLoading && <Loading text="Tutor is responding..." />}
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <textarea rows={2} value={chatMsg} onChange={e => setChatMsg(e.target.value)} placeholder="Ask a question about this topic..." />
            <button onClick={sendChat} style={{ padding: "0 16px", background: "#f0a500", border: "none", borderRadius: 10, fontSize: 18, cursor: "pointer" }}>➤</button>
          </div>
        </div>
      )}
    </div>
  );
                   }


function TeacherPage({ classLevel }) {
  const [topic, setTopic] = useState("");
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(false);

  async function generatePlan() {
    if (!topic.trim()) return;
    setLoading(true); setPlan(null);
    const sys = `You are an expert Nigerian secondary school CRS teacher. Create detailed, curriculum-compliant lesson plans for ${classLevel}.`;
    const text = await callClaude(sys,
      `Create a CRS lesson plan for ${classLevel} on: "${topic}"

📋 LESSON PLAN: ${topic}

🎯 OBJECTIVES
1. [objective]
2. [objective]
3. [objective]

📚 MATERIALS NEEDED
[List materials]

⏱️ LESSON STRUCTURE (40 minutes)

INTRODUCTION (5 mins)
[Starter activity]

DEVELOPMENT (25 mins)
[Main teaching points with Bible references]

CONCLUSION (10 mins)
[Summary and assignment]

📝 ASSIGNMENT
[Task for students]

📖 REFERENCES
[Bible passages and textbook references]`
    );
    setPlan(text);
    setLoading(false);
  }

  return (
    <div className="section">
      <p className="page-title">👩‍🏫 Teacher's Corner</p>
      <p className="page-sub">AI-powered CRS lesson plans for {classLevel}</p>
      <div className="card">
        <div className="section-label">Choose or Type a Topic</div>
        <select onChange={e => setTopic(e.target.value)} value={topic}
          style={{ width: "100%", padding: "10px", borderRadius: 8, border: "1px solid #1e3a5f", background: "#111827", color: "#e8f0fe", fontFamily: "Nunito,sans-serif", fontSize: 13, marginBottom: 8 }}>
          <option value="">-- Select a curriculum topic --</option>
          {CURRICULUM[classLevel].map((t, i) => <option key={i} value={t}>{t}</option>)}
        </select>
        <textarea rows={2} value={topic} onChange={e => setTopic(e.target.value)} placeholder="Or type your own topic..." />
        <button className="btn btn-gold" style={{ marginTop: 10 }} onClick={generatePlan} disabled={loading}>
          {loading ? "⏳ Generating..." : "🗒️ Generate Lesson Plan"}
        </button>
      </div>
      {loading && <Loading text="Creating your lesson plan..." />}
      {plan && <div className="card lesson-plan-card"><div className="ai-text">{plan}</div></div>}
    </div>
  );
}

function ExamPrepPage({ classLevel }) {
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(false);

  async function generate(type) {
    setContent(null); setLoading(true);
    const sys = `You are a WAEC/NECO CRS exam specialist for Nigerian secondary school students (${classLevel}).`;
    let prompt = "";
    if (type === "essay") {
      prompt = `Generate 3 WAEC/NECO CRS essay questions for ${classLevel} with model answers. Format each as:\n\nQUESTION [N]:\n[Question]\n\nMODEL ANSWER:\n[Answer with Bible references]\n\n---`;
    } else if (type === "obj") {
      prompt = `Generate 10 WAEC/NECO style objective questions for ${classLevel} CRS with answers. Number 1-10, options A-D, mark correct answer.`;
    } else {
      prompt = `Create a ${classLevel} CRS revision summary covering all major topics in the Nigerian curriculum. Include key Bible references and likely exam focus areas.`;
    }
    const text = await callClaude(sys, prompt);
    setContent(text); setLoading(false);
  }

  return (
    <div className="section">
      <p className="page-title">🎓 Exam Prep</p>
      <p className="page-sub">WAEC & NECO CRS preparation for {classLevel}</p>
      <button className="btn btn-gold" onClick={() => generate("essay")}>📝 Essay Questions & Answers</button>
      <button className="btn btn-blue" onClick={() => generate("obj")}>🔵 Objective Questions (10)</button>
      <button className="btn btn-outline" onClick={() => generate("revision")}>📋 Revision Summary</button>
      {loading && <Loading text="Generating exam materials..." />}
      {content && <div className="card"><div className="ai-text">{content}</div></div>}
    </div>
  );
}

function DevotionalPage() {
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => { loadDevotional(); }, []);

  async function loadDevotional() {
    setLoading(true); setContent(null);
    const day = new Date().toLocaleDateString("en-NG", { weekday: "long", year: "numeric", month: "long", day: "numeric" });
    const sys = `You are a warm Nigerian Christian devotional writer for secondary school students.`;
    const text = await callClaude(sys,
      `Write a daily devotional for Nigerian Christian secondary school students for ${day}.

📅 ${day}

📖 SCRIPTURE OF THE DAY
[Bible verse with reference]

✨ DEVOTIONAL
[Encouraging message about 100 words relevant to student life]

🙏 PRAYER
[Short sincere prayer]

✨ POSITIVE CONFESSION
[Declaration based on Scripture. Start with "I am..." or "I have..." or "I can..."]

💭 REFLECT
[One reflection question]`
    );
    setContent(text); setLoading(false);
  }

  return (
    <div className="section">
      <p className="page-title">🕊️ Daily Devotional</p>
      <p className="page-sub">Faith for the Nigerian student · Updated daily</p>
      {loading ? <Loading text="Preparing today's devotional..." /> : content ? (
        <>
          <div className="card faith-card"><div className="ai-text">{content}</div></div>
          <button className="btn btn-outline" onClick={loadDevotional}>🔄 Refresh</button>
        </>
      ) : null}
    </div>
  );
            }

export default function App() {
  const [nav, setNav] = useState("home");
  const [classLevel, setClassLevel] = useState("SS1");
  const [selectedTopic, setSelectedTopic] = useState(null);

  const navItems = [
    { id: "home", icon: "🏠", label: "Home" },
    { id: "learn", icon: "📖", label: "Learn" },
    { id: "exam", icon: "🎓", label: "Exam" },
    { id: "teacher", icon: "👩‍🏫", label: "Teacher" },
    { id: "devotional", icon: "🕊️", label: "Daily" },
  ];

  function renderHome() {
    const totalTopics = Object.values(CURRICULUM).flat().length;
    return (
      <>
        <div className="home-hero">
          <span className="hero-emoji">✝️</span>
          <h1 className="hero-title">CRSAlive</h1>
          <p className="hero-sub">Nigerian CRS Curriculum · AI-Powered · SS1–SS3</p>
          <div className="stats-row">
            <div className="stat-box"><div className="stat-num">{totalTopics}</div><div className="stat-label">Topics</div></div>
            <div className="stat-box"><div className="stat-num">3</div><div className="stat-label">Classes</div></div>
            <div className="stat-box"><div className="stat-num">AI</div><div className="stat-label">Powered</div></div>
          </div>
        </div>
        <div className="section">
          <div className="card" style={{ background: "linear-gradient(135deg,#1a1040 0%,#0a1628 100%)", borderColor: "#3b1f7f", marginBottom: 12 }}>
            <div className="section-label">✨ Faith Insight Available</div>
            <div style={{ fontSize: 13, color: "#8899aa" }}>Every topic includes spiritual reflections, positive confessions & daily devotionals</div>
          </div>
          <div className="section-label">Quick Access</div>
          <button className="btn btn-gold" onClick={() => setNav("learn")}>📖 Start Learning</button>
          <button className="btn btn-blue" onClick={() => setNav("exam")}>🎓 Exam Preparation</button>
          <button className="btn btn-outline" onClick={() => setNav("devotional")}>🕊️ Today's Devotional</button>
          <button className="btn" style={{ background: "#1a2a1a", color: "#06d6a0", border: "1px solid #06d6a0" }} onClick={() => setNav("teacher")}>👩‍🏫 Teacher's Corner</button>
          <div className="card" style={{ marginTop: 4 }}>
            <div className="section-label">Curriculum Classes</div>
            {["SS1", "SS2", "SS3"].map(cl => (
              <div key={cl} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: "1px solid #1e3a5f" }}>
                <span style={{ fontSize: 14, fontWeight: 700 }}>{cl}</span>
                <span style={{ fontSize: 12, color: "#8899aa" }}>{CURRICULUM[cl].length} topics</span>
                <button onClick={() => { setClassLevel(cl); setNav("learn"); }}
                  style={{ padding: "4px 12px", borderRadius: 6, border: "1px solid #f0a500", background: "transparent", color: "#f0a500", fontSize: 12, cursor: "pointer", fontFamily: "Nunito,sans-serif" }}>Open →</button>
              </div>
            ))}
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <style>{css}</style>
      <div className="app">
        <div className="header">
          <div className="header-title">✝️ CRSAlive</div>
          <div className="header-sub">Nigerian Curriculum · SS1–SS3 · AI-Powered</div>
          {(nav === "learn" || nav === "exam" || nav === "teacher") && (
            <div className="class-tabs">
              {["SS1", "SS2", "SS3"].map(cl => (
                <button key={cl} className={`class-tab ${classLevel === cl ? "active" : ""}`}
                  onClick={() => { setClassLevel(cl); setSelectedTopic(null); }}>
                  {cl}
                </button>
              ))}
            </div>
          )}
        </div>

        {nav === "home" && renderHome()}
        {nav === "learn" && (
          selectedTopic
            ? <TopicLesson topic={selectedTopic} classLevel={classLevel} onBack={() => setSelectedTopic(null)} />
            : <TopicList classLevel={classLevel} onSelect={setSelectedTopic} />
        )}
        {nav === "exam" && <ExamPrepPage classLevel={classLevel} />}
        {nav === "teacher" && <TeacherPage classLevel={classLevel} />}
        {nav === "devotional" && <DevotionalPage />}

        <nav className="nav">
          {navItems.map(n => (
            <button key={n.id} className={`nav-btn ${nav === n.id ? "active" : ""}`}
              onClick={() => { setNav(n.id); setSelectedTopic(null); }}>
              <span className="nav-icon">{n.icon}</span>
              {n.label}
            </button>
          ))}
        </nav>
      </div>
    </>
  );
      }

