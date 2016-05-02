/**
 * Created by mk on 30.04.16.
 */
Template.header.events({
  "submit form"(e) {
    e.preventDefault();
    let form = e.currentTarget;
    if ($(form).hasClass('login')) {
      Meteor.loginWithPassword(form.name.value, form.password.value);
    } else {
      Meteor.logout()
    }
  }
});

Template.header.helpers({
  formClass() {
    return Meteor.user() ? "logout" : "login"
  }
});