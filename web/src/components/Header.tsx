import { NavLink } from 'react-router-dom';

export default function Header() {
  return (
    <header className="header">
      <nav className="nav container" aria-label="Main navigation">
        <div className="title">IDP Dashboard</div>
        <NavLink to="/" end className={({isActive}) => isActive ? 'active' : ''}>Overview</NavLink>
        <NavLink to="/services" className={({isActive}) => isActive ? 'active' : ''}>Services</NavLink>
        <NavLink to="/deployments" className={({isActive}) => isActive ? 'active' : ''}>Deployments</NavLink>
      </nav>
    </header>
  );
}
