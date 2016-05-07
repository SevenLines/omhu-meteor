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
  iparams() {
    let group = Groups.findOne({
      year: parseInt(this.params.year),
      title: this.params.title
    });
    let groupId = group ? group._id : undefined;
    return {
      groupId: groupId,
      year: this.params.year,
      discipline: this.params.discipline
    }
  },
  subscriptions() {
    let options = this.iparams();
    this.groupsAndDisciplinesSub = Meteor.subscribe('groupsAndDisciplines', options.year);
    this.marksSub = Meteor.subscribe('marksFull', options.groupId, options.discipline)
  },
  students() {
    return Students.find()
  },
  groups() {
    return Groups.find()
  },
  disciplines() {
    let options = this.iparams();
    return Disciplines.find().map(discipline => {
      return {
        i: discipline,
        selected: discipline._id === options.discipline ? 'selected' : ''
      }
    })
  },
  marksInfo() {
    let options = this.iparams();
    let marksInfo = {};
    if (Meteor.isClient) {
      if (this.groupsAndDisciplinesSub.ready() && this.marksSub.ready()) {
        let lessons = Lessons.find({groupId: options.groupId}, {$sort: {date: 1}}).fetch();
        let lessonsCount = lessons.reduce((s, l) => {
          return s + (l.score_ignore ? 0 : 1)
        }, 0);
        console.log(lessonsCount)
        let minSumm = lessonsCount * -2;
        let maxSumm = lessonsCount * 3;
        let baseK = 0.3;

        Marks.find({groupId: options.groupId}).forEach(mark => {
          if (!(mark.studentId in marksInfo))
            marksInfo[mark.studentId] = {};
          marksInfo[mark.studentId][mark.lessonId] = mark;
        });
        let chart = d3.select("#barChart");

        // form marks table
        let students = Students.find({groupId: options.groupId}, {
          $sort: {second_name: -1}
        }).map(student => {
          // за одно пересчитываем сколько кто набрал баллов
          let sum = 0;
          let studentMarks = lessons.map(lesson => {
            let mark = undefined;
            if (student._id in marksInfo) {
              let item = marksInfo[student._id];
              if (lesson._id in item)
                mark = item[lesson._id];
            }
            let value = mark ? mark.value : 0;
            switch (value) {
              case Marks.MARK_BLACK_HOLE:
                if (sum > 0)
                  sum = 0;
                break;
              case Marks.MARK_SHINING:
                if (sum < lessons.length * 3)
                  sum = lessons.length * 3;
                break;
              case Marks.MARK_MERCY:
                if (sum < 0)
                  sum = 0;
                break;
              default:
                sum += value;
            }

            return {
              lesson: lesson,
              student: student,
              value: value
            }
          });

          if (sum === 0)
            percentSum = baseK;
          else if (sum > 0 )
            percentSum = baseK + (sum / maxSumm) * (1.0 - baseK);
          else
            percentSum = baseK - (sum / minSumm) * baseK;

          return {
            studentId: student._id,
            info: {
              studentId: student._id,
              marks: studentMarks,
              name: student.name,
              second_name: student.second_name,
              sum,
              percentSum
            }
          }
        }).reduce((o, v) => {
          o[v.studentId] = v.info;
          return o;
        }, {});
        marksInfo = {
          lessons: lessons,
          students: students
        }
      }
    }
    return marksInfo
  },
  data() {
    return {
      years: activeYears(parseInt(this.params.year)),
      students: this.students(),
      groups: Groups.find(),
      disciplines: this.disciplines(),
      groupsAndDisciplinesReady: this.groupsAndDisciplinesSub.ready,
      marksReady: this.marksSub.ready,
    }
  }
});