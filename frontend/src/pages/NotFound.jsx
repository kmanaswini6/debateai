import { useNavigate } from 'react-router-dom';

export default function NotFound() {
  const navigate = useNavigate();
  return (
    <div style={{height:'100vh',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',background:'var(--bg)',gap:16}}>
      <div style={{fontFamily:'Syne,sans-serif',fontSize:80,fontWeight:800,color:'var(--border2)',lineHeight:1}}>404</div>
      <div style={{fontSize:16,color:'var(--text2)'}}>This page doesn't exist</div>
      <button className="btn btn-primary" onClick={()=>navigate('/')}>← Go Home</button>
    </div>
  );
}
