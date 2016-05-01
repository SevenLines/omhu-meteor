/**
 * Created by mk on 25.04.16.
 */
Groups = new Mongo.Collection("groups");

Groups.schema = new SimpleSchema({
  title: {type: String},
  year: {type: Number}
});