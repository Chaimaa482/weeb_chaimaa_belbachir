import { useState } from 'react';
import { authApi } from '../api';

export default function ResetPassword() {
  const [step, setStep] = useState('request');
  const [form, setForm] = useState({ email: '', uid: '', token: '', new_password: '' });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  async function requestReset(event) {
    event.preventDefault();
    setError('');
    try {
      const data = await authApi.requestPasswordReset(form.email);
      if (data.uid && data.token) {
        setForm({ ...form, uid: data.uid, token: data.token });
        setStep('confirm');
        setMessage('Un jeton de réinitialisation a été généré. Saisissez votre nouveau mot de passe.');
      } else {
        setMessage(data.message);
      }
    } catch (requestError) {
      setError(requestError.message);
    }
  }

  async function confirmReset(event) {
    event.preventDefault();
    setError('');
    try {
      const data = await authApi.confirmPasswordReset({
        uid: form.uid,
        token: form.token,
        new_password: form.new_password,
      });
      setMessage(data.message);
      setStep('done');
    } catch (requestError) {
      setError(Object.values(requestError.data || {}).flat().join(' ') || requestError.message);
    }
  }

  return (
    <section className="max-w-2xl mx-auto m-20 px-6">
      <h1 className="text-4xl font-bold mb-8">Réinitialiser le mot de passe</h1>
      {step === 'request' && (
        <form onSubmit={requestReset} className="grid gap-4">
          <input required type="email" placeholder="Email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} className="bg-transparent border-b border-purple-400 p-2" />
          <button className="bg-purple-600 rounded-md p-2">Demander un jeton</button>
        </form>
      )}
      {step === 'confirm' && (
        <form onSubmit={confirmReset} className="grid gap-4">
          <input
            required
            minLength={8}
            type="password"
            placeholder="Nouveau mot de passe"
            value={form.new_password}
            onChange={(event) => setForm({ ...form, new_password: event.target.value })}
            className="bg-transparent border-b border-purple-400 p-2"
          />
          <button className="bg-purple-600 rounded-md p-2">Changer le mot de passe</button>
        </form>
      )}
      {message && <p className="text-green-300 mt-4">{message}</p>}
      {error && <p className="text-red-300 mt-4">{error}</p>}
    </section>
  );
}
