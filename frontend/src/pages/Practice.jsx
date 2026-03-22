import { useState } from 'react';
import Layout from '../components/Layout';

export default function Practice() {
  const [msgs, setMsgs] = useState([{role:'ai',content:"Hi! I'm your debate coach. Pick a topic and let's explore different argument angles together. What do you want to practice today?"}]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);

  const RESPONSES = [
    "Great point! Think about the historical precedent here. What counterarguments do you anticipate from the opposition?",
    "Good angle. Now try to back that up with a specific statistic or example. Strong debaters always have evidence ready.",
    "Interesting! Have you considered the opposing side's strongest argument? Knowing it helps you preemptively address it.",
    "That's a solid argument. Now think about how to make it more concise — in real debates, brevity is power.",
    "Well framed. Try rephrasing this using an analogy — it makes abstract arguments immediately relatable to judges.",
  ];
  let responseIdx = 0;

  const send = () => {
    if (!input.trim()) return;
    const msg = input.trim(); setInput('');
    setMsgs(p=>[...p,{role:'user',content:msg}]);
    setTyping(true);
    setTimeout(()=>{
      setMsgs(p=>[...p,{role:'ai',content:RESPONSES[responseIdx % RESPONSES.length]}]);
      responseIdx++;
      setTyping(false);
    },1400);
  };

  const CHIPS = ['Try a historical analogy','Use a statistics-based point','Appeal to human values','Counter with an exception','Use a real-world example'];

  return (
    <Layout title="Practice Mode">
      <div style={{background:'var(--success-dim)',border:'0.5px solid rgba(52,211,153,.2)',borderRadius:'var(--r)',padding:'16px 20px',marginBottom:20,display:'flex',alignItems:'center',gap:12}}>
        <span style={{fontSize:20}}>🧘</span>
        <div><div style={{fontSize:13.5,fontWeight:600,color:'var(--success)',marginBottom:2}}>No scoring. No pressure.</div><div style={{fontSize:12.5,color:'var(--text2)'}}>Chat freely with your AI debate coach — learn techniques, explore argument angles.</div></div>
      </div>

      <div style={{display:'flex',flexWrap:'wrap',gap:7,marginBottom:16}}>
        {CHIPS.map(c=>(
          <div key={c} onClick={()=>setInput(c)} style={{padding:'6px 13px',background:'var(--surface2)',border:'0.5px solid var(--border)',borderRadius:20,fontSize:12.5,color:'var(--text2)',cursor:'pointer',transition:'.15s'}}
            onMouseOver={e=>e.target.style.borderColor='var(--accent)'} onMouseOut={e=>e.target.style.borderColor='var(--border)'}>{c}</div>
        ))}
      </div>

      <div className="card" style={{display:'flex',flexDirection:'column',height:380}}>
        <div style={{flex:1,overflowY:'auto',display:'flex',flexDirection:'column',gap:12,marginBottom:14,paddingRight:4}}>
          {msgs.map((m,i)=>(
            <div key={i} style={{display:'flex',flexDirection:'column',alignItems:m.role==='user'?'flex-end':'flex-start'}}>
              <div style={{fontSize:10,textTransform:'uppercase',letterSpacing:'.9px',color:'var(--muted)',marginBottom:4}}>{m.role==='ai'?'Coach':'You'}</div>
              <div style={{maxWidth:'80%',padding:'10px 14px',borderRadius:m.role==='ai'?'4px 12px 12px 12px':'12px 4px 12px 12px',background:m.role==='ai'?'var(--surface2)':'var(--accent)',fontSize:13,lineHeight:1.55,color:'var(--text)'}}>{m.content}</div>
            </div>
          ))}
          {typing&&<div style={{alignSelf:'flex-start'}}>
            <div style={{fontSize:10,textTransform:'uppercase',letterSpacing:'.9px',color:'var(--muted)',marginBottom:4}}>Coach</div>
            <div style={{padding:'10px 14px',background:'var(--surface2)',borderRadius:'4px 12px 12px 12px',display:'flex',gap:5}}>
              {[0,200,400].map(d=><div key={d} style={{width:6,height:6,borderRadius:'50%',background:'var(--muted)',animation:`tdot 1.2s ${d}ms ease-in-out infinite`}}/>)}
            </div>
          </div>}
        </div>
        <div style={{display:'flex',gap:8}}>
          <input className="form-input" value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==='Enter'&&send()} placeholder="Ask your coach anything..." style={{flex:1}}/>
          <button className="btn btn-primary btn-sm" onClick={send}>Send</button>
        </div>
      </div>
      <style>{`@keyframes tdot{0%,80%,100%{transform:translateY(0);opacity:.5}40%{transform:translateY(-5px);opacity:1}}`}</style>
    </Layout>
  );
}
