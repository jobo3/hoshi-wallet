import React, { useEffect } from 'react'
import { Toast as BsToast } from 'bootstrap'

const Toast = ({ id='toast', message='Hi!', delay=5000, onClose, show, color='success'}) => {

  let toastClasses = `toast align-items-center text-white bg-${color} border-0`

  useEffect(() => {
    window.addEventListener('hidden.bs.toast', onClose)
    return () => {
      window.removeEventListener('hidden.bs.toast', onClose)
    }
  }, [])

  useEffect(() => {
    let toastEl = document.getElementById(id)
    let toast = BsToast.getOrCreateInstance(toastEl, { delay: delay })
    if (toast) {
      if (show) {
        toast.show()
      }
      else {
        toast.hide()
      }
    }
  }, [show])

  return (
    <div className="toast-position">
      <div id={id} className={toastClasses} role="alert" aria-live="assertive" aria-atomic="true">
        <div className="d-flex">
          <div className="toast-body">
            {message}
          </div>
          <button type="button" className="btn-close btn-close-white me-2 m-auto" data-bs-dismiss={id} aria-label="Close"></button>
        </div>
      </div>
    </div>
  )
}

export default Toast