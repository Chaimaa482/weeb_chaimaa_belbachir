import { NavLink } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../useAuth';

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { isAuthenticated, logout } = useAuth();

  return (
    <header className=" max-w-4/5 xl:max-w-5xl mx-auto shadow-2xl rounded-2xl p-5 bg-white/5 ">
      <nav className="flex items-center justify-between">
        <NavLink to="/" className="text-2xl font-bold">
          weeb
        </NavLink>

        <ul className="hidden md:flex items-center gap-8 text-ms">
          <li>
            <NavLink
              to="/"
              className={({ isActive }) => (isActive ? 'font-bold' : '')}
            >
              Accueil 
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/contact"
              className={({ isActive }) => (isActive ? 'font-bold' : '')}
            >
              Contact
            </NavLink>
          </li>
          {isAuthenticated && (
            <li>
              <NavLink
                to="/articles"
                className={({ isActive }) => (isActive ? 'font-bold' : '')}
              >
                Articles
              </NavLink>
            </li>
          )}
        </ul>

        <div className="hidden md:flex items-center gap-8 text-ms">
          {isAuthenticated ? (
            <button onClick={logout} className="hover:text-purple-300 transition">
              Se déconnecter
            </button>
          ) : (
            <>
              <NavLink
                to="/login"
                className={({ isActive }) => (isActive ? 'font-bold' : '')}
              >
                Se connecter
              </NavLink>

              <NavLink
                to="/signup"
                className={({ isActive }) =>
                  `bg-purple-600 hover:bg-purple-700 transition px-5 py-2 rounded-lg ${
                    isActive ? 'font-bold' : ''
                  }`
                }
              >
                S'inscrire
              </NavLink>
            </>
          )}
        </div>
        {/* Mobile hamburger */}
        <button onClick={() => setOpen(!open)} className="md:hidden text-2xl">
          ☰
        </button>
      </nav>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden mt-4 flex flex-col gap-4 text-sm">
          <NavLink to="/" onClick={() => setOpen(false)}>
            Home
          </NavLink>

          <NavLink to="/contact" onClick={() => setOpen(false)}>
            Contact
          </NavLink>
          {isAuthenticated && (
            <NavLink to="/articles" onClick={() => setOpen(false)}>
              Articles
            </NavLink>
          )}

          <hr className="border-white/20" />

          {isAuthenticated ? (
            <button
              onClick={() => {
                logout();
                setOpen(false);
              }}
              className="text-left"
            >
              Se déconnecter
            </button>
          ) : (
            <>
              <NavLink to="/login" onClick={() => setOpen(false)}>
                Se connecter
              </NavLink>

              <NavLink
                to="/signup"
                onClick={() => setOpen(false)}
                className="bg-purple-600 hover:bg-purple-700 transition px-5 py-2 rounded-lg text-center"
              >
                S'inscrire
              </NavLink>
            </>
          )}
        </div>
      )}
    </header>
  );
}
