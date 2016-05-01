/**
 * Created by mk on 26.04.16.
 */
Template.group.events({
  "click button"(e) {
    e.preventDefault();
    Router.go("students", {year: this.year, title: this.title});
  }
});