var request = Meteor.npmRequire("request");

Meteor.methods({
	'uploadImageFromUrl': function(urlObj){
		request.get({url: urlObj.url, encoding: null}, Meteor.bindEnvironment(function(e, r, buffer){
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
	}
});