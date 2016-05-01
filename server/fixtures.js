/**
 * Created by mk on 25.04.16.
 */
if (Students.find().count() === 0) {
  let content = Assets.getText("data_fixtures/students.json");
  let students = JSON.parse(content);
  content = Assets.getText("data_fixtures/groups.json");
  let groups = JSON.parse(content);
  content = Assets.getText("data_fixtures/lessons.json");
  let lessons = JSON.parse(content);
  content = Assets.getText("data_fixtures/marks.json");
  let marks = JSON.parse(content);
  content = Assets.getText("data_fixtures/disciplines.json");
  let disciplines = JSON.parse(content);

  for (let student of students) {
    student._id = student._id.toString();
    Students.insert(student)
  }

  for (let group of groups) {
    group._id = group._id.toString();
    Groups.insert(group)
  }

  for (let discipline of disciplines) {
    discipline._id = discipline._id.toString();
    Disciplines.insert(discipline)
  }

  for (let lesson of lessons) {
    lesson._id = lesson._id.toString();
    Lessons.insert(lesson)
  }

  for (let mark of marks) {
    mark._id = mark._id.toString();
    mark.groupId = Students.findOne({_id: mark.studentId}).groupId;
    mark.disciplineId = Lessons.findOne({_id: mark.lessonId}).disciplineId;
    Marks.insert(mark)
  }
}