import { createRoot } from "react-dom/client";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Navigate,
  Route,
  RouterProvider,
} from "react-router-dom";
import { AboutMe } from "./components/AboutMe";
import App from "./components/App";
import { Circle, CircleErrorElement } from "./components/Circle";
import { DetectScaleByNotes } from "./components/DetectScaleByNotes";
import { NumberOfAccidentalsGame } from "./components/games/NumberOfAccidentalsGame";
import {
  ScalesCatalog,
  ScaleInfoErrorElement,
} from "./components/ScalesCatalog";
import "./index.scss";
import { defaultScaleParam } from "./utils/url";
import "react-toastify/dist/ReactToastify.css";
import { ReadingTrainerGame } from "./components/games/ReadingTrainerGame";
import { ChordSequencer } from "./components/ChordSequencer";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route
      path="/"
      element={<App />}
      errorElement={"App error. Please refresh the page and try again."}
    >
      <Route
        path="/"
        element={<Navigate to={`/circle/${defaultScaleParam}`} />}
      />

      <Route path="/detect-scale-by-notes" element={<DetectScaleByNotes />} />

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
        element={<ScalesCatalog />}
        errorElement={<ScaleInfoErrorElement />}
      />

      <Route
        path="/games/number-of-accidentals"
        element={<NumberOfAccidentalsGame />}
      />

      <Route path="/games/reading-trainer" element={<ReadingTrainerGame />} />

      <Route path="/chord-sequencer" element={<ChordSequencer />} />
    </Route>,
  ),
  { basename: import.meta.env.BASE_URL },
);

createRoot(document.getElementById("root")!).render(
  <RouterProvider router={router} />,
);
