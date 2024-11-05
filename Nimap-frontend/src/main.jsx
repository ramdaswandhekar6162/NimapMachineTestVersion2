import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { BrowserRouter } from 'react-router-dom';
import { FaGithubSquare } from 'react-icons/fa';

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <BrowserRouter>
            <div className="flex min-h-screen flex-col bg-slate-900 text-slate-200">
                <header className="">
                    <h1 className="flex justify-center p-8 text-3xl text-slate-200">
                        NIMAP-INFOTECH PROJECT
                    </h1>
                </header>
                <main className="flex-grow basis-0">
                    <App />
                </main>
                <footer className="flex justify-center p-8">
                    <a href="https://github.com/ramdaswandhekar6162">
                        <FaGithubSquare />
                    </a>
                </footer>
            </div>
        </BrowserRouter>
    </StrictMode>
);
