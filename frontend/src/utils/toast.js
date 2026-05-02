import Toastify from 'toastify-js';

const baseOptions = {
  duration: 3000,
  gravity: 'top',
  position: 'right',
  stopOnFocus: true,
  close: true,
  style: {
    borderRadius: '12px',
    fontWeight: '600',
    padding: '12px 16px',
    boxShadow: '0 10px 25px -5px rgb(0 0 0 / 0.1)',
  },
};

export const toast = {
  success: (text) =>
    Toastify({
      ...baseOptions,
      text,
      style: { ...baseOptions.style, background: '#059669', color: '#fff' },
    }).showToast(),
  error: (text) =>
    Toastify({
      ...baseOptions,
      text,
      style: { ...baseOptions.style, background: '#e11d48', color: '#fff' },
    }).showToast(),
};
