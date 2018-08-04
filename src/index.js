import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import 'leaflet/dist/leaflet.css';
import './index.css';
import registerServiceWorker from './registerServiceWorker';
//import registerServiceWorker from './reg_sw';

ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();
