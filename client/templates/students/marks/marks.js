Template.marks.helpers({
  params() {
    return Router.current().route.params;
  },
  marksCount() {
    return Marks.find().count();
  }
});

Template.marks.events({
  "change #year, change #discipline"(e) {
    let form = e.target.form;
    Router.go("marks", {
      title: Router.current().params.title,
      year: form.year.value,
      discipline: form.discipline.value
    })
  }
});

Template.marks.onRendered(function () {
  Tracker.autorun(function () {
    var marks = Router.current().marksInfo();
    if (_.isEmpty(marks))
      return;
    
    let chart = d3.select("#barChart");
    let svg = chart.append('svg');
    // svg.selectAll("rect")
    //   .data(marks)
    console.log(marks)
  })
});