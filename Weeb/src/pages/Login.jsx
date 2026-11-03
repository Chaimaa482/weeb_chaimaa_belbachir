import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../useAuth';

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(form.email, form.password);
      navigate('/articles');
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <section className="max-w-5xl mx-auto px-15 md:px-6  text-center m-20">
        {/* Header */}
        <div className="mb-12 rounded-lg">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">Se connecter</h1>
        </div>

        {/* Form */}
        <div className="mx-auto max-w-2xl rounded-xl p-10 bg-linear-to-br from-[#1a1f3c] to-[#151a33] shadow-xl border border-purple-400 ">
          <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-6 text-left">
            <div className="col-span-2">
              <label className="block text-purple-300 text-sm mb-2">
                Email
              </label>
              <input
                type="email"
                required
                value={form.email}
                onChange={(event) => setForm({ ...form, email: event.target.value })}
                className="w-full bg-transparent border-b border-purple-400 text-white focus:outline-none focus:border-purple-600"
              />
            </div>

            <div>
              <label className="block text-purple-300 text-sm mb-2">
                Mot de passe
              </label>
              <input
                type="password"
                required
                value={form.password}
                onChange={(event) => setForm({ ...form, password: event.target.value })}
                className="w-full bg-transparent border-b border-purple-400 text-white focus:outline-none focus:border-purple-600"
              />
            </div>

            <div className="col-span-2 flex justify-center mt-6">
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-md shadow-md transition"
              >
                {loading ? 'Connexion...' : 'Se connecter'}
              </button>
            </div>
            {error && <p className="col-span-2 text-red-300">{error}</p>}
          </form>
        </div>
        <div className="p-10 flex flex-col gap-10">
          <Link to="/reset-password" className="text-purple-300 hover:underline">
            Mot de passe oublié ?
          </Link>
          <p className="text-gray-400">
            Vous n'avez pas de compte ?{' '}
            <Link to="/signup" className="text-purple-700 hover:underline">
              Créer un.
            </Link>
          </p>
        </div>
      </section>
    </>
  );
}

export default Login;
