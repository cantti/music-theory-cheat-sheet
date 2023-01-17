import { createRoot } from 'react-dom/client';
import {
    createBrowserRouter,
    createRoutesFromElements,
    Navigate,
    Route,
    RouterProvider,
} from 'react-router-dom';
import { AboutMe } from './components/AboutMe';
import App from './components/App';
import { Circle, CircleErrorElement } from './components/Circle';
import { DetectScaleByNotes } from './components/DetectScaleByNotes';
import { ScaleInfo, ScaleInfoErrorElement } from './components/ScaleInfo';
import './index.scss';
import { defaultScaleParam } from './utils/url';

const router = createBrowserRouter(
    createRoutesFromElements(
        <Route
            path="/"
            element={<App />}
            errorElement={'App error. Please refresh the page and try again.'}
        >
            <Route
                path="/"
                element={<Navigate to={`/circle/${defaultScaleParam}`} />}
            />

            <Route
                path="/detect-scale-by-notes"
                element={<DetectScaleByNotes />}
            />

            <Route path="/discography" element={<AboutMe />} />

            <Route
                path="/circle"
                element={<Navigate to={`/circle/${defaultScaleParam}`} />}
            />
            <Route
                path="/circle/:scale"
                element={<Circle />}
                errorElement={<CircleErrorElement />}
            />

            <Route
                path="/scales"
                element={<Navigate to={`/scales/${defaultScaleParam}`} />}
            />
            <Route
                path="/scales/:scale"
                element={<ScaleInfo />}
                errorElement={<ScaleInfoErrorElement />}
            />
        </Route>
    ),
    { basename: process.env.PUBLIC_URL }
);

createRoot(document.getElementById('root')!).render(
    <RouterProvider router={router} />
);
