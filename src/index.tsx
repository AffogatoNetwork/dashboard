import React from "react";

import App from './App';
import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';

const rootElement = document.getElementById('root');

// 👇️ non-null (!) assertion
const root = createRoot(rootElement!);

root.render(
    <StrictMode>
        <App />
    </StrictMode>,
);
