import { NavLink, useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../utils/firebase';
import { useAuth } from '../context/AuthContext';

export default function Layout({ children, title, actions }) {
  const { dbUser } = useAuth();
  const navigate = useNavigate();
  const initials = dbUser?.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0,2) || 'U';

  const logout = async () => {
    await signOut(auth);
    navigate('/');
  };

  return (
    <div className="app-layout">
      <aside className="sidebar">
        <div className="logo">
          <div className="logo-mark">D</div>
          <div className="logo-name">Debate<span>AI</span></div>
        </div>
        <nav className="nav">
          <div className="nav-section">Main</div>
          <NavLink to="/dashboard" className={({isActive})=>`nav-item${isActive?' active':''}`}>
            <svg className="nav-icon" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="1" y="1" width="6" height="6" rx="1.5"/><rect x="9" y="1" width="6" height="6" rx="1.5"/><rect x="1" y="9" width="6" height="6" rx="1.5"/><rect x="9" y="9" width="6" height="6" rx="1.5"/></svg>
            Dashboard
          </NavLink>
          <NavLink to="/new-debate" className={({isActive})=>`nav-item${isActive?' active':''}`}>
            <svg className="nav-icon" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="8" cy="8" r="6"/><path d="M8 5v3l2 2"/></svg>
            New Debate
          </NavLink>
          <NavLink to="/practice" className={({isActive})=>`nav-item${isActive?' active':''}`}>
            <svg className="nav-icon" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M8 2L2 6v8h4v-4h4v4h4V6L8 2z"/></svg>
            Practice
          </NavLink>
          <div className="nav-section">Account</div>
          <NavLink to="/history" className={({isActive})=>`nav-item${isActive?' active':''}`}>
            <svg className="nav-icon" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="8" cy="8" r="6"/><path d="M8 5v3l2 2"/></svg>
            History
          </NavLink>
          <NavLink to="/profile" className={({isActive})=>`nav-item${isActive?' active':''}`}>
            <svg className="nav-icon" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="8" cy="5" r="3"/><path d="M2 14c0-3.314 2.686-6 6-6s6 2.686 6 6"/></svg>
            Profile
          </NavLink>
          <NavLink to="/leaderboard" className={({isActive})=>`nav-item${isActive?' active':''}`}>
            <svg className="nav-icon" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="1" y="8" width="4" height="6" rx="1"/><rect x="6" y="5" width="4" height="9" rx="1"/><rect x="11" y="2" width="4" height="12" rx="1"/></svg>
            Leaderboard
          </NavLink>
          <NavLink to="/settings" className={({isActive})=>`nav-item${isActive?' active':''}`}>
            <svg className="nav-icon" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="8" cy="8" r="2.5"/><path d="M8 1v2M8 13v2M1 8h2M13 8h2M3.05 3.05l1.41 1.41M11.54 11.54l1.41 1.41M3.05 12.95l1.41-1.41M11.54 4.46l1.41-1.41"/></svg>
            Settings
          </NavLink>
        </nav>
        <div className="sidebar-footer">
          <div className="avatar">{initials}</div>
          <div style={{flex:1,minWidth:0}}>
            <div className="avatar-name" style={{whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{dbUser?.name || 'User'}</div>
            <div className="avatar-level">Level {Math.floor((dbUser?.totalDebates||0)/5)+1} Debater</div>
          </div>
          <button onClick={logout} style={{background:'transparent',border:'none',color:'var(--muted)',cursor:'pointer',fontSize:'11px'}}>Out</button>
        </div>
      </aside>
      <div className="main-area">
        <div className="topbar">
          <div style={{fontSize:'15px',fontWeight:600}}>{title}</div>
          <div style={{display:'flex',gap:8}}>{actions}</div>
        </div>
        <div className="page-content page-enter">{children}</div>
      </div>
    </div>
  );
}
