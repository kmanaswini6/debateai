import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

export default function Dashboard() {
  const { dbUser } = useAuth();
  const [history, setHistory] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/user/history?limit=5').then(r => setHistory(r.data.debates || [])).catch(()=>{});
  }, []);

  const winRate = dbUser?.totalDebates > 0 ? Math.round((dbUser.wins / dbUser.totalDebates) * 100) : 0;
  const avgScore = history.length > 0
    ? (history.reduce((a,d) => a + (d.scores?.userScore||0), 0) / history.length).toFixed(1)
    : '—';

  const diffColor = d => d==='Easy'?'var(--success)':d==='Medium'?'var(--warning)':'var(--error)';

  return (
    <Layout title="Dashboard" actions={
      <>
        <button className="btn btn-ghost btn-sm" onClick={()=>navigate('/practice')}>Practice Mode</button>
        <button className="btn btn-primary btn-sm" onClick={()=>navigate('/new-debate')}>+ New Debate</button>
      </>
    }>
      {/* Welcome */}
      <div style={{display:'flex',alignItems:'flex-start',justifyContent:'space-between',marginBottom:26}}>
        <div>
          <h1 style={{fontFamily:'Syne,sans-serif',fontSize:26,fontWeight:800,letterSpacing:'-.5px',marginBottom:5}}>
            Welcome back, <span style={{color:'var(--accent)'}}>{dbUser?.name?.split(' ')[0] || 'Debater'}</span> 👋
          </h1>
          <p style={{fontSize:13.5,color:'var(--text2)'}}>Ready to sharpen those arguments?</p>
          {dbUser?.currentStreak > 0 &&
            <div style={{display:'inline-flex',alignItems:'center',gap:6,background:'rgba(251,191,36,.1)',border:'0.5px solid rgba(251,191,36,.25)',padding:'5px 13px',borderRadius:20,marginTop:10}}>
              <span style={{fontSize:13,fontWeight:600,color:'var(--warning)'}}>🔥 {dbUser.currentStreak}-day streak</span>
            </div>
          }
        </div>
      </div>

      {/* Stats */}
      <div className="stats-grid">
        <div className="stat-card"><div className="stat-label">Total Debates</div><div className="stat-val">{dbUser?.totalDebates||0}</div></div>
        <div className="stat-card"><div className="stat-label">Win Rate</div><div className="stat-val c-green">{winRate}%</div><div className="stat-delta up">↑ improving</div></div>
        <div className="stat-card"><div className="stat-label">Avg Score</div><div className="stat-val c-purple">{avgScore}</div></div>
        <div className="stat-card"><div className="stat-label">Win Streak</div><div className="stat-val c-amber">{dbUser?.currentStreak||0}</div></div>
      </div>

      {/* Daily Challenge */}
      <div style={{background:'var(--surface3)',border:'0.5px solid rgba(124,106,255,.25)',borderRadius:'var(--r)',padding:'20px 22px',marginBottom:16,position:'relative',overflow:'hidden'}}>
        <div style={{fontSize:10,textTransform:'uppercase',letterSpacing:1,color:'var(--warning)',fontWeight:700,marginBottom:8}}>⚡ Daily Challenge</div>
        <div style={{fontFamily:'Syne,sans-serif',fontSize:16,fontWeight:700,marginBottom:14}}>"AI will eliminate more jobs than it creates in the next decade"</div>
        <div style={{display:'flex',alignItems:'center',gap:8}}>
          <span className="badge badge-hard">Hard</span>
          <span style={{fontSize:12,color:'var(--muted)'}}>5 rounds</span>
          <button className="btn btn-primary btn-sm" style={{marginLeft:'auto'}} onClick={()=>navigate('/new-debate')}>Accept →</button>
        </div>
      </div>

      {/* Recent Debates */}
      <div className="card">
        <div className="card-header">
          <div className="card-title">Recent Debates</div>
          <div className="card-action" onClick={()=>navigate('/history')}>See all →</div>
        </div>
        {history.length === 0 ? (
          <div style={{textAlign:'center',padding:'30px 0',color:'var(--muted)'}}>
            <div style={{fontSize:28,marginBottom:8}}>🎤</div>
            <div style={{fontSize:13}}>No debates yet. Start your first one!</div>
            <button className="btn btn-primary btn-sm" style={{marginTop:12}} onClick={()=>navigate('/new-debate')}>Start Debating</button>
          </div>
        ) : history.map(d => (
          <div key={d._id} onClick={()=>navigate(`/results/${d._id}`)} style={{display:'flex',alignItems:'center',padding:'11px 0',borderBottom:'0.5px solid var(--border)',cursor:'pointer',gap:12}}>
            <div style={{flex:1,minWidth:0}}>
              <div style={{fontSize:13.5,fontWeight:500,whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{d.topic}</div>
              <div style={{fontSize:11.5,color:'var(--muted)',marginTop:2,display:'flex',alignItems:'center',gap:6}}>
                {new Date(d.createdAt).toLocaleDateString()}
                <span className={`badge badge-${d.difficulty?.toLowerCase()}`}>{d.difficulty}</span>
              </div>
            </div>
            <div style={{display:'flex',alignItems:'center',gap:8,flexShrink:0}}>
              <span style={{fontFamily:'Syne,sans-serif',fontSize:16,fontWeight:700,color:d.scores?.winner==='User'?'var(--success)':'var(--error)'}}>{d.scores?.userScore||'—'}</span>
              <span className={`badge badge-${d.scores?.winner==='User'?'win':'loss'}`}>{d.scores?.winner==='User'?'Win':'Loss'}</span>
            </div>
          </div>
        ))}
      </div>
    </Layout>
  );
}
