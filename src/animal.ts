export default class Animal {
    private name: string;
    constructor(name: string) {
        this.name = name;
    }

    public makeSound(): string {
        return `${this.name} does some generic sound!`;
    }
}