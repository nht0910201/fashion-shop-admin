import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import GlobalStyles from './components/GlobalStyles'
import { NextUIProvider } from '@nextui-org/react';
import { Provider } from 'react-redux';
import { store } from './redux/store';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <Provider store={store}>
        <GlobalStyles>
            <NextUIProvider>
                <App />
            </NextUIProvider>
        </GlobalStyles>
    </Provider>
);

