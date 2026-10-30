import React, { useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  MessageCircle, Search, UserRound, Menu, X, Plus, Flame, Users,
  Trophy, BarChart3, ArrowRight, ThumbsUp, Clock3, ChevronDown,
  GraduationCap, Globe2, Smartphone, Landmark, Utensils, Bot,
  Laptop, CheckCircle2, Send, LogIn
} from "lucide-react";
import "./styles.css";

const starterDebates = [
  { id: 1, title: "Is online learning better than traditional learning?", category: "Education", tags: ["Education", "Technology"], comments: 12, participants: 34, image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=900&q=80", sideA: 21, sideB: 13, description: "Does digital learning offer more flexibility and better outcomes, or is the classroom experience still essential?" },
  { id: 2, title: "Should countries do more to combat climate change?", category: "Environment", tags: ["Environment", "Politics"], comments: 18, participants: 41, image: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=900&q=80", sideA: 30, sideB: 11, description: "Explore the balance between environmental responsibility, economic growth, and individual choice." },
  { id: 3, title: "Are social media platforms more harmful than helpful?", category: "Technology", tags: ["Technology", "Society"], comments: 14, participants: 37, image: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&w=900&q=80", sideA: 19, sideB: 18, description: "Do social platforms bring people together, or do their risks outweigh the benefits?" },
  { id: 4, title: "Should voting be mandatory for all citizens?", category: "Politics", tags: ["Politics", "Society"], comments: 9, participants: 28, image: "https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?auto=format&fit=crop&w=900&q=80", sideA: 15, sideB: 13, description: "Would mandatory voting strengthen democracy or limit personal freedom?" },
  { id: 5, title: "Should fast food be banned in schools?", category: "Health", tags: ["Health", "Education"], comments: 11, participants: 26, image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=900&q=80", sideA: 17, sideB: 9, description: "Consider student health, personal choice, and the role schools should play in nutrition." },
  { id: 6, title: "Will AI replace human jobs in the future?", category: "Technology", tags: ["Technology", "Jobs"], comments: 16, participants: 39, image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=900&q=80", sideA: 22, sideB: 17, description: "Will automation create more opportunities than it removes, and how should workers prepare?" }
];

const tagClass = (tag) => ({
  Education: "blue", Technology: "blue", Environment: "green", Politics: "red",
  Society: "purple", Health: "orange", Jobs: "purple"
}[tag] || "blue");

function App() {
  const [debates, setDebates] = useState(starterDebates);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All topics");
  const [activeTab, setActiveTab] = useState("Home");
  const [selected, setSelected] = useState(null);
  const [showCreate, setShowCreate] = useState(false);
  const [showAuth, setShowAuth] = useState("");
  const [mobileMenu, setMobileMenu] = useState(false);
  const [toast, setToast] = useState("");
  const [votes, setVotes] = useState({});
  const [comments, setComments] = useState({});
  const [commentText, setCommentText] = useState("");
  const [newDebate, setNewDebate] = useState({ title: "", category: "Education", description: "" });

  const filtered = useMemo(() => debates.filter(d => {
    const matchesQuery = `${d.title} ${d.tags.join(" ")} ${d.description}`.toLowerCase().includes(query.toLowerCase());
    const matchesCategory = category === "All topics" || d.tags.includes(category);
    return matchesQuery && matchesCategory;
  }), [debates, query, category]);

  const notify = (message) => {
    setToast(message);
    window.setTimeout(() => setToast(""), 2600);
  };

  const submitDebate = (e) => {
    e.preventDefault();
    if (!newDebate.title.trim()) return;
    const item = {
      id: Date.now(), title: newDebate.title.trim(), category: newDebate.category,
      tags: [newDebate.category], comments: 0, participants: 1,
      image: "https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=900&q=80",
      sideA: 1, sideB: 0, description: newDebate.description.trim() || "Share your perspective and support your argument with evidence."
    };
    setDebates(prev => [item, ...prev]);
    setNewDebate({ title: "", category: "Education", description: "" });
    setShowCreate(false);
    setCategory("All topics");
    setQuery("");
    setActiveTab("Debates");
    notify("Your debate has been created!");
  };

  const castVote = (side) => {
    if (!selected) return;
    if (votes[selected.id]) { notify("You've already voted on this debate."); return; }
    setVotes(prev => ({ ...prev, [selected.id]: side }));
    setDebates(prev => prev.map(d => d.id === selected.id ? { ...d, [side === "for" ? "sideA" : "sideB"]: d[side === "for" ? "sideA" : "sideB"] + 1, participants: d.participants + 1 } : d));
    notify("Vote submitted — thanks for joining the discussion!");
  };

  const submitComment = (e) => {
    e.preventDefault();
    if (!commentText.trim() || !selected) return;
    setComments(prev => ({ ...prev, [selected.id]: [...(prev[selected.id] || []), commentText.trim()] }));
    setDebates(prev => prev.map(d => d.id === selected.id ? { ...d, comments: d.comments + 1 } : d));
    setCommentText("");
  };

  const goToDebates = () => { setActiveTab("Debates"); document.getElementById("debates")?.scrollIntoView({ behavior: "smooth" }); };
  const openCreate = () => { setShowCreate(true); setActiveTab("Create Debate"); setMobileMenu(false); };

  return (
    <div className="app-shell">
      <header className="topbar">
        <a className="brand" href="#" onClick={() => { setActiveTab("Home"); setCategory("All topics"); }}>
          <span className="brand-icon"><MessageCircle size={25} fill="currentColor" /></span>
          <span>Debate<span className="brand-blue">Hub</span></span>
        </a>
        <button className="mobile-toggle" aria-label="Toggle menu" onClick={() => setMobileMenu(!mobileMenu)}>{mobileMenu ? <X /> : <Menu />}</button>
        <nav className={`nav-links ${mobileMenu ? "nav-open" : ""}`}>
          {["Home", "Debates", "Create Debate", "Leaderboard"].map(item => (
            <button key={item} className={activeTab === item ? "nav-link active" : "nav-link"} onClick={() => {
              if (item === "Create Debate") openCreate();
              else { setActiveTab(item); setMobileMenu(false); if (item === "Debates") goToDebates(); }
            }}>{item}</button>
          ))}
        </nav>
        <div className="top-actions">
          <label className="search-box"><Search size={18} /><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search debates..." aria-label="Search debates" /><kbd>⌘ K</kbd></label>
          <button className="login-link" onClick={() => setShowAuth("Login")}><UserRound size={19} /> <span>Login</span></button>
          <button className="btn btn-primary signup-top" onClick={() => setShowAuth("Sign Up")}>Sign Up</button>
        </div>
      </header>

      <main className="page-layout">
        <section className="main-column">
          <section className="hero">
            <div className="hero-copy">
              <span className="eyebrow"><span className="eyebrow-dot" /> THE PLACE FOR BIG IDEAS</span>
              <h1>Better Arguments.<br /><span>A Stronger Tomorrow.</span></h1>
              <p>Join debates, share your perspective, and be part of a community that values critical thinking and respectful discussion.</p>
              <div className="hero-actions">
                <button className="btn btn-primary" onClick={goToDebates}>Explore Debates <ArrowRight size={17} /></button>
                <button className="btn btn-outline-light" onClick={openCreate}><Plus size={17} /> Create a Debate</button>
              </div>
              <div className="hero-proof"><div className="avatar-stack"><span>JM</span><span>AK</span><span>LW</span><span>+</span></div><div><strong>Join 2,400+ curious minds</strong><small>Think critically. Debate respectfully.</small></div></div>
            </div>
            <div className="hero-art" aria-hidden="true">
              <div className="art-orbit orbit-one"></div><div className="art-orbit orbit-two"></div>
              <div className="speech speech-blue"><span></span><span></span><span></span></div>
              <div className="speech speech-red"><span></span><span></span><span></span></div>
              <div className="podium podium-blue"><b>FOR</b></div><div className="podium podium-red"><b>AGAINST</b></div>
              <div className="spark spark-one">✦</div><div className="spark spark-two">✦</div><div className="spark spark-three">•</div>
            </div>
          </section>

          <section className="debate-section" id="debates">
            <div className="section-heading">
              <div><span className="section-icon"><Flame size={24} fill="currentColor" /></span><div><h2>{activeTab === "Leaderboard" ? "Community Leaderboard" : "Popular Debates"}</h2><p className="section-subtitle">Ideas worth talking about today</p></div></div>
              <button className="text-link" onClick={() => { setCategory("All topics"); setQuery(""); setActiveTab("Debates"); }}>View all <ArrowRight size={16} /></button>
            </div>
            <div className="filter-row">
              {["All topics", "Education", "Technology", "Environment", "Politics", "Society"].map(c => <button key={c} onClick={() => setCategory(c)} className={`filter-chip ${category === c ? "selected" : ""}`}>{c}</button>)}
              <button className="sort-button" onClick={() => setDebates(prev => [...prev].reverse())}>Latest <ChevronDown size={15} /></button>
            </div>
            {activeTab === "Leaderboard" ? (
              <div className="leaderboard-full">
                {[["1","AlexT","1,250","AT"],["2","DebateQueen","980","DQ"],["3","Thinker123","870","T1"],["4","LogicLord","760","LL"],["5","TruthSeeker","690","TS"]].map((u,i) => <div className="leader-row" key={u[1]}><span className={`rank rank-${i+1}`}>{u[0]}</span><span className="avatar">{u[3]}</span><div className="leader-name"><strong>{u[1]}</strong><small>Thoughtful contributor</small></div><b>{u[2]} pts</b></div>)}
              </div>
            ) : (
              <div className="debate-grid">
                {filtered.map((debate, index) => <article className="debate-card" key={debate.id}>
                  <button className="card-image-button" onClick={() => setSelected(debate)} aria-label={`Open ${debate.title}`}><img src={debate.image} alt="" className="card-image" loading={index > 2 ? "lazy" : "eager"} /><span className="image-overlay"><span>Explore topic <ArrowRight size={15} /></span></span></button>
                  <div className="card-body">
                    <div className="card-tags">{debate.tags.map(tag => <span key={tag} className={`tag ${tagClass(tag)}`}>{tag}</span>)}</div>
                    <button className="card-title" onClick={() => setSelected(debate)}>{debate.title}</button>
                    <div className="card-meta"><span><MessageCircle size={15} /> {debate.comments} comments</span><span><Users size={15} /> {debate.participants} participants</span></div>
                    <div className="card-footer"><span className="live-dot"></span><span>Open for discussion</span><button onClick={() => setSelected(debate)} className="join-button">Join debate <ArrowRight size={15} /></button></div>
                  </div>
                </article>)}
              </div>
            )}
            {filtered.length === 0 && activeTab !== "Leaderboard" && <div className="empty-state"><Search size={30} /><h3>No debates found</h3><p>Try another search or choose a different topic.</p><button className="btn btn-primary" onClick={() => { setQuery(""); setCategory("All topics"); }}>Clear filters</button></div>}
          </section>
        </section>

        <aside className="sidebar">
          <section className="welcome-panel">
            <div className="welcome-top"><div className="guest-avatar"><UserRound size={34} /></div><div><h3>Welcome, Guest!</h3><p>Join the discussion and make your voice heard.</p></div></div>
            <div className="welcome-actions"><button className="btn btn-primary" onClick={() => setShowAuth("Sign Up")}>Create free account</button><button className="btn btn-outline" onClick={() => setShowAuth("Login")}>Login</button></div>
            <div className="welcome-foot"><CheckCircle2 size={14} /> Free to join · Always respectful</div>
          </section>
          <section className="side-panel">
            <div className="side-title"><Trophy size={19} /><h3>Top Debaters</h3><button onClick={() => { setActiveTab("Leaderboard"); document.getElementById("debates")?.scrollIntoView({ behavior: "smooth" }); }}>See all</button></div>
            {[["1","AlexT","1,250","AT"],["2","DebateQueen","980","DQ"],["3","Thinker123","870","T1"],["4","LogicLord","760","LL"],["5","TruthSeeker","690","TS"]].map((u,i) => <div className="mini-leader" key={u[1]}><span className={`rank rank-${i+1}`}>{u[0]}</span><span className={`mini-avatar av-${i}`}>{u[3]}</span><div><strong>{u[1]}</strong><small>{u[2]} points</small></div><span className="leader-badge">{i === 0 ? "✦" : ""}</span></div>)}
          </section>
          <section className="side-panel stats-panel">
            <div className="side-title"><BarChart3 size={19} /><h3>Community Stats</h3></div>
            <div className="stat-line"><span><MessageCircle size={17} /> Total debates</span><strong>{debates.length + 6}</strong></div>
            <div className="stat-line"><span><Users size={17} /> Active members</span><strong>2,408</strong></div>
            <div className="stat-line"><span><ThumbsUp size={17} /> Votes cast</span><strong>{Object.keys(votes).length + 142}</strong></div>
          </section>
          <section className="quote-panel"><span className="quote-mark">“</span><p>The aim of argument, or of discussion, should not be victory, but progress.</p><small>— Joseph Joubert</small></section>
          <section className="side-cta"><div className="cta-icon"><GraduationCap size={22} /></div><h3>Your voice matters.</h3><p>Start a conversation that challenges ideas and inspires change.</p><button onClick={openCreate}>Start a debate <ArrowRight size={15} /></button></section>
        </aside>
      </main>
      <footer className="footer"><a className="brand footer-brand" href="#"><span className="brand-icon"><MessageCircle size={20} fill="currentColor" /></span><span>Debate<span className="brand-blue">Hub</span></span></a><span>© 2026 DebateHub. Think freely. Debate respectfully.</span><div><a href="#debates">Explore</a><a href="#debates">Community guidelines</a><a href="#debates">About</a></div></footer>

      {showCreate && <div className="modal-backdrop" onClick={() => setShowCreate(false)}><section className="modal" onClick={e => e.stopPropagation()}><button className="modal-close" onClick={() => setShowCreate(false)} aria-label="Close"><X /></button><div className="modal-icon"><Plus /></div><h2>Create a debate</h2><p className="modal-intro">Ask a thoughtful question and invite the community to weigh in.</p><form onSubmit={submitDebate} className="modal-form"><label>Debate topic<input required maxLength="120" placeholder="e.g. Should university education be free?" value={newDebate.title} onChange={e => setNewDebate({ ...newDebate, title: e.target.value })} /></label><label>Category<select value={newDebate.category} onChange={e => setNewDebate({ ...newDebate, category: e.target.value })}>{["Education","Technology","Environment","Politics","Society","Health","Jobs"].map(c => <option key={c}>{c}</option>)}</select></label><label>Background (optional)<textarea rows="3" placeholder="Add a little context to get the conversation started..." value={newDebate.description} onChange={e => setNewDebate({ ...newDebate, description: e.target.value })} /></label><button className="btn btn-primary modal-submit" type="submit">Publish debate <ArrowRight size={16} /></button></form></section></div>}

      {showAuth && <div className="modal-backdrop" onClick={() => setShowAuth("")}><section className="modal auth-modal" onClick={e => e.stopPropagation()}><button className="modal-close" onClick={() => setShowAuth("")} aria-label="Close"><X /></button><div className="modal-icon"><UserRound /></div><h2>{showAuth === "Login" ? "Welcome back" : "Join the conversation"}</h2><p className="modal-intro">{showAuth === "Login" ? "Sign in to continue debating." : "Create your free DebateHub account."}</p><form className="modal-form" onSubmit={e => { e.preventDefault(); setShowAuth(""); notify("Demo only: account sign-in is not connected yet."); }}><label>Email address<input type="email" required placeholder="you@example.com" /></label><label>Password<input type="password" required minLength="6" placeholder="At least 6 characters" /></label><button className="btn btn-primary modal-submit" type="submit"><LogIn size={16} /> {showAuth === "Login" ? "Login" : "Create account"}</button></form><p className="auth-switch">{showAuth === "Login" ? "New to DebateHub?" : "Already have an account?"} <button onClick={() => setShowAuth(showAuth === "Login" ? "Sign Up" : "Login")}>{showAuth === "Login" ? "Sign up" : "Login"}</button></p></section></div>}

      {selected && <div className="modal-backdrop" onClick={() => setSelected(null)}><section className="modal debate-modal" onClick={e => e.stopPropagation()}><button className="modal-close" onClick={() => setSelected(null)} aria-label="Close"><X /></button><img src={selected.image} alt="" className="detail-image" /><div className="card-tags detail-tags">{selected.tags.map(tag => <span key={tag} className={`tag ${tagClass(tag)}`}>{tag}</span>)}</div><h2>{selected.title}</h2><p className="modal-intro">{selected.description}</p><div className="vote-heading"><strong>Which side do you support?</strong><span>{selected.participants} participants</span></div><div className="vote-options"><button className={`vote-option for ${votes[selected.id] === "for" ? "voted" : ""}`} onClick={() => castVote("for")}><span>FOR</span><strong>{selected.sideA}</strong><small>Support this idea</small></button><button className={`vote-option against ${votes[selected.id] === "against" ? "voted" : ""}`} onClick={() => castVote("against")}><span>AGAINST</span><strong>{selected.sideB}</strong><small>Challenge this idea</small></button></div><div className="comment-section"><h3><MessageCircle size={17} /> Discussion ({selected.comments})</h3>{(comments[selected.id] || []).map((c,i) => <div className="comment" key={i}><span className="comment-avatar">G</span><p>{c}<small>Guest · just now</small></p></div>)}<form className="comment-form" onSubmit={submitComment}><input value={commentText} onChange={e => setCommentText(e.target.value)} placeholder="Share a thoughtful argument..." aria-label="Write a comment" /><button type="submit" aria-label="Post comment"><Send size={17} /></button></form><small className="guideline-note">Keep it respectful. Back up your claims with evidence.</small></div></section></div>}

      {toast && <div className="toast"><CheckCircle2 size={18} /> {toast}</div>}
    </div>
  );
}

createRoot(document.getElementById("root")).render(<App />);
