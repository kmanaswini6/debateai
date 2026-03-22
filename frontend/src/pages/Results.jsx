import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import api from '../utils/api';

export default function Results() {
  const { id } = useParams();
  const [debate, setDebate] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    api.get(`/debate/${id}`).then(r => setDebate(r.data.debate)).catch(()=>navigate('/dashboard'));
  }, [id]);

  if (!debate) return <div className="loading-screen"><div className="spinner"/></div>;
  const s = debate.scores;
  const won = s?.winner === 'User';

  return (
    <Layout title="Results" actions={<button className="btn btn-ghost btn-sm" onClick={()=>navigate('/dashboard')}>← Dashboard</button>}>
      <div style={{background:won?'var(--success-dim)':'var(--error-dim)',border:`0.5px solid ${won?'rgba(52,211,153,.22)':'rgba(248,113,113,.22)'}`,borderRadius:'var(--r-lg)',padding:'28px',textAlign:'center',marginBottom:20}}>
        <div style={{fontSize:11,textTransform:'uppercase',letterSpacing:1.2,fontWeight:700,color:won?'var(--success)':'var(--error)',marginBottom:8}}>{won?'Victory!':'Defeated'}</div>
        <div style={{fontFamily:'Syne,sans-serif',fontSize:32,fontWeight:800,letterSpacing:'-.8px',color:won?'var(--success)':'var(--error)',marginBottom:5}}>{won?'You Win 🎉':'AI Wins 🤖'}</div>
        <div style={{fontSize:12.5,color:'var(--text2)'}}>{debate.topic} · {debate.difficulty} · {debate.rounds} Rounds</div>
      </div>

      <div style={{display:'grid',gridTemplateColumns:'1fr auto 1fr',gap:16,alignItems:'center',marginBottom:18}}>
        {[{label:'Your Score',val:s?.userScore,color:'var(--success)'},{},{label:'AI Score',val:s?.aiScore,color:'var(--error)'}].map((item,i)=>
          i===1 ? <div key={i} style={{fontSize:13,fontWeight:600,color:'var(--muted)',textAlign:'center'}}>VS</div> :
          <div key={i} style={{background:'var(--surface)',border:'0.5px solid var(--border)',borderRadius:'var(--r)',padding:22,textAlign:'center'}}>
            <div style={{fontSize:11,textTransform:'uppercase',letterSpacing:'.9px',color:'var(--muted)',marginBottom:8}}>{item.label}</div>
            <div style={{fontFamily:'Syne,sans-serif',fontSize:52,fontWeight:800,letterSpacing:-2,color:item.color,lineHeight:1}}>{item.val||'—'}</div>
          </div>
        )}
      </div>

      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12,marginBottom:14}}>
        {[{title:'Your Strengths',items:s?.userStrengths,color:'var(--success)'},{title:'Areas to Improve',items:s?.userWeaknesses,color:'var(--error)'}].map(({title,items,color})=>(
          <div key={title} className="card">
            <div style={{fontSize:10,textTransform:'uppercase',letterSpacing:1,fontWeight:700,color,marginBottom:10}}>{title}</div>
            {(items||[]).map((item,i)=>(
              <div key={i} style={{fontSize:12.5,color:'var(--text2)',padding:'4px 0',display:'flex',gap:8,lineHeight:1.45}}>
                <span style={{color:'var(--accent)'}}>›</span>{item}
              </div>
            ))}
          </div>
        ))}
      </div>

      {s?.bestArgument&&<div className="card" style={{marginBottom:18}}>
        <div style={{fontSize:10,textTransform:'uppercase',letterSpacing:1,color:'var(--accent)',fontWeight:700,marginBottom:10}}>✨ Your Best Argument</div>
        <blockquote style={{fontSize:13.5,color:'var(--text2)',fontStyle:'italic',background:'var(--accent-dim)',border:'0.5px solid rgba(124,106,255,.2)',borderRadius:'var(--r-sm)',padding:'11px 16px',lineHeight:1.55}}>"{s.bestArgument}"</blockquote>
      </div>}

      <div style={{display:'flex',gap:10,flexWrap:'wrap'}}>
        <button className="btn btn-primary" onClick={()=>navigate('/new-debate')}>Try Another Topic</button>
        <button className="btn btn-ghost" onClick={()=>navigate('/new-debate')}>Rematch</button>
        <button className="btn btn-ghost" onClick={()=>navigate('/history')}>View History</button>
      </div>
    </Layout>
  );
}
