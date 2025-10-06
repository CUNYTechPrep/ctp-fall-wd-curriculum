import React from 'react';
import { createRoot } from 'react-dom/client';

let x: number | undefined = undefined;
const root = createRoot(document.getElementById('root')!)

const useX = (initial: number) => {
    if (x === undefined) {
        x = initial;
    }

    return [x, (newValue: number) => {
        x = newValue;

        root.render(<Component message="Hello2" />);
    }] as const;
}

// ### The Four Aspects of React

// 1. Its all a composed function
const Component = (
    // 2. That Takes arguments
    { message }: { message: string }
) => {
    // 3. That through hooks, does side effects like reading and writing state
    const [value, setValue] = useX(10);

    // 4. And returns JSX (The page)
    return <div onClick={() => setValue(value + 1)}>{message}: {value}</div>;
}

root.render(<Component message="Hello" />);
