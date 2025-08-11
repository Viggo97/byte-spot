export class OptionIdGenerator {
    private id = 0;

    nextId(): number {
        return this.id++;
    }
}
