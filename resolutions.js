Resolutions = new Mongo.Collection("resolutions");
/*
Resolutions.allow({
  insert: function(){
    return true;
  },
  update: function(){
    return true;
  },
  remove: function(){
    return true;
  }
});
*/
if (Meteor.isClient) {
  Template.body.helpers({
    resolutions: function(){
      if(Session.get('hideFinished')){
        return Resolutions.find({checked: {$ne: true}});
      }
      else {
        return Resolutions.find();
      }
    },
    hideFinished: function(){
      return Session.get('hideFinished');
    }
  });
  Template.body.events({
    "submit .new-resolution": function(event){
      var title = event.target.title.value;
      var insertRecord = {
        title: title,
        createdAt: new Date()
      }
      Resolutions.insert(insertRecord);
      event.target.title.value = "";
      return false;
    },
    "change .hide-finished" : function (event) {
      Session.set("hideFinished", event.target.checked);

    }
  });

  Template.resolution.events({

    "click .toggle-checked": function(){
      Resolutions.update(this._id, {$set: {checked: !this.checked}});
    },
    "click .delete": function(){
      Resolutions.remove(this._id);
    }

  });

}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}
