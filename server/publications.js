/**
 * Created by mk on 25.04.16.
 */
Meteor.publish("students", (groupId) => {
  return Students.find({groupId: groupId});
});

Meteor.publish("marks", (groupId, disciplineId) => {
  return Marks.find({groupId: groupId, disciplineId: disciplineId})
});

Meteor.publish("groups", (year) => {
  return Groups.find({year: parseInt(year)});
});

// Deny all client-side updates to user documents
Meteor.users.deny({
  update() { return true; }
});