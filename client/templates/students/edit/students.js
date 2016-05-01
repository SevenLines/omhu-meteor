/**
 * Created by mk on 26.04.16.
 */
Template.students.helpers({});

Template.students.events({
  "change #year"(e) {
    Router.go("students", {year: e.target.value})
  }
});