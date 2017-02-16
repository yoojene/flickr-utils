var Flickr = require("flickrapi"),
    flickrOptions = {
      api_key: "",
      secret: ""
    };
var json2csv = require('json2csv');
var fs = require('fs');
var prompt = require('prompt');

prompt.start();

var fields = ["id", "title", "url_m", "url_o"];

Flickr.authenticate(flickrOptions, function(error, flickr) {


  // we can now use "flickr" as our API object

	 getPhotoList();

	 function getPhotoList() {

		flickr.photosets.getList({

			user_id: flickr.options.user_id
		},function(error, res){
			if(error){
				throw new Error(error);
			}

			var photoArr = [];
			for (var x = 0; x < res.photosets.photoset.length; x++){

				photoArr.push({photoset_id: res.photosets.photoset[x].id, title: res.photosets.photoset[x].title._content});

			}

			console.log(photoArr);

			prompt.get(['album', 'csvFile'], function (err, result) {

				if(error){
					throw new Error(error);
			}

				console.log('Command-line input received:');
				console.log('  album: ' + result.album);
				console.log('  csvFile: ' + result.csvFile);

				var photoSetID;
				for (var y = 0; y < photoArr.length; y++){

					if (photoArr[y].title.indexOf(result.album) != -1){ // Just use Noci album for testing
						console.log('here');

						photoSetID = photoArr[y].photoset_id;
						break;

					}
				}

				console.log('photoSetID - ' + photoSetID);


				getPhotos(photoSetID, result.csvFile);


			});


		});

	}

	function getPhotos(setID, csv) {



		flickr.photosets.getPhotos({

			photoset_id: setID,
			user_id: flickr.options.user_id,
			extras: "url_m, url_o"


		}, function(error, result){
			if(error){
				throw new Error(error);
		}

		console.log(result);
		console.log(result.photoset.photo);

			try {
				  var csvRes = json2csv({data: result.photoset.photo, fields: fields});
				  console.log(csvRes);

					fs.writeFile(csv+'.csv', csvRes, function(err) {
					  if (err) throw err;
					  console.log('file saved');
					});
				} catch (err) {
				  // Errors are thrown for bad options, or if the data is empty and no fields are provided.
				  // Be sure to provide fields if it is possible that your data array will be empty.
				  console.error(err);
				}

	});

	}

});
