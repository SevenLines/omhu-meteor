/**
 * Created by mk on 30.04.16.
 */
throwError = function (message) {
  // Errors.insert({message: message})
  sAlert.error(message)
};

throwInfo = function (message) {
  sAlert.info(message);
};