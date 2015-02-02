var Request = Meteor.npmRequire("request");
var RequestImageSize = Meteor.npmRequire("request-image-size");
var Future = Meteor.npmRequire("fibers/future");
var Cheerio = Meteor.npmRequire("cheerio");

Meteor.methods({
	'uploadImageFromUrl': function(urlObj){
		Request.get({url: urlObj.url, encoding: null}, Meteor.bindEnvironment(function(e, r, buffer){
			var image = new FS.File();
			image.attachData(buffer, {type: urlObj.type}, function(error){
				if(error) throw error;
				image.name(urlObj.name);
				Images.insert(image, function(error){
					if (error) throw new Error(error.message);
					console.log("Done uploading");
				});
			});
		}));
	},
	detectImageFromUrl: function(url){
		check(url, String);
		var result = [];
		var future = new Future;
		Request.get({url: url}, Meteor.bindEnvironment(function(e, r, buffer){
			var $ = Cheerio.load(buffer);
			var li = [];

			$("img").each(function() {
				var imgsrc = this.attribs.src;
				li.push(imgsrc);
			});
			future.return(li);
		}));
		result = future.wait();

		for (var i = 0; i < result.length; i++) {
			var iUrl = result[i];
			if (iUrl.length === 0) continue;

			if (iUrl.lastIndexOf("http://", 0) !== 0 && iUrl.lastIndexOf("https://", 0) !== 0){
				iUrl = "http:" + iUrl;
			}

			var name = iUrl.substring(iUrl.lastIndexOf('/') + 1);
			var type = 'image/jpeg';
			var dimensions = Meteor.call("getImageSize", iUrl);

			if (dimensions.height > 100 && dimensions.width > 100) {
				Meteor.call("uploadImageFromUrl", {url: iUrl, name: name, type: type});
			}
		}
	},

	getImageSize: function(url) {
		check(url, String);
		var future = new Future;
		var dimensions = {};

		RequestImageSize(url, function(err, dimensions, length){
			future.return(dimensions);
		});
		return future.wait();
	}
});