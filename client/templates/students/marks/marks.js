Template.students.helpers({});

Template.students.events({
  "change #year"(e) {
    Router.go("students", {year: e.target.value})
  }
});