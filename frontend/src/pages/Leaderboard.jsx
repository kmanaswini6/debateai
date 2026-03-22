import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import Layout from '../components/Layout';
import api from '../utils/api';

export default function Leaderboard() {
  const [data, setData] = useState([]);
  const [myRank, setMyRank] = useState(null);
  const { dbUser } = useAuth();

  useEffect(()=>{
    api.get('/leaderboard').then(r=>{
      setData(r.data.leaderboard||[]);
      setMyRank(r.data.myRank);
    }).catch(()=>{});
  },[]);

  const medals = ['🥇','🥈','🥉'];
  return (
    <Layout title="Leaderboard">
      {myRank&&<div style={{marginBottom:14,padding:'12px 16px',background:'var(--accent-dim)',border:'0.5px solid rgba(124,106,255,.2)',borderRadius:'var(--r-sm)',fontSize:12.5,color:'var(--text2)'}}>
        🎯 Your current rank: <strong style={{color:'var(--accent)'}}>#{myRank}</strong> — complete 5+ debates to appear on the board!
      </div>}
      <div className="card">
        <table style={{width:'100%',borderCollapse:'collapse'}}>
          <thead><tr style={{borderBottom:'0.5px solid var(--border)'}}>
            {['Rank','Name','Debates','Win Rate','Avg Score'].map((h,i)=>(
              <th key={h} style={{fontSize:10.5,textTransform:'uppercase',letterSpacing:'.9px',color:'var(--muted)',fontWeight:500,padding:'0 0 12px',textAlign:i<2?'left':'right'}}>{h}</th>
            ))}
          </tr></thead>
          <tbody>
            {data.length===0
              ? <tr><td colSpan={5} style={{textAlign:'center',padding:'40px 0',color:'var(--muted)'}}>Complete 5+ debates to appear on the leaderboard!</td></tr>
              : data.map((u,i)=>(
                <tr key={i} style={{borderBottom:'0.5px solid var(--border)',background:u.uid===dbUser?.uid?'var(--accent-dim)':'transparent'}}>
                  <td style={{padding:'11px 0',color:i<3?'var(--warning)':'var(--muted)',fontWeight:i<3?700:400}}>{medals[i]||`#${u.rank}`}</td>
                  <td style={{padding:'11px 0',color:u.uid===dbUser?.uid?'var(--accent)':'var(--text)',fontWeight:u.uid===dbUser?.uid?600:400}}>{u.name}{u.uid===dbUser?.uid?' (You)':''}</td>
                  <td style={{padding:'11px 0',textAlign:'right',color:'var(--muted)'}}>{u.debates}</td>
                  <td style={{padding:'11px 0',textAlign:'right',color:'var(--success)'}}>{u.winRate}%</td>
                  <td style={{padding:'11px 0',textAlign:'right'}}>{u.avgScore||'—'}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </Layout>
  );
}
