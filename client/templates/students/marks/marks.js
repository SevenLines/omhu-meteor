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
  .range(['#ff7d85', 'white', '#b9ff1f', '#ffe20a', '#ffe20a']);

function sortStudentsByName(a, b) {
  return d3.ascending(a.second_name, b.second_name);
}
sortStudentsByName.name = "byName";

function sortStudentsByResult(a, b) {
  return d3.descending(a.sum, b.sum);
}
sortStudentsByResult.name = "byResult";
sortFunctions = {};
sortFunctions[sortStudentsByName.name] = sortStudentsByName;
sortFunctions[sortStudentsByResult.name] = sortStudentsByResult;

function badStudentsFilter(student) {
  return student.sum < 0;
}

function showPoints(student) {
  return student.sum;
}

function showPercents(student) {
  return Math.round(student.percentSum * 100, 0) + "%";
}

let sortFunction = ReactiveVar(sortFunctions[localStorage['sortMarksFunction'] || sortStudentsByName.name]);
let showBadStudents = ReactiveVar(false);
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
  "change #year, change #discipline, change #group"(e) {
    let form = e.target.form;
    Router.go("marks", {
      title: form.group.value,
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
    currentSortFunction = currentSortFunction == sortStudentsByName ? sortStudentsByResult : sortStudentsByName;
    localStorage['sortMarksFunction'] = currentSortFunction.name;
    sortFunction.set(currentSortFunction);
  }).append("i").attr("class", "fa fa-sort");

  // показывать проценты вместо баллов
  controlRow.append("button").attr("class", "student-btn stared").on("click", function () {
    let currentShowFunction = showFunction.get();
    showFunction.set(currentShowFunction == showPoints ? showPercents : showPoints);
  }).append("i").attr("class", "fa fa-star");

  // спрятать плохих студентов
  controlRow.append("button").attr("class", "student-btn stared").on("click", function () {
    localStorage['showBadStudents'] = !showBadStudents.get();
    showBadStudents.set(!showBadStudents.get());
  }).append("i").attr("class", "fa fa-eye");

  let tableMarks = d3.select("#marks").append('table');
  let lessonsRow = tableMarks.append("tr");

  var drag = d3.behavior.drag().on("drag", function () {
    this.scrollLeft -= d3.event.dx;
  }).on('dragstart', function() {
    d3.select(this).classed("dragged", true);
  }).on('dragend', function () {
    d3.select(this).classed("dragged", false);
  });
  d3.select("#marks").call(drag);


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

    // MARK TABLE
    let marksSelection = tableMarks.selectAll("tr.student").data(students);
    marksSelection.enter().append("tr");
    marksSelection.attr({
      class: "student"
    });
    marksSelection.exit().remove();

    let studentsMarksSelection = marksSelection.selectAll("td")
      .data((s, i) => {
        return s.marks
      });

    studentsMarksSelection.enter().append("td").append("div").append("span");
    studentsMarksSelection.selectAll("div").data(d => {
      return [d]
    }).attr({
      class(m) {
        return `mark-cell mmark ${markClass(m.value)} ${lessonClass(m.lesson.lesson_type)}`
      },
      dataDate(m) {
        return new Date(m.lesson.date).getUTCDate();
      }
    }).select("span").text(m => {
      return m.value
    });
    studentsMarksSelection.exit().remove();

    // STUDENTS TABLE
    let studentSelection = tableStudents.selectAll("tr.student-row").data(students);
    let studentSelectionEnter = studentSelection.enter()
      .append("tr")
      .append("td")
      .append("div");
    studentSelectionEnter.append("span").attr("class", "second-name");
    studentSelectionEnter.append("span").attr("class", "name");
    studentSelectionEnter.append("span").attr("class", "n");
    studentSelectionEnter.append("span").attr("class", "label label-default");

    // .text(s => {
    //   return showFunction.get()(s);
    // });


    let studentRow = studentSelection.attr({
      class(s) {
        return `student-row`;
      }
    }).selectAll("tr > td > div")
      .data(d => {
        return [d]
      })
      .attr({
        class(s) {
          return "student"
        }
      }).style("background-color", function (s) {
        return studentPercentColor(s.percentSum);
      });

    studentRow.select("span.second-name").text(s => {
      return s.second_name;
    });
    studentRow.select("span.name").text(s => {
      return " " + s.name;
    });
    studentRow.select("span.n").text(s => {
      let firstLetter = s.name && s.name.length ? s.name[0] : "";
      return " " + firstLetter + ".";
    });
    studentRow.select("span.label").text(s => {
      return showFunction.get()(s);
    });

    if (!showBadStudents.get()) {
      marksSelection.filter(badStudentsFilter).classed("hidden", true);
      studentSelection.filter(badStudentsFilter).classed("hidden", true);
    }
    studentSelection.sort(sortFunction.get());
    marksSelection.sort(sortFunction.get());

    studentSelection.exit().remove();
  })
});