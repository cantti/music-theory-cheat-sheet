export abstract class Letter {
    abstract readonly char: string;
    abstract readonly index: number;
    public toString() {
        return this.char;
    }
    public equals(other: Letter) {
        return this.char === other.char;
    }
}

export class C extends Letter {
    char = 'C';
    index = 0;
}

export class D extends Letter {
    char = 'D';
    index = 2;
}

export class E extends Letter {
    char = 'E';
    index = 4;
}

export class F extends Letter {
    char = 'F';
    index = 5;
}

export class G extends Letter {
    char = 'G';
    index = 7;
}

export class A extends Letter {
    char = 'A';
    index = 9;
}

export class B extends Letter {
    char = 'B';
    index = 11;
}

export const allLetters = [
    new C(),
    new D(),
    new E(),
    new F(),
    new G(),
    new A(),
    new B(),
];
