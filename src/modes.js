import _findWhere from 'lodash/collection/findWhere'

const modes = [
  {name: 'Brainfuck', mime: 'text/x-brainfuck', mode: 'brainfuck', ext: ['b', 'bf']},
  {name: 'C', mime: 'text/x-csrc', mode: 'clike', ext: ['c', 'h']},
  {name: 'C++', mime: 'text/x-c++src', mode: 'clike', ext: ['cpp', 'c++', 'cc', 'cxx', 'hpp', 'h++', 'hh', 'hxx'], alias: ['cpp']},
  {name: 'Cobol', mime: 'text/x-cobol', mode: 'cobol', ext: ['cob', 'cpy']},
  {name: 'C#', mime: 'text/x-csharp', mode: 'clike', ext: ['cs'], alias: ['csharp']},
  {name: 'Clojure', mime: 'text/x-clojure', mode: 'clojure', ext: ['clj']},
  {name: 'CMake', mime: 'text/x-cmake', mode: 'cmake', ext: ['cmake', 'cmake.in'], file: /^CMakeLists.txt$/},
  {name: 'CoffeeScript', mime: 'text/x-coffeescript', mode: 'coffeescript', ext: ['coffee'], alias: ['coffee', 'coffee-script']},
  {name: 'Common Lisp', mime: 'text/x-common-lisp', mode: 'commonlisp', ext: ['cl', 'lisp', 'el'], alias: ['lisp']},
  {name: 'CSS', mime: 'text/css', mode: 'css', ext: ['css']},
  {name: 'D', mime: 'text/x-d', mode: 'd', ext: ['d']},
  {name: 'Dart', mimes: ['application/dart', 'text/x-dart'], mode: 'dart', ext: ['dart']},
  {name: 'diff', mime: 'text/x-diff', mode: 'diff', ext: ['diff', 'patch']},
  {name: 'Django', mime: 'text/x-django', mode: 'django'},
  {name: 'Dockerfile', mime: 'text/x-dockerfile', mode: 'dockerfile', file: /^Dockerfile$/},
  {name: 'Elm', mime: 'text/x-elm', mode: 'elm', ext: ['elm']},
  {name: 'Erlang', mime: 'text/x-erlang', mode: 'erlang', ext: ['erl']},
  {name: 'Fortran', mime: 'text/x-fortran', mode: 'fortran', ext: ['f', 'for', 'f77', 'f90']},
  {name: 'F#', mime: 'text/x-fsharp', mode: 'mllike', ext: ['fs'], alias: ['fsharp']},
  {name: 'Go', mime: 'text/x-go', mode: 'go', ext: ['go']},
  {name: 'Groovy', mime: 'text/x-groovy', mode: 'groovy', ext: ['groovy']},
  {name: 'HAML', mime: 'text/x-haml', mode: 'haml', ext: ['haml']},
  {name: 'Haskell', mime: 'text/x-haskell', mode: 'haskell', ext: ['hs']},
  {name: 'Haxe', mime: 'text/x-haxe', mode: 'haxe', ext: ['hx']},
  {name: 'ASP.NET', mime: 'application/x-aspx', mode: 'htmlembedded', ext: ['aspx'], alias: ['asp', 'aspx']},
  {name: 'HTML', mime: 'text/html', mode: 'htmlmixed', ext: ['html', 'htm'], alias: ['xhtml']},
  {name: 'HTTP', mime: 'message/http', mode: 'http'},
  {name: 'Jade', mime: 'text/x-jade', mode: 'jade', ext: ['jade']},
  {name: 'Java', mime: 'text/x-java', mode: 'clike', ext: ['java']},
  {name: 'JavaScript', mimes: ['text/javascript', 'text/ecmascript', 'application/javascript', 'application/x-javascript', 'application/ecmascript'], mode: 'javascript', ext: ['js'], alias: ['ecmascript', 'js', 'node']},
  {name: 'JSON', mimes: ['application/json', 'application/x-json'], mode: 'javascript', ext: ['json', 'map'], alias: ['json5']},
  {name: 'JSON-LD', mime: 'application/ld+json', mode: 'javascript', ext: ['jsonld'], alias: ['jsonld']},
  {name: 'Jinja2', mime: 'null', mode: 'jinja2'},
  {name: 'Julia', mime: 'text/x-julia', mode: 'julia', ext: ['jl']},
  {name: 'Kotlin', mime: 'text/x-kotlin', mode: 'clike', ext: ['kt']},
  {name: 'LESS', mime: 'text/x-less', mode: 'css', ext: ['less']},
  {name: 'LiveScript', mime: 'text/x-livescript', mode: 'livescript', ext: ['ls'], alias: ['ls']},
  {name: 'Lua', mime: 'text/x-lua', mode: 'lua', ext: ['lua']},
  {name: 'Markdown', mime: 'text/x-markdown', mode: 'markdown', ext: ['markdown', 'md', 'mkd']},
  {name: 'mIRC', mime: 'text/mirc', mode: 'mirc'},
  {name: 'MariaDB SQL', mime: 'text/x-mariadb', mode: 'sql'},
  {name: 'Mathematica', mime: 'text/x-mathematica', mode: 'mathematica', ext: ['m', 'nb']},
  {name: 'MS SQL', mime: 'text/x-mssql', mode: 'sql'},
  {name: 'MySQL', mime: 'text/x-mysql', mode: 'sql'},
  {name: 'Nginx', mime: 'text/x-nginx-conf', mode: 'nginx', file: /nginx.*\.conf$/i},
  {name: 'Objective C', mime: 'text/x-objectivec', mode: 'clike', ext: ['m', 'mm']},
  {name: 'OCaml', mime: 'text/x-ocaml', mode: 'mllike', ext: ['ml', 'mli', 'mll', 'mly']},
  {name: 'Pascal', mime: 'text/x-pascal', mode: 'pascal', ext: ['p', 'pas']},
  {name: 'Perl', mime: 'text/x-perl', mode: 'perl', ext: ['pl', 'pm']},
  {name: 'PHP', mime: 'application/x-httpd-php', mode: 'php', ext: ['php', 'php3', 'php4', 'php5', 'phtml']},
  {name: 'Plain Text', mime: 'text/plain', mode: 'null', ext: ['txt', 'text', 'conf', 'def', 'list', 'log']},
  {name: 'Python', mime: 'text/x-python', mode: 'python', ext: ['py', 'pyw']},
  {name: 'Puppet', mime: 'text/x-puppet', mode: 'puppet', ext: ['pp']},
  {name: 'R', mime: 'text/x-rsrc', mode: 'r', ext: ['r'], alias: ['rscript']},
  {name: 'reStructuredText', mime: 'text/x-rst', mode: 'rst', ext: ['rst'], alias: ['rst']},
  {name: 'Ruby', mime: 'text/x-ruby', mode: 'ruby', ext: ['rb'], alias: ['jruby', 'macruby', 'rake', 'rb', 'rbx']},
  {name: 'Rust', mime: 'text/x-rustsrc', mode: 'rust', ext: ['rs']},
  {name: 'Sass', mime: 'text/x-sass', mode: 'sass', ext: ['sass']},
  {name: 'Scala', mime: 'text/x-scala', mode: 'clike', ext: ['scala']},
  {name: 'Scheme', mime: 'text/x-scheme', mode: 'scheme', ext: ['scm', 'ss']},
  {name: 'SCSS', mime: 'text/x-scss', mode: 'css', ext: ['scss']},
  {name: 'Shell', mime: 'text/x-sh', mode: 'shell', ext: ['sh', 'ksh', 'bash'], alias: ['bash', 'sh', 'zsh'], file: /^PKGBUILD$/},
  {name: 'Smalltalk', mime: 'text/x-stsrc', mode: 'smalltalk', ext: ['st']},
  {name: 'Solr', mime: 'text/x-solr', mode: 'solr'},
  {name: 'SPARQL', mime: 'application/sparql-query', mode: 'sparql', ext: ['rq', 'sparql'], alias: ['sparul']},
  {name: 'Spreadsheet', mime: 'text/x-spreadsheet', mode: 'spreadsheet', alias: ['excel', 'formula']},
  {name: 'SQL', mime: 'text/x-sql', mode: 'sql', ext: ['sql']},
  {name: 'Swift', mime: 'text/x-swift', mode: 'swift', ext: ['swift']},
  {name: 'MariaDB', mime: 'text/x-mariadb', mode: 'sql'},
  {name: 'LaTeX', mime: 'text/x-latex', mode: 'stex', ext: ['text', 'ltx'], alias: ['tex']},
  {name: 'Tcl', mime: 'text/x-tcl', mode: 'tcl', ext: ['tcl']},
  {name: 'Textile', mime: 'text/x-textile', mode: 'textile', ext: ['textile']},
  {name: 'TOML', mime: 'text/x-toml', mode: 'toml', ext: ['toml']},
  {name: 'TypeScript', mime: 'application/typescript', mode: 'javascript', ext: ['ts'], alias: ['ts']},
  {name: 'Twig', mime: 'text/x-twig', mode: 'twig'},
  {name: 'VB.NET', mime: 'text/x-vb', mode: 'vb', ext: ['vb']},
  {name: 'VBScript', mime: 'text/vbscript', mode: 'vbscript', ext: ['vbs']},
  {name: 'Velocity', mime: 'text/velocity', mode: 'velocity', ext: ['vtl']},
  {name: 'VHDL', mime: 'text/x-vhdl', mode: 'vhdl', ext: ['vhd', 'vhdl']},
  {name: 'XML', mimes: ['application/xml', 'text/xml'], mode: 'xml', ext: ['xml', 'xsl', 'xsd'], alias: ['rss', 'wsdl', 'xsd']},
  {name: 'YAML', mime: 'text/x-yaml', mode: 'yaml', ext: ['yaml', 'yml'], alias: ['yml']}
]

modes.map((mode) => {
  const name = mode.mode
  if (name !== 'null') {
    require('codemirror/mode/' + name + '/' + name + '.js')
  }
})

class Modes {
  find (name) {
    let found_mode = _findWhere(modes, {name})
    return found_mode
  }
  map (func) {
    return modes.map(func)
  }
}

export default Modes
