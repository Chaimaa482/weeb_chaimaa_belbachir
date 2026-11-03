import { useEffect, useState } from 'react';
import { Link, Route, Routes, useNavigate, useParams } from 'react-router-dom';
import { articlesApi } from '../api';
import { useAuth } from '../useAuth';

function ArticleList() {
  const [articles, setArticles] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    articlesApi.list().then(setArticles).catch((requestError) => setError(requestError.message));
  }, []);

  return (
    <section className="max-w-5xl mx-auto m-20 px-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">Articles</h1>
        <Link to="new" className="bg-purple-600 rounded-md px-4 py-2">Nouvel article</Link>
      </div>
      {error && <p className="text-red-300">{error}</p>}
      <div className="grid gap-4">
        {articles.map((article) => (
          <Link key={article.id} to={`${article.id}`} className="rounded-xl bg-white/5 p-6 hover:bg-white/10">
            <h2 className="text-2xl font-semibold">{article.title}</h2>
            <p className="text-gray-400 mt-2">{article.excerpt}</p>
            <p className="text-sm text-purple-300 mt-3">{article.author_name}</p>
          </Link>
        ))}
        {!articles.length && !error && <p className="text-gray-400">Aucun article publié.</p>}
      </div>
    </section>
  );
}

function ArticleDetail() {
  const { id } = useParams();
  const { isAuthenticated } = useAuth();
  const [article, setArticle] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    articlesApi.get(id).then(setArticle).catch((requestError) => setError(requestError.message));
  }, [id]);

  async function remove() {
    if (!window.confirm('Supprimer cet article ?')) return;
    try {
      await articlesApi.remove(id);
      window.location.href = '/articles';
    } catch (requestError) {
      setError(requestError.message);
    }
  }

  if (error) return <p className="m-20 text-red-300">{error}</p>;
  if (!article) return <p className="m-20">Chargement...</p>;
  return (
    <article className="max-w-3xl mx-auto m-20 px-6">
      <h1 className="text-4xl font-bold">{article.title}</h1>
      <p className="text-purple-300 mt-2">{article.author_name}</p>
      <div className="mt-8 whitespace-pre-wrap text-gray-300">{article.content}</div>
      {isAuthenticated && (
        <div className="flex gap-4 mt-8">
          <Link to="edit" className="bg-purple-600 rounded-md px-4 py-2">Modifier</Link>
          <button onClick={remove} className="border border-red-400 rounded-md px-4 py-2">Supprimer</button>
        </div>
      )}
    </article>
  );
}

function ArticleEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const editing = Boolean(id);
  const [form, setForm] = useState({ title: '', slug: '', excerpt: '', content: '' });
  const [error, setError] = useState('');

  useEffect(() => {
    if (editing) articlesApi.get(id).then(setForm).catch((requestError) => setError(requestError.message));
  }, [editing, id]);

  async function save(event) {
    event.preventDefault();
    try {
      const article = editing ? await articlesApi.update(id, form) : await articlesApi.create(form);
      navigate(`/articles/${article.id}`);
    } catch (requestError) {
      setError(Object.values(requestError.data || {}).flat().join(' ') || requestError.message);
    }
  }

  return (
    <section className="max-w-3xl mx-auto m-20 px-6">
      <h1 className="text-4xl font-bold mb-8">{editing ? 'Modifier l’article' : 'Nouvel article'}</h1>
      <form onSubmit={save} className="grid gap-4">
        <input required placeholder="Titre" value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} className="bg-transparent border-b border-purple-400 p-2" />
        <input required placeholder="Slug" value={form.slug} onChange={(event) => setForm({ ...form, slug: event.target.value })} className="bg-transparent border-b border-purple-400 p-2" />
        <input placeholder="Résumé" value={form.excerpt} onChange={(event) => setForm({ ...form, excerpt: event.target.value })} className="bg-transparent border-b border-purple-400 p-2" />
        <textarea required rows={10} placeholder="Contenu" value={form.content} onChange={(event) => setForm({ ...form, content: event.target.value })} className="bg-transparent border border-purple-400 p-2" />
        <button className="bg-purple-600 rounded-md p-2">{editing ? 'Enregistrer' : 'Créer'}</button>
      </form>
      {error && <p className="text-red-300 mt-4">{error}</p>}
    </section>
  );
}

export default function Articles() {
  return (
    <Routes>
      <Route index element={<ArticleList />} />
      <Route path="new" element={<ArticleEditor />} />
      <Route path=":id/edit" element={<ArticleEditor />} />
      <Route path=":id" element={<ArticleDetail />} />
    </Routes>
  );
}
