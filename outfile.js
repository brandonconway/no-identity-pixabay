(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (factory((global.Visualizer = global.Visualizer || {})));
}(this, (function (exports) { 'use strict';

var _classCallCheck = (function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
});

var _createClass = (function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
})();

// Nod to Adrian Hall's blog post:
// https://shellmonger.com/2015/03/24/promises-and-ajax-in-ecmascript-6/

var Http = function () {
    function Http() {
        _classCallCheck(this, Http);
    }

    _createClass(Http, [{
        key: "get",
        value: function get(url) {
            return new Promise(function (resolve, reject) {
                var request = new XMLHttpRequest();
                request.open("GET", url);
                request.onload = function () {
                    if (request.status === 200) {
                        resolve(request.response);
                    } else {
                        reject(new Error(request.statusText));
                    }
                };

                request.onerror = function () {
                    reject(new Error("Network error"));
                };

                request.send();
            });
        }
    }]);

    return Http;
}();

var Visualizer = function () {
    function Visualizer(container, audio_element, options) {
        var _this = this;

        _classCallCheck(this, Visualizer);

        this.text = '';
        this.word = "";
        this.last_word = "";
        this.i = 1;
        this.player = audio_element;
        this.container = container;
        var that = this;
        if (typeof options.data === 'string') {
            var http = new Http();
            http.get(options.data).then(JSON.parse).then(function (response) {
                _this.data = response;
                _this.init();
            }).catch(function (error) {
                throw new Error(error);
            });
        } else {
            this.data = options.data;
            this.init();
        }
    }

    _createClass(Visualizer, [{
        key: 'init',
        value: function init() {
            var _this2 = this;

            var width = void 0,
                height = void 0;
            this.canvas = document.createElement('canvas');
            height = window.innerHeight;
            width = window.innerWidth;
            this.canvas.setAttribute("width", width);
            this.canvas.setAttribute("height", height);
            this.container.append(this.canvas);
            this.ctx = this.canvas.getContext('2d');
            this.player.addEventListener('playing', function () {
                _this2.update();
            });
        }
    }, {
        key: 'update',
        value: function update() {
            var _this3 = this;

            this.t = undefined;
            this.player.addEventListener('timeupdate', function () {
                _this3.displayText();
            });
        }
    }, {
        key: 'displayText',
        value: function displayText(word, last_word) {
            var _this4 = this;

            var key = void 0;
            this.ctx.fillStyle = 'white';
            this.ctx.textAlign = "center";
            this.ctx.font = '48px serif';

            key = Math.floor(this.player.currentTime) + 10;
            if (typeof this.data[key] !== 'undefined') {
                this.word = this.data[key];
                if (this.word != this.last_word) {
                    this.last_word = this.word;
                    console.log('changed');
                    console.log(this.t);
                    var http = new Http();
                    var url = 'https://pixabay.com/api/?key=4423877-e94fab80133cf77ffe9041cb4&per_page=50&image_type=photo&q=' + this.data[key];
                    http.get(url).then(JSON.parse).then(function (response) {
                        _this4.render_image(response);
                    }).catch(function (error) {
                        throw new Error(error);
                    });
                    this.i = this.i + 12;
                    //this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
                }
            }
        }
    }, {
        key: 'render_image',
        value: function render_image(response) {
            var _this5 = this;

            function drawThing(alpha, ctx) {
                //ctx.globalAlpha = alpha;
                ctx.globalCompositeOperation = 'source-over';
                if (alpha % 4) {
                    ctx.globalCompositeOperation = 'xor';
                }
                //ctx.filter = 'grayscale(100%)';
                var x = Math.random() * (ctx.canvas.width - 50);
                var y = Math.random() * (ctx.canvas.height - 50);
                var width = Math.random() * 100 + 50;
                var height = Math.random() * 100 + 50;
                var size = Math.random() + 1;
                var width = base_image.width * size;
                var height = base_image.height * size;
                ctx.drawImage(base_image, x, y, width, height);
            }

            var most = Math.min(response["totalHits"], 50);
            var choice = Math.floor(Math.random() * most);
            var image_url = response["hits"][choice]["previewURL"];
            var base_image = void 0;
            clearInterval(this.t);
            base_image = new Image(50, 50);
            base_image.src = image_url;
            base_image.onload = function () {
                var alpha = 0;
                _this5.t = setInterval(function () {
                    //if(alpha > 1) { alpha = 0; }
                    alpha++;
                    drawThing(alpha, _this5.ctx);
                }, 20);
                //            setTimeout(() => {clearInterval(t)}, 1000);
            };
        }
    }]);

    return Visualizer;
}();

(function () {
    console.log('this');
    var container = void 0,
        audio_element = void 0,
        visualizer = void 0;

    container = document.querySelector("#main");
    audio_element = document.querySelector("audio");
    visualizer = new Visualizer(container, audio_element, { "data": "/assets/data.json" });
})();

Object.defineProperty(exports, '__esModule', { value: true });

})));
