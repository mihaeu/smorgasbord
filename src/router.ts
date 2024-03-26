import {Controller} from "./controller.ts";
import {MainController} from "./mainController.ts";
import {Model} from "./model.ts";

export class Router {
    route(): Controller {
        const urlSearchParams = new URLSearchParams(window.location.search);
        return new MainController(new Model(urlSearchParams.get("share")))
    }
}