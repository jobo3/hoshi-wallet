import React, { useEffect } from 'react'
import { Modal } from 'bootstrap'
import classNames from 'classnames'
import { useSelector } from 'react-redux'

const ConfirmModal = ({ id='modal', title='Title', show, children, onClose, onConfirm }) => {

  const darkMode = useSelector((state) => state.settings.darkMode)
  const closeBtnClasses = classNames({
    'btn-close': true,
    'btn-close-white': darkMode
  })

  useEffect(() => {
    window.addEventListener('hidden.bs.modal', onClose)
    return () => {
      window.removeEventListener('hidden.bs.modal', onClose)
    }
  }, [])

  useEffect(() => {
    let modalEl = document.getElementById(id)
    let modal = Modal.getOrCreateInstance(modalEl)
    if (modal) {
      if (show) {
        modal.show()
      }
      else {
        modal.hide()
      }
    }
  }, [show])

  return (
    <div className="modal" id={id} tabIndex="-1">
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">{title}</h5>
            <button type="button" className={closeBtnClasses} aria-label="Close" data-bs-dismiss={id}></button>
          </div>
          <div className="modal-body">
            {children}
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" data-bs-dismiss={id}>Cancel</button>
            <button type="button" className="btn btn-primary" onClick={onConfirm}>Confirm</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ConfirmModal