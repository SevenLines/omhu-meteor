/**
 * Created by mk on 25.04.16.
 */

HomeController = RouteController.extend({
  template: 'index'
});

function activeYears(activeYear) {
  return [2013, 2014, 2015, 2016].map(year => {
    return {
      'year': year,
      'selected': year === activeYear ? 'selected' : ''
    }
  })
}

StudentsController = RouteController.extend({
  template: 'students',
  subscriptions() {
    let group = Groups.findOne({year: parseInt(this.params.year), title: this.params.title});
    let groupId = group ? group._id : undefined;
    this.studentsSub = Meteor.subscribe('students', groupId);
    this.groupsSub = Meteor.subscribe('groups', this.params.year);
  },
  students() {
    return Students.find({}, {sort: {second_name: 1, name: 1}});
  },
  data() {
    return {
      years: activeYears(parseInt(this.params.year)),
      year: this.params.year,
      title: this.params.title,
      groups: Groups.find(),
      studentsReady: this.studentsSub.ready,
      groupsReady: this.groupsSub.ready,
      students: this.students()
    }
  }
});

MarksController = RouteController.extend({
  template: "marks",
  subscriptions() {
    let group = Groups.findOne({
      year: parseInt(this.params.year),
      title: this.params.title,
      // disciplineId: this.params.discipline
    });
    let groupId = group ? group._id : undefined;
    this.groupsSub = Meteor.subscribe('groups', this.params.year);
    this.studentsSub = Meteor.subscribe('students', groupId);
    this.marksSub = Meteor.subscribe('marks', groupId, this.params.discipline)
  },
  students() {
    return Students.find()
  },
  groups() {
    return Groups.find()
  },
  data() {
    return {
      years: activeYears(parseInt(this.params.year)),
      students: this.students(),
      groups: Groups.find(),
      studentsReady: this.studentsSub.ready,
      groupsReady: this.groupsSub.ready,
      marksReady: this.marksSub.ready
    }
  }
});