import Animal from "./animal";

const rootElement: HTMLElement | null = document.getElementById("root");
if (rootElement != null) {
    rootElement.innerHTML = "<h1>Hello TypeScript</h1>";
    
    const theAnimal = new Animal("generic animal");
    var animalSoundElement = document.createElement('h2');
    animalSoundElement.innerHTML = theAnimal.makeSound();
    rootElement.appendChild(animalSoundElement);
}
