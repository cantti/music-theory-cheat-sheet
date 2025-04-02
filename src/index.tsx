import { createRoot } from 'react-dom/client';
import App from './components/App';
import './index.scss';
import 'react-toastify/dist/ReactToastify.css';

createRoot(document.getElementById('root')!).render(<App />);
