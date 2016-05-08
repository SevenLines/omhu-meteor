/**
 * Created by mk on 26.04.16.
 */
Marks = new Mongo.Collection("marks");


Marks.MARK_BASE = 0;
Marks.MARK_SPECIAL = 1000;

Marks.MARK_BLACK_HOLE = Marks.MARK_BASE - (Marks.MARK_SPECIAL + 1);
Marks.MARK_ABSENT = Marks.MARK_BASE - 2;
Marks.MARK_EMPTY = Marks.MARK_BASE;
Marks.MARK_NORMAL = Marks.MARK_BASE + 1;
Marks.MARK_GOOD = Marks.MARK_BASE + 2;
Marks.MARK_EXCELLENT = Marks.MARK_BASE + 3;
Marks.MARK_AWESOME = Marks.MARK_BASE + 4;
Marks.MARK_FANTASTIC = Marks.MARK_BASE + 5;
Marks.MARK_INCREDIBLE = Marks.MARK_BASE + 6;
Marks.MARK_SHINING = Marks.MARK_BASE + (Marks.MARK_SPECIAL + 1);
Marks.MARK_MERCY = Marks.MARK_BASE + (Marks.MARK_SPECIAL + 2);
Marks.MARK_KEEP = Marks.MARK_BASE + (Marks.MARK_SPECIAL + 3);
