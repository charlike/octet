module.exports = function(html, options, done) {
  var re = /<%([^%>]+)?%>/g,
  reExp = /(^( )?(if|for|else|switch|case|break|{|}))(.*)?/g,
  code = 'var r=[];\n',
  cursor = 0, result;
  var add = function(line, js) {
    js? (code += line.match(reExp) ? line + '\n' : 'r.push(' + line + ');\n') :
        (code += line != '' ? 'r.push("' + line.replace(/"/g, '\\"') + '");\n' : '');
    return add;
  }
  while(match = re.exec(html)) {
    add(html.slice(cursor, match.index))(match[1], true);
    cursor = match.index + match[0].length;
  }
  add(html.substr(cursor, html.length - cursor));
  code += 'return r.join("");';
  try {
    result = new Function(code.replace(/[\r\t\n]/g, '')).apply(options, [options]);
    if ('function' === typeof done) return done(null, result);
    else return {err: null, res: result};
  } catch(err) {
    if ('function' === typeof done) return done(err, null);

    console.error("'" + err.message + "'", " in \n\nCode:\n", code, "\n");
    return {err: err, res: null};
  }
}
