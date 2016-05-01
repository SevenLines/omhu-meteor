/**
 * Created by mk on 01.05.16.
 */
Template.marksGroup.events({
  "click button"(e) {
    e.preventDefault();
    Router.go("marks", {year: this.year, title: this.title});
  }
});