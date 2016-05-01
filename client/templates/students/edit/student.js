/**
 * Created by mk on 30.04.16.
 */
Template.student.onCreated(function () {
  this.second_name = ReactiveVar(this.data.second_name);
  this.name = ReactiveVar(this.data.name);
  this.sex = ReactiveVar(this.data.sex);
  this.reset = () => {
    this.second_name.set(this.data.second_name);
    this.name.set(this.data.name);
    this.sex.set(this.data.sex);
  };
  this.changed = () => {
    return this.second_name.get() != this.data.second_name
      || this.name.get() != this.data.name
      || this.sex.get() != this.data.sex;
  };
  this.reset()
});

Template.student.helpers({
  canEdit() {
    return Meteor.userId()
  },
  btnClass() {
    return Template.instance().changed() ? 'btn-success' : 'btn-success-outline disabled'
  },
  formClass() {
    return Template.instance().changed() ? 'has-success' : ''
  },
  maleClass() {
    return Template.instance().sex.get() == 1 ? 'btn-primary' : 'btn-secondary-outline'
  },
  femaleClass() {
    return Template.instance().sex.get() == 0 ? 'btn-primary' : 'btn-secondary-outline'
  },
  marksD3() {
    return Marks.find({studentId: this._id});
  }
});

Template.student.events({
  'click .save'(e) {
    e.preventDefault();

    if(!Template.instance().changed())
      return;

    let result = Meteor.call('students.update', this._id, {
      name: Template.instance().name.get(),
      sex: Template.instance().sex.get(),
      second_name: Template.instance().second_name.get(),
      groupId: this.groupId
    }, (error) => {
      if (error) {
        throwError(error.message)
      } else {
        throwInfo(`Успешно обновил студента\n ${this.second_name} ${this.name}`)
      }
    });
    Template.instance().reset()
  },
  'click .remove'() {
    alert("removed");
  },
  'click .gender'(e) {
    console.log(e);
    if ($(e.currentTarget).hasClass('male')) {
      Template.instance().sex.set(1);
    } else {
      Template.instance().sex.set(0);
    }
  },
  'input .student_secondname'(e) {
    Template.instance().second_name.set(e.target.value);
  },
  'input .student_name'(e) {
    Template.instance().name.set(e.target.value);
  }
});