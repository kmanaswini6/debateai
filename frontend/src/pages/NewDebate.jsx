import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import api from '../utils/api';

const TOPICS = [
  {icon:'🤖',name:'AI replacing jobs',cat:'Tech'},
  {icon:'📱',name:'Social media harms society',cat:'Society'},
  {icon:'🎓',name:'College degrees are overrated',cat:'Education'},
  {icon:'🏠',name:'Remote work is the future',cat:'Career'},
  {icon:'⚡',name:'Nuclear energy is the answer',cat:'Society'},
  {icon:'🗳️',name:'Voting should be mandatory',cat:'Society'},
  {icon:'🔒',name:'Privacy vs national security',cat:'Tech'},
  {icon:'🏫',name:'Homework should be banned',cat:'Education'},
  {icon:'💰',name:'Universal basic income works',cat:'Career'},
  {icon:'🌍',name:'Climate change needs radical action',cat:'Society'},
  {icon:'🧠',name:'Philosophy should be in schools',cat:'Education'},
  {icon:'🚀',name:'Space exploration is worth the cost',cat:'Tech'},
];

export default function NewDebate() {
  const [step, setStep] = useState(1);
  const [topic, setTopic] = useState(TOPICS[0].name);
  const [customTopic, setCustomTopic] = useState('');
  const [side, setSide] = useState('For');
  const [difficulty, setDifficulty] = useState('Medium');
  const [rounds, setRounds] = useState(5);
  const [cat, setCat] = useState('All');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const filtered = cat === 'All' ? TOPICS : TOPICS.filter(t => t.cat === cat);
  const finalTopic = customTopic.trim() || topic;

  const begin = async () => {
    setLoading(true);
    try {
      const res = await api.post('/debate/start', { topic: finalTopic, side, difficulty, rounds });
      navigate(`/debate/${res.data.debateId}`);
    } catch(e) { alert('Error starting debate'); }
    setLoading(false);
  };

  const pill = (val, cur, setter, color) => (
    <div onClick={()=>setter(val)} style={{flex:1,textAlign:'center',padding:'10px',border:`1.5px solid ${cur===val?'var(--accent)':'var(--border)'}`,borderRadius:'var(--r)',background:cur===val?'var(--accent-dim)':'var(--surface2)',cursor:'pointer',color:cur===val?'var(--accent)':color||'var(--text2)',fontWeight:600,fontSize:13,transition:'all .15s'}}>{val}</div>
  );

  return (
    <Layout title="New Debate" actions={<button className="btn btn-ghost btn-sm" onClick={()=>navigate('/dashboard')}>← Back</button>}>
      {/* Step indicator */}
      <div style={{display:'flex',alignItems:'center',marginBottom:28,maxWidth:400}}>
        {[1,2,3,4].map((n,i)=>(
          <div key={n} style={{display:'flex',alignItems:'center',flex:i<3?1:'none'}}>
            <div style={{width:28,height:28,borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',fontSize:12,fontWeight:600,border:`1.5px solid ${step>n?'var(--accent)':step===n?'var(--accent)':'var(--border2)'}`,background:step>n?'var(--accent)':'transparent',color:step>n?'#fff':step===n?'var(--accent)':'var(--muted)',transition:'all .25s',flexShrink:0}}>
              {step>n?'✓':n}
            </div>
            {i<3&&<div style={{flex:1,height:1,background:step>n?'var(--accent)':'var(--border2)',margin:'0 4px',transition:'.25s'}}/>}
          </div>
        ))}
      </div>

      {/* Step 1: Topic */}
      {step===1&&<div>
        <h2 style={{fontFamily:'Syne,sans-serif',fontSize:20,fontWeight:800,marginBottom:4}}>Choose your topic</h2>
        <p style={{fontSize:13,color:'var(--text2)',marginBottom:18}}>Pick a preset or type your own</p>
        <div style={{display:'flex',gap:6,marginBottom:16,flexWrap:'wrap'}}>
          {['All','Tech','Education','Society','Career'].map(c=>(
            <div key={c} onClick={()=>setCat(c)} style={{padding:'5px 13px',borderRadius:20,fontSize:12,background:cat===c?'var(--accent-dim)':'var(--surface2)',color:cat===c?'var(--accent)':'var(--text2)',border:`0.5px solid ${cat===c?'rgba(124,106,255,.3)':'var(--border)'}`,cursor:'pointer'}}>{c}</div>
          ))}
        </div>
        <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:10,marginBottom:18}}>
          {filtered.map(t=>(
            <div key={t.name} onClick={()=>{setTopic(t.name);setCustomTopic('');}} style={{background:'var(--surface2)',border:`1.5px solid ${topic===t.name&&!customTopic?'var(--accent)':'var(--border)'}`,borderRadius:'var(--r)',padding:'14px',cursor:'pointer',transition:'all .15s',background:topic===t.name&&!customTopic?'var(--accent-dim)':'var(--surface2)'}}>
              <div style={{fontSize:22,marginBottom:6}}>{t.icon}</div>
              <div style={{fontSize:13,fontWeight:600}}>{t.name}</div>
              <div style={{fontSize:11,color:'var(--muted)',marginTop:2}}>{t.cat}</div>
            </div>
          ))}
        </div>
        <input className="form-input" value={customTopic} onChange={e=>setCustomTopic(e.target.value)} placeholder="Or type a custom topic..." style={{marginBottom:20}}/>
        <div style={{display:'flex',justifyContent:'flex-end'}}>
          <button className="btn btn-primary" onClick={()=>setStep(2)}>Next: Choose Side →</button>
        </div>
      </div>}

      {/* Step 2: Side */}
      {step===2&&<div>
        <h2 style={{fontFamily:'Syne,sans-serif',fontSize:20,fontWeight:800,marginBottom:4}}>Pick your side</h2>
        <p style={{fontSize:13,color:'var(--text2)',marginBottom:18}}>Topic: <strong style={{color:'var(--text)'}}>{finalTopic}</strong></p>
        <div style={{display:'flex',gap:14,marginBottom:24}}>
          <div onClick={()=>setSide('For')} style={{flex:1,padding:'22px 18px',borderRadius:'var(--r)',border:`1.5px solid ${side==='For'?'var(--accent)':'var(--border)'}`,background:side==='For'?'var(--accent-dim)':'var(--surface2)',cursor:'pointer',textAlign:'center',transition:'all .15s'}}>
            <div style={{fontSize:28,marginBottom:8}}>✅</div>
            <div style={{fontFamily:'Syne,sans-serif',fontSize:20,fontWeight:800,color:'var(--success)',marginBottom:4}}>FOR</div>
            <div style={{fontSize:12,color:'var(--text2)'}}>Argue in support of the topic</div>
          </div>
          <div onClick={()=>setSide('Against')} style={{flex:1,padding:'22px 18px',borderRadius:'var(--r)',border:`1.5px solid ${side==='Against'?'var(--accent)':'var(--border)'}`,background:side==='Against'?'var(--accent-dim)':'var(--surface2)',cursor:'pointer',textAlign:'center',transition:'all .15s'}}>
            <div style={{fontSize:28,marginBottom:8}}>❌</div>
            <div style={{fontFamily:'Syne,sans-serif',fontSize:20,fontWeight:800,color:'var(--error)',marginBottom:4}}>AGAINST</div>
            <div style={{fontSize:12,color:'var(--text2)'}}>Argue in opposition to the topic</div>
          </div>
        </div>
        <div style={{display:'flex',justifyContent:'flex-end',gap:10}}>
          <button className="btn btn-ghost" onClick={()=>setStep(1)}>← Back</button>
          <button className="btn btn-primary" onClick={()=>setStep(3)}>Next: Difficulty →</button>
        </div>
      </div>}

      {/* Step 3: Difficulty */}
      {step===3&&<div>
        <h2 style={{fontFamily:'Syne,sans-serif',fontSize:20,fontWeight:800,marginBottom:4}}>Difficulty & Rounds</h2>
        <p style={{fontSize:13,color:'var(--text2)',marginBottom:18}}>How tough should the AI be?</p>
        <div style={{display:'flex',gap:12,marginBottom:24}}>
          {[{d:'Easy',c:'var(--success)',desc:'Friendly, short. Great for beginners.'},{d:'Medium',c:'var(--warning)',desc:'Logical arguments with examples.'},{d:'Hard',c:'var(--error)',desc:'Data, stats, ruthless rebuttals.'}].map(({d,c,desc})=>(
            <div key={d} onClick={()=>setDifficulty(d)} style={{flex:1,padding:'16px',borderRadius:'var(--r)',border:`1.5px solid ${difficulty===d?'var(--accent)':'var(--border)'}`,background:difficulty===d?'var(--accent-dim)':'var(--surface2)',cursor:'pointer',transition:'all .15s'}}>
              <div style={{fontSize:14,fontWeight:700,color:c,marginBottom:5}}>{d}</div>
              <div style={{fontSize:12,color:'var(--text2)',lineHeight:1.5}}>{desc}</div>
            </div>
          ))}
        </div>
        <div style={{marginBottom:24}}>
          <div style={{fontSize:13,fontWeight:600,marginBottom:10}}>Number of Rounds</div>
          <div style={{display:'flex',gap:8}}>
            {[3,5,7].map(r=>(
              <div key={r} onClick={()=>setRounds(r)} style={{padding:'9px 22px',borderRadius:'var(--r-sm)',border:`1.5px solid ${rounds===r?'var(--accent)':'var(--border)'}`,background:rounds===r?'var(--accent-dim)':'transparent',color:rounds===r?'var(--accent)':'var(--muted)',fontWeight:600,fontSize:14,cursor:'pointer',transition:'all .15s'}}>{r}</div>
            ))}
          </div>
        </div>
        <div style={{display:'flex',justifyContent:'flex-end',gap:10}}>
          <button className="btn btn-ghost" onClick={()=>setStep(2)}>← Back</button>
          <button className="btn btn-primary" onClick={()=>setStep(4)}>Preview →</button>
        </div>
      </div>}

      {/* Step 4: Preview */}
      {step===4&&<div>
        <h2 style={{fontFamily:'Syne,sans-serif',fontSize:20,fontWeight:800,marginBottom:4}}>Ready to debate?</h2>
        <p style={{fontSize:13,color:'var(--text2)',marginBottom:20}}>Review your selections</p>
        <div style={{background:'var(--surface2)',border:'0.5px solid var(--border)',borderRadius:'var(--r)',padding:'18px 20px',marginBottom:22}}>
          {[['Topic',finalTopic],['Your side',side],['Difficulty',difficulty],['Rounds',rounds],['Hints',3]].map(([k,v])=>(
            <div key={k} style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'9px 0',borderBottom:'0.5px solid var(--border)',fontSize:13}}>
              <span style={{color:'var(--muted)'}}>{k}</span>
              <span style={{fontWeight:500,color:k==='Your side'?(v==='For'?'var(--success)':'var(--error)'):k==='Difficulty'?(v==='Easy'?'var(--success)':v==='Medium'?'var(--warning)':'var(--error)'):'var(--text)'}}>{v}</span>
            </div>
          ))}
        </div>
        <div style={{display:'flex',justifyContent:'flex-end',gap:10}}>
          <button className="btn btn-ghost" onClick={()=>setStep(3)}>← Back</button>
          <button className="btn btn-primary" onClick={begin} disabled={loading} style={{padding:'10px 26px',fontSize:14}}>
            {loading?'Starting...':'Begin Debate →'}
          </button>
        </div>
      </div>}
    </Layout>
  );
}
