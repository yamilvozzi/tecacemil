export default function ConfirmDialog({ title, message, onConfirm, onCancel, danger = true }) {
  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="confirm-dialog" onClick={e => e.stopPropagation()}>
        <h3>{title || '¿Estás seguro?'}</h3>
        {message && <p>{message}</p>}
        <div className="confirm-actions">
          <button className="btn btn-secondary" onClick={onCancel}>
            Cancelar
          </button>
          <button
            className="btn"
            onClick={onConfirm}
            style={{
              background: danger ? 'var(--red-lite)' : 'var(--accent)',
              color: danger ? 'var(--red)' : '#fff',
              border: danger ? '1px solid var(--red)' : 'none',
            }}
          >
            Eliminar
          </button>
        </div>
      </div>
    </div>
  )
}
