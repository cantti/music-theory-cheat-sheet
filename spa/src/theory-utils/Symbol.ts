export type Symbol = "None" | "Sharp" | "DoubleSharp" | "Flat" | "DoubleFlat";

export const symbols: { symbol: Symbol; shift: number }[] = [
    { symbol: "None", shift: 0 },
    { symbol: "Sharp", shift: 1 },
    { symbol: "DoubleSharp", shift: 2 },
    { symbol: "Flat", shift: -1 },
    { symbol: "DoubleFlat", shift: -2 },
];
