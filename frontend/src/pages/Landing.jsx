// Landing.jsx
import { useNavigate } from 'react-router-dom';
export default function Landing() {
  const navigate = useNavigate();
  return (
    <div style={{minHeight:'100vh',background:'var(--bg)',display:'flex',flexDirection:'column'}}>
      <nav style={{padding:'18px 40px',display:'flex',alignItems:'center',justifyContent:'space-between',borderBottom:'0.5px solid var(--border)'}}>
        <div style={{display:'flex',alignItems:'center',gap:10}}>
          <div className="logo-mark">D</div>
          <div style={{fontFamily:'Syne,sans-serif',fontSize:16,fontWeight:700}}>Debate<span style={{color:'var(--accent)'}}>AI</span></div>
        </div>
        <div style={{display:'flex',gap:8}}>
          <button className="btn btn-ghost btn-sm" onClick={()=>navigate('/login')}>Login</button>
          <button className="btn btn-primary btn-sm" onClick={()=>navigate('/signup')}>Sign Up Free</button>
        </div>
      </nav>
      <div style={{flex:1,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',padding:'60px 20px',textAlign:'center'}}>
        <div style={{background:'var(--accent-dim)',border:'0.5px solid rgba(124,106,255,.3)',color:'var(--accent)',fontSize:11,fontWeight:600,textTransform:'uppercase',letterSpacing:1,padding:'5px 14px',borderRadius:20,marginBottom:20}}>AI-Powered Debate Coach</div>
        <h1 style={{fontFamily:'Syne,sans-serif',fontSize:58,fontWeight:800,letterSpacing:'-2px',lineHeight:1.1,marginBottom:20,maxWidth:700}}>
          Argue. Rebut. <span style={{color:'var(--accent)'}}>Win.</span>
        </h1>
        <p style={{fontSize:16,color:'var(--text2)',marginBottom:36,maxWidth:460,lineHeight:1.65}}>
          Practice debate against an AI opponent that fights back. Track your progress, get real feedback, and become unstoppable.
        </p>
        <div style={{display:'flex',gap:12,flexWrap:'wrap',justifyContent:'center',marginBottom:60}}>
          <button className="btn btn-primary" style={{padding:'13px 30px',fontSize:15}} onClick={()=>navigate('/signup')}>Start Debating Free →</button>
          <button className="btn btn-ghost" style={{padding:'13px 30px',fontSize:15}} onClick={()=>navigate('/login')}>Sign In</button>
        </div>
        <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:14,maxWidth:720,width:'100%'}}>
          {[{icon:'🤖',title:'AI Opponent',desc:'Argues back intelligently at Easy, Medium, or Hard difficulty'},
            {icon:'📊',title:'Real Scoring',desc:'Groq AI scores every debate and gives detailed feedback'},
            {icon:'🏆',title:'Leaderboard',desc:'Compete globally and track your improvement over time'}].map(f=>(
            <div key={f.title} style={{background:'var(--surface)',border:'0.5px solid var(--border)',borderRadius:'var(--r)',padding:'22px',textAlign:'left'}}>
              <div style={{fontSize:26,marginBottom:10}}>{f.icon}</div>
              <div style={{fontWeight:600,marginBottom:6}}>{f.title}</div>
              <div style={{fontSize:12.5,color:'var(--text2)',lineHeight:1.55}}>{f.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
