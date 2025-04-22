import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { ModalProvider } from './contexts/ModalContext'
import './css/index.css'
import App from "./App.jsx"
import 'flowbite'

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <BrowserRouter>
            < ModalProvider>	
                <App/>
            </ModalProvider>	    
        </BrowserRouter>
    </StrictMode>,
)
