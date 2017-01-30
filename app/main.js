import { Visualizer } from "./Visualizer.js"


(function () {
    console.log('this');
    let container,
        audio_element,
        visualizer;

    container = document.querySelector("#main");
    audio_element = document.querySelector("audio");
    visualizer = new Visualizer(
                    container,
                    audio_element,
                    {"data": "/assets/data.json"}
    );

})();
