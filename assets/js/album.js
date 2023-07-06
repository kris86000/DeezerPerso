window.addEventListener('load', function () {
    var urlParams = new URLSearchParams(window.location.search);
    var albumId = urlParams.get('id');

    var currentAudio = null;

    var albumUrl = 'https://deezerdevs-deezer.p.rapidapi.com/album/' + albumId;
    var titreOptions = {
        method: 'GET',
        url: albumUrl,
        headers: {
            'X-RapidAPI-Key': '6a6b0e9afamsh51889cc7987a1f4p1046dcjsnf1d166b4759f',
            'X-RapidAPI-Host': 'deezerdevs-deezer.p.rapidapi.com'
        }
    };

    axios.request(titreOptions)
        .then(function (response) {
            var albumData = response.data;
            var titreAlbum = albumData.title;
            var artistAlbum = albumData.artist.name;
            var coverAlbum = albumData.cover_big;
            var tracks = albumData.tracks.data;
            var dateSortie = albumData.release_date;

            var releaseDateSortie = new Date(dateSortie);

            var day = releaseDateSortie.getDate();
            var month = releaseDateSortie.getMonth() + 1;
            var year = releaseDateSortie.getFullYear();

            var formatDate = day.toString().padStart(2, '0') + '-' + month.toString().padStart(2, '0') + '-' + year.toString();

            console.log(albumData);

            var album = document.getElementById('album');
            var albumTracks = document.getElementById('tracksAlbum');

            var containerCard = document.createElement('div');
            containerCard.className = 'col mt-5 d-flex justify-content-center';

            var albumTitre = document.createElement('h2');
            albumTitre.className = 'text-center mt-2'
            albumTitre.innerText = titreAlbum;

            var date = document.createElement('h5');
            date.className = 'text-center mt-2 text-muted';
            date.innerText = 'Sortie le : ' + formatDate;

            var cardAlbum = document.createElement('div');
            cardAlbum.className = 'card';

            var artist = document.createElement('h2');
            artist.className = 'text-center fw-bolder mt-5';
            artist.innerText = artistAlbum;

            var title = document.createElement('h4');
            title.className = 'card-title', 'text-center', 'fw-bolder';
            title.innerText = titreAlbum;

            var imgAlbum = document.createElement('img');
            imgAlbum.className = 'card-img-top img-fluid';
            imgAlbum.src = coverAlbum;

            var containerTracks = document.createElement('div');
            containerTracks.className = 'container-fluid mt-5';

            cardAlbum.appendChild(imgAlbum);
            containerCard.appendChild(cardAlbum);
            album.append(artist);
            album.append(albumTitre);
            album.append(date);
            album.appendChild(containerCard);
            albumTracks.appendChild(containerTracks);

            var table = document.createElement('table');
            table.className = 'table table-responsive';

            var thead = document.createElement('thead');

            var tr1 = document.createElement('tr');

            var th1 = document.createElement('th');
            th1.className = 'text-center col-md-6 col-sm-6 col-6';
            th1.innerText = "Titre";

            var th2 = document.createElement('th');
            th2.className = 'text-center col-3 d-none d-md-table-cell';
            th2.innerText = 'Popularité';

            var th3 = document.createElement('th');
            th3.className = 'text-center col-md-3 col-sm-3 col-3';
            th3.innerText = 'Lecture';

            var tbody = document.createElement('tbody');

            var currentTrackRow = null;

            table.append(thead, tbody);
            thead.appendChild(tr1);
            tr1.append(th1, th2, th3);

            containerTracks.appendChild(table);

            tracks.forEach(sound => {
                var soundTitle = sound.title_short;
                var soundRank = sound.rank;
                var soundTrack = sound.preview;

                var tr2 = document.createElement('tr');

                var tdTitle = document.createElement('td');
                tdTitle.className = 'ml-2 align-middle col-md-6 col-sm-6 col-6';
                tdTitle.innerText = soundTitle;

                var tdRank = document.createElement('td');
                tdRank.className = 'text-center align-middle col-3 d-none d-md-table-cell';
                tdRank.innerText = generateStarRating(soundRank);

                var tdPlay = document.createElement('td');
                tdPlay.style.display = 'flex';
                tdPlay.style.justifyContent = 'space-around';

                var playButton = document.createElement('button');
                playButton.className = 'btn-play';

                var playIcon = document.createElement('i');
                playIcon.className = 'fas fa-play';

                playButton.appendChild(playIcon);

                var stopButton = document.createElement('button');
                stopButton.className = 'btn-stop';

                var stopIcon = document.createElement('i');
                stopIcon.className = 'fas fa-stop';

                stopButton.appendChild(stopIcon);

                playButton.addEventListener('click', function () {
                    if (currentAudio) {
                        currentAudio.pause();
                        if (currentTrackRow) {
                            currentTrackRow.classList.remove('current-track');
                        }
                    }

                    var audio = new Audio(soundTrack);
                    audio.play();

                    currentAudio = audio;

                    currentTrackRow = tr2;
                    currentTrackRow.classList.add('current-track');

                    audio.volume = 0.2;
                    console.log('Lecture de la piste: ' + soundTitle);
                });

                stopButton.addEventListener('click', function () {
                    if (currentAudio && currentAudio.src === soundTrack) {
                        currentAudio.pause();
                        if (currentTrackRow) {
                            currentTrackRow.classList.remove('current-track');
                        }
                    }
                });

                tdPlay.appendChild(playButton);
                tdPlay.appendChild(stopButton);

                tr2.append(tdTitle, tdRank, tdPlay);

                tbody.appendChild(tr2);
            });
        })

    function generateStarRating(popularity) {
        const maxStars = 3;
        const filledStar = '★';
        const emptyStar = '☆';

        let starRating = '';

        if (popularity > 500000) {
            starRating = filledStar.repeat(3);
        } else if (popularity > 350000) {
            starRating = filledStar.repeat(2) + emptyStar;
        } else if (popularity > 120000) {
            starRating = filledStar + emptyStar.repeat(2);
        } else {
            starRating = emptyStar.repeat(3);
        }
        return starRating;
    }
})