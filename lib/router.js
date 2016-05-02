/**
 * Created by mk on 25.04.16.
 */

Router.configure({
  layoutTemplate: 'layout',
  loadingTemplate: 'loading',
  notFoundTemplate: 'not_found',
});

Router.route('/', {
  name: "home",
  controller: HomeController
});

Router.route('/students/:year/:title?', {
  name: "students",
  controller: StudentsController
});

Router.route('/marks/:discipline/:year/:title?', {
  name: "marks",
  controller: MarksController
});