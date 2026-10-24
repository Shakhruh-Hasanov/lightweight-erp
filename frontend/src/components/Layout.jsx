import { useEffect, useState } from 'react';
import { NAV_SECTIONS } from '../navigation';
import { Link } from '../router';
import Icon from './Icon';
import ThemeToggle from './ThemeToggle';

// The frame around every page:
//   - a sidebar on the left with all modules, grouped into sections
//   - the current page on the right
// On small screens (phones) the sidebar hides behind a ☰ menu button.
export default function Layout({ currentPath, children }) {
  const [menuOpen, setMenuOpen] = useState(false);

  // Close the phone menu whenever you go to another page.
  useEffect(() => setMenuOpen(false), [currentPath]);

  const isActive = (to) => (to === '/' ? currentPath === '/' : currentPath === to || currentPath.startsWith(`${to}/`));

  return (
    <div className={`shell ${menuOpen ? 'menu-open' : ''}`}>
      <aside className="sidebar">
        <div className="sidebar-brand">
          <span className="brand-mark">L</span>
          <span>Lightweight ERP</span>
          <button className="icon-button sidebar-close" onClick={() => setMenuOpen(false)} aria-label="Close menu">
            <Icon name="close" />
          </button>
        </div>

        <nav className="sidebar-nav">
          {NAV_SECTIONS.map((section, index) => (
            <div className="nav-section" key={section.title ?? index}>
              {section.title && <div className="nav-section-title">{section.title}</div>}
              {section.items.map((item) => (
                <Link key={item.to} to={item.to} className={`nav-item ${isActive(item.to) ? 'active' : ''}`}>
                  <Icon name={item.icon} />
                  <span className="nav-label">{item.label}</span>
                  {item.status !== 'ready' && (
                    <span className={`nav-dot nav-dot-${item.status}`} title={item.status === 'todo' ? 'Waiting on backend' : 'Planned'} />
                  )}
                </Link>
              ))}
            </div>
          ))}
        </nav>

        <div className="sidebar-footer">
          <ThemeToggle />
          <div className="legend">
            <span><span className="nav-dot nav-dot-todo" /> waiting on backend</span>
            <span><span className="nav-dot nav-dot-planned" /> planned</span>
          </div>
        </div>
      </aside>

      {/* Dark overlay behind the phone menu; tap it to close. */}
      <div className="sidebar-backdrop" onClick={() => setMenuOpen(false)} />

      <div className="main">
        <header className="mobile-bar">
          <button className="icon-button" onClick={() => setMenuOpen(true)} aria-label="Open menu">
            <Icon name="menu" />
          </button>
          <span className="brand-small">Lightweight ERP</span>
        </header>
        <main className="page">{children}</main>
      </div>
    </div>
  );
}
