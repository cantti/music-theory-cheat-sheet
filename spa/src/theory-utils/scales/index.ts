import { createMajor } from './createMajor';
import { createNaturalMinor } from './createNaturalMinor';

export type ScaleName = 'major' | 'naturalMinor';

export const getScale = (scaleName: ScaleName) => {
    switch (scaleName) {
        case 'major':
            return createMajor();
        case 'naturalMinor':
            return createNaturalMinor();
        default:
            throw Error('Invalid scale name');
    }
};

export { createMajor, createNaturalMinor };
