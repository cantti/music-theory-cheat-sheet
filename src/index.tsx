import {
    createBrowserRouter,
    createRoutesFromElements,
    Navigate,
    Route,
    RouterProvider,
} from 'react-router-dom';
import { AboutMe } from './components/AboutMe';
import App from './components/App';
import { DetectScaleByNotes } from './components/DetectScaleByNotes';
import { ScaleInfo } from './components/Circle';
import { createRoot } from 'react-dom/client';
import './index.scss';
import { Scale } from './components/Scale';

const router = createBrowserRouter(
    createRoutesFromElements(
        <Route path="/" element={<App />}>
            <Route path="/" element={<Navigate to="/circle/C" />} />
            <Route
                path="/detect-scale-by-notes"
                element={<DetectScaleByNotes />}
            />
            <Route path="/discography" element={<AboutMe />} />
            <Route path="/circle/:scale" element={<ScaleInfo />} />
            <Route path="/scales/:scale" element={<Scale />} />
        </Route>
    ),
    { basename: process.env.PUBLIC_URL }
);

createRoot(document.getElementById('root')!).render(
    <RouterProvider router={router} />
);
