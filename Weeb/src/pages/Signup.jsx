import { Link } from 'react-router-dom';
import { useState } from 'react';
import { authApi } from '../api';

function Signup() {
  const [form, setForm] = useState({ first_name: '', last_name: '', email: '', password: '', confirmPassword: '' });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    setMessage('');
    if (form.password !== form.confirmPassword) {
      setError('Les mots de passe ne correspondent pas.');
      return;
    }
    try {
      await authApi.signup({
        first_name: form.first_name,
        last_name: form.last_name,
        email: form.email,
        password: form.password,
      });
      setMessage('Compte créé. Un administrateur doit valider votre compte avant connexion.');
      setForm({ first_name: '', last_name: '', email: '', password: '', confirmPassword: '' });
    } catch (requestError) {
      setError(Object.values(requestError.data || {}).flat().join(' ') || requestError.message);
    }
  }

  return (
    <>
      <section className="max-w-5xl mx-auto px-15 md:px-6  text-center m-20">
        {/* Header */}
        <div className="mb-12 rounded-lg">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
            Créer un compte
          </h1>
        </div>

        {/* Form */}
        <div className="mx-auto max-w-2xl rounded-xl p-10 bg-linear-to-br from-[#1a1f3c] to-[#151a33] shadow-xl border border-purple-400 ">
          <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-6 text-left">
            <input required placeholder="Prénom" value={form.first_name} onChange={(event) => setForm({ ...form, first_name: event.target.value })} className="bg-transparent border-b border-purple-400 text-white" />
            <input required placeholder="Nom" value={form.last_name} onChange={(event) => setForm({ ...form, last_name: event.target.value })} className="bg-transparent border-b border-purple-400 text-white" />
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
                minLength={8}
                value={form.password}
                onChange={(event) => setForm({ ...form, password: event.target.value })}
                className="w-full bg-transparent border-b border-purple-400 text-white focus:outline-none focus:border-purple-600"
              />
            </div>

            <div>
              <label className="block text-purple-300 text-sm mb-2">
                Confirmer mot de passe
              </label>
              <input
                type="password"
                required
                value={form.confirmPassword}
                onChange={(event) => setForm({ ...form, confirmPassword: event.target.value })}
                className="w-full bg-transparent border-b border-purple-400 text-white focus:outline-none focus:border-purple-600"
              />
            </div>

            <div className="col-span-2 flex justify-center mt-6">
              <button
                type="submit"
                className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-md shadow-md transition"
              >
                S'inscrire
              </button>
            </div>
            {error && <p className="col-span-2 text-red-300">{error}</p>}
            {message && <p className="col-span-2 text-green-300">{message}</p>}
          </form>
        </div>
        <p className="text-gray-400 p-10 "></p>
        <p className="text-gray-400">
          Vous avez déjà un compte?{' '}
          <Link to="/login" className="text-purple-700 hover:underline">
            Se connecter.
          </Link>
        </p>
      </section>
    </>
  );
}

export default Signup;
