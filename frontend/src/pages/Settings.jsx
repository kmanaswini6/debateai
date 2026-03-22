import { signOut } from 'firebase/auth';
import { auth } from '../utils/firebase';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import api from '../utils/api';

export default function Settings() {
  const navigate = useNavigate();
  const logout = async () => { await signOut(auth); navigate('/'); };
  const delAll = async () => {
    if (confirm('Delete ALL debate history? This cannot be undone.')) {
      await api.delete('/user/history');
      alert('History deleted.');
    }
  };
  return (
    <Layout title="Settings">
      <div className="card" style={{marginBottom:14}}>
        <div className="card-header"><div className="card-title">Account</div></div>
        <button className="btn btn-ghost btn-sm" onClick={logout}>Sign Out</button>
      </div>
      <div className="card" style={{marginBottom:14}}>
        <div className="card-header"><div className="card-title">Notifications</div></div>
        {['Daily challenge reminder','New achievement unlocked','Weekly stats summary'].map(n=>(
          <div key={n} style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'9px 0',borderBottom:'0.5px solid var(--border)',fontSize:13}}>
            <span style={{color:'var(--text2)'}}>{n}</span>
            <div style={{width:36,height:20,borderRadius:10,background:'var(--accent)',cursor:'pointer',position:'relative'}}>
              <div style={{width:16,height:16,borderRadius:'50%',background:'#fff',position:'absolute',right:2,top:2}}/>
            </div>
          </div>
        ))}
      </div>
      <div className="card" style={{border:'0.5px solid rgba(248,113,113,.2)'}}>
        <div className="card-header"><div className="card-title" style={{color:'var(--error)'}}>Danger Zone</div></div>
        <div style={{display:'flex',gap:10}}>
          <button className="btn btn-danger btn-sm" onClick={delAll}>Delete All History</button>
          <button className="btn btn-danger btn-sm" onClick={()=>confirm('Delete your account? This is permanent.')}>Delete Account</button>
        </div>
      </div>
    </Layout>
  );
}
