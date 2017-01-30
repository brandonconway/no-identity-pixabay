import { Http } from './Http.js'


class Visualizer {

    constructor (container, audio_element, options) {
        this.i = 0;
        this.player = audio_element;
        this.container = container;

        var that = this;
        if (typeof options.data  === 'string') {
            let http = new Http();
            http.get(options.data)
                .then(JSON.parse)
                .then((response) => {
                        this.data = response;
                        this.init();
                    })
                .catch(function(error) { throw new Error(error); });
        }
        else {
            this.data = options.data;
            this.init();
        }
    }

    init () {
        console.log('init');
        console.log(this.player);
        // render
        this.canvas = document.createElement('canvas');
        this.canvas.setAttribute("width", 800);
        this.canvas.setAttribute("height", 400);
        this.container.append(this.canvas);
        this.ctx = this.canvas.getContext('2d');
        this.player.addEventListener('playing', () => {this.update()})

    }

    update () {
        console.log('update');
        console.log(this);
        this.player.addEventListener('timeupdate', () => {this.displayText()});
    }

    displayText () {
        this.i++;
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.ctx.font = '48px serif';
        this.ctx.fillText(this.i, 10, 50);
    }
}

export { Visualizer }
