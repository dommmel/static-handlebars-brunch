// Generated by CoffeeScript 1.4.0
(function() {
  var StaticHandlebarsCompiler, fs, glob, handlebars, mkdirp, sysPath;

  handlebars = require("handlebars");

  sysPath = require("path");

  mkdirp = require("mkdirp");

  fs = require("fs");

  glob = require("glob");

  module.exports = StaticHandlebarsCompiler = (function() {

    StaticHandlebarsCompiler.prototype.brunchPlugin = true;

    StaticHandlebarsCompiler.prototype.type = "template";

    StaticHandlebarsCompiler.prototype.extension = "hbs";

    function StaticHandlebarsCompiler(config) {
      this.config = config;
      return;
    }

    StaticHandlebarsCompiler.prototype.withPartials = function(callback) {
      var partials,
        _this = this;
      partials = {};
      return glob("app/templates/_*.hbs", function(err, files) {
        return files.forEach(function(file) {
          var name;
          name = sysPath.basename(file, ".hbs").substr(1);
          return fs.readFile(file, function(err, data) {
            partials[name] = data.toString();
            if (Object.keys(partials).length === files.length) {
              return callback(partials);
            }
          });
        });
      });
    };

    StaticHandlebarsCompiler.prototype.compile = function(data, path, callback) {
      var basename, template,
        _this = this;
      try {
        basename = sysPath.basename(path, ".hbs");
        template = handlebars.compile(data);
        return this.withPartials(function(partials) {
          var html, newPath;
          html = template({}, {
            partials: partials,
            helpers: _this.makeHelpers(partials)
          });
          newPath = "app/assets" + path.slice(13, -4) + ".html";
          return fs.writeFile(newPath, html, function(err) {
            return callback(err, null);
          });
        });
      } catch (err) {
        return callback(err, null);
      }
    };

    StaticHandlebarsCompiler.prototype.makeHelpers = function(partials) {
      return {
        partial: function(partial, options) {
          return new handlebars.SafeString(handlebars.compile(partials[partial])(options.hash));
        }
      };
    };

    return StaticHandlebarsCompiler;

  })();

}).call(this);