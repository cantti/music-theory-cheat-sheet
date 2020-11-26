import React from "react";
import "./App.css";
import { notesByInterval } from "./theory-utils";

function App() {
    return (
        <div>
            {JSON.stringify(
                notesByInterval({ octave: 0, letter: "A", symbol: "None" }, [
                    { name: "Second", quality: "Minor" },
                ])
            )}
        </div>
    );
}

export default App;
