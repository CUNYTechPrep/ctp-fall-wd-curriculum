// https://swapi.dev/api/

import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";

const root = createRoot(document.getElementById("root")!);

const Person = ({ personUrl }: { personUrl: string }) => {
    const [personIndex, setPersonIndex] = useState(1);
    const [personData, setPersonData] = useState(null);

    useEffect(() => {
        fetch(`${personUrl}/${personIndex}`)
            .then(response => response.json())
            .then(data => {
                setPersonData(data);
            });
    }, [personUrl, personIndex])

    useEffect(() => {
        const handler = () => {
            setPersonIndex(personIndex + 1);
        }
        window.addEventListener("click", handler)

        return () => {
            window.removeEventListener("click", handler)
        }
    }, [personIndex]);

    console.log("Person render");

    return (
        <div>
            {personData ? JSON.stringify(personData) : "Loading..."}
        </div>
    );
}

const App = () => {
    return <Person personUrl="https://swapi.dev/api/people" />;
}

root.render(<App />);