var Flickr = require("flickrapi"),
    flickrOptions = {
      api_key: "ca9278ba6ae27642d17d744ba6df0e99",
      secret: "9b82a86a0cbf68c4"
    };
var json2csv = require('json2csv');
var fs = require('fs');


var fields = ['id', 'title', 'url_m', 'url_o'];


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

			var photoSetID;
			for (var y = 0; y < photoArr.length; y++){

				if (photoArr[y].title.indexOf('Tea Ceremony') != -1){ // Just use Noci album for testing
					console.log('here');

					photoSetID = photoArr[y].photoset_id;
					break;

				}
			}

			console.log('photoSetID - ' + photoSetID);

			getPhotos(photoSetID);

		});

	}

	function getPhotos(setID) {

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
				  var csvRes = json2csv({data: result.photoset.photo, field: fields});
				  console.log(csvRes);

					fs.writeFile('Tea.csv', csvRes, function(err) {
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
