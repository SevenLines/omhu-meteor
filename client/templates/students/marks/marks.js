let markClass = d3.scale.ordinal().domain([
  -1001, -2, -1, 0, 1, 2, 3, 4, 5, 6, 1001
]).range([
  'black-hole', 'awful', 'bad', 'empty', 'normal', 'good', ' excellent', 'awesome', 'fantastic', 'incredible', 'shining'
]);

let lessonClass = d3.scale.ordinal().domain([
  1, 2, 3, 4, 5
]).range([
  'prct', 'test', 'lect', 'lab', 'exam'
]);

let studentPercentColor = d3.scale.linear()
  .domain([0, 0.3, 0.99999, 1, 1000])
  .range(['red', 'white', 'green', '#ffe20a', '#ffe20a']);

function sortStudentsByName(a, b) {
  return d3.ascending(a.second_name, b.second_name);
}

function sortStudentsByResult(a, b) {
  return d3.descending(a.sum, b.sum);
}

function badStudentsFilter(student) {
  return student.sum < 0;
}

function showPoints(student) {
  return student.sum;
}

function showPercents(student) {
  return Math.round(student.percentSum * 100, 0) + "%";
}

let sortFunction = ReactiveVar(sortStudentsByName);
let showBadStudents = ReactiveVar(true);
let showFunction = ReactiveVar(showPoints);

Template.marks.helpers({
  params() {
    return Router.current().route.params;
  },
  marksCount() {
    return Marks.find().count();
  },
  loadingVisible() {
    return Router.current().data().groupsAndDisciplinesReady() ? "hidden" : "";
  },
  marksVisible() {
    return Router.current().data().groupsAndDisciplinesReady() ? "" : "hidden";
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
  let tableStudents = d3.select("#students").append('table');
  let controlRow = tableStudents.append("tr").append("td").append("div").attr("class", "mark-cell");

  // сортировка
  controlRow.append("button").attr("class", "student-btn sort").on("click", function () {
    let currentSortFunction = sortFunction.get();
    sortFunction.set(currentSortFunction == sortStudentsByName ? sortStudentsByResult : sortStudentsByName);
  }).append("i").attr("class", "fa fa-sort");

  // показывать проценты вместо баллов
  controlRow.append("button").attr("class", "student-btn stared").on("click", function () {
    let currentShowFunction = showFunction.get();
    showFunction.set(currentShowFunction == showPoints ? showPercents : showPoints);
  }).append("i").attr("class", "fa fa-star");

  // спрятать плохих студентов
  controlRow.append("button").attr("class", "student-btn stared").on("click", function () {
    showBadStudents.set(!showBadStudents.get());
  }).append("i").attr("class", "fa fa-eye");

  let tableMarks = d3.select("#marks").append('table');
  let lessonsRow = tableMarks.append("tr");

  Tracker.autorun(function () {
    var marks = Router.current().marksInfo();
    var lessons = marks.lessons;
    var students = marks.students;
    students = _.map(students, (v, i) => {
      return v
    });

    if (_.isEmpty(marks))
      return;

    function getXPos(i) {
      return i * (itemSize.x + itemMargins.x);
    }

    function getYPos(i) {
      return i * (itemSize.y + itemMargins.y);
    }

    // LESSONS LINE
    let lessonsSelection = lessonsRow.selectAll("td").data(lessons);
    lessonsSelection.enter().append("td").append("div");
    lessonsSelection.select("div").attr({
      class(l) {
        return `mark-cell lesson ${lessonClass(l.lesson_type)}`
      }
    }).text((l) => {
      return new Date(l.date).getUTCDate();
    });
    lessonsSelection.exit().remove();
    //
    // // MARK TABLE
    let marksSelection = tableMarks.selectAll("tr.student").data(students);
    marksSelection.enter().append("tr");
    marksSelection.attr({
      class: "student"
    }).sort(sortFunction.get());
    marksSelection.exit().remove();

    let studentsMarksSelection = marksSelection.selectAll("td")
      .data((s, i) => {
        return s.marks
      });
    //
    studentsMarksSelection.enter().append("td").append("div");
    studentsMarksSelection.selectAll("div").data(d => {
      return [d]
    }).attr({
      class(m) {
        return `mark-cell mmark ${markClass(m.value)} ${lessonClass(m.lesson.lesson_type)}`
      },
      dataDate(m) {
        return new Date(m.lesson.date).getUTCDate();
      }
    });
    studentsMarksSelection.exit().remove();

    // STUDENTS TABLE
    let studentSelection = tableStudents.selectAll("tr.student-row").data(students);
    studentSelection.enter().append("tr").append("td").append("div");
    studentSelection.attr({
      class(s) {
        return `student-row`;
      }
    }).sort(sortFunction.get())
      .selectAll("tr td div")
      .data(d => {
        return [d]
      })
      .attr({
        class(s) {
          return "student"
        }
      }).style("background-color", function (s) {
      return studentPercentColor(s.percentSum);
    }).text(s => {
      return `${s.second_name} ${s.name} ${showFunction.get()(s)}`
    });

    if (showBadStudents.get()) {
      marksSelection.filter(badStudentsFilter).classed("hidden", true);
      studentSelection.filter(badStudentsFilter).classed("hidden", true);
    }

    studentSelection.exit().remove();
  })
});