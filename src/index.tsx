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
import { ScaleInfo } from './components/ScaleInfo';
import { createRoot } from 'react-dom/client';

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
        </Route>
    ),
    { basename: process.env.PUBLIC_URL }
);

createRoot(document.getElementById('root')!).render(
    <RouterProvider router={router} />
);
