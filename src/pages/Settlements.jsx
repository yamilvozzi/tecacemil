import { useState } from 'react'
import { useFinances } from '../hooks/useFinances'
import { useAuth } from '../context/AuthContext'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'

function fmt(n) {
  return new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format(n)
}

function SettlementModal({ onClose, onSave, userId, profiles, summary }) {
  const today = format(new Date(), 'yyyy-MM-dd')
  const otherUser = profiles.find(p => p.id !== userId)

  const [form, setForm] = useState({
    to_user_id: otherUser?.id || '',
    amount: summary?.debtResult ? Math.round(summary.debtResult.amount).toString() : '',
    date: today,
    note: '',
  })
  const [loading, setLoading] = useState(false)

  function set(key, val) { setForm(f => ({ ...f, [key]: val })) }

  async function handleSave() {
    if (!form.amount || !form.to_user_id) return
    setLoading(true)
    await onSave({ ...form, amount: Number(form.amount), from_user_id: userId })
    setLoading(false)
    onClose()
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <h2 className="modal-title">Registrar transferencia</h2>

        <div className="form-row">
          <label className="form-label">Para</label>
          <select value={form.to_user_id} onChange={e => set('to_user_id', e.target.value)}>
            {profiles.filter(p => p.id !== userId).map(p => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
        </div>

        <div className="form-grid-2">
          <div className="form-row">
            <label className="form-label">Monto ($)</label>
            <input
              type="number"
              value={form.amount}
              onChange={e => set('amount', e.target.value)}
              placeholder="0"
              min="0"
              autoFocus
            />
          </div>
          <div className="form-row">
            <label className="form-label">Fecha</label>
            <input
              type="date"
              value={form.date}
              onChange={e => set('date', e.target.value)}
            />
          </div>
        </div>

        <div className="form-row">
          <label className="form-label">Nota (opcional)</label>
          <input
            type="text"
            value={form.note}
            onChange={e => set('note', e.target.value)}
            placeholder="Ej: Saldo de febrero"
          />
        </div>

        {summary?.debtResult && (
          <div style={{
            background: 'rgba(200,136,58,0.08)',
            border: '1px solid rgba(200,136,58,0.2)',
            borderRadius: 'var(--radius-sm)',
            padding: '0.75rem',
            fontSize: '0.82rem',
            color: 'var(--text-muted)',
            marginBottom: '0.5rem',
          }}>
            💡 La deuda pendiente es <strong style={{ color: 'var(--accent)' }}>{fmt(summary.debtResult.amount)}</strong>
            {' '}({summary.debtResult.from} → {summary.debtResult.to})
          </div>
        )}

        <div className="form-actions">
          <button className="btn btn-secondary" onClick={onClose}>Cancelar</button>
          <button
            className="btn btn-primary"
            onClick={handleSave}
            disabled={loading || !form.amount}
          >
            {loading ? 'Guardando...' : 'Guardar'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default function Settlements({ selectedMonth }) {
  const { user } = useAuth()
  const { settlements, profiles, summary, loading, addSettlement, deleteSettlement } = useFinances(selectedMonth)
  const [showModal, setShowModal] = useState(false)

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Transferencias</h1>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          + Nueva
        </button>
      </div>

      {summary?.debtResult && (
        <div className="debt-callout mb-2">
          <div className="debt-callout-icon">💸</div>
          <div>
            <div className="debt-callout-text">
              Deuda pendiente este mes:{' '}
              <strong style={{ color: summary.debtResult.from === 'Yamil' ? 'var(--yamil)' : 'var(--celeste-color)' }}>
                {summary.debtResult.from}
              </strong>
              {' → '}
              <strong style={{ color: summary.debtResult.to === 'Yamil' ? 'var(--yamil)' : 'var(--celeste-color)' }}>
                {summary.debtResult.to}
              </strong>
            </div>
            <div className="debt-callout-amount">{fmt(summary.debtResult.amount)}</div>
          </div>
        </div>
      )}

      {loading ? (
        <div className="loading">Cargando...</div>
      ) : settlements.length === 0 ? (
        <div className="empty-state">No hay transferencias registradas este mes.</div>
      ) : (
        <div className="card" style={{ padding: 0 }}>
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Fecha</th>
                  <th>De</th>
                  <th>Para</th>
                  <th>Nota</th>
                  <th style={{ textAlign: 'right' }}>Monto</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {settlements.map(st => {
                  const fromName = st.from?.profiles?.name || '?'
                  const toName = st.to?.profiles?.name || '?'
                  return (
                    <tr key={st.id}>
                      <td style={{ color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
                        {format(new Date(st.date + 'T00:00:00'), 'd MMM', { locale: es })}
                      </td>
                      <td>
                        <span className={`tag tag-${fromName.toLowerCase()}`}>{fromName}</span>
                      </td>
                      <td>
                        <span className={`tag tag-${toName.toLowerCase()}`}>{toName}</span>
                      </td>
                      <td style={{ color: 'var(--text-muted)' }}>{st.note || '—'}</td>
                      <td style={{ textAlign: 'right', fontWeight: 500, color: 'var(--accent)' }}>
                        {fmt(st.amount)}
                      </td>
                      <td>
                        {(st.from_user_id === user?.id || st.from?.id === user?.id) && (
                          <button className="btn btn-danger" onClick={() => deleteSettlement(st.id)}>✕</button>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {showModal && (
        <SettlementModal
          onClose={() => setShowModal(false)}
          onSave={addSettlement}
          userId={user?.id}
          profiles={profiles}
          summary={summary}
        />
      )}
    </div>
  )
}
