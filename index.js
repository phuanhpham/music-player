const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const playList = $('.playlist');
const player = $('.player');
const header = $('header h2');
const cdThumb = $('.cd-thumb');
const audio = $('audio');
const playBtn = $('.btn-toggle-play');
const progress = $('.progress');
const nextBtn = $('.btn-next');
const prevBtn = $('.btn-prev');
const randomBtn = $('.btn-random');
const repeatBtn = $('.btn-repeat');

const PLAYER_SETTING = "PLAYER_CONFIG";
// console.log(playBtn)
const app = {
    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    config: JSON.parse(localStorage.getItem(PLAYER_SETTING)) || {},
    songs: [
        {
            name: "Click Pow Get Down",
            singer: "Raftaar x Fortnite",
            path: "Assets/stillLife.mp3",
            image: "https://i.ytimg.com/vi/jTLhQf5KJSc/maxresdefault.jpg"
          },
          {
            name: "Tu Phir Se Aana",
            singer: "Raftaar x Salim Merchant x Karma",
            path: "https://zingmp3.vn/bai-hat/Buon-Khong-The-Buong-DREAMeR-Phi-Phuong-Anh-RIN9-MiiNa/ZZA09OUC.html",
            image:
              "https://1.bp.blogspot.com/-kX21dGUuTdM/X85ij1SBeEI/AAAAAAAAKK4/feboCtDKkls19cZw3glZWRdJ6J8alCm-gCNcBGAsYHQ/s16000/Tu%2BAana%2BPhir%2BSe%2BRap%2BSong%2BLyrics%2BBy%2BRaftaar.jpg"
          },
          {
            name: "Naachne Ka Shaunq",
            singer: "Raftaar x Brobha V",
            path:
              "https://mp3.filmysongs.in/download.php?id=Naachnhttps://zingmp3.vn/embed/song/ZZA60E6I",
            image: "https://i.ytimg.com/vi/QvswgfLDuPg/maxresdefault.jpg"
          },
          {
            name: "Mantoiyat",
            singer: "Raftaar x Nawazuddin Siddiqui",
            path: "https://mp3.vlcmusic.com/download.php?track_id=14448&format=320",
            image:
              "https://a10.gaanacdn.com/images/song/39/24225939/crop_480x480_1536749130.jpg"
          },
          {
            name: "Aage Chal",
            singer: "Raftaar",
            path: "https://mp3.vlcmusic.com/download.php?track_id=25791&format=320",
            image:
              "https://a10.gaanacdn.com/images/albums/72/3019572/crop_480x480_3019572.jpg"
          },
          {
            name: "Damn",
            singer: "Raftaar x kr$na",
            path:
              "https://mp3.filmisongs.com/go.php?id=Damn%20Song%20Raftaar%20Ft%20KrSNa.mp3",
            image:
              "https://filmisongs.xyz/wp-content/uploads/2020/07/Damn-Song-Raftaar-KrNa.jpg"
          },
          {
            name: "Feeling You",
            singer: "Raftaar x Harjas",
            path: "https://mp3.vlcmusic.com/download.php?track_id=27145&format=320",
            image:
              "https://a10.gaanacdn.com/gn_img/albums/YoEWlabzXB/oEWlj5gYKz/size_xxl_1586752323.webp"
          }
    ],
    setConfig: function(key, value){
        this.config[key] = value;
        localStorage.setItem(PLAYER_SETTING, JSON.stringify(this.config));
    },
    render: function(){
        const htmls = this.songs.map((song, index) => {
            return `
                <div class="song ${index === this.currentIndex ? 'active' : ''}" data-index="${index}">
                    <div class="thumb" style="background-image: url(${song.path})"></div>
                    <div class="body">
                        <h3 class="title">${song.name}</h3>
                        <p class="author">${song.singer}</p>
                    </div>
                    <div class="option">
                        <i class="fas fa-ellipsis-h"></i>
                    </div>
                </div>
            `
        });
        playList.innerHTML = htmls.join('');

    },
    defineProperties: function(){
        Object.defineProperty(this, "currentSong", {
            get: function(){
                return this.songs[this.currentIndex];
            }
        } )
    },
    handlerEvent: function(){
        const _this = this;
        const cd = $('.cd');
        const cdWith = cd.offsetWidth;
        document.onscroll = function(){
            const scrollTop = window.scrollY || document.documentElement.scrollTop;
            const newCdWidth = cdWith - scrollTop;
            // console.log(newCdWidth)
            cd.style.width = newCdWidth > 0 ? newCdWidth + 'px' : 0; 
            cd.style.opacity = newCdWidth / cdWith;
        };

        const cdThumbAnimate = cdThumb.animate([{ transform: "rotate(360deg)" }], {
            duration: 10000, // 10 seconds
            iterations: Infinity
          });
        cdThumbAnimate.pause();

        playBtn.onclick = function(){
            if(_this.isPlaying){
                audio.pause();
            }else{
                audio.play();
            }
            
        }

        audio.onplay = function(){
            _this.isPlaying = true;
            player.classList.add('playing'); 
            cdThumbAnimate.play();
        }

        audio.onpause = function(){
            _this.isPlaying = false;
            player.classList.remove('playing'); 
            cdThumbAnimate.pause();

        }

        audio.ontimeupdate = function(){
            if(audio.duration){
                const progressPercent = Math.floor(audio.currentTime / audio.duration * 100);
                progress.value = progressPercent;
            }
        }

        audio.onended = function(){
            if(_this.isRepeat){
                audio.play();
            }else{
                nextBtn.click();
            }
        }

        progress.oninput = function(e){
            const seekTime = audio.duration / 100 * e.target.value;
            audio.currentTime = seekTime;
        }

        nextBtn.onclick = function(){
            if(_this.isRandom){
                _this.playRandomSong()
            }else{
                _this.nextSong();
            }
            audio.play();
            _this.scrollToActiveSong();
            _this.render();
        }

        prevBtn.onclick = function(){
            if(_this.isRandom){
                _this.playRandomSong()
            }else{
                _this.prevSong();
            }
            audio.play();
            _this.scrollToActiveSong();
            _this.render();
        }

        randomBtn.onclick = function(){
            _this.isRandom = !_this.isRandom;
            _this.setConfig('isRandom', _this.isRandom)
            randomBtn.classList.toggle('active', _this.isRandom);
        }

        repeatBtn.onclick = function(){
            _this.isRepeat = !_this.isRepeat;
            _this.setConfig('isRepeat', _this.isRepeat)
            repeatBtn.classList.toggle('active', _this.isRepeat);
        }
        
        playList.onclick = function(e){
            const songNode = e.target.closest('.song:not(.active)');
            if(songNode || e.target.closest('.option')){
                if(songNode){
                    _this.currentIndex = Number(songNode.dataset.index);
                    _this.loadCurrentSong();
                    _this.render();
                    audio.play();
                }
            }
        }
    },
    scrollToActiveSong: function () {
        setTimeout(() => {
          $(".song.active").scrollIntoView({
            behavior: "smooth",
            block: "nearest"
          });
        }, 300);
    },
    loadCurrentSong: function(){
        
        header.innerHTML = `${this.currentSong.name}`;
        cdThumb.style.backgroundImage = `url(${this.currentSong.image})`;
        audio.src = `${this.currentSong.path}`;
    },
    nextSong: function(){
        this.currentIndex++;
        if(this.currentIndex >= this.songs.length){
            this.currentIndex = 0;
        }
        this.loadCurrentSong();
    },
    prevSong: function(){
        this.currentIndex--;
        if(this.currentIndex < 0){
            this.currentIndex = this.songs.length - 1;
        }
        this.loadCurrentSong();
    },
    playRandomSong: function(){
        let newIndex;
        do {
            newIndex = Math.floor(Math.random() * this.songs.length);
        } while (newIndex === this.currentIndex);

        this.currentIndex = newIndex;
        this.loadCurrentSong();
    },
    loadConfig: function(){
        this.isRandom = this.config.isRandom;
        this.isRepeat = this.config.isRepeat;
    },
    start: function(){
        this.loadConfig();
        this.defineProperties();
        this.handlerEvent();
        this.loadCurrentSong();
        this.render();
        repeatBtn.classList.toggle('active', this.isRepeat);
        randomBtn.classList.toggle('active', this.isRandom);
    }
}
app.start();