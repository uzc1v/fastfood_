import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Users, Search, Trash2, Phone, RefreshCw } from 'lucide-react';
import { apiService } from '../../services/api';
import { formatPhoneFull, formatDateTime } from '../../utils/formatters';

export default function VisitorsPanel() {
  const [visitors, setVisitors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [query, setQuery] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      setVisitors(await apiService.getVisitors());
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return visitors;
    const digits = q.replace(/\D/g, '');
    return visitors.filter(
      (v) =>
        `${v.firstName} ${v.lastName}`.toLowerCase().includes(q) ||
        (digits && v.phone.replace(/\D/g, '').includes(digits))
    );
  }, [visitors, query]);

  const handleDelete = async (visitor) => {
    if (!window.confirm(`${visitor.firstName} ${visitor.lastName} ro‘yxatdan o‘chirilsinmi?`)) return;
    try {
      await apiService.deleteVisitor(visitor.id);
      setVisitors((list) => list.filter((v) => v.id !== visitor.id));
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
        <div className="flex items-center gap-2 text-neutral-800">
          <Users className="w-5 h-5 text-red-800" />
          <h2 className="font-display text-xl font-extrabold">Mijozlar</h2>
          <span className="px-2.5 py-0.5 rounded-full bg-red-100 text-red-800 text-xs font-extrabold">
            {visitors.length}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative flex-1 sm:w-72">
            <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ism yoki telefon bo‘yicha qidirish"
              className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-neutral-200 bg-white text-sm focus:outline-none focus:ring-4 focus:ring-red-800/10 focus:border-red-800"
            />
          </div>
          <button
            onClick={load}
            aria-label="Yangilash"
            className="p-2.5 rounded-xl bg-white border border-neutral-200 hover:bg-amber-50 text-neutral-700 cursor-pointer"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {error ? (
        <div className="bg-red-50 border border-red-200 text-red-800 rounded-2xl p-5 text-sm font-semibold">
          {error}
        </div>
      ) : loading && visitors.length === 0 ? (
        <div className="h-48 rounded-3xl bg-white border border-neutral-200 animate-pulse" />
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-3xl border border-dashed border-neutral-300 p-14 text-center">
          <Users className="w-12 h-12 text-neutral-400 mx-auto mb-3" />
          <h3 className="font-display text-lg font-bold text-neutral-800">
            {visitors.length === 0 ? 'Hozircha mijozlar yo‘q' : 'Hech narsa topilmadi'}
          </h3>
          <p className="text-sm text-neutral-500 mt-1">
            {visitors.length === 0
              ? 'Saytga kirgan mijozlar shu yerda ko‘rinadi.'
              : 'Qidiruv so‘zini o‘zgartirib ko‘ring.'}
          </p>
        </div>
      ) : (
        <>
          {/* Katta ekran: jadval */}
          <div className="hidden md:block bg-white rounded-3xl border border-neutral-200 shadow-sm overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-amber-50 text-neutral-600 text-xs uppercase tracking-wider">
                <tr>
                  <th className="text-left font-bold px-5 py-3.5">Ism, familiya</th>
                  <th className="text-left font-bold px-5 py-3.5">Telefon</th>
                  <th className="text-left font-bold px-5 py-3.5">Oxirgi kirish</th>
                  <th className="text-center font-bold px-5 py-3.5">Kirishlar</th>
                  <th className="px-5 py-3.5" />
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {filtered.map((v) => (
                  <tr key={v.id} className="hover:bg-amber-50/40">
                    <td className="px-5 py-3.5 font-bold text-neutral-900">
                      {v.firstName} {v.lastName}
                    </td>
                    <td className="px-5 py-3.5">
                      <a href={`tel:${v.phone}`} className="font-semibold text-red-800 hover:underline whitespace-nowrap">
                        {formatPhoneFull(v.phone)}
                      </a>
                    </td>
                    <td className="px-5 py-3.5 text-neutral-500 whitespace-nowrap">
                      {formatDateTime(v.lastVisitAt)}
                    </td>
                    <td className="px-5 py-3.5 text-center font-bold text-neutral-700">{v.visitCount}</td>
                    <td className="px-5 py-3.5 text-right">
                      <button
                        onClick={() => handleDelete(v)}
                        aria-label="O‘chirish"
                        className="p-2 rounded-lg text-red-700 hover:bg-red-50 cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobil: kartochkalar */}
          <div className="md:hidden space-y-3">
            {filtered.map((v) => (
              <div key={v.id} className="bg-white rounded-2xl border border-neutral-200 p-4 flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="font-bold text-neutral-900 truncate">
                    {v.firstName} {v.lastName}
                  </p>
                  <a
                    href={`tel:${v.phone}`}
                    className="inline-flex items-center gap-1.5 text-sm font-semibold text-red-800 mt-1"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    {formatPhoneFull(v.phone)}
                  </a>
                  <p className="text-xs text-neutral-500 mt-1.5">
                    {formatDateTime(v.lastVisitAt)} · {v.visitCount} marta kirgan
                  </p>
                </div>
                <button
                  onClick={() => handleDelete(v)}
                  aria-label="O‘chirish"
                  className="p-2 rounded-lg text-red-700 bg-red-50 shrink-0 cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
