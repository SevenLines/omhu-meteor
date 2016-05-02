/**
 * Created by mk on 25.04.16.
 */
Meteor.publish("students", (groupId) => {
  return Students.find({groupId: groupId});
});

Meteor.publish("marksFull", (groupId, disciplineId) => {
  return [
    Marks.find({groupId: groupId, disciplineId: disciplineId.toString()}),
    Lessons.find({groupId: groupId, disciplineId: disciplineId.toString()}),
    Students.find({groupId: groupId})
  ]
});

Meteor.publish("marks", (groupId, disciplineId) => {
  return Marks.find({groupId: groupId, disciplineId: disciplineId.toString()});
});


Meteor.publish("lessons", (groupId, disciplineId) => {
  return Lessons.find({groupId: groupId, disciplineId: disciplineId.toString()})
});

Meteor.publish("groupsAndDisciplines", (year) => {
  return [
    Groups.find({year: parseInt(year)}),
    Disciplines.find()
  ]
});

Meteor.publish("groups", (year) => {
  return Groups.find({year: parseInt(year)})
});

// Deny all client-side updates to user documents
Meteor.users.deny({
  update() { return true; }
});