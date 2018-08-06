import {MAX_RELATED_ARTISTS, MAX_TRACKS_PER_ARTIST, FIND_SONGS_TIMEOUT, ADD_SONGS_TIMEOUT, BACKUP_TRACKS} from './constants';

export function isValidArtist(spotifyApi, artistName) {
	return new Promise((resolve, reject) => {
		spotifyApi.searchArtists(artistName)
		.then(function(artistsJSON) {
			resolve(artistsJSON.artists.items.length > 0);
		})
		.catch(function(err) {
			reject(err);
		})
	})
}

function addTracksToMap(spotifyApi, artistNames, map, msg) {
	artistNames.forEach(function(artistName) {
		setTimeout(function() {
			spotifyApi.search('artist:' + artistName, ['track'], {limit:MAX_TRACKS_PER_ARTIST})
			.then(function(tracksJSON) {
				let tracks = tracksJSON.tracks.items;
				let filteredTracks = tracks.filter(track => (msg.includes(track.name.charAt(0))));
				filteredTracks.forEach(function(track) {
					let letter = track.name.charAt(0);
					if (map.has(letter)) {
						map.get(letter).push(track.uri);
					} else {
						map.set(letter, [track.uri]);
					}
				})
			})
			.catch(function(err) {
				console.error(err);
			});
		}, FIND_SONGS_TIMEOUT);
	})
}


function populateRelatedArtists(spotifyApi, artistNames, destination) {
	artistNames.forEach(function(artistName) {
		spotifyApi.searchArtists(artistName)
		.then(function(artistsJSON) {
			let artist = artistsJSON.artists.items[0];
			spotifyApi.getArtistRelatedArtists(artist.id)
			.then(function(relatedArtists) {
				let currRelatedNames = relatedArtists.map(artist => artist.name);
				destination.push(currRelatedNames.slice(MAX_RELATED_ARTISTS));
			});
		})
		.catch(function(err) {
			console.error(err);
		})
	});
}


export function initAndFillPlaylist(spotifyApi, targetArtists, playlistName, msg) {
	let mainTrackUris = new Map();
	let altTrackUris = new Map();
	let relatedArtists = [];
	populateRelatedArtists(spotifyApi, targetArtists, relatedArtists);
	addTracksToMap(spotifyApi, targetArtists, mainTrackUris, msg);
	addTracksToMap(spotifyApi, relatedArtists, altTrackUris, msg);
	setTimeout(function() {
		spotifyApi.getMe()
		.then(function(user) {
			spotifyApi.createPlaylist(user.id, {name: playlistName})
			.then(function(playlist) {
				let playListTrackUris = []
				for(var i = 0; i < msg.length; i++) {
					let letter = msg.charAt(i)
					let map = mainTrackUris.has(letter) ? mainTrackUris : altTrackUris;
					if (map.has(letter)) {
						let trackUris = map.get(letter);
						let r = Math.floor(Math.random()*trackUris.length);
						playListTrackUris.push(trackUris[r]);
						trackUris.splice(r, 1);
					} else {
						playListTrackUris.push(BACKUP_TRACKS[letter]);
					}
				}
				spotifyApi.addTracksToPlaylist(user.id, playlist.id, playListTrackUris)
			})
		})
		.catch(function(error) {
			console.error(error);
		});
	}, ADD_SONGS_TIMEOUT);
	
}