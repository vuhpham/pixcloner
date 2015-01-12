///
Stores = {};

Stores.images = new FS.Store.GridFS("images");

///

Images = new FS.Collection("images", {
	stores: [Stores.images],
	filter: {
		maxSize: 20 * 1024 * 1024, //in bytes
		allow: {
			contentTypes: ['image/*']
		},
		onInvalid: function(message) {
			Meteor.isClient && alert(message);
		}
	}
});

///
FS.debug = false;

FS.HTTP.setHeadersForGet([
	['Cache-Control', 'public, max-age=31536000']
]);