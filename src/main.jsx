import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import AuditoriaForm from './AuditoriaForm.jsx'
import UserForm from './UserForm.jsx'
import ProductForm from './ProductForm.jsx'
import TransformadorForm from './TransformadorForm.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <TransformadorForm />
  </StrictMode>,
)
