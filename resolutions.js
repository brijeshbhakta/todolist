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
  Meteor.subscribe("resolutions");
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
        createdAt: new Date(),
        owner: Meteor.userId()
      }
      Meteor.call("addResolution", insertRecord);
      //Resolutions.insert(insertRecord);
      event.target.title.value = "";
      return false;
    },
    "change .hide-finished" : function (event) {
      Session.set("hideFinished", event.target.checked);
    }
  });
  Template.resolution.helpers({
    isOwner: function(){
      return this.owner === Meteor.userId()
    }
  });
  Template.resolution.events({

    "click .toggle-checked": function(){
      Meteor.call("updateResolution", this._id, !this.checked);
    },
    "click .delete": function(){
      Meteor.call("deleteResolution", this._id);
    },
    "click .toggle-private": function(){
      Meteor.call("setPrivate", this._id, !this.private);
    }

  });
  Accounts.ui.config({
    passwordSignupFields: "USERNAME_ONLY"
  });

}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
  Meteor.publish("resolutions", function(){
    //Code
    return Resolutions.find({
      $or: [
        { private: {$ne: true} },
        { owner:  this.userId }
      ]
    });
  });
}

Meteor.methods({
  addResolution:function(insertRecord){
     Resolutions.insert(insertRecord);
  },
  updateResolution: function(id, checked){

    var res = Resolutions.findOne(id);
    if (res.owner !== Meteor.userId()) {
      throw new Meteor.Error('not-authorized');
    } else {
      Resolutions.update(id,{$set: {
          checked: checked
      }});
    }
  },
  deleteResolution: function(id){
    var res = Resolutions.findOne(id);
    if (res.owner !== Meteor.userId()) {
      throw new Meteor.Error('not-authorized');
    } else {
      Resolutions.remove(id);
    }
  },
  setPrivate: function(id, private){
    var res = Resolutions.findOne(id);
    if (res.owner !== Meteor.userId()) {
      throw new Meteor.Error('not-authorized');
    } else {
      Resolutions.update(id, {$set:{
        private: private
      }});
    }
  }
});
