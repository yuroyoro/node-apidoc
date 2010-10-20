var fs = require('fs');

var Member = function( level, title, stream, parent){
  Object.defineProperty(this, 'level', {value:level, writable : true, enumerable : false,  configurable : false});
  Object.defineProperty(this, 'parent', {value:parent, writable : true, enumerable : false,  configurable : false});
  Object.defineProperty(this, 'content', {value:"", writable : true, enumerable : false,  configurable : false});
  Object.defineProperty(this, 'members', {value:new Array(), writable : true, enumerable : false,  configurable : false});
  var stream = stream || process.stdout;
  Object.defineProperty(this, 'stream', {value:stream, writable : true, enumerable : false,  configurable : false});
  var header = "";
  var i = 0;
  for( i = 0; i < level ; i++){ header += "#" }
  header += " " + title;
  this.title = title;
  Object.defineProperty(this, 'header', {value:header, writable : true, enumerable : false,  configurable : false});
  Object.defineProperty(this, 'm', {value:this.members, writable : true, enumerable : false,  configurable : false});
};
Member.prototype.write = function(s){ this.stream.write(s + "\n");}
Member.prototype.show = function(){
  this.write( this.header);
  this.write( this.content);
  return this;
};
Member.prototype.s = Member.prototype.show;
Member.prototype.list = function(){
  this.write( this.header );
  var i = 0;
  for( i = 0; i < this.members.length; i++){
    this.write("  " + i + ": " + this.members[i].title);
  }
  return this;
};
Member.prototype.l = Member.prototype.list ;
Member.prototype.find = function( pattern , quiet){
  var result = new Array();
  var str = "";
  if( this.title.match(pattern) ) result.push(this);
  var i = 0;
  for( i = 0; i < this.members.length; i++){
    var cr = this.members[i].find(pattern, true);
    result = result.concat(cr.members );
  }
  for( i = 0; i < result.length; i++){
    str += "  " + i + ": " + result[i].title + "\n";
  }
  var m = new Member( this.level, "search result for " + pattern , this.stream );
  m.members = result;
  m.content = str;
  if(!quiet ) this.write(str);
  return m;
};
Member.prototype.f = Member.prototype.find ;
Member.prototype.grep = function( pattern , quiet){
  var result = new Array();
  var str = "";
  var pushed = false;
  if( this.title.match(pattern) ) {
    result.push(this);
    pushed = true;
    str += "  " + this.header + "\n";
  }
  var lines = this.content.split(/\r?\n/);
  var i = 0;
  for( i = 0; i < lines.length; i++){
    if( lines[i].match(pattern) ){
      if( pushed ){
        result.push(this);
        pushed = true;
      }
      str += "  " + this.title + ":" + i + ":" + lines[i] + "\n";
    }
  }
  var m = new Member( this.level, "grep result for " + pattern + "\n", this.stream );
  m.content += str;

  for( i = 0; i < this.members.length; i++){
    var cr = this.members[i].grep(pattern, true);
    result = result.concat(cr.members);
    m.content += cr.content;
  }
  m.members = result;
  if(!quiet) {
    var l = m.content.split(/\r?\n/);
    for( i = 0; i < l.length; i++){
      this.write(l[i]);
    }
  }

  return m;
};
Member.prototype.g = Member.prototype.grep ;


exports.load = load;
function load( path, stream ){
  var level = 0;
  var doc = new Member(level,path, stream );
  var current = doc ;

  function processLine(line) {
    var r = line.match(/^(#+)\s(.*)/);
    if(r){
      var new_level = r[1].length;
      var member = new Member(new_level, r[2], stream);
      if( level < new_level ){
        member.parent = current;
        current.members.push(member);
      }
      else if( level == new_level ){
        member.parent = current.parent;
        current.parent.members.push(member);
      }
      else {
        member.parent = current.parent.parent;
        current.parent.parent.members.push(member);
      }
      current = member;
      level = new_level;
    } else{
      current.content += line;
    }
  }

  var buf = "";
  fs.createReadStream(path, {"encoding":'utf8'}).on('data', function(data){
    if (data.match(/\r?\n/)) {
      var lines = data.split(/\r?\n/);
      processLine( buf + lines.shift() + "\n");
      buf = lines.pop();
      var i = 0;
      for( i = 0; i < lines.length; i++ ){
        processLine(lines[i] +"\n");
      }
    } else{
     buf += data;
    }
  }).on('end', function(){
      processLine(buf);
  });

  return doc;
}

if( process.env["NODE_JS_DOC_PATH"]) {
  var node = load(process.env["NODE_JS_DOC_PATH"]);
  exports.node = node;
  exports.list = node.list;
  exports.l = node.l;
  exports.find = node.find;
  exports.f = node.f;
  exports.grep = node.find;
  exports.g = node.f;
}
