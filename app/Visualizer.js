import { Http } from './Http.js'


class Visualizer {

    constructor (container, audio_element, options) {
        this.text = '';
        this.word = "";
        this.last_word = "";
        this.i = 1;
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
        let width, height;
        this.canvas = document.createElement('canvas');
        height = window.innerHeight;
        width = window.innerWidth;
        this.canvas.setAttribute("width", width);
        this.canvas.setAttribute("height", height);
        this.container.append(this.canvas);
        this.ctx = this.canvas.getContext('2d');
        this.player.addEventListener('playing', () => {this.update()})
    }

    update () {
        this.player.addEventListener('timeupdate', () => {this.displayText()});
    }

    displayText (word, last_word) {
        let key;
        this.ctx.fillStyle = 'white';
        this.ctx.textAlign="center";
        this.ctx.font = '48px serif';
        key = Math.floor(this.player.currentTime);
        if (typeof this.data[key] !== 'undefined'){
            this.word = this.data[key];
            if(this.word != this.last_word){
                this.last_word = this.word;
                console.log('changed');
                let http = new Http();
                let url = `https://pixabay.com/api/?key=4423877-e94fab80133cf77ffe9041cb4&per_page=50&image_type=photo&q=${this.data[key]}`;
                http.get(url)
                    .then(JSON.parse)
                    .then((response) => {
                            this.render_image(response)
                        })
                    .catch(function(error) { throw new Error(error); });
            this.i = this.i + 12;
                //this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            }
        }
    }

    render_image(response) {
        let most = Math.min(response["totalHits"], 50);
        let choice = Math.floor(Math.random() * most);
        let image_url = response["hits"][choice]["previewURL"];
        let base_image;
        base_image = new Image();
        base_image.src = image_url;
        base_image.onload = () => {
            this.ctx.drawImage(
                base_image, Math.random()*this.canvas.width, Math.random() * this.canvas.height);
        }
    }

}

export { Visualizer }
