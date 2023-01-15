export abstract class Letter {
    abstract readonly char: string;
    abstract readonly index: number;
    toString() {
        return this.char;
    }
    equals(other: Letter) {
        return this.char === other.char;
    }
}
