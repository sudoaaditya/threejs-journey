import Experience from '../Experience';
import Environment from './Environment';
import Floor from './Floor';
import Fox from './Fox';

export default class World {
    constructor() {
        this.experience = new Experience();
        this.scene = this.experience.scene;
        this.resources = this.experience.resources;
    
        this.resources.on('ready', () => {
            this.fox = new Fox();
            this.floor = new Floor();

            this.environment = new Environment();
        });
    }

    update = () => {
        this.fox && this.fox.update();
    }
}