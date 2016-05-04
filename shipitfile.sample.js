module.exports = function (shipit) {
  var path = "/home/{USER}/projects/omhu";
  var nvm_path = "/home/{USER}/.nvm/nvm.sh";
  var node_version = "0.10";

  shipit.initConfig({
    staging: {
      servers: '{USER}@{SERVER}'
    }
  });

  shipit.task("mdeploy", function () {
    shipit.local("meteor build .build --architecture os.linux.x86_64").then(function () {
      var date = new Date();
      date = [
        date.getUTCFullYear(),
        date.getUTCMonth(),
        date.getUTCDay(),
        date.getUTCHours(),
        date.getUTCMinutes(),
        date.getUTCSeconds()
      ].join("");
      var release_path = path + "/releases/" + date;
      shipit.remote("mkdir -p " + release_path).then(function () {
        shipit.remoteCopy(".build/omhu.tar.gz", release_path + "/build.tar.gz").then(function () {
          shipit.remote("cd " + release_path + " && tar -xf " + release_path + "/build.tar.gz").then(function () {
            shipit.remote("rm -f " + path + "/current").then(function () {
              var output_dir = release_path + "/../../current";
              var bundle_dir = release_path + "/bundle ";
              shipit.remote("cd " + release_path + "&& ln -s " + bundle_dir + output_dir).then(function () {
                shipit.remote("source " + nvm_path + "&& cd " + output_dir + "/programs/server && nvm use " + node_version + "&& npm update")
              })
            });
          });
        })
      })
    });
  })
};