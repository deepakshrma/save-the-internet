(function(window) {
    var YouTubePlayer = {
        current: 0,
        player: null,
        /**
         * Tracks ids here...
         */
        videos: [
            'azAmiANwhJs',
            'tx0yUNj8fHk',
            'aUaBVtnssyk',
            'mfY1NKrzqi0',
            'QvW8bjGRhog',
            'W0w_YhZUYeA'
        ],
        currentlyPlaying: function () {
            console.info('Current Track id', YouTubePlayer.videos[YouTubePlayer.current]);
            return YouTubePlayer.videos[YouTubePlayer.current];
        },
        playNext: function () {
            YouTubePlayer.increaseTrack()
            if (YouTubePlayer.player) {
                YouTubePlayer.currentlyPlaying();
                YouTubePlayer.player.loadVideoById(YouTubePlayer.videos[YouTubePlayer.current]);
            } else {
                alert('Please Wait! Player is loading');
            }
        },
        playPrevious: function () {
            YouTubePlayer.decreaseTrack()
            if (YouTubePlayer.player) {
                YouTubePlayer.currentlyPlaying();
                YouTubePlayer.player.loadVideoById(YouTubePlayer.videos[YouTubePlayer.current]);
            } else {
                alert('Please Wait! Player is loading');
            }

        },
        increaseTrack: function () {
            YouTubePlayer.current = YouTubePlayer.current + 1;
            if (YouTubePlayer.current >= YouTubePlayer.videos.length) {
                YouTubePlayer.current = 0;
            }
        },
        decreaseTrack: function () {
            YouTubePlayer.current = Math.max(YouTubePlayer.current - 1, 0);
        },
        onReady: function (event) {
            event.target.loadVideoById(YouTubePlayer.videos[YouTubePlayer.current]);
        },
        onStateChange: function (event) {
            if (event.data == YT.PlayerState.ENDED) {
                YouTubePlayer.playNext();
            }
        }
    };
    function onYouTubeIframeAPIReady() {
        console.info(">>>>>>>>>>>>>onYouTubeIframeAPIReady");
        YouTubePlayer.player = new YT.Player('youtube', {
            height: '350',
            width: '425',
            events: {
                'onReady': YouTubePlayer.onReady,
                'onStateChange': YouTubePlayer.onStateChange
            }
        });
    }
    window.YouTubePlayer= YouTubePlayer;
    window.onYouTubeIframeAPIReady = onYouTubeIframeAPIReady;
    console.info(">>>>>>>>>>>>>YouTubePlayer");
}(window));