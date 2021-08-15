const fs = require("fs");
const path = require("path");
const parser = require("@babel/parser");
const traverse = require("@babel/traverse").default;
const { transformFromAst } = require("@babel/core");

class Webpack {
  constructor({ entry, output }) {
    this.entry = entry;
    this.output = output;
    this.modules = [];
  }

  run() {
    const info = this.parse(this.entry);
    this.modules.push(info);
    for (let i = 0; i < this.modules.length; i++) {
      const { rely } = this.modules[i];
      for (let r in rely) {
        this.modules.push(this.parse(rely[r]));
      }
    }

    const obj = {};
    this.modules.forEach((module) => {
      const { entryFile, rely, code } = module;
      obj[entryFile] = {
        rely,
        code,
      };
    });

    this.makeFile(obj);
  }

  parse(entryFile) {
    const content = fs.readFileSync(entryFile, "utf-8");
    const ast = parser.parse(content, { sourceType: "module" });
    const entryDirname = path.dirname(entryFile);
    const rely = {};

    traverse(ast, {
      ImportDeclaration({ node }) {
        const value = node.source.value;
        const newPathname = "./" + path.join(entryDirname, value);
        rely[value] = newPathname;
      },
    });

    const { code } = transformFromAst(ast, null, {
      presets: ["@babel/preset-env"],
    });

    return {
      entryFile,
      rely,
      code,
    };
  }

  makeFile(code) {
    const outputPath = path.join(this.output.path, this.output.filename);

    const newCode = JSON.stringify(code);

    const bundle = `(function(modules){
        function require(module){

            const exports = {}

            function pathRequire(relativePath){
                return require(modules[module].rely[relativePath])
            }

            (function(require,exports,code){
                eval(code)
            })(pathRequire,exports,modules[module].code)

            return exports

        }
        require('${this.entry}')
    })(${newCode})`;

    fs.writeFileSync(outputPath, bundle, "utf-8");
  }
}

module.exports = Webpack;
