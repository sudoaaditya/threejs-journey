import Robot from "./Robot";

class FlyingRobot extends Robot {
    
    constructor(name, legs) {
        super(name, legs);
        
    }

    sayHi() {
        console.log(`Hello! My name is ${this.name}, and i'm a flying robot`)
    }
    

    takeOff() {
        console.log(`Have a good flight, ${this.name}`);
    }

    takeOff() {
        console.log(`Welcome back!, ${this.name}`);
    }
}

export default FlyingRobot;