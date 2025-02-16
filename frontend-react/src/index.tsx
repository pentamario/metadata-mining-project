import React from 'react'
import * as ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App'

const rootElement = document.getElementById('root')
if (!rootElement) throw new Error('Root element not found')

const root = ReactDOM.createRoot(rootElement)
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <h1 className="text-3xl font-semibold bg-primary text-white w-screen h-14 fixed top-0 left-0 flex items-center uppercase ps-4 md:ps-4 lg:ps-11 z-[10000]">
        GitHub Issues
      </h1>
      <div className="pt-20">
        <App/>
      </div>
    </BrowserRouter>
  </React.StrictMode>
)
