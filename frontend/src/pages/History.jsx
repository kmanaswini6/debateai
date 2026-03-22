import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import api from '../utils/api';

export default function History() {
  const [debates, setDebates] = useState([]);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [search, setSearch] = useState('');
  const [result, setResult] = useState('all');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const load = async () => {
    setLoading(true);
    try {
      const r = await api.get(`/user/history?page=${page}&search=${search}&result=${result==='all'?'':result}`);
      setDebates(r.data.debates);
      setPages(r.data.pages);
    } catch(e){}
    setLoading(false);
  };

  useEffect(()=>{ load(); }, [page, result]);
  useEffect(()=>{ const t=setTimeout(load,400); return ()=>clearTimeout(t); }, [search]);

  const del = async (id) => {
    if (!confirm('Delete this debate?')) return;
    await api.delete(`/user/history/${id}`);
    load();
  };

  return (
    <Layout title="Debate History" actions={<button className="btn btn-ghost btn-sm">Export CSV</button>}>
      <div style={{display:'flex',gap:10,marginBottom:18,flexWrap:'wrap',alignItems:'center'}}>
        <input className="form-input" value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search by topic..." style={{flex:1,minWidth:200}}/>
        <div style={{display:'flex',gap:6}}>
          {['all','win','loss'].map(r=>(
            <div key={r} onClick={()=>setResult(r)} style={{padding:'5px 13px',borderRadius:20,fontSize:12,background:result===r?'var(--accent-dim)':'var(--surface2)',color:result===r?'var(--accent)':'var(--text2)',border:`0.5px solid ${result===r?'rgba(124,106,255,.3)':'var(--border)'}`,cursor:'pointer',textTransform:'capitalize'}}>{r==='all'?'All':r==='win'?'Wins':'Losses'}</div>
          ))}
        </div>
      </div>

      {loading ? <div style={{textAlign:'center',padding:40}}><div className="spinner" style={{margin:'0 auto'}}/></div> :
       debates.length === 0 ? (
        <div style={{textAlign:'center',padding:'60px 0',color:'var(--muted)'}}>
          <div style={{fontSize:36,marginBottom:12}}>📭</div>
          <div style={{fontSize:14}}>No debates found</div>
          <button className="btn btn-primary btn-sm" style={{marginTop:14}} onClick={()=>navigate('/new-debate')}>Start your first debate</button>
        </div>
      ) : debates.map(d=>(
        <div key={d._id} onClick={()=>navigate(`/results/${d._id}`)} style={{display:'flex',alignItems:'center',gap:14,padding:'13px 18px',border:'0.5px solid var(--border)',borderRadius:'var(--r)',background:'var(--surface)',marginBottom:8,cursor:'pointer',transition:'all .15s'}}
          onMouseOver={e=>e.currentTarget.style.borderColor='var(--border2)'} onMouseOut={e=>e.currentTarget.style.borderColor='var(--border)'}>
          <div style={{width:38,height:38,borderRadius:9,background:'var(--surface3)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:17,flexShrink:0}}>🎤</div>
          <div style={{flex:1,minWidth:0}}>
            <div style={{fontSize:13.5,fontWeight:500,whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{d.topic}</div>
            <div style={{fontSize:11.5,color:'var(--muted)',marginTop:2,display:'flex',alignItems:'center',gap:6}}>
              {new Date(d.createdAt).toLocaleDateString()}
              <span className={`badge badge-${d.difficulty?.toLowerCase()}`}>{d.difficulty}</span>
              · {d.rounds} rounds
            </div>
          </div>
          <div style={{display:'flex',alignItems:'center',gap:10,flexShrink:0}}>
            <span className={`badge badge-${d.scores?.winner==='User'?'win':'loss'}`}>{d.scores?.winner==='User'?'Win':'Loss'}</span>
            <span style={{fontFamily:'Syne,sans-serif',fontSize:17,fontWeight:700,color:d.scores?.winner==='User'?'var(--success)':'var(--error)'}}>{d.scores?.userScore||'—'}</span>
            <button className="btn btn-ghost btn-sm" onClick={e=>{e.stopPropagation();del(d._id)}} style={{color:'var(--error)',borderColor:'rgba(248,113,113,.25)'}}>Del</button>
          </div>
        </div>
      ))}

      {pages>1&&<div style={{display:'flex',alignItems:'center',justifyContent:'center',gap:6,marginTop:18}}>
        {Array.from({length:pages},(_,i)=>i+1).map(p=>(
          <button key={p} onClick={()=>setPage(p)} style={{width:32,height:32,borderRadius:'var(--r-sm)',border:'0.5px solid var(--border2)',background:page===p?'var(--accent-dim)':'transparent',color:page===p?'var(--accent)':'var(--text2)',cursor:'pointer',fontFamily:'inherit',fontSize:12.5}}>{p}</button>
        ))}
      </div>}
    </Layout>
  );
}
