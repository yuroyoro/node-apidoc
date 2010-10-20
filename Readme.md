# node-apidoc

requireすることで、node.js付属のAPI Documentを表示させるUtility。
REPLの中からAPI Documentを検索、表示させることができますよ。

http://twitter.com/yuroyoro

## Install

  npm install node-apidoc


## 準備

node.jsのAPI Documentであるapi.markdownへのパスを環境変数NODE_JS_DOC_PATHに設定してください。

## 使い方

以下のようにrequireすることで、api.markdownを読み込みます。apidoc.nodeにapi.markdownの内容が入ってます。

  > var apidoc = require('node-apidoc');
  > apidoc.node.show();
   /Users/ozaki/dev/Project/sandbox/javascript/node/doc/api.markdown
  node(1) -- evented I/O for V8 JavaScript
  ========================================


  { title: '/Users/ozaki/dev/Project/sandbox/javascript/node/doc/api.markdown' }

apidocへの呼び出しは全てMemberオブジェクトを返します。Memberオブジェクトは以下のプロパティ/メソッドを持っています。

### titleプロパティ

Document/Sectionのタイトルです。

  > apidoc.node.m[2].title
  'Buffers'

### contentプロパティ

Document/Sectionの内容です。

  > apidoc.node.m[2].content
  '\nPure Javascript is Unicode friendly but not nice to binary data.  When\ndealing with TCP streams or the file system, it\'s necessary to handle octet\nstreams. Node has several strategies for manipulating, creating, and\nconsuming octet streams.\n\nRaw data is stored in instances of the `Buffer` class. A `Buffer` is similar\nto an array of integers but corresponds

### member/mプロパティ

Document/Sectionに含まれるSectionの配列です。

  > apidoc.node.m[2].members;
  [ { title: 'new Buffer(size)' }
  , { title: 'new Buffer(array)' }
  , { title: 'new Buffer(str, encoding=\'utf8\')' }
  , { title: 'buffer.write(string, offset=0, encoding=\'utf8\')' }
  , { title: 'buffer.toString(encoding, start=0, end=buffer.length)' }
  , { title: 'buffer[index]' }
  , { title: 'Buffer.byteLength(string, encoding=\'utf8\')' }
  , { title: 'buffer.length' }
  , { title: 'buffer.copy(targetBuffer, targetStart, sourceStart, sourceEnd=buffer.length)' }
  , { title: 'buffer.slice(start, end=buffer.length)' }
  ]


### show()/s()

内容を表示します。

  > apidoc.node.m[2].show();
  ## Buffers

  Pure Javascript is Unicode friendly but not nice to binary data.  When
  dealing with TCP streams or the file system,
  ...

### list()/l()

Document/Sectionに含まれるSectionの表示します。

  > apidoc.node.m[2].list();
  ## Buffers
    0: new Buffer(size)
    1: new Buffer(array)
    2: new Buffer(str, encoding='utf8')
    3: buffer.write(string, offset=0, encoding='utf8')
    4: buffer.toString(encoding, start=0, end=buffer.length)
    5: buffer[index]
    6: Buffer.byteLength(string, encoding='utf8')
    7: buffer.length
    8: buffer.copy(targetBuffer, targetStart, sourceStart, sourceEnd=buffer.length)
    9: buffer.slice(start, end=buffer.length)
  { title: 'Buffers' }

### find(pattern, quiet)/l(pattern, quiet)

再帰的にpatternに一致するタイトルを検索します。
quietにtrueを指定すると出力を行わずにMemberオブジェクトを返します。

  > apidoc.node.m[2].find('Buffer');
    0: Buffers
    1: new Buffer(size)
    2: new Buffer(array)
    3: new Buffer(str, encoding='utf8')
    4: Buffer.byteLength(string, encoding='utf8')
    5: buffer.copy(targetBuffer, targetStart, sourceStart, sourceEnd=buffer.length)

  { title: 'search result for Buffer' }

### grep(pattern)/l(pattern)

再帰的にpatternに一致するタイトル/内容を検索します。
quietにtrueを指定すると出力を行わずにMemberオブジェクトを返します。

  > apidoc.node.m[2].grep('Buffer');
    ## Buffers
    Buffers:6:Raw data is stored in instances of the `Buffer` class. A `Buffer` is similar
    Buffers:8:the V8 heap. A `Buffer` cannot be resized.
    Buffers:10:The `Buffer` object is global.
    Buffers:12:Converting between Buffers and JavaScript string objects requires an explicit encoding
    Buffers:24:should be avoided in favor of `Buffer` objects where possible. This encoding

  { title: 'grep result for Buffer\n' }

### Memberオブジェクト

show()/list()/find()/grep()は全てMemberオブジェクトを返すので、以下のようにチェーンして呼び出すことができます。jk


  > apidoc.node.find('sys',true).members[1].show();
  ### sys.print(string)

  Like `console.log()` but without the trailing newline.

      require('sys').print('String with no newline');


  { title: 'sys.print(string)' }
