import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../utils/api';

export default function DebateRoom() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [debate, setDebate] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [typing, setTyping] = useState(false);
  const [timer, setTimer] = useState(60);
  const [round, setRound] = useState(1);
  const [hints, setHints] = useState(3);
  const [hint, setHint] = useState('');
  const [startTime] = useState(Date.now());
  const chatRef = useRef(null);
  const timerRef = useRef(null);

  useEffect(() => {
    api.get(`/debate/${id}`).then(r => {
      setDebate(r.data.debate);
      setMessages(r.data.debate.messages || []);
    }).catch(() => navigate('/dashboard'));
  }, [id]);

  useEffect(() => {
    timerRef.current = setInterval(() => setTimer(t => t > 0 ? t-1 : 0), 1000);
    return () => clearInterval(timerRef.current);
  }, []);

  useEffect(() => {
    if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight;
  }, [messages, typing]);

  const send = async () => {
    if (!input.trim() || loading) return;
    const msg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role:'user', content:msg }]);
    setTyping(true);
    setLoading(true);
    try {
      const res = await api.post('/debate/message', { debateId: id, message: msg });
      setMessages(prev => [...prev, { role:'ai', content:res.data.message, strength:res.data.strength }]);
      const newRound = Math.ceil((messages.length + 2) / 2);
      setRound(Math.min(newRound, debate?.rounds || 5));
      setTimer(60);
      // Check if debate is over
      if (newRound > (debate?.rounds || 5)) {
        setTimeout(() => finishDebate(), 500);
      }
    } catch(e) { alert('Error sending message'); }
    setTyping(false);
    setLoading(false);
  };

  const finishDebate = async () => {
    const duration = Math.floor((Date.now() - startTime) / 1000);
    try {
      const res = await api.post('/debate/finish', { debateId: id, duration });
      navigate(`/results/${id}`);
    } catch(e) { navigate(`/results/${id}`); }
  };

  const getHint = async () => {
    if (hints <= 0) return;
    try {
      const res = await api.post('/debate/hint', { debateId: id });
      setHint(res.data.hint);
      setHints(h => h-1);
    } catch(e) {}
  };

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); }
  };

  const totalRounds = debate?.rounds || 5;
  const fmt = s => `${Math.floor(s/60)}:${String(s%60).padStart(2,'0')}`;

  return (
    <div style={{height:'100vh',display:'flex',flexDirection:'column',background:'var(--bg)'}}>
      {/* Top bar */}
      <div style={{padding:'12px 22px',background:'var(--surface)',borderBottom:'0.5px solid var(--border)',display:'flex',alignItems:'center',justifyContent:'space-between'}}>
        <div>
          <div style={{fontSize:13.5,fontWeight:600}}>{debate?.topic || 'Loading...'}</div>
          <div style={{fontSize:11,color:'var(--muted)',marginTop:2}}>You are arguing: <strong style={{color:debate?.side==='For'?'var(--success)':'var(--error)'}}>{debate?.side}</strong></div>
        </div>
        <div style={{display:'flex',alignItems:'center',gap:10}}>
          <span style={{background:'var(--accent-dim)',color:'var(--accent)',fontSize:12,fontWeight:600,padding:'4px 12px',borderRadius:20}}>Round {round} of {totalRounds}</span>
          <span style={{background:timer<=10?'var(--error-dim)':'var(--warning-dim)',color:timer<=10?'var(--error)':'var(--warning)',fontSize:13,fontWeight:700,padding:'4px 12px',borderRadius:20,fontFamily:'Syne,sans-serif',animation:timer<=10?'pulse 1s infinite':'none'}}>{fmt(timer)}</span>
          <button className="btn btn-sm" style={{background:'var(--error-dim)',color:'var(--error)',border:'0.5px solid rgba(248,113,113,.25)'}} onClick={()=>{if(confirm('Forfeit?'))finishDebate()}}>Forfeit</button>
        </div>
      </div>

      {/* Round progress */}
      <div style={{display:'flex',gap:4,padding:'8px 22px',background:'var(--surface2)',borderBottom:'0.5px solid var(--border)'}}>
        {Array.from({length:totalRounds}).map((_,i)=>(
          <div key={i} style={{flex:1,height:4,borderRadius:2,background:i<round-1?'var(--accent)':i===round-1?'var(--warning)':'var(--border2)',boxShadow:i<round?'0 0 6px var(--accent-glow)':'none'}}/>
        ))}
      </div>

      {/* Chat */}
      <div ref={chatRef} style={{flex:1,overflowY:'auto',padding:'18px 22px',display:'flex',flexDirection:'column',gap:16}}>
        {messages.length === 0 && (
          <div style={{textAlign:'center',padding:'40px 0',color:'var(--muted)'}}>
            <div style={{fontSize:28,marginBottom:8}}>🎤</div>
            <div style={{fontSize:13}}>Make your opening argument!</div>
          </div>
        )}
        {messages.map((m,i) => (
          <div key={i} style={{display:'flex',flexDirection:'column',alignItems:m.role==='user'?'flex-end':'flex-start'}}>
            <div style={{fontSize:10,textTransform:'uppercase',letterSpacing:'.9px',color:'var(--muted)',marginBottom:5}}>{m.role==='ai'?'AI Opponent':'You'}</div>
            <div style={{maxWidth:'68%',padding:'12px 16px',borderRadius:m.role==='ai'?'4px 14px 14px 14px':'14px 4px 14px 14px',background:m.role==='ai'?'var(--surface3)':'var(--accent)',border:m.role==='ai'?'0.5px solid var(--border2)':'none',fontSize:13.5,lineHeight:1.55,color:'var(--text)'}}>
              {m.content}
            </div>
            {m.role==='ai'&&m.strength&&(
              <div style={{display:'flex',alignItems:'center',gap:7,marginTop:6}}>
                <span style={{fontSize:10,color:'var(--muted)'}}>Argument strength</span>
                <div style={{width:90,height:3,background:'var(--border2)',borderRadius:2}}>
                  <div style={{height:'100%',width:`${m.strength*10}%`,background:'var(--warning)',borderRadius:2}}/>
                </div>
                <span style={{fontSize:10,color:'var(--warning)',fontWeight:600}}>{m.strength}/10</span>
              </div>
            )}
          </div>
        ))}
        {typing && (
          <div style={{display:'flex',flexDirection:'column',alignItems:'flex-start'}}>
            <div style={{fontSize:10,textTransform:'uppercase',letterSpacing:'.9px',color:'var(--muted)',marginBottom:5}}>AI Opponent</div>
            <div style={{padding:'12px 16px',background:'var(--surface3)',border:'0.5px solid var(--border2)',borderRadius:'4px 14px 14px 14px',display:'flex',gap:5,alignItems:'center'}}>
              {[0,200,400].map(d=><div key={d} style={{width:7,height:7,borderRadius:'50%',background:'var(--muted)',animation:`tdot 1.2s ${d}ms ease-in-out infinite`}}/>)}
            </div>
          </div>
        )}
      </div>

      {/* Hint */}
      <div style={{padding:'8px 22px',borderTop:'0.5px solid var(--border)',background:'var(--surface)',display:'flex',alignItems:'flex-start',gap:10,flexDirection:'column'}}>
        <div style={{display:'flex',alignItems:'center',gap:10,width:'100%'}}>
          <span style={{fontSize:12,color:'var(--muted)'}}>Hints: {hints} remaining</span>
          <button onClick={getHint} disabled={hints<=0} style={{background:'var(--warning-dim)',color:'var(--warning)',border:'0.5px solid rgba(251,191,36,.25)',padding:'4px 11px',borderRadius:20,fontSize:12,cursor:hints>0?'pointer':'not-allowed',opacity:hints>0?1:.5,fontFamily:'inherit'}}>💡 Need a hint?</button>
        </div>
        {hint&&<div style={{background:'var(--warning-dim)',border:'0.5px solid rgba(251,191,36,.2)',borderRadius:'var(--r-sm)',padding:'10px 14px',fontSize:12.5,color:'var(--text2)',width:'100%'}}>{hint}</div>}
      </div>

      {/* Input */}
      <div style={{padding:'14px 22px',borderTop:'0.5px solid var(--border)',background:'var(--surface)'}}>
        <div style={{display:'flex',gap:10,alignItems:'flex-end'}}>
          <textarea value={input} onChange={e=>setInput(e.target.value)} onKeyDown={handleKey} placeholder="Type your argument... (Enter to send, Shift+Enter for new line)" style={{flex:1,background:'var(--surface2)',border:'0.5px solid var(--border2)',borderRadius:10,padding:'10px 14px',color:'var(--text)',fontSize:13,fontFamily:'inherit',resize:'none',minHeight:44,maxHeight:100,lineHeight:1.55,outline:'none'}} maxLength={500}/>
          <button onClick={send} disabled={loading||!input.trim()} style={{width:40,height:40,borderRadius:10,background:'var(--accent)',border:'none',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0,opacity:input.trim()?1:.5}}>
            <svg width="16" height="16" fill="none" stroke="white" strokeWidth="2" viewBox="0 0 16 16"><path d="M2 8h12M9 3l5 5-5 5"/></svg>
          </button>
        </div>
        <div style={{fontSize:11,color:'var(--muted)',marginTop:5,textAlign:'right'}}>{input.length}/500</div>
        <div style={{display:'flex',justifyContent:'center',marginTop:8}}>
          <button className="btn btn-primary btn-sm" onClick={finishDebate} style={{fontSize:11,padding:'4px 14px',background:'var(--surface3)',color:'var(--text2)',border:'0.5px solid var(--border2)'}}>End & Get Results</button>
        </div>
      </div>
      <style>{`@keyframes tdot{0%,80%,100%{transform:translateY(0);opacity:.5}40%{transform:translateY(-5px);opacity:1}}@keyframes pulse{0%,100%{opacity:1}50%{opacity:.5}}`}</style>
    </div>
  );
}
