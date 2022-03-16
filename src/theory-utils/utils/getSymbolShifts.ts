import { Symbol } from '../note/Symbol';

export const getSymbolShifts = (): { symbol: Symbol; shift: number }[] => [
    { symbol: '', shift: 0 },
    { symbol: '#', shift: 1 },
    { symbol: '##', shift: 2 },
    { symbol: 'b', shift: -1 },
    { symbol: 'bb', shift: -2 },
];
