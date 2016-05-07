/**
 * Created by mk on 26.04.16.
 */
Lessons = new Mongo.Collection('lessons');

Lessons.LESSON_TYPE_PRACTICE = 1;
Lessons.LESSON_TYPE_TEST = 2;
Lessons.LESSON_TYPE_LECTION = 3;
Lessons.LESSON_TYPE_LAB = 4;
Lessons.LESSON_TYPE_EXAM = 5;