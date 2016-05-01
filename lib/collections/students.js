/**
 * Created by mk on 25.04.16.
 */
Students = new Mongo.Collection("students");

Students.schema = new SimpleSchema({
  name: {type: String, label: 'Имя', optional: true},
  second_name: {type: String, label: 'Фамилия', optional: true},
  sex: {type: Number, min: -1, max: 1, defaultValue: -1, label: 'Пол', allowedValues: [-1, 0, 1]},
  groupId: {type: String}
});

Students.attachSchema(Students.schema);


Meteor.methods({
  'students.update'(studentId, options) {
    Students.schema.validate(options);
    
    Students.update(studentId, {
      $set: options
    })
  }
});