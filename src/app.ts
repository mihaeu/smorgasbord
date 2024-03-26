import {Router} from "./router.ts";

export class App {
    constructor(private readonly router: Router) {

    }

    init() {
        const controller = this.router.route()
        document.getElementById('app')?.appendChild(controller.render());
    }
}