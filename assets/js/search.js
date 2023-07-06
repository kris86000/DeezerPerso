window.addEventListener('load', function () {
    var form = document.getElementById('myForm');
    var searchInput = document.getElementById('inputName');
    var currentAudio = null;
    var currentVolume = 0.3;

    function search() {
        if (currentAudio) {
            currentAudio.pause();
            currentAudio = null;
        }

        var artistName = searchInput.value;
        var cardCount = 0;

        var homeDiv = document.getElementById('home');
        homeDiv.style.display = 'none';

        var options = {
            method: 'GET',
            url: 'https://deezerdevs-deezer.p.rapidapi.com/search',
            params: {
                q: artistName
            },
            headers: {
                'X-RapidAPI-Key': '6a6b0e9afamsh51889cc7987a1f4p1046dcjsnf1d166b4759f',
                'X-RapidAPI-Host': 'deezerdevs-deezer.p.rapidapi.com'
            }
        };
        axios.request(options)
            .then(function (response) {
                var albumArtist = document.getElementById('album');
                albumArtist.innerHTML = "";

                var artistImgURL = response.data.data[0].artist.picture_big;
                var artistName = response.data.data[0].artist.name;
                var albums = response.data.data;

                var imgArtist = document.getElementById('imgArtist');
                imgArtist.textContent = artistName;

                var artistImage = document.createElement('img');
                artistImage.src = artistImgURL;
                artistImage.style.display = 'block';
                artistImage.classList.add('img-fluid', 'mx-auto');

                var artistContainer = document.createElement('div');
                artistContainer.classList.add('desc', 'text-center');
                artistContainer.appendChild(artistImage);

                var allAlbum = document.createElement('h3');
                allAlbum.innerText = " Tous les albums ";
                allAlbum.classList.add('text-center', 'mt-4', 'fw-bolder');
                allAlbum.style.display = 'block';

                artistContainer.appendChild(allAlbum);

                albumArtist.appendChild(artistContainer);

                albums.forEach(function (albumElt) {
                    var albumTitle = albumElt.album.title;

                    var col = document.createElement('div');
                    col.classList.add('col-md-4', 'col-lg-4', 'col-sm-12', 'mt-5', 'd-flex', 'justify-content-center', 'mb-3');

                    var card = document.createElement('div');
                    card.classList.add('card');

                    var image = document.createElement('img');
                    image.classList.add('card-img-top');
                    image.classList.add('img-fluid');
                    image.src = albumElt.album.cover_big;
                    card.appendChild(image);

                    var cardBody = document.createElement('div');
                    cardBody.classList.add('card-body');

                    var title = document.createElement('h4');
                    title.classList.add('card-title', 'text-center', 'fw-bolder');
                    title.innerText = albumTitle;
                    cardBody.appendChild(title);

                    var albumId = albumElt.album.id;
                    var albumUrl = 'https://deezerdevs-deezer.p.rapidapi.com/album/' + albumId;
                    var albumOptions = {
                        method: 'GET',
                        url: albumUrl,
                        headers: {
                            'X-RapidAPI-Key': '6a6b0e9afamsh51889cc7987a1f4p1046dcjsnf1d166b4759f',
                            'X-RapidAPI-Host': 'deezerdevs-deezer.p.rapidapi.com'
                        }
                    };

                    axios.request(albumOptions)
                        .then(function (response) {
                            var albumData = response.data;
                            var genres = albumData.genres.data;
                            var labelAlbum = albumData.label;
                            var dateAlbum = albumData.release_date;

                            var releaseDate = new Date(dateAlbum);

                            var day = releaseDate.getDate();
                            var month = releaseDate.getMonth() + 1;
                            var year = releaseDate.getFullYear();

                            var formattedDate = day.toString().padStart(2, '0') + '-' + month.toString().padStart(2, '0') + '-' + year.toString();

                            var genreNames = genres.map(genre => genre.name);

                            var genre = document.createElement('p');
                            genre.classList.add('card-text', 'text-center', 'fst-italic');
                            genre.innerText = genreNames.join(', ');
                            cardBody.appendChild(genre);

                            var label = document.createElement('p');
                            label.classList.add('labelAlbum', 'card-text', 'text-center');
                            label.innerText = labelAlbum;
                            cardBody.appendChild(label);

                            var releaseDateElement = document.createElement('p');
                            releaseDateElement.classList.add('card-text', 'text-center');
                            releaseDateElement.innerText = 'sortie : ' + formattedDate;
                            cardBody.appendChild(releaseDateElement);

                        })
                        .catch(function (error) {
                            console.error('Erreur lors de la récupération des informations de l\'album ' + albumId + ':', error);
                        });

                    var cardFooter = document.createElement('div')
                    cardFooter.classList.add('card-footer', 'text-muted', 'd-flex', 'justify-content-around');

                    var playButton = document.createElement('button');
                    playButton.classList.add('play-button', 'btn', 'btn-primary', 'no-outline');
                    playButton.innerText = 'Preview';
                    playButton.dataset.albumId = albumElt.album.id;
                    playButton.addEventListener('click', playRandomPreview);

                    var view = document.createElement('button');
                    view.classList.add('view', 'btn', 'btn-primary', 'no-outline');
                    view.innerText = 'Voir';
                    view.dataset.albumId = albumElt.album.id;
                    view.addEventListener('click', viewAlbum);

                    var albumLink = document.createElement('a');
                    albumLink.href = 'album.html';
                    albumLink.appendChild(view);

                    col.appendChild(card);
                    card.appendChild(cardBody);
                    card.appendChild(cardFooter);
                    cardFooter.appendChild(playButton);
                    cardFooter.appendChild(view);

                    if (cardCount % 3 === 0) {
                        row = document.createElement('div');
                        row.classList.add('row');

                        var containerFluid = document.createElement('div');
                        containerFluid.classList.add('container-fluid');
                        containerFluid.appendChild(row);
                        albumArtist.appendChild(containerFluid);
                    }
                    row.appendChild(col);
                    cardCount++;
                });
            })
            .catch(function (error) {
                console.error(error);
            });
    }

    function playRandomPreview(event) {
        var albumId = event.target.dataset.albumId;
        var albumUrl = 'https://deezerdevs-deezer.p.rapidapi.com/album/' + albumId;

        var albumOptions = {
            method: 'GET',
            url: albumUrl,
            headers: {
                'X-RapidAPI-Key': '6a6b0e9afamsh51889cc7987a1f4p1046dcjsnf1d166b4759f',
                'X-RapidAPI-Host': 'deezerdevs-deezer.p.rapidapi.com'
            }
        };

        axios.request(albumOptions)
            .then(function (response) {
                var albumData = response.data;
                var coverAlbum = albumData.cover;
                var artistAlbum = albumData.artist.name;
                var tracks = albumData.tracks.data;
                var randomIndex = Math.floor(Math.random() * tracks.length);
                var randomTrack = tracks[randomIndex];
                var trackTitle = randomTrack.title;
                var trackPreview = randomTrack.preview;

                if (currentAudio) {
                    currentAudio.pause();
                }

                var audio = new Audio(trackPreview);

                audio.volume = currentVolume;
                audio.play();

                currentAudio = audio;

                var modal = document.getElementById('modal');
                modal.style.display = 'block';

                var musicInfoElement = document.getElementById('musicInfo');
                musicInfoElement.innerHTML = "";

                var textContainer = document.createElement('div');
                textContainer.classList.add('text-container');

                var textElement = document.createElement('p');
                textElement.innerText = trackTitle + " - " + albumData.title + " - " + artistAlbum;
                textElement.classList.add('animation');
                textContainer.appendChild(textElement);

                var artistImage = document.createElement('img');
                artistImage.src = coverAlbum;
                artistImage.alt = "Artist Image";
                artistImage.classList.add('artist-image');
                textContainer.appendChild(artistImage);

                musicInfoElement.appendChild(textContainer);

                var volumeInput = document.getElementById('volumeInput');
                volumeInput.value = currentVolume;
                volumeInput.addEventListener('input', function () {
                    var volume = parseFloat(volumeInput.value);
                    if (currentAudio) {
                        currentAudio.volume = volume;
                    }
                });

                var playButton = document.getElementById('playButton');
                var pauseButton = document.getElementById('pauseButton');

                playButton.style.display = 'none';
                pauseButton.style.display = 'block';
            })
            .catch(function (error) {
                console.error('Erreur lors de la récupération des informations de l\'album ' + albumId + ':', error);
            });
    }

    form.addEventListener('submit', function (event) {
        event.preventDefault();
        search();
        searchInput.value = "";
    });

    function viewAlbum(event) {
        var albumId = event.target.dataset.albumId;
        window.location.href = 'album.html?id=' + albumId;
    }

    function pauseMusic() {
        if (currentAudio) {
            currentAudio.pause();

            var playButton = document.getElementById('playButton');
            playButton.style.display = 'block';
            var pauseButton = document.getElementById('pauseButton');
            pauseButton.style.display = 'none';
        }
    }

    function playMusic() {
        if (currentAudio) {
            currentAudio.play();

            var playButton = document.getElementById('playButton');
            playButton.style.display = 'none';
            var pauseButton = document.getElementById('pauseButton');
            pauseButton.style.display = 'block';
        }
    }

    var pauseButton = document.getElementById('pauseButton');
    pauseButton.addEventListener('click', pauseMusic);

    var playButton = document.getElementById('playButton');
    playButton.addEventListener('click', playMusic);

});

var closeBtn = document.getElementsByClassName('close')[0];
closeBtn.addEventListener('click', function () {
    var modal = document.getElementById('modal');
    modal.style.display = 'none';
});