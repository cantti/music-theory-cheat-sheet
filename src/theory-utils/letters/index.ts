import { LetterChar } from './LetterChar';
import { Letter } from './Letter';

class C extends Letter {
    char = 'C';
    index = 0;
}

class D extends Letter {
    char = 'D';
    index = 2;
}

class E extends Letter {
    char = 'E';
    index = 4;
}

class F extends Letter {
    char = 'F';
    index = 5;
}

class G extends Letter {
    char = 'G';
    index = 7;
}

class A extends Letter {
    char = 'A';
    index = 9;
}

class B extends Letter {
    char = 'B';
    index = 11;
}

function createLetter(char: LetterChar): Letter {
    switch (char) {
        case 'C':
            return new C();
        case 'D':
            return new D();
        case 'E':
            return new E();
        case 'F':
            return new F();
        case 'G':
            return new G();
        case 'A':
            return new A();
        case 'B':
            return new B();
        default:
            throw new Error();
    }
}

export type { LetterChar };

export { Letter, C, D, E, F, G, A, B, createLetter };
