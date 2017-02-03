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
        this.t = undefined;
        this.player.addEventListener('timeupdate', () => {this.displayText()});
    }

    displayText (word, last_word) {
        let key;
        this.ctx.fillStyle = 'white';
        this.ctx.textAlign="center";
        this.ctx.font = '48px serif';

        key = Math.floor(this.player.currentTime)+10;
        if (typeof this.data[key] !== 'undefined'){
            this.word = this.data[key];
            if(this.word != this.last_word){
                this.last_word = this.word;
                console.log('changed');
                console.log(this.t);
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

        function drawThing(alpha, ctx){
            //ctx.globalAlpha = alpha;
            ctx.globalCompositeOperation = 'source-over';
            if (alpha % 4){
                ctx.globalCompositeOperation = 'xor';
            }
            //ctx.filter = 'grayscale(100%)';
            var x = Math.random()*(ctx.canvas.width-50);
            var y = Math.random() * (ctx.canvas.height-50);
            var width = (Math.random() * 100) + 50;
            var height = (Math.random() * 100) + 50;
            var size  = Math.random() + 1;
            var width = base_image.width * size;
            var height = base_image.height * size;
            ctx.drawImage(base_image, x, y, width, height);
        }

        let most = Math.min(response["totalHits"], 50);
        let choice = Math.floor(Math.random() * most);
        let image_url = response["hits"][choice]["previewURL"];
        let base_image;
        clearInterval(this.t);
        base_image = new Image(50, 50);
        base_image.src = image_url;
        base_image.onload = () => {
            var alpha = 0;
            this.t = setInterval(() => {
                        //if(alpha > 1) { alpha = 0; }
                        alpha++;
                        drawThing(alpha, this.ctx)}, 20);
//            setTimeout(() => {clearInterval(t)}, 1000);
        }
    }

}

export { Visualizer }
