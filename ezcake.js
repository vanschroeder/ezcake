#!/usr/bin/env node
// Generated by CoffeeScript 1.6.2
(function() {
  var ezcake;

  ezcake = (function() {
    ezcake.prototype.version = '0.0.1';

    ezcake.prototype.fs = require('fs');

    ezcake.prototype.async = require('async');

    ezcake.prototype.cmd = require('commander');

    ezcake.prototype.require_tree = require('require_tree').require_tree;

    ezcake.prototype._ = require('underscore');

    ezcake.prototype.templates_path = './templates';

    ezcake.prototype.strings = {
      hash: '#',
      red: '\u001b[31m',
      green: '\u001b[32m',
      yellow: '\u001b[33m',
      reset: '\u001b[0m'
    };

    ezcake.prototype.ENV = void 0;

    ezcake.prototype.PATH = void 0;

    ezcake.prototype.COMMAND = void 0;

    ezcake.prototype.CONFIG = void 0;

    ezcake.prototype.NAME = void 0;

    ezcake.prototype.uConfig = void 0;

    function ezcake() {
      var _this = this;

      this.config = this.require_tree(null);
      this.async.series([
        (function(cb) {
          return _this.loadConfig(_this.templates_path, cb);
        }), (function(cb) {
          return _this.createOpts(cb);
        }), (function(cb) {
          return _this.fs.realpath('.', false, function(e, path) {
            if (e != null) {
              _this.error(e);
            }
            _this.$path = path;
            return cb(null, "ok");
          });
        }), (function(cb) {
          if ((_this.$home = process.env.EZCAKE_HOME) !== void 0 && !_this.cmd.ignore) {
            return _this.loadConfig("" + _this.$home + "/ezcake.json", cb);
          } else {
            return cb();
          }
        }), (function(cb) {
          return _this.preProcessArgs(cb);
        }), (function(cb) {
          if (_this.cmd.location) {
            return _this._.each(_this.cmd.location, function(l, idx) {
              return _this.loadConfig(l, function() {
                if (idx === _this.cmd.location.length) {
                  return cb(null, "ok");
                }
              });
            });
          } else {
            return cb(null, "ok");
          }
        }), (function(cb) {
          return _this.processArgs(cb);
        }), (function(cb) {
          if (process.argv[1].split('/').pop() === 'ezcake') {
            switch (_this.COMMAND) {
              case "create":
              case "c":
                _this.onCreate();
                break;
              case "init":
              case "i":
                _this.onInit();
                break;
              default:
                if (typeof _this.COMMAND === 'undefined') {
                  process.argv.push('-h');
                  _this.help();
                  _this.cmd.usage("<command> [options]\n\n  where <command> is one of:\n    create, init\n    \n  hint: 'ezcake <command> -h' will give quick help on <command>").parse(process.argv);
                  process.exit(0);
                } else {
                  _this.error("Command must be either 'create' or 'init' try \'ezcake create " + _this.COMMAND + "'");
                }
            }
          }
          _this.cmd.usage(_this.usage);
          return cb(null, "ok");
        }), (function(cb) {
          if (_this.CONFIG === "-h") {
            _this.CONFIG = null;
          }
          if (_this.CONFIG) {
            return _this.processConfiguration(cb);
          } else {
            process.argv.push('-h');
            _this.help();
            _this.cmd.parse(process.argv);
            return process.exit(0);
          }
        }), (function(cb) {
          return _this.getOpts(cb);
        }), (function(cb) {
          if (_this.help()) {
            process.argv.push('-h');
          }
          return cb(null);
        }), (function(cb) {
          _this.cmd.parse(process.argv);
          return cb(null);
        }), (function(cb) {
          return _this.generateConfiguration(cb);
        })
      ], function(err, r) {
        _this.log("" + _this.strings.green + "ezCake completed" + _this.strings.reset + "\n");
        return process.exit(0);
      });
    }

    return ezcake;

  })();

  ezcake.prototype.onCreate = function() {
    var _this = this;

    this.usage = "create " + (this.CONFIG || '<type>') + " <name> [options]\n\n  Creates new " + (this.CONFIG || '<type>') + " configuration as directory <name> in current path";
    if (typeof this.CONFIG === 'undefined') {
      this.usage += "\n  Available types: " + (this.getConfigurations().join(', '));
    }
    if (typeof this.NAME !== 'undefined') {
      this.$path += "/" + this.NAME;
    } else {
      process.argv.push('-h');
    }
    return this.fs.exists(this.$path, function(bool) {
      if (!bool) {
        return _this.fs.mkdir(_this.$path, function(e) {
          if (e != null) {
            _this.error(e);
          }
          return _this.success = "" + _this.CONFIG + " created as " + _this.NAME + "\n";
        });
      }
    });
  };

  ezcake.prototype.onInit = function() {
    this.usage = "init " + (this.CONFIG || '<type>') + " [options]\n\n  Creates or Updates " + (this.CONFIG || '<type>') + " Cakefile in current Project Directory";
    if (typeof this.CONFIG === 'undefined') {
      this.usage += "\n  Available types: " + (this.getConfigurations().join(', '));
    }
    return this.success = "Cakefile updated!\n";
  };

  ezcake.prototype.preProcessArgs = function(callback) {
    var args,
      _this = this;

    args = [];
    this._.each(process.argv, function(v, k) {
      if ((v.match(/^(\-h|\-\-help)+$/)) === null) {
        return args.push(v);
      }
    });
    this.cmd.parse(args);
    return callback(null);
  };

  ezcake.prototype.processArgs = function(cB) {
    var _this = this;

    if (process.argv.length < 3) {
      process.argv.push('-h');
    } else {
      process.argv.forEach(function(val, index) {
        if (index === 0) {
          return (_this.ENV = val);
        }
        if (index === 1) {
          return (_this.PATH = val);
        }
        if (index === 2 && (typeof _this.COMMAND === 'undefined') && !(val.match(/^\-/))) {
          return (_this.COMMAND = val);
        }
        if (index === 3 && (_this.COMMAND.match(/create|init/)) && !(val.match(/^\-/))) {
          return (_this.CONFIG = val);
        }
        if (index === 4 && (_this.COMMAND.match(/create/)) && !(val.match(/^\-/))) {
          return (_this.NAME = val);
        }
      });
    }
    return cB();
  };

  ezcake.prototype.processConfiguration = function(cB) {
    if (typeof (this.uConfig = this.selectedConfig()) !== 'undefined') {
      this.cmd.option("-F, --no-config", "Do not create ezcake config file");
      return cB();
    } else {
      return this.error("Configuration '" + this.CONFIG + "' was not found");
    }
  };

  ezcake.prototype.createOpts = function(cB) {
    this.cmd.version('version: #{@version}').option("-I, --ignore", "ignore global config file if defined in env.EZCAKE_HOME").option("-O, --no-override", "do not allow loaded configs to override each other").option("-l, --location <paths>", "set path(s) of config file location(s)", function(arg) {
      return arg.split(',');
    });
    return cB();
  };

  ezcake.prototype.getOpts = function(cB) {
    var _this = this;

    this._.each((this.commandModuleArr = [].concat(this.uConfig.modules, this.uConfig.commands)), function(v, k) {
      var t;

      if ((t = _this._.findWhere([].concat(_this.config.templates.modules, _this.config.templates.commands), {
        name: v
      })) !== void 0) {
        _this.cmd.option(t.command[0], t.command[1]);
        if ((_this._.indexOf(t.command[1])) > -1 || process.argv[process.argv.length - 1].match(new RegExp("[" + (t.command[0].charAt(1)) + "]+"))) {
          if (typeof t.setFlag !== 'undefined' && (t.setFlag != null)) {
            return process.argv.push(t.setFlag);
          }
        }
      } else {
        return _this.error("" + v + " was not defined");
      }
    });
    return cB();
  };

  ezcake.prototype.help = function() {
    var idx;

    if ((idx = process.argv.indexOf('-h')) > -1) {
      return process.argv.splice(2, idx - 2);
    }
  };

  ezcake.prototype.loadConfig = function(p, cB) {
    var _this = this;

    return this.fs.exists(p, function(bool) {
      var callBack;

      if (!bool) {
        return _this.warn("config file " + p + " was not found");
      }
      callBack = function(d) {
        _this.config.require_tree.off('changed');
        return cB();
      };
      _this.config.require_tree.on('changed', callBack);
      return _this.config.require_tree.addTree(p);
    });
  };

  ezcake.prototype.selectedConfig = function() {
    return this.config.templates.configurations[this.CONFIG];
  };

  ezcake.prototype.getConfigurations = function() {
    return this._.pluck('name', this.config.templates.configurations);
  };

  ezcake.prototype.hasDependencies = function() {
    var has,
      _this = this;

    has = this._.every(this._.flatten(this._.pluck(this.uConfigured, "required")), function(val) {
      return (_this._.find(_this._.pluck(_this._.extend({}, _this.declarations, _this.helpers, _this.uConfigured.modules), "name"), function(n) {
        return n === val;
      })) || false;
    });
    if (!has) {
      throw new Error("'" + val + "' was required but not found");
    }
    return true;
  };

  ezcake.prototype.getPaths = function() {
    return this.uConfig.paths;
  };

  ezcake.prototype.getExts = function() {
    return this._.compact(this._.pluck(this.config.templates.modules, 'ext'));
  };

  ezcake.prototype.getCallbacks = function(list) {
    return this._.compact(this._.pluck(list, 'callback'));
  };

  ezcake.prototype.getDeclarations = function() {
    var _this = this;

    return this._.map(this.config.templates.declarations, function(v, k) {
      if (v.body) {
        return "" + _this.strings.hash + " " + (v.description || v.name + 'header') + "\n" + v.body;
      }
    }).join('\n');
  };

  ezcake.prototype.getHelpers = function() {
    var helpers,
      _this = this;

    helpers = "";
    this._.each(this.config.templates.helpers, function(v, k) {
      return helpers += "" + _this.strings.hash + " " + (v.description || v.name + " helper method") + "\n" + v.name + " = " + v.body;
    });
    return helpers;
  };

  ezcake.prototype.getTasks = function() {
    var tasks,
      _this = this;

    tasks = '';
    this._.each(this.config.templates.tasks, function(t, tk) {
      var body, handlerName;

      handlerName = "on" + (t.name.charAt(0).toUpperCase()) + (t.name.slice(1));
      body = "" + (t.body || new String);
      _this._.each(_this.uConfig.commands, function(v, k) {
        var invocation;

        if (t.invocations != null) {
          if ((invocation = _this._.where(t.invocations, {
            call: handlerName
          })).length) {
            return body += "" + _this.strings.hash + " From Command '" + v + "'\n  " + ('# ' + t.description) + "\n  " + invocation[0].body + "\n  ";
          }
        }
      });
      _this._.each(_this.uConfig.modules, function(v, k) {
        var invocation;

        if (t.invocations != null) {
          if ((invocation = _this._.where(t.invocations, {
            call: handlerName
          })).length) {
            return body += "" + _this.strings.hash + " From Module '" + v + "'\n  " + ('# ' + t.description) + "\n  " + invocation[0].body + "\n  ";
          }
        }
      });
      return tasks += "" + _this.strings.hash + " " + _this.strings.hash + _this.strings.hash + " *" + t.name + "*\n" + _this.strings.hash + " " + t.description + "\ntask '" + t.name + "', '" + t.description + "', (" + (t.args || new String) + ")-> " + (t.name.replace(/:/g, '_')) + " -> log ':)', green\n" + (t.name.replace(/:/g, '_')) + " = (" + (t.args || new String) + ")->\n  " + body + "\n\n";
    });
    return tasks;
  };

  ezcake.prototype.template = function(p, params, callback) {
    var _this = this;

    return this.fs.readFile(p, function(e, data) {
      if (e != null) {
        return _this.error(e);
      }
      _this._.each((data = "" + data).match(/\{([a-zA-Z0-9\.\-_]+)\}/g), function(v, k) {
        return data = data.replace(v, params[v.replace(/[\{\}]/g, '')] || "");
      });
      if (callback && typeof callback === 'function') {
        return callback(data);
      }
    });
  };

  ezcake.prototype.generateConfiguration = function(cB) {
    var modcommands, rx,
      _this = this;

    rx = new RegExp("(" + ((this.uConfig.modules.concat(this.uConfig.commands)).join('|')) + ")+");
    modcommands = this._.filter(this.config.templates.modules.concat(this.config.templates.commands), function(v) {
      return (rx.exec(v.name)) != null;
    });
    return this.template(this.config.templates.cake_template, {
      version: this.version,
      declarations: this.getDeclarations(),
      paths: JSON.stringify(this.getPaths(), null, 2),
      exts: this.getExts().join('|'),
      callbacks: this.getCallbacks(modcommands),
      tasks: this.getTasks(),
      helpers: this.getHelpers()
    }, function(rendered) {
      return _this.fs.writeFile("" + _this.$path + "/Cakefile", rendered, null, function(e) {
        if (e != null) {
          return console.log(e);
        }
        return cB(null);
      });
    });
  };

  ezcake.prototype.log = function(m) {
    return process.stdout.write("" + m + "\n");
  };

  ezcake.prototype.warn = function(m) {
    return process.stdout.write("" + this.strings.yellow + "Warning: " + m + this.strings.reset + "\n");
  };

  ezcake.prototype.error = function(m) {
    process.stderr.write("" + this.strings.red + "Error: " + m + this.strings.reset + "\n");
    return process.exit(1);
  };

  exports.EzCake = ezcake;

  if (process && process.argv && process.argv[1].split('/').pop() === 'ezcake') {
    new ezcake;
  }

}).call(this);
