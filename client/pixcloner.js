Template.submitImage.helpers({
  submittedImage: function(){
    return Images.find({},{sort: {uploadedAt: -1}}).fetch();
  }
});

Template.submitImage.events({
  'click #upload-image button': function(ev, tpl) {
    $('#upload-image input[type="file"]').trigger('click');
  },
  'change #upload-image input': function(ev, tpl) {
    var images = ev.target.files;
    if (images.length > 0) {
      var image = Images.insert(images[0], function(error, result){
        if (error) console.log(error);
      });
    }
  },
  'click #url-image button': function(ev, tpl){
    var url = $('#url-image input[type="text"]').val();
    var name = url.substring(url.lastIndexOf('/') + 1);
    var type = 'image/jpeg';
    var urlObj = {
      url: url,
      name: name,
      type: type
    };
    Meteor.call('uploadImageFromUrl', urlObj, function(error, result){
      if (error) console.log(error);
    });
  }
});
