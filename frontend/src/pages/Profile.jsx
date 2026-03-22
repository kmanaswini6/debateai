import { useAuth } from '../context/AuthContext';
import Layout from '../components/Layout';

export default function Profile() {
  const { dbUser } = useAuth();
  const initials = dbUser?.name?.split(' ').map(n=>n[0]).join('').toUpperCase().slice(0,2)||'U';
  const winRate = dbUser?.totalDebates>0 ? Math.round((dbUser.wins/dbUser.totalDebates)*100) : 0;
  const BADGES = [
    {id:'First Debate',icon:'🥊',desc:'Complete 1 debate'},
    {id:'On a Roll',icon:'🔥',desc:'Win 3 in a row'},
    {id:'Hard Mode Hero',icon:'💀',desc:'Win on Hard'},
    {id:'Debate Master',icon:'🏆',desc:'Complete 10 debates'},
    {id:'Perfect 10',icon:'⭐',desc:'Score 10/10'},
  ];
  return (
    <Layout title="Profile">
      <div style={{display:'flex',alignItems:'center',gap:20,background:'var(--surface)',border:'0.5px solid var(--border)',borderRadius:'var(--r-lg)',padding:'24px 26px',marginBottom:20}}>
        <div style={{width:66,height:66,borderRadius:'50%',background:'var(--accent-dim)',border:'2px solid var(--accent)',display:'flex',alignItems:'center',justifyContent:'center',fontFamily:'Syne,sans-serif',fontSize:22,fontWeight:800,color:'var(--accent)',flexShrink:0}}>{initials}</div>
        <div>
          <div style={{fontFamily:'Syne,sans-serif',fontSize:22,fontWeight:800}}>{dbUser?.name}</div>
          <div style={{fontSize:13,color:'var(--text2)',marginTop:3}}>Goal: {dbUser?.goal} · Prefers {dbUser?.preferredDifficulty}</div>
        </div>
      </div>
      <div className="stats-grid" style={{marginBottom:20}}>
        <div className="stat-card"><div className="stat-label">Total Debates</div><div className="stat-val">{dbUser?.totalDebates||0}</div></div>
        <div className="stat-card"><div className="stat-label">Win Rate</div><div className="stat-val c-green">{winRate}%</div></div>
        <div className="stat-card"><div className="stat-label">Wins</div><div className="stat-val c-purple">{dbUser?.wins||0}</div></div>
        <div className="stat-card"><div className="stat-label">Best Streak</div><div className="stat-val c-amber">{dbUser?.longestStreak||0}🔥</div></div>
      </div>
      <div className="card">
        <div className="card-header"><div className="card-title">Achievements</div></div>
        <div style={{display:'flex',gap:10,flexWrap:'wrap'}}>
          {BADGES.map(b=>{
            const earned = dbUser?.badges?.includes(b.id);
            return (
              <div key={b.id} style={{background:'var(--surface2)',border:'0.5px solid var(--border)',borderRadius:'var(--r)',padding:'13px 15px',display:'flex',alignItems:'center',gap:11,minWidth:155,opacity:earned?1:.3,filter:earned?'none':'grayscale(1)'}}>
                <div style={{fontSize:20}}>{b.icon}</div>
                <div><div style={{fontSize:12.5,fontWeight:600}}>{b.id}</div><div style={{fontSize:11,color:'var(--muted)'}}>{b.desc}</div></div>
              </div>
            );
          })}
        </div>
      </div>
    </Layout>
  );
}
