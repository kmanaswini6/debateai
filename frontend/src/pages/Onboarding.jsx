import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';

const TOPICS = ['Tech & AI','Education','Society','Politics','Career','Environment','Philosophy','Sports'];

export default function Onboarding() {
  const [goal, setGoal] = useState('');
  const [difficulty, setDifficulty] = useState('');
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const toggleTopic = (t) => setTopics(prev => prev.includes(t) ? prev.filter(x=>x!==t) : [...prev,t]);

  const handleSubmit = async () => {
    if (!goal || !difficulty || topics.length === 0) return alert('Please complete all steps');
    setLoading(true);
    try {
      await api.post('/auth/onboarding', { goal, preferredDifficulty: difficulty, favoriteTopics: topics });
      navigate('/dashboard');
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  const s = {card:{background:'var(--surface2)',border:'1.5px solid var(--border)',borderRadius:'var(--r)',padding:'14px 18px',cursor:'pointer',transition:'all .15s',marginBottom:8}};

  return (
    <div className="auth-page" style={{alignItems:'flex-start',paddingTop:40}}>
      <div className="auth-card" style={{maxWidth:520}}>
        <div className="auth-logo"><div className="logo-mark">D</div><div className="logo-name">Debate<span style={{color:'var(--accent)'}}>AI</span></div></div>
        <div className="auth-title">Quick setup</div>
        <div className="auth-sub" style={{marginBottom:28}}>Personalize your experience</div>

        <div style={{marginBottom:24}}>
          <div className="form-label" style={{marginBottom:10,fontSize:13}}>What's your debate goal?</div>
          {['Placement GD','Public Speaking','Academic','Fun'].map(g=>(
            <div key={g} style={{...s.card,borderColor:goal===g?'var(--accent)':'var(--border)',background:goal===g?'var(--accent-dim)':'var(--surface2)'}} onClick={()=>setGoal(g)}>
              <div style={{fontSize:13,fontWeight:500,color:goal===g?'var(--accent)':'var(--text)'}}>{g}</div>
            </div>
          ))}
        </div>

        <div style={{marginBottom:24}}>
          <div className="form-label" style={{marginBottom:10,fontSize:13}}>Preferred difficulty</div>
          <div style={{display:'flex',gap:10}}>
            {['Easy','Medium','Hard'].map(d=>(
              <div key={d} style={{flex:1,textAlign:'center',padding:'12px',border:`1.5px solid ${difficulty===d?'var(--accent)':'var(--border)'}`,borderRadius:'var(--r)',background:difficulty===d?'var(--accent-dim)':'var(--surface2)',cursor:'pointer',color:difficulty===d?'var(--accent)':'var(--text2)',fontWeight:600,fontSize:13}} onClick={()=>setDifficulty(d)}>{d}</div>
            ))}
          </div>
        </div>

        <div style={{marginBottom:28}}>
          <div className="form-label" style={{marginBottom:10,fontSize:13}}>Favorite topics (pick at least 1)</div>
          <div style={{display:'flex',flexWrap:'wrap',gap:8}}>
            {TOPICS.map(t=>(
              <div key={t} onClick={()=>toggleTopic(t)} style={{padding:'6px 14px',borderRadius:20,border:`1.5px solid ${topics.includes(t)?'var(--accent)':'var(--border)'}`,background:topics.includes(t)?'var(--accent-dim)':'var(--surface2)',color:topics.includes(t)?'var(--accent)':'var(--text2)',cursor:'pointer',fontSize:12.5,fontWeight:500}}>{t}</div>
            ))}
          </div>
        </div>

        <button className="btn btn-primary" onClick={handleSubmit} disabled={loading} style={{width:'100%',justifyContent:'center',padding:11}}>
          {loading ? 'Saving...' : 'Get Started →'}
        </button>
      </div>
    </div>
  );
}
