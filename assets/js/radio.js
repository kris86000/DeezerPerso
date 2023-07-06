window.addEventListener('load', function () {
    var radios = {
        method: 'GET',
        url: 'https://deezerdevs-deezer.p.rapidapi.com/radio/top',
        headers: {
            'X-RapidAPI-Key': '6a6b0e9afamsh51889cc7987a1f4p1046dcjsnf1d166b4759f',
            'X-RapidAPI-Host': 'deezerdevs-deezer.p.rapidapi.com'
        }
    };

    axios.request(radios)
        .then(function (response) {
            var radio = response.data;
            var topRadio = radio.data;

            var cardContainer = document.getElementById('card-container');

            var cardCount = 0;
            var row;

            topRadio.forEach(top => {
                var topTitle = top.title;
                var topId = top.id;
                var topImg = top.picture_medium;

                var col = document.createElement('div');
                col.className = 'col-lg-4 col-md-4 col-sm-12 mt-3 d-flex justify-content-center';

                var card = document.createElement('div');
                card.className = 'card mb-4';

                var img = document.createElement('img');
                img.className = 'card-img-top';
                img.src = topImg;
                img.alt = topTitle;
                card.appendChild(img);

                var cardBody = document.createElement('div');
                cardBody.className = 'card-body';

                var title = document.createElement('h5');
                title.className = 'card-title fw-bold text-center';
                title.textContent = topTitle;
                cardBody.appendChild(title);

                card.appendChild(cardBody);

                var cardFooter = document.createElement('div');
                cardFooter.className = 'card-footer d-flex justify-content-center';

                var buttonContainer = document.createElement('div');
                buttonContainer.classList.add('d-flex', 'justify-content-center');

                var playRadio = document.createElement('a');
                playRadio.classList.add('play-radio', 'btn', 'btn-primary', 'no-outline');
                playRadio.innerText = 'Ecouter sur Deezer';
                playRadio.href = '';

                buttonContainer.appendChild(playRadio);
                cardFooter.appendChild(buttonContainer);
                col.appendChild(card);
                card.appendChild(cardBody);
                card.appendChild(cardFooter);
                cardFooter.appendChild(playRadio);

                col.appendChild(card);
                cardContainer.appendChild(col);

                var radioURL = 'https://deezerdevs-deezer.p.rapidapi.com/radio/' + topId;
                var radioOptions = {
                    method: 'GET',
                    url: radioURL,
                    headers: {
                        'X-RapidAPI-Key': '6a6b0e9afamsh51889cc7987a1f4p1046dcjsnf1d166b4759f',
                        'X-RapidAPI-Host': 'deezerdevs-deezer.p.rapidapi.com'
                    }
                };

                axios.request(radioOptions)
                    .then(function (response) {
                        var radioData = response.data;
                        var radioShare = radioData.share;

                        playRadio.href = radioShare;
                    })
                    .catch(function (error) {
                        console.error('Erreur lors de la récupération des informations de la radio ' + topId + ':', error);
                    });

                playRadio.dataset.radioId = topId;
                playRadio.addEventListener('click', playRadioSound);

                if (cardCount % 3 === 0) {
                    row = document.createElement('div');
                    row.classList.add('row');
                    var containerFluid = document.createElement('div');
                    containerFluid.classList.add('container-fluid');
                    containerFluid.appendChild(row);
                    cardContainer.appendChild(containerFluid);
                }
                row.appendChild(col);
                cardCount++;

            });

        })
        .catch(function (error) {
            console.error(error);
        });

    function playRadioSound(event) {
        var radioId = event.target.dataset.radioId;
        var radioUrl = 'https://deezerdevs-deezer.p.rapidapi.com/radio/' + radioId;

        var radioSoundOptions = {
            method: 'GET',
            url: radioUrl,
            headers: {
                'X-RapidAPI-Key': '6a6b0e9afamsh51889cc7987a1f4p1046dcjsnf1d166b4759f',
                'X-RapidAPI-Host': 'deezerdevs-deezer.p.rapidapi.com'
            }
        };

        axios.request(radioSoundOptions)
            .then(function (response) {
                var radioData = response.data;
                var share = radioData.share;
                console.log(share);
            })
            .catch(function (error) {
                console.error('Erreur lors de la récupération des informations de la radio ' + radioId + ':', error);
            });
    }
});








