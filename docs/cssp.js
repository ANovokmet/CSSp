(function(factory) {
  typeof define === "function" && define.amd ? define(factory) : factory();
})((function() {
  "use strict";
  function _mergeNamespaces(n, m) {
    for (var i = 0; i < m.length; i++) {
      const e = m[i];
      if (typeof e !== "string" && !Array.isArray(e)) {
        for (const k in e) {
          if (k !== "default" && !(k in n)) {
            const d = Object.getOwnPropertyDescriptor(e, k);
            if (d) {
              Object.defineProperty(n, k, d.get ? d : {
                enumerable: true,
                get: () => e[k]
              });
            }
          }
        }
      }
    }
    return Object.freeze(Object.defineProperty(n, Symbol.toStringTag, { value: "Module" }));
  }
  function getDefaultExportFromCjs(x) {
    return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, "default") ? x["default"] : x;
  }
  var create$4 = {};
  var List_1;
  var hasRequiredList;
  function requireList() {
    if (hasRequiredList) return List_1;
    hasRequiredList = 1;
    function createItem(data) {
      return {
        prev: null,
        next: null,
        data
      };
    }
    function allocateCursor(node2, prev, next) {
      var cursor;
      if (cursors !== null) {
        cursor = cursors;
        cursors = cursors.cursor;
        cursor.prev = prev;
        cursor.next = next;
        cursor.cursor = node2.cursor;
      } else {
        cursor = {
          prev,
          next,
          cursor: node2.cursor
        };
      }
      node2.cursor = cursor;
      return cursor;
    }
    function releaseCursor(node2) {
      var cursor = node2.cursor;
      node2.cursor = cursor.cursor;
      cursor.prev = null;
      cursor.next = null;
      cursor.cursor = cursors;
      cursors = cursor;
    }
    var cursors = null;
    var List = function() {
      this.cursor = null;
      this.head = null;
      this.tail = null;
    };
    List.createItem = createItem;
    List.prototype.createItem = createItem;
    List.prototype.updateCursors = function(prevOld, prevNew, nextOld, nextNew) {
      var cursor = this.cursor;
      while (cursor !== null) {
        if (cursor.prev === prevOld) {
          cursor.prev = prevNew;
        }
        if (cursor.next === nextOld) {
          cursor.next = nextNew;
        }
        cursor = cursor.cursor;
      }
    };
    List.prototype.getSize = function() {
      var size = 0;
      var cursor = this.head;
      while (cursor) {
        size++;
        cursor = cursor.next;
      }
      return size;
    };
    List.prototype.fromArray = function(array) {
      var cursor = null;
      this.head = null;
      for (var i = 0; i < array.length; i++) {
        var item = createItem(array[i]);
        if (cursor !== null) {
          cursor.next = item;
        } else {
          this.head = item;
        }
        item.prev = cursor;
        cursor = item;
      }
      this.tail = cursor;
      return this;
    };
    List.prototype.toArray = function() {
      var cursor = this.head;
      var result2 = [];
      while (cursor) {
        result2.push(cursor.data);
        cursor = cursor.next;
      }
      return result2;
    };
    List.prototype.toJSON = List.prototype.toArray;
    List.prototype.isEmpty = function() {
      return this.head === null;
    };
    List.prototype.first = function() {
      return this.head && this.head.data;
    };
    List.prototype.last = function() {
      return this.tail && this.tail.data;
    };
    List.prototype.each = function(fn, context) {
      var item;
      if (context === void 0) {
        context = this;
      }
      var cursor = allocateCursor(this, null, this.head);
      while (cursor.next !== null) {
        item = cursor.next;
        cursor.next = item.next;
        fn.call(context, item.data, item, this);
      }
      releaseCursor(this);
    };
    List.prototype.forEach = List.prototype.each;
    List.prototype.eachRight = function(fn, context) {
      var item;
      if (context === void 0) {
        context = this;
      }
      var cursor = allocateCursor(this, this.tail, null);
      while (cursor.prev !== null) {
        item = cursor.prev;
        cursor.prev = item.prev;
        fn.call(context, item.data, item, this);
      }
      releaseCursor(this);
    };
    List.prototype.forEachRight = List.prototype.eachRight;
    List.prototype.nextUntil = function(start, fn, context) {
      if (start === null) {
        return;
      }
      var item;
      if (context === void 0) {
        context = this;
      }
      var cursor = allocateCursor(this, null, start);
      while (cursor.next !== null) {
        item = cursor.next;
        cursor.next = item.next;
        if (fn.call(context, item.data, item, this)) {
          break;
        }
      }
      releaseCursor(this);
    };
    List.prototype.prevUntil = function(start, fn, context) {
      if (start === null) {
        return;
      }
      var item;
      if (context === void 0) {
        context = this;
      }
      var cursor = allocateCursor(this, start, null);
      while (cursor.prev !== null) {
        item = cursor.prev;
        cursor.prev = item.prev;
        if (fn.call(context, item.data, item, this)) {
          break;
        }
      }
      releaseCursor(this);
    };
    List.prototype.some = function(fn, context) {
      var cursor = this.head;
      if (context === void 0) {
        context = this;
      }
      while (cursor !== null) {
        if (fn.call(context, cursor.data, cursor, this)) {
          return true;
        }
        cursor = cursor.next;
      }
      return false;
    };
    List.prototype.map = function(fn, context) {
      var result2 = new List();
      var cursor = this.head;
      if (context === void 0) {
        context = this;
      }
      while (cursor !== null) {
        result2.appendData(fn.call(context, cursor.data, cursor, this));
        cursor = cursor.next;
      }
      return result2;
    };
    List.prototype.filter = function(fn, context) {
      var result2 = new List();
      var cursor = this.head;
      if (context === void 0) {
        context = this;
      }
      while (cursor !== null) {
        if (fn.call(context, cursor.data, cursor, this)) {
          result2.appendData(cursor.data);
        }
        cursor = cursor.next;
      }
      return result2;
    };
    List.prototype.clear = function() {
      this.head = null;
      this.tail = null;
    };
    List.prototype.copy = function() {
      var result2 = new List();
      var cursor = this.head;
      while (cursor !== null) {
        result2.insert(createItem(cursor.data));
        cursor = cursor.next;
      }
      return result2;
    };
    List.prototype.prepend = function(item) {
      this.updateCursors(null, item, this.head, item);
      if (this.head !== null) {
        this.head.prev = item;
        item.next = this.head;
      } else {
        this.tail = item;
      }
      this.head = item;
      return this;
    };
    List.prototype.prependData = function(data) {
      return this.prepend(createItem(data));
    };
    List.prototype.append = function(item) {
      return this.insert(item);
    };
    List.prototype.appendData = function(data) {
      return this.insert(createItem(data));
    };
    List.prototype.insert = function(item, before) {
      if (before !== void 0 && before !== null) {
        this.updateCursors(before.prev, item, before, item);
        if (before.prev === null) {
          if (this.head !== before) {
            throw new Error("before doesn't belong to list");
          }
          this.head = item;
          before.prev = item;
          item.next = before;
          this.updateCursors(null, item);
        } else {
          before.prev.next = item;
          item.prev = before.prev;
          before.prev = item;
          item.next = before;
        }
      } else {
        this.updateCursors(this.tail, item, null, item);
        if (this.tail !== null) {
          this.tail.next = item;
          item.prev = this.tail;
        } else {
          this.head = item;
        }
        this.tail = item;
      }
      return this;
    };
    List.prototype.insertData = function(data, before) {
      return this.insert(createItem(data), before);
    };
    List.prototype.remove = function(item) {
      this.updateCursors(item, item.prev, item, item.next);
      if (item.prev !== null) {
        item.prev.next = item.next;
      } else {
        if (this.head !== item) {
          throw new Error("item doesn't belong to list");
        }
        this.head = item.next;
      }
      if (item.next !== null) {
        item.next.prev = item.prev;
      } else {
        if (this.tail !== item) {
          throw new Error("item doesn't belong to list");
        }
        this.tail = item.prev;
      }
      item.prev = null;
      item.next = null;
      return item;
    };
    List.prototype.push = function(data) {
      this.insert(createItem(data));
    };
    List.prototype.pop = function() {
      if (this.tail !== null) {
        return this.remove(this.tail);
      }
    };
    List.prototype.unshift = function(data) {
      this.prepend(createItem(data));
    };
    List.prototype.shift = function() {
      if (this.head !== null) {
        return this.remove(this.head);
      }
    };
    List.prototype.prependList = function(list) {
      return this.insertList(list, this.head);
    };
    List.prototype.appendList = function(list) {
      return this.insertList(list);
    };
    List.prototype.insertList = function(list, before) {
      if (list.head === null) {
        return this;
      }
      if (before !== void 0 && before !== null) {
        this.updateCursors(before.prev, list.tail, before, list.head);
        if (before.prev !== null) {
          before.prev.next = list.head;
          list.head.prev = before.prev;
        } else {
          this.head = list.head;
        }
        before.prev = list.tail;
        list.tail.next = before;
      } else {
        this.updateCursors(this.tail, list.tail, null, list.head);
        if (this.tail !== null) {
          this.tail.next = list.head;
          list.head.prev = this.tail;
        } else {
          this.head = list.head;
        }
        this.tail = list.tail;
      }
      list.head = null;
      list.tail = null;
      return this;
    };
    List.prototype.replace = function(oldItem, newItemOrList) {
      if ("head" in newItemOrList) {
        this.insertList(newItemOrList, oldItem);
      } else {
        this.insert(newItemOrList, oldItem);
      }
      this.remove(oldItem);
    };
    List_1 = List;
    return List_1;
  }
  var createCustomError;
  var hasRequiredCreateCustomError;
  function requireCreateCustomError() {
    if (hasRequiredCreateCustomError) return createCustomError;
    hasRequiredCreateCustomError = 1;
    createCustomError = function createCustomError2(name, message) {
      var error2 = Object.create(SyntaxError.prototype);
      var errorStack = new Error();
      error2.name = name;
      error2.message = message;
      Object.defineProperty(error2, "stack", {
        get: function() {
          return (errorStack.stack || "").replace(/^(.+\n){1,3}/, name + ": " + message + "\n");
        }
      });
      return error2;
    };
    return createCustomError;
  }
  var _SyntaxError$1;
  var hasRequired_SyntaxError$1;
  function require_SyntaxError$1() {
    if (hasRequired_SyntaxError$1) return _SyntaxError$1;
    hasRequired_SyntaxError$1 = 1;
    var createCustomError2 = requireCreateCustomError();
    var MAX_LINE_LENGTH = 100;
    var OFFSET_CORRECTION = 60;
    var TAB_REPLACEMENT = "    ";
    function sourceFragment(error2, extraLines) {
      function processLines(start, end) {
        return lines.slice(start, end).map(function(line2, idx) {
          var num = String(start + idx + 1);
          while (num.length < maxNumLength) {
            num = " " + num;
          }
          return num + " |" + line2;
        }).join("\n");
      }
      var lines = error2.source.split(/\r\n?|\n|\f/);
      var line = error2.line;
      var column = error2.column;
      var startLine = Math.max(1, line - extraLines) - 1;
      var endLine = Math.min(line + extraLines, lines.length + 1);
      var maxNumLength = Math.max(4, String(endLine).length) + 1;
      var cutLeft = 0;
      column += (TAB_REPLACEMENT.length - 1) * (lines[line - 1].substr(0, column - 1).match(/\t/g) || []).length;
      if (column > MAX_LINE_LENGTH) {
        cutLeft = column - OFFSET_CORRECTION + 3;
        column = OFFSET_CORRECTION - 2;
      }
      for (var i = startLine; i <= endLine; i++) {
        if (i >= 0 && i < lines.length) {
          lines[i] = lines[i].replace(/\t/g, TAB_REPLACEMENT);
          lines[i] = (cutLeft > 0 && lines[i].length > cutLeft ? "…" : "") + lines[i].substr(cutLeft, MAX_LINE_LENGTH - 2) + (lines[i].length > cutLeft + MAX_LINE_LENGTH - 1 ? "…" : "");
        }
      }
      return [
        processLines(startLine, line),
        new Array(column + maxNumLength + 2).join("-") + "^",
        processLines(line, endLine)
      ].filter(Boolean).join("\n");
    }
    var SyntaxError2 = function(message, source, offset, line, column) {
      var error2 = createCustomError2("SyntaxError", message);
      error2.source = source;
      error2.offset = offset;
      error2.line = line;
      error2.column = column;
      error2.sourceFragment = function(extraLines) {
        return sourceFragment(error2, isNaN(extraLines) ? 0 : extraLines);
      };
      Object.defineProperty(error2, "formattedMessage", {
        get: function() {
          return "Parse error: " + error2.message + "\n" + sourceFragment(error2, 2);
        }
      });
      error2.parseError = {
        offset,
        line,
        column
      };
      return error2;
    };
    _SyntaxError$1 = SyntaxError2;
    return _SyntaxError$1;
  }
  var _const;
  var hasRequired_const;
  function require_const() {
    if (hasRequired_const) return _const;
    hasRequired_const = 1;
    var TYPE = {
      EOF: 0,
      // <EOF-token>
      Ident: 1,
      // <ident-token>
      Function: 2,
      // <function-token>
      AtKeyword: 3,
      // <at-keyword-token>
      Hash: 4,
      // <hash-token>
      String: 5,
      // <string-token>
      BadString: 6,
      // <bad-string-token>
      Url: 7,
      // <url-token>
      BadUrl: 8,
      // <bad-url-token>
      Delim: 9,
      // <delim-token>
      Number: 10,
      // <number-token>
      Percentage: 11,
      // <percentage-token>
      Dimension: 12,
      // <dimension-token>
      WhiteSpace: 13,
      // <whitespace-token>
      CDO: 14,
      // <CDO-token>
      CDC: 15,
      // <CDC-token>
      Colon: 16,
      // <colon-token>     :
      Semicolon: 17,
      // <semicolon-token> ;
      Comma: 18,
      // <comma-token>     ,
      LeftSquareBracket: 19,
      // <[-token>
      RightSquareBracket: 20,
      // <]-token>
      LeftParenthesis: 21,
      // <(-token>
      RightParenthesis: 22,
      // <)-token>
      LeftCurlyBracket: 23,
      // <{-token>
      RightCurlyBracket: 24,
      // <}-token>
      Comment: 25
    };
    var NAME = Object.keys(TYPE).reduce(function(result2, key) {
      result2[TYPE[key]] = key;
      return result2;
    }, {});
    _const = {
      TYPE,
      NAME
    };
    return _const;
  }
  var charCodeDefinitions;
  var hasRequiredCharCodeDefinitions;
  function requireCharCodeDefinitions() {
    if (hasRequiredCharCodeDefinitions) return charCodeDefinitions;
    hasRequiredCharCodeDefinitions = 1;
    var EOF = 0;
    function isDigit(code) {
      return code >= 48 && code <= 57;
    }
    function isHexDigit(code) {
      return isDigit(code) || // 0 .. 9
      code >= 65 && code <= 70 || // A .. F
      code >= 97 && code <= 102;
    }
    function isUppercaseLetter(code) {
      return code >= 65 && code <= 90;
    }
    function isLowercaseLetter(code) {
      return code >= 97 && code <= 122;
    }
    function isLetter(code) {
      return isUppercaseLetter(code) || isLowercaseLetter(code);
    }
    function isNonAscii(code) {
      return code >= 128;
    }
    function isNameStart(code) {
      return isLetter(code) || isNonAscii(code) || code === 95;
    }
    function isName(code) {
      return isNameStart(code) || isDigit(code) || code === 45;
    }
    function isNonPrintable(code) {
      return code >= 0 && code <= 8 || code === 11 || code >= 14 && code <= 31 || code === 127;
    }
    function isNewline(code) {
      return code === 10 || code === 13 || code === 12;
    }
    function isWhiteSpace(code) {
      return isNewline(code) || code === 32 || code === 9;
    }
    function isValidEscape(first, second) {
      if (first !== 92) {
        return false;
      }
      if (isNewline(second) || second === EOF) {
        return false;
      }
      return true;
    }
    function isIdentifierStart(first, second, third) {
      if (first === 45) {
        return isNameStart(second) || second === 45 || isValidEscape(second, third);
      }
      if (isNameStart(first)) {
        return true;
      }
      if (first === 92) {
        return isValidEscape(first, second);
      }
      return false;
    }
    function isNumberStart(first, second, third) {
      if (first === 43 || first === 45) {
        if (isDigit(second)) {
          return 2;
        }
        return second === 46 && isDigit(third) ? 3 : 0;
      }
      if (first === 46) {
        return isDigit(second) ? 2 : 0;
      }
      if (isDigit(first)) {
        return 1;
      }
      return 0;
    }
    function isBOM(code) {
      if (code === 65279) {
        return 1;
      }
      if (code === 65534) {
        return 1;
      }
      return 0;
    }
    var CATEGORY = new Array(128);
    charCodeCategory.Eof = 128;
    charCodeCategory.WhiteSpace = 130;
    charCodeCategory.Digit = 131;
    charCodeCategory.NameStart = 132;
    charCodeCategory.NonPrintable = 133;
    for (var i = 0; i < CATEGORY.length; i++) {
      switch (true) {
        case isWhiteSpace(i):
          CATEGORY[i] = charCodeCategory.WhiteSpace;
          break;
        case isDigit(i):
          CATEGORY[i] = charCodeCategory.Digit;
          break;
        case isNameStart(i):
          CATEGORY[i] = charCodeCategory.NameStart;
          break;
        case isNonPrintable(i):
          CATEGORY[i] = charCodeCategory.NonPrintable;
          break;
        default:
          CATEGORY[i] = i || charCodeCategory.Eof;
      }
    }
    function charCodeCategory(code) {
      return code < 128 ? CATEGORY[code] : charCodeCategory.NameStart;
    }
    charCodeDefinitions = {
      isDigit,
      isHexDigit,
      isUppercaseLetter,
      isLowercaseLetter,
      isLetter,
      isNonAscii,
      isNameStart,
      isName,
      isNonPrintable,
      isNewline,
      isWhiteSpace,
      isValidEscape,
      isIdentifierStart,
      isNumberStart,
      isBOM,
      charCodeCategory
    };
    return charCodeDefinitions;
  }
  var utils;
  var hasRequiredUtils;
  function requireUtils() {
    if (hasRequiredUtils) return utils;
    hasRequiredUtils = 1;
    var charCodeDef = requireCharCodeDefinitions();
    var isDigit = charCodeDef.isDigit;
    var isHexDigit = charCodeDef.isHexDigit;
    var isUppercaseLetter = charCodeDef.isUppercaseLetter;
    var isName = charCodeDef.isName;
    var isWhiteSpace = charCodeDef.isWhiteSpace;
    var isValidEscape = charCodeDef.isValidEscape;
    function getCharCode(source, offset) {
      return offset < source.length ? source.charCodeAt(offset) : 0;
    }
    function getNewlineLength(source, offset, code) {
      if (code === 13 && getCharCode(source, offset + 1) === 10) {
        return 2;
      }
      return 1;
    }
    function cmpChar(testStr, offset, referenceCode) {
      var code = testStr.charCodeAt(offset);
      if (isUppercaseLetter(code)) {
        code = code | 32;
      }
      return code === referenceCode;
    }
    function cmpStr(testStr, start, end, referenceStr) {
      if (end - start !== referenceStr.length) {
        return false;
      }
      if (start < 0 || end > testStr.length) {
        return false;
      }
      for (var i = start; i < end; i++) {
        var testCode = testStr.charCodeAt(i);
        var referenceCode = referenceStr.charCodeAt(i - start);
        if (isUppercaseLetter(testCode)) {
          testCode = testCode | 32;
        }
        if (testCode !== referenceCode) {
          return false;
        }
      }
      return true;
    }
    function findWhiteSpaceStart(source, offset) {
      for (; offset >= 0; offset--) {
        if (!isWhiteSpace(source.charCodeAt(offset))) {
          break;
        }
      }
      return offset + 1;
    }
    function findWhiteSpaceEnd(source, offset) {
      for (; offset < source.length; offset++) {
        if (!isWhiteSpace(source.charCodeAt(offset))) {
          break;
        }
      }
      return offset;
    }
    function findDecimalNumberEnd(source, offset) {
      for (; offset < source.length; offset++) {
        if (!isDigit(source.charCodeAt(offset))) {
          break;
        }
      }
      return offset;
    }
    function consumeEscaped(source, offset) {
      offset += 2;
      if (isHexDigit(getCharCode(source, offset - 1))) {
        for (var maxOffset = Math.min(source.length, offset + 5); offset < maxOffset; offset++) {
          if (!isHexDigit(getCharCode(source, offset))) {
            break;
          }
        }
        var code = getCharCode(source, offset);
        if (isWhiteSpace(code)) {
          offset += getNewlineLength(source, offset, code);
        }
      }
      return offset;
    }
    function consumeName(source, offset) {
      for (; offset < source.length; offset++) {
        var code = source.charCodeAt(offset);
        if (isName(code)) {
          continue;
        }
        if (isValidEscape(code, getCharCode(source, offset + 1))) {
          offset = consumeEscaped(source, offset) - 1;
          continue;
        }
        break;
      }
      return offset;
    }
    function consumeNumber(source, offset) {
      var code = source.charCodeAt(offset);
      if (code === 43 || code === 45) {
        code = source.charCodeAt(offset += 1);
      }
      if (isDigit(code)) {
        offset = findDecimalNumberEnd(source, offset + 1);
        code = source.charCodeAt(offset);
      }
      if (code === 46 && isDigit(source.charCodeAt(offset + 1))) {
        code = source.charCodeAt(offset += 2);
        offset = findDecimalNumberEnd(source, offset);
      }
      if (cmpChar(
        source,
        offset,
        101
        /* e */
      )) {
        var sign = 0;
        code = source.charCodeAt(offset + 1);
        if (code === 45 || code === 43) {
          sign = 1;
          code = source.charCodeAt(offset + 2);
        }
        if (isDigit(code)) {
          offset = findDecimalNumberEnd(source, offset + 1 + sign + 1);
        }
      }
      return offset;
    }
    function consumeBadUrlRemnants(source, offset) {
      for (; offset < source.length; offset++) {
        var code = source.charCodeAt(offset);
        if (code === 41) {
          offset++;
          break;
        }
        if (isValidEscape(code, getCharCode(source, offset + 1))) {
          offset = consumeEscaped(source, offset);
        }
      }
      return offset;
    }
    utils = {
      consumeEscaped,
      consumeName,
      consumeNumber,
      consumeBadUrlRemnants,
      cmpChar,
      cmpStr,
      getNewlineLength,
      findWhiteSpaceStart,
      findWhiteSpaceEnd
    };
    return utils;
  }
  var TokenStream_1;
  var hasRequiredTokenStream;
  function requireTokenStream() {
    if (hasRequiredTokenStream) return TokenStream_1;
    hasRequiredTokenStream = 1;
    var constants = require_const();
    var TYPE = constants.TYPE;
    var NAME = constants.NAME;
    var utils2 = requireUtils();
    var cmpStr = utils2.cmpStr;
    var EOF = TYPE.EOF;
    var WHITESPACE = TYPE.WhiteSpace;
    var COMMENT = TYPE.Comment;
    var OFFSET_MASK = 16777215;
    var TYPE_SHIFT = 24;
    var TokenStream = function() {
      this.offsetAndType = null;
      this.balance = null;
      this.reset();
    };
    TokenStream.prototype = {
      reset: function() {
        this.eof = false;
        this.tokenIndex = -1;
        this.tokenType = 0;
        this.tokenStart = this.firstCharOffset;
        this.tokenEnd = this.firstCharOffset;
      },
      lookupType: function(offset) {
        offset += this.tokenIndex;
        if (offset < this.tokenCount) {
          return this.offsetAndType[offset] >> TYPE_SHIFT;
        }
        return EOF;
      },
      lookupOffset: function(offset) {
        offset += this.tokenIndex;
        if (offset < this.tokenCount) {
          return this.offsetAndType[offset - 1] & OFFSET_MASK;
        }
        return this.source.length;
      },
      lookupValue: function(offset, referenceStr) {
        offset += this.tokenIndex;
        if (offset < this.tokenCount) {
          return cmpStr(
            this.source,
            this.offsetAndType[offset - 1] & OFFSET_MASK,
            this.offsetAndType[offset] & OFFSET_MASK,
            referenceStr
          );
        }
        return false;
      },
      getTokenStart: function(tokenIndex) {
        if (tokenIndex === this.tokenIndex) {
          return this.tokenStart;
        }
        if (tokenIndex > 0) {
          return tokenIndex < this.tokenCount ? this.offsetAndType[tokenIndex - 1] & OFFSET_MASK : this.offsetAndType[this.tokenCount] & OFFSET_MASK;
        }
        return this.firstCharOffset;
      },
      // TODO: -> skipUntilBalanced
      getRawLength: function(startToken, mode) {
        var cursor = startToken;
        var balanceEnd;
        var offset = this.offsetAndType[Math.max(cursor - 1, 0)] & OFFSET_MASK;
        var type;
        loop:
          for (; cursor < this.tokenCount; cursor++) {
            balanceEnd = this.balance[cursor];
            if (balanceEnd < startToken) {
              break loop;
            }
            type = this.offsetAndType[cursor] >> TYPE_SHIFT;
            switch (mode(type, this.source, offset)) {
              case 1:
                break loop;
              case 2:
                cursor++;
                break loop;
              default:
                offset = this.offsetAndType[cursor] & OFFSET_MASK;
                if (this.balance[balanceEnd] === cursor) {
                  cursor = balanceEnd;
                }
            }
          }
        return cursor - this.tokenIndex;
      },
      isBalanceEdge: function(pos) {
        return this.balance[this.tokenIndex] < pos;
      },
      isDelim: function(code, offset) {
        if (offset) {
          return this.lookupType(offset) === TYPE.Delim && this.source.charCodeAt(this.lookupOffset(offset)) === code;
        }
        return this.tokenType === TYPE.Delim && this.source.charCodeAt(this.tokenStart) === code;
      },
      getTokenValue: function() {
        return this.source.substring(this.tokenStart, this.tokenEnd);
      },
      getTokenLength: function() {
        return this.tokenEnd - this.tokenStart;
      },
      substrToCursor: function(start) {
        return this.source.substring(start, this.tokenStart);
      },
      skipWS: function() {
        for (var i = this.tokenIndex, skipTokenCount = 0; i < this.tokenCount; i++, skipTokenCount++) {
          if (this.offsetAndType[i] >> TYPE_SHIFT !== WHITESPACE) {
            break;
          }
        }
        if (skipTokenCount > 0) {
          this.skip(skipTokenCount);
        }
      },
      skipSC: function() {
        while (this.tokenType === WHITESPACE || this.tokenType === COMMENT) {
          this.next();
        }
      },
      skip: function(tokenCount) {
        var next = this.tokenIndex + tokenCount;
        if (next < this.tokenCount) {
          this.tokenIndex = next;
          this.tokenStart = this.offsetAndType[next - 1] & OFFSET_MASK;
          next = this.offsetAndType[next];
          this.tokenType = next >> TYPE_SHIFT;
          this.tokenEnd = next & OFFSET_MASK;
        } else {
          this.tokenIndex = this.tokenCount;
          this.next();
        }
      },
      next: function() {
        var next = this.tokenIndex + 1;
        if (next < this.tokenCount) {
          this.tokenIndex = next;
          this.tokenStart = this.tokenEnd;
          next = this.offsetAndType[next];
          this.tokenType = next >> TYPE_SHIFT;
          this.tokenEnd = next & OFFSET_MASK;
        } else {
          this.tokenIndex = this.tokenCount;
          this.eof = true;
          this.tokenType = EOF;
          this.tokenStart = this.tokenEnd = this.source.length;
        }
      },
      dump: function() {
        var offset = this.firstCharOffset;
        return Array.prototype.slice.call(this.offsetAndType, 0, this.tokenCount).map(function(item, idx) {
          var start = offset;
          var end = item & OFFSET_MASK;
          offset = end;
          return {
            idx,
            type: NAME[item >> TYPE_SHIFT],
            chunk: this.source.substring(start, end),
            balance: this.balance[idx]
          };
        }, this);
      }
    };
    TokenStream_1 = TokenStream;
    return TokenStream_1;
  }
  var generate_1;
  var hasRequiredGenerate;
  function requireGenerate() {
    if (hasRequiredGenerate) return generate_1;
    hasRequiredGenerate = 1;
    function noop(value2) {
      return value2;
    }
    function generateMultiplier(multiplier) {
      if (multiplier.min === 0 && multiplier.max === 0) {
        return "*";
      }
      if (multiplier.min === 0 && multiplier.max === 1) {
        return "?";
      }
      if (multiplier.min === 1 && multiplier.max === 0) {
        return multiplier.comma ? "#" : "+";
      }
      if (multiplier.min === 1 && multiplier.max === 1) {
        return "";
      }
      return (multiplier.comma ? "#" : "") + (multiplier.min === multiplier.max ? "{" + multiplier.min + "}" : "{" + multiplier.min + "," + (multiplier.max !== 0 ? multiplier.max : "") + "}");
    }
    function generateTypeOpts(node2) {
      switch (node2.type) {
        case "Range":
          return " [" + (node2.min === null ? "-∞" : node2.min) + "," + (node2.max === null ? "∞" : node2.max) + "]";
        default:
          throw new Error("Unknown node type `" + node2.type + "`");
      }
    }
    function generateSequence(node2, decorate, forceBraces, compact) {
      var combinator = node2.combinator === " " || compact ? node2.combinator : " " + node2.combinator + " ";
      var result2 = node2.terms.map(function(term) {
        return generate(term, decorate, forceBraces, compact);
      }).join(combinator);
      if (node2.explicit || forceBraces) {
        result2 = (compact || result2[0] === "," ? "[" : "[ ") + result2 + (compact ? "]" : " ]");
      }
      return result2;
    }
    function generate(node2, decorate, forceBraces, compact) {
      var result2;
      switch (node2.type) {
        case "Group":
          result2 = generateSequence(node2, decorate, forceBraces, compact) + (node2.disallowEmpty ? "!" : "");
          break;
        case "Multiplier":
          return generate(node2.term, decorate, forceBraces, compact) + decorate(generateMultiplier(node2), node2);
        case "Type":
          result2 = "<" + node2.name + (node2.opts ? decorate(generateTypeOpts(node2.opts), node2.opts) : "") + ">";
          break;
        case "Property":
          result2 = "<'" + node2.name + "'>";
          break;
        case "Keyword":
          result2 = node2.name;
          break;
        case "AtKeyword":
          result2 = "@" + node2.name;
          break;
        case "Function":
          result2 = node2.name + "(";
          break;
        case "String":
        case "Token":
          result2 = node2.value;
          break;
        case "Comma":
          result2 = ",";
          break;
        default:
          throw new Error("Unknown node type `" + node2.type + "`");
      }
      return decorate(result2, node2);
    }
    generate_1 = function(node2, options) {
      var decorate = noop;
      var forceBraces = false;
      var compact = false;
      if (typeof options === "function") {
        decorate = options;
      } else if (options) {
        forceBraces = Boolean(options.forceBraces);
        compact = Boolean(options.compact);
        if (typeof options.decorate === "function") {
          decorate = options.decorate;
        }
      }
      return generate(node2, decorate, forceBraces, compact);
    };
    return generate_1;
  }
  var error;
  var hasRequiredError;
  function requireError() {
    if (hasRequiredError) return error;
    hasRequiredError = 1;
    var createCustomError2 = requireCreateCustomError();
    var generate = requireGenerate();
    function fromMatchResult(matchResult) {
      var tokens = matchResult.tokens;
      var longestMatch = matchResult.longestMatch;
      var node2 = longestMatch < tokens.length ? tokens[longestMatch].node : null;
      var mismatchOffset = -1;
      var entries = 0;
      var css = "";
      for (var i = 0; i < tokens.length; i++) {
        if (i === longestMatch) {
          mismatchOffset = css.length;
        }
        if (node2 !== null && tokens[i].node === node2) {
          if (i <= longestMatch) {
            entries++;
          } else {
            entries = 0;
          }
        }
        css += tokens[i].value;
      }
      return {
        node: node2,
        css,
        mismatchOffset: mismatchOffset === -1 ? css.length : mismatchOffset,
        last: node2 === null || entries > 1
      };
    }
    function getLocation(node2, point) {
      var loc = node2 && node2.loc && node2.loc[point];
      if (loc) {
        return {
          offset: loc.offset,
          line: loc.line,
          column: loc.column
        };
      }
      return null;
    }
    var SyntaxReferenceError = function(type, referenceName) {
      var error2 = createCustomError2(
        "SyntaxReferenceError",
        type + (referenceName ? " `" + referenceName + "`" : "")
      );
      error2.reference = referenceName;
      return error2;
    };
    var MatchError = function(message, syntax2, node2, matchResult) {
      var error2 = createCustomError2("SyntaxMatchError", message);
      var details = fromMatchResult(matchResult);
      var mismatchOffset = details.mismatchOffset || 0;
      var badNode = details.node || node2;
      var end = getLocation(badNode, "end");
      var start = details.last ? end : getLocation(badNode, "start");
      var css = details.css;
      error2.rawMessage = message;
      error2.syntax = syntax2 ? generate(syntax2) : "<generic>";
      error2.css = css;
      error2.mismatchOffset = mismatchOffset;
      error2.loc = {
        source: badNode && badNode.loc && badNode.loc.source || "<unknown>",
        start,
        end
      };
      error2.line = start ? start.line : void 0;
      error2.column = start ? start.column : void 0;
      error2.offset = start ? start.offset : void 0;
      error2.message = message + "\n  syntax: " + error2.syntax + "\n   value: " + (error2.css || "<empty string>") + "\n  --------" + new Array(error2.mismatchOffset + 1).join("-") + "^";
      return error2;
    };
    error = {
      SyntaxReferenceError,
      MatchError
    };
    return error;
  }
  var names;
  var hasRequiredNames;
  function requireNames() {
    if (hasRequiredNames) return names;
    hasRequiredNames = 1;
    var hasOwnProperty = Object.prototype.hasOwnProperty;
    var keywords = /* @__PURE__ */ Object.create(null);
    var properties2 = /* @__PURE__ */ Object.create(null);
    var HYPHENMINUS = 45;
    function isCustomProperty(str, offset) {
      offset = offset || 0;
      return str.length - offset >= 2 && str.charCodeAt(offset) === HYPHENMINUS && str.charCodeAt(offset + 1) === HYPHENMINUS;
    }
    function getVendorPrefix(str, offset) {
      offset = offset || 0;
      if (str.length - offset >= 3) {
        if (str.charCodeAt(offset) === HYPHENMINUS && str.charCodeAt(offset + 1) !== HYPHENMINUS) {
          var secondDashIndex = str.indexOf("-", offset + 2);
          if (secondDashIndex !== -1) {
            return str.substring(offset, secondDashIndex + 1);
          }
        }
      }
      return "";
    }
    function getKeywordDescriptor(keyword) {
      if (hasOwnProperty.call(keywords, keyword)) {
        return keywords[keyword];
      }
      var name = keyword.toLowerCase();
      if (hasOwnProperty.call(keywords, name)) {
        return keywords[keyword] = keywords[name];
      }
      var custom = isCustomProperty(name, 0);
      var vendor = !custom ? getVendorPrefix(name, 0) : "";
      return keywords[keyword] = Object.freeze({
        basename: name.substr(vendor.length),
        name,
        vendor,
        prefix: vendor,
        custom
      });
    }
    function getPropertyDescriptor(property) {
      if (hasOwnProperty.call(properties2, property)) {
        return properties2[property];
      }
      var name = property;
      var hack = property[0];
      if (hack === "/") {
        hack = property[1] === "/" ? "//" : "/";
      } else if (hack !== "_" && hack !== "*" && hack !== "$" && hack !== "#" && hack !== "+" && hack !== "&") {
        hack = "";
      }
      var custom = isCustomProperty(name, hack.length);
      if (!custom) {
        name = name.toLowerCase();
        if (hasOwnProperty.call(properties2, name)) {
          return properties2[property] = properties2[name];
        }
      }
      var vendor = !custom ? getVendorPrefix(name, hack.length) : "";
      var prefix = name.substr(0, hack.length + vendor.length);
      return properties2[property] = Object.freeze({
        basename: name.substr(prefix.length),
        name: name.substr(hack.length),
        hack,
        vendor,
        prefix,
        custom
      });
    }
    names = {
      keyword: getKeywordDescriptor,
      property: getPropertyDescriptor,
      isCustomProperty,
      vendorPrefix: getVendorPrefix
    };
    return names;
  }
  var adoptBuffer;
  var hasRequiredAdoptBuffer;
  function requireAdoptBuffer() {
    if (hasRequiredAdoptBuffer) return adoptBuffer;
    hasRequiredAdoptBuffer = 1;
    var MIN_SIZE = 16 * 1024;
    var SafeUint32Array = typeof Uint32Array !== "undefined" ? Uint32Array : Array;
    adoptBuffer = function adoptBuffer2(buffer, size) {
      if (buffer === null || buffer.length < size) {
        return new SafeUint32Array(Math.max(size + 1024, MIN_SIZE));
      }
      return buffer;
    };
    return adoptBuffer;
  }
  var tokenizer$1;
  var hasRequiredTokenizer$1;
  function requireTokenizer$1() {
    if (hasRequiredTokenizer$1) return tokenizer$1;
    hasRequiredTokenizer$1 = 1;
    var TokenStream = requireTokenStream();
    var adoptBuffer2 = requireAdoptBuffer();
    var constants = require_const();
    var TYPE = constants.TYPE;
    var charCodeDefinitions2 = requireCharCodeDefinitions();
    var isNewline = charCodeDefinitions2.isNewline;
    var isName = charCodeDefinitions2.isName;
    var isValidEscape = charCodeDefinitions2.isValidEscape;
    var isNumberStart = charCodeDefinitions2.isNumberStart;
    var isIdentifierStart = charCodeDefinitions2.isIdentifierStart;
    var charCodeCategory = charCodeDefinitions2.charCodeCategory;
    var isBOM = charCodeDefinitions2.isBOM;
    var utils2 = requireUtils();
    var cmpStr = utils2.cmpStr;
    var getNewlineLength = utils2.getNewlineLength;
    var findWhiteSpaceEnd = utils2.findWhiteSpaceEnd;
    var consumeEscaped = utils2.consumeEscaped;
    var consumeName = utils2.consumeName;
    var consumeNumber = utils2.consumeNumber;
    var consumeBadUrlRemnants = utils2.consumeBadUrlRemnants;
    var OFFSET_MASK = 16777215;
    var TYPE_SHIFT = 24;
    function tokenize(source, stream) {
      function getCharCode(offset2) {
        return offset2 < sourceLength ? source.charCodeAt(offset2) : 0;
      }
      function consumeNumericToken() {
        offset = consumeNumber(source, offset);
        if (isIdentifierStart(getCharCode(offset), getCharCode(offset + 1), getCharCode(offset + 2))) {
          type = TYPE.Dimension;
          offset = consumeName(source, offset);
          return;
        }
        if (getCharCode(offset) === 37) {
          type = TYPE.Percentage;
          offset++;
          return;
        }
        type = TYPE.Number;
      }
      function consumeIdentLikeToken() {
        const nameStartOffset = offset;
        offset = consumeName(source, offset);
        if (cmpStr(source, nameStartOffset, offset, "url") && getCharCode(offset) === 40) {
          offset = findWhiteSpaceEnd(source, offset + 1);
          if (getCharCode(offset) === 34 || getCharCode(offset) === 39) {
            type = TYPE.Function;
            offset = nameStartOffset + 4;
            return;
          }
          consumeUrlToken();
          return;
        }
        if (getCharCode(offset) === 40) {
          type = TYPE.Function;
          offset++;
          return;
        }
        type = TYPE.Ident;
      }
      function consumeStringToken(endingCodePoint) {
        if (!endingCodePoint) {
          endingCodePoint = getCharCode(offset++);
        }
        type = TYPE.String;
        for (; offset < source.length; offset++) {
          var code2 = source.charCodeAt(offset);
          switch (charCodeCategory(code2)) {
            // ending code point
            case endingCodePoint:
              offset++;
              return;
            // EOF
            case charCodeCategory.Eof:
              return;
            // newline
            case charCodeCategory.WhiteSpace:
              if (isNewline(code2)) {
                offset += getNewlineLength(source, offset, code2);
                type = TYPE.BadString;
                return;
              }
              break;
            // U+005C REVERSE SOLIDUS (\)
            case 92:
              if (offset === source.length - 1) {
                break;
              }
              var nextCode = getCharCode(offset + 1);
              if (isNewline(nextCode)) {
                offset += getNewlineLength(source, offset + 1, nextCode);
              } else if (isValidEscape(code2, nextCode)) {
                offset = consumeEscaped(source, offset) - 1;
              }
              break;
          }
        }
      }
      function consumeUrlToken() {
        type = TYPE.Url;
        offset = findWhiteSpaceEnd(source, offset);
        for (; offset < source.length; offset++) {
          var code2 = source.charCodeAt(offset);
          switch (charCodeCategory(code2)) {
            // U+0029 RIGHT PARENTHESIS ())
            case 41:
              offset++;
              return;
            // EOF
            case charCodeCategory.Eof:
              return;
            // whitespace
            case charCodeCategory.WhiteSpace:
              offset = findWhiteSpaceEnd(source, offset);
              if (getCharCode(offset) === 41 || offset >= source.length) {
                if (offset < source.length) {
                  offset++;
                }
                return;
              }
              offset = consumeBadUrlRemnants(source, offset);
              type = TYPE.BadUrl;
              return;
            // U+0022 QUOTATION MARK (")
            // U+0027 APOSTROPHE (')
            // U+0028 LEFT PARENTHESIS (()
            // non-printable code point
            case 34:
            case 39:
            case 40:
            case charCodeCategory.NonPrintable:
              offset = consumeBadUrlRemnants(source, offset);
              type = TYPE.BadUrl;
              return;
            // U+005C REVERSE SOLIDUS (\)
            case 92:
              if (isValidEscape(code2, getCharCode(offset + 1))) {
                offset = consumeEscaped(source, offset) - 1;
                break;
              }
              offset = consumeBadUrlRemnants(source, offset);
              type = TYPE.BadUrl;
              return;
          }
        }
      }
      if (!stream) {
        stream = new TokenStream();
      }
      source = String(source || "");
      var sourceLength = source.length;
      var offsetAndType = adoptBuffer2(stream.offsetAndType, sourceLength + 1);
      var balance = adoptBuffer2(stream.balance, sourceLength + 1);
      var tokenCount = 0;
      var start = isBOM(getCharCode(0));
      var offset = start;
      var balanceCloseType = 0;
      var balanceStart = 0;
      var balancePrev = 0;
      while (offset < sourceLength) {
        var code = source.charCodeAt(offset);
        var type = 0;
        balance[tokenCount] = sourceLength;
        switch (charCodeCategory(code)) {
          // whitespace
          case charCodeCategory.WhiteSpace:
            type = TYPE.WhiteSpace;
            offset = findWhiteSpaceEnd(source, offset + 1);
            break;
          // U+0022 QUOTATION MARK (")
          case 34:
            consumeStringToken();
            break;
          // U+0023 NUMBER SIGN (#)
          case 35:
            if (isName(getCharCode(offset + 1)) || isValidEscape(getCharCode(offset + 1), getCharCode(offset + 2))) {
              type = TYPE.Hash;
              offset = consumeName(source, offset + 1);
            } else {
              type = TYPE.Delim;
              offset++;
            }
            break;
          // U+0027 APOSTROPHE (')
          case 39:
            consumeStringToken();
            break;
          // U+0028 LEFT PARENTHESIS (()
          case 40:
            type = TYPE.LeftParenthesis;
            offset++;
            break;
          // U+0029 RIGHT PARENTHESIS ())
          case 41:
            type = TYPE.RightParenthesis;
            offset++;
            break;
          // U+002B PLUS SIGN (+)
          case 43:
            if (isNumberStart(code, getCharCode(offset + 1), getCharCode(offset + 2))) {
              consumeNumericToken();
            } else {
              type = TYPE.Delim;
              offset++;
            }
            break;
          // U+002C COMMA (,)
          case 44:
            type = TYPE.Comma;
            offset++;
            break;
          // U+002D HYPHEN-MINUS (-)
          case 45:
            if (isNumberStart(code, getCharCode(offset + 1), getCharCode(offset + 2))) {
              consumeNumericToken();
            } else {
              if (getCharCode(offset + 1) === 45 && getCharCode(offset + 2) === 62) {
                type = TYPE.CDC;
                offset = offset + 3;
              } else {
                if (isIdentifierStart(code, getCharCode(offset + 1), getCharCode(offset + 2))) {
                  consumeIdentLikeToken();
                } else {
                  type = TYPE.Delim;
                  offset++;
                }
              }
            }
            break;
          // U+002E FULL STOP (.)
          case 46:
            if (isNumberStart(code, getCharCode(offset + 1), getCharCode(offset + 2))) {
              consumeNumericToken();
            } else {
              type = TYPE.Delim;
              offset++;
            }
            break;
          // U+002F SOLIDUS (/)
          case 47:
            if (getCharCode(offset + 1) === 42) {
              type = TYPE.Comment;
              offset = source.indexOf("*/", offset + 2) + 2;
              if (offset === 1) {
                offset = source.length;
              }
            } else {
              type = TYPE.Delim;
              offset++;
            }
            break;
          // U+003A COLON (:)
          case 58:
            type = TYPE.Colon;
            offset++;
            break;
          // U+003B SEMICOLON (;)
          case 59:
            type = TYPE.Semicolon;
            offset++;
            break;
          // U+003C LESS-THAN SIGN (<)
          case 60:
            if (getCharCode(offset + 1) === 33 && getCharCode(offset + 2) === 45 && getCharCode(offset + 3) === 45) {
              type = TYPE.CDO;
              offset = offset + 4;
            } else {
              type = TYPE.Delim;
              offset++;
            }
            break;
          // U+0040 COMMERCIAL AT (@)
          case 64:
            if (isIdentifierStart(getCharCode(offset + 1), getCharCode(offset + 2), getCharCode(offset + 3))) {
              type = TYPE.AtKeyword;
              offset = consumeName(source, offset + 1);
            } else {
              type = TYPE.Delim;
              offset++;
            }
            break;
          // U+005B LEFT SQUARE BRACKET ([)
          case 91:
            type = TYPE.LeftSquareBracket;
            offset++;
            break;
          // U+005C REVERSE SOLIDUS (\)
          case 92:
            if (isValidEscape(code, getCharCode(offset + 1))) {
              consumeIdentLikeToken();
            } else {
              type = TYPE.Delim;
              offset++;
            }
            break;
          // U+005D RIGHT SQUARE BRACKET (])
          case 93:
            type = TYPE.RightSquareBracket;
            offset++;
            break;
          // U+007B LEFT CURLY BRACKET ({)
          case 123:
            type = TYPE.LeftCurlyBracket;
            offset++;
            break;
          // U+007D RIGHT CURLY BRACKET (})
          case 125:
            type = TYPE.RightCurlyBracket;
            offset++;
            break;
          // digit
          case charCodeCategory.Digit:
            consumeNumericToken();
            break;
          // name-start code point
          case charCodeCategory.NameStart:
            consumeIdentLikeToken();
            break;
          // EOF
          case charCodeCategory.Eof:
            break;
          // anything else
          default:
            type = TYPE.Delim;
            offset++;
        }
        switch (type) {
          case balanceCloseType:
            balancePrev = balanceStart & OFFSET_MASK;
            balanceStart = balance[balancePrev];
            balanceCloseType = balanceStart >> TYPE_SHIFT;
            balance[tokenCount] = balancePrev;
            balance[balancePrev++] = tokenCount;
            for (; balancePrev < tokenCount; balancePrev++) {
              if (balance[balancePrev] === sourceLength) {
                balance[balancePrev] = tokenCount;
              }
            }
            break;
          case TYPE.LeftParenthesis:
          case TYPE.Function:
            balance[tokenCount] = balanceStart;
            balanceCloseType = TYPE.RightParenthesis;
            balanceStart = balanceCloseType << TYPE_SHIFT | tokenCount;
            break;
          case TYPE.LeftSquareBracket:
            balance[tokenCount] = balanceStart;
            balanceCloseType = TYPE.RightSquareBracket;
            balanceStart = balanceCloseType << TYPE_SHIFT | tokenCount;
            break;
          case TYPE.LeftCurlyBracket:
            balance[tokenCount] = balanceStart;
            balanceCloseType = TYPE.RightCurlyBracket;
            balanceStart = balanceCloseType << TYPE_SHIFT | tokenCount;
            break;
        }
        offsetAndType[tokenCount++] = type << TYPE_SHIFT | offset;
      }
      offsetAndType[tokenCount] = TYPE.EOF << TYPE_SHIFT | offset;
      balance[tokenCount] = sourceLength;
      balance[sourceLength] = sourceLength;
      while (balanceStart !== 0) {
        balancePrev = balanceStart & OFFSET_MASK;
        balanceStart = balance[balancePrev];
        balance[balancePrev] = sourceLength;
      }
      stream.source = source;
      stream.firstCharOffset = start;
      stream.offsetAndType = offsetAndType;
      stream.tokenCount = tokenCount;
      stream.balance = balance;
      stream.reset();
      stream.next();
      return stream;
    }
    Object.keys(constants).forEach(function(key) {
      tokenize[key] = constants[key];
    });
    Object.keys(charCodeDefinitions2).forEach(function(key) {
      tokenize[key] = charCodeDefinitions2[key];
    });
    Object.keys(utils2).forEach(function(key) {
      tokenize[key] = utils2[key];
    });
    tokenizer$1 = tokenize;
    return tokenizer$1;
  }
  var genericAnPlusB;
  var hasRequiredGenericAnPlusB;
  function requireGenericAnPlusB() {
    if (hasRequiredGenericAnPlusB) return genericAnPlusB;
    hasRequiredGenericAnPlusB = 1;
    var isDigit = requireTokenizer$1().isDigit;
    var cmpChar = requireTokenizer$1().cmpChar;
    var TYPE = requireTokenizer$1().TYPE;
    var DELIM = TYPE.Delim;
    var WHITESPACE = TYPE.WhiteSpace;
    var COMMENT = TYPE.Comment;
    var IDENT = TYPE.Ident;
    var NUMBER = TYPE.Number;
    var DIMENSION = TYPE.Dimension;
    var PLUSSIGN = 43;
    var HYPHENMINUS = 45;
    var N = 110;
    var DISALLOW_SIGN = true;
    var ALLOW_SIGN = false;
    function isDelim(token, code) {
      return token !== null && token.type === DELIM && token.value.charCodeAt(0) === code;
    }
    function skipSC(token, offset, getNextToken) {
      while (token !== null && (token.type === WHITESPACE || token.type === COMMENT)) {
        token = getNextToken(++offset);
      }
      return offset;
    }
    function checkInteger(token, valueOffset, disallowSign, offset) {
      if (!token) {
        return 0;
      }
      var code = token.value.charCodeAt(valueOffset);
      if (code === PLUSSIGN || code === HYPHENMINUS) {
        if (disallowSign) {
          return 0;
        }
        valueOffset++;
      }
      for (; valueOffset < token.value.length; valueOffset++) {
        if (!isDigit(token.value.charCodeAt(valueOffset))) {
          return 0;
        }
      }
      return offset + 1;
    }
    function consumeB(token, offset_, getNextToken) {
      var sign = false;
      var offset = skipSC(token, offset_, getNextToken);
      token = getNextToken(offset);
      if (token === null) {
        return offset_;
      }
      if (token.type !== NUMBER) {
        if (isDelim(token, PLUSSIGN) || isDelim(token, HYPHENMINUS)) {
          sign = true;
          offset = skipSC(getNextToken(++offset), offset, getNextToken);
          token = getNextToken(offset);
          if (token === null && token.type !== NUMBER) {
            return 0;
          }
        } else {
          return offset_;
        }
      }
      if (!sign) {
        var code = token.value.charCodeAt(0);
        if (code !== PLUSSIGN && code !== HYPHENMINUS) {
          return 0;
        }
      }
      return checkInteger(token, sign ? 0 : 1, sign, offset);
    }
    genericAnPlusB = function anPlusB(token, getNextToken) {
      var offset = 0;
      if (!token) {
        return 0;
      }
      if (token.type === NUMBER) {
        return checkInteger(token, 0, ALLOW_SIGN, offset);
      } else if (token.type === IDENT && token.value.charCodeAt(0) === HYPHENMINUS) {
        if (!cmpChar(token.value, 1, N)) {
          return 0;
        }
        switch (token.value.length) {
          // -n
          // -n <signed-integer>
          // -n ['+' | '-'] <signless-integer>
          case 2:
            return consumeB(getNextToken(++offset), offset, getNextToken);
          // -n- <signless-integer>
          case 3:
            if (token.value.charCodeAt(2) !== HYPHENMINUS) {
              return 0;
            }
            offset = skipSC(getNextToken(++offset), offset, getNextToken);
            token = getNextToken(offset);
            return checkInteger(token, 0, DISALLOW_SIGN, offset);
          // <dashndashdigit-ident>
          default:
            if (token.value.charCodeAt(2) !== HYPHENMINUS) {
              return 0;
            }
            return checkInteger(token, 3, DISALLOW_SIGN, offset);
        }
      } else if (token.type === IDENT || isDelim(token, PLUSSIGN) && getNextToken(offset + 1).type === IDENT) {
        if (token.type !== IDENT) {
          token = getNextToken(++offset);
        }
        if (token === null || !cmpChar(token.value, 0, N)) {
          return 0;
        }
        switch (token.value.length) {
          // '+'? n
          // '+'? n <signed-integer>
          // '+'? n ['+' | '-'] <signless-integer>
          case 1:
            return consumeB(getNextToken(++offset), offset, getNextToken);
          // '+'? n- <signless-integer>
          case 2:
            if (token.value.charCodeAt(1) !== HYPHENMINUS) {
              return 0;
            }
            offset = skipSC(getNextToken(++offset), offset, getNextToken);
            token = getNextToken(offset);
            return checkInteger(token, 0, DISALLOW_SIGN, offset);
          // '+'? <ndashdigit-ident>
          default:
            if (token.value.charCodeAt(1) !== HYPHENMINUS) {
              return 0;
            }
            return checkInteger(token, 2, DISALLOW_SIGN, offset);
        }
      } else if (token.type === DIMENSION) {
        var code = token.value.charCodeAt(0);
        var sign = code === PLUSSIGN || code === HYPHENMINUS ? 1 : 0;
        for (var i = sign; i < token.value.length; i++) {
          if (!isDigit(token.value.charCodeAt(i))) {
            break;
          }
        }
        if (i === sign) {
          return 0;
        }
        if (!cmpChar(token.value, i, N)) {
          return 0;
        }
        if (i + 1 === token.value.length) {
          return consumeB(getNextToken(++offset), offset, getNextToken);
        } else {
          if (token.value.charCodeAt(i + 1) !== HYPHENMINUS) {
            return 0;
          }
          if (i + 2 === token.value.length) {
            offset = skipSC(getNextToken(++offset), offset, getNextToken);
            token = getNextToken(offset);
            return checkInteger(token, 0, DISALLOW_SIGN, offset);
          } else {
            return checkInteger(token, i + 2, DISALLOW_SIGN, offset);
          }
        }
      }
      return 0;
    };
    return genericAnPlusB;
  }
  var genericUrange;
  var hasRequiredGenericUrange;
  function requireGenericUrange() {
    if (hasRequiredGenericUrange) return genericUrange;
    hasRequiredGenericUrange = 1;
    var isHexDigit = requireTokenizer$1().isHexDigit;
    var cmpChar = requireTokenizer$1().cmpChar;
    var TYPE = requireTokenizer$1().TYPE;
    var IDENT = TYPE.Ident;
    var DELIM = TYPE.Delim;
    var NUMBER = TYPE.Number;
    var DIMENSION = TYPE.Dimension;
    var PLUSSIGN = 43;
    var HYPHENMINUS = 45;
    var QUESTIONMARK = 63;
    var U = 117;
    function isDelim(token, code) {
      return token !== null && token.type === DELIM && token.value.charCodeAt(0) === code;
    }
    function startsWith(token, code) {
      return token.value.charCodeAt(0) === code;
    }
    function hexSequence(token, offset, allowDash) {
      for (var pos = offset, hexlen = 0; pos < token.value.length; pos++) {
        var code = token.value.charCodeAt(pos);
        if (code === HYPHENMINUS && allowDash && hexlen !== 0) {
          if (hexSequence(token, offset + hexlen + 1, false) > 0) {
            return 6;
          }
          return 0;
        }
        if (!isHexDigit(code)) {
          return 0;
        }
        if (++hexlen > 6) {
          return 0;
        }
      }
      return hexlen;
    }
    function withQuestionMarkSequence(consumed, length, getNextToken) {
      if (!consumed) {
        return 0;
      }
      while (isDelim(getNextToken(length), QUESTIONMARK)) {
        if (++consumed > 6) {
          return 0;
        }
        length++;
      }
      return length;
    }
    genericUrange = function urange(token, getNextToken) {
      var length = 0;
      if (token === null || token.type !== IDENT || !cmpChar(token.value, 0, U)) {
        return 0;
      }
      token = getNextToken(++length);
      if (token === null) {
        return 0;
      }
      if (isDelim(token, PLUSSIGN)) {
        token = getNextToken(++length);
        if (token === null) {
          return 0;
        }
        if (token.type === IDENT) {
          return withQuestionMarkSequence(hexSequence(token, 0, true), ++length, getNextToken);
        }
        if (isDelim(token, QUESTIONMARK)) {
          return withQuestionMarkSequence(1, ++length, getNextToken);
        }
        return 0;
      }
      if (token.type === NUMBER) {
        if (!startsWith(token, PLUSSIGN)) {
          return 0;
        }
        var consumedHexLength = hexSequence(token, 1, true);
        if (consumedHexLength === 0) {
          return 0;
        }
        token = getNextToken(++length);
        if (token === null) {
          return length;
        }
        if (token.type === DIMENSION || token.type === NUMBER) {
          if (!startsWith(token, HYPHENMINUS) || !hexSequence(token, 1, false)) {
            return 0;
          }
          return length + 1;
        }
        return withQuestionMarkSequence(consumedHexLength, length, getNextToken);
      }
      if (token.type === DIMENSION) {
        if (!startsWith(token, PLUSSIGN)) {
          return 0;
        }
        return withQuestionMarkSequence(hexSequence(token, 1, true), ++length, getNextToken);
      }
      return 0;
    };
    return genericUrange;
  }
  var generic;
  var hasRequiredGeneric;
  function requireGeneric() {
    if (hasRequiredGeneric) return generic;
    hasRequiredGeneric = 1;
    var tokenizer2 = requireTokenizer$1();
    var isIdentifierStart = tokenizer2.isIdentifierStart;
    var isHexDigit = tokenizer2.isHexDigit;
    var isDigit = tokenizer2.isDigit;
    var cmpStr = tokenizer2.cmpStr;
    var consumeNumber = tokenizer2.consumeNumber;
    var TYPE = tokenizer2.TYPE;
    var anPlusB = requireGenericAnPlusB();
    var urange = requireGenericUrange();
    var cssWideKeywords = ["unset", "initial", "inherit"];
    var calcFunctionNames = ["calc(", "-moz-calc(", "-webkit-calc("];
    var LENGTH = {
      // absolute length units
      "px": true,
      "mm": true,
      "cm": true,
      "in": true,
      "pt": true,
      "pc": true,
      "q": true,
      // relative length units
      "em": true,
      "ex": true,
      "ch": true,
      "rem": true,
      // viewport-percentage lengths
      "vh": true,
      "vw": true,
      "vmin": true,
      "vmax": true,
      "vm": true
    };
    var ANGLE = {
      "deg": true,
      "grad": true,
      "rad": true,
      "turn": true
    };
    var TIME = {
      "s": true,
      "ms": true
    };
    var FREQUENCY = {
      "hz": true,
      "khz": true
    };
    var RESOLUTION = {
      "dpi": true,
      "dpcm": true,
      "dppx": true,
      "x": true
      // https://github.com/w3c/csswg-drafts/issues/461
    };
    var FLEX = {
      "fr": true
    };
    var DECIBEL = {
      "db": true
    };
    var SEMITONES = {
      "st": true
    };
    function charCode(str, index2) {
      return index2 < str.length ? str.charCodeAt(index2) : 0;
    }
    function eqStr(actual, expected) {
      return cmpStr(actual, 0, actual.length, expected);
    }
    function eqStrAny(actual, expected) {
      for (var i = 0; i < expected.length; i++) {
        if (eqStr(actual, expected[i])) {
          return true;
        }
      }
      return false;
    }
    function isPostfixIeHack(str, offset) {
      if (offset !== str.length - 2) {
        return false;
      }
      return str.charCodeAt(offset) === 92 && // U+005C REVERSE SOLIDUS (\)
      isDigit(str.charCodeAt(offset + 1));
    }
    function outOfRange(opts, value2, numEnd) {
      if (opts && opts.type === "Range") {
        var num = Number(
          numEnd !== void 0 && numEnd !== value2.length ? value2.substr(0, numEnd) : value2
        );
        if (isNaN(num)) {
          return true;
        }
        if (opts.min !== null && num < opts.min) {
          return true;
        }
        if (opts.max !== null && num > opts.max) {
          return true;
        }
      }
      return false;
    }
    function consumeFunction(token, getNextToken) {
      var startIdx = token.index;
      var length = 0;
      do {
        length++;
        if (token.balance <= startIdx) {
          break;
        }
      } while (token = getNextToken(length));
      return length;
    }
    function calc(next) {
      return function(token, getNextToken, opts) {
        if (token === null) {
          return 0;
        }
        if (token.type === TYPE.Function && eqStrAny(token.value, calcFunctionNames)) {
          return consumeFunction(token, getNextToken);
        }
        return next(token, getNextToken, opts);
      };
    }
    function tokenType(expectedTokenType) {
      return function(token) {
        if (token === null || token.type !== expectedTokenType) {
          return 0;
        }
        return 1;
      };
    }
    function func(name) {
      name = name + "(";
      return function(token, getNextToken) {
        if (token !== null && eqStr(token.value, name)) {
          return consumeFunction(token, getNextToken);
        }
        return 0;
      };
    }
    function customIdent(token) {
      if (token === null || token.type !== TYPE.Ident) {
        return 0;
      }
      var name = token.value.toLowerCase();
      if (eqStrAny(name, cssWideKeywords)) {
        return 0;
      }
      if (eqStr(name, "default")) {
        return 0;
      }
      return 1;
    }
    function customPropertyName(token) {
      if (token === null || token.type !== TYPE.Ident) {
        return 0;
      }
      if (charCode(token.value, 0) !== 45 || charCode(token.value, 1) !== 45) {
        return 0;
      }
      return 1;
    }
    function hexColor(token) {
      if (token === null || token.type !== TYPE.Hash) {
        return 0;
      }
      var length = token.value.length;
      if (length !== 4 && length !== 5 && length !== 7 && length !== 9) {
        return 0;
      }
      for (var i = 1; i < length; i++) {
        if (!isHexDigit(token.value.charCodeAt(i))) {
          return 0;
        }
      }
      return 1;
    }
    function idSelector(token) {
      if (token === null || token.type !== TYPE.Hash) {
        return 0;
      }
      if (!isIdentifierStart(charCode(token.value, 1), charCode(token.value, 2), charCode(token.value, 3))) {
        return 0;
      }
      return 1;
    }
    function declarationValue(token, getNextToken) {
      if (!token) {
        return 0;
      }
      var length = 0;
      var level = 0;
      var startIdx = token.index;
      scan:
        do {
          switch (token.type) {
            // ... does not contain <bad-string-token>, <bad-url-token>,
            case TYPE.BadString:
            case TYPE.BadUrl:
              break scan;
            // ... unmatched <)-token>, <]-token>, or <}-token>,
            case TYPE.RightCurlyBracket:
            case TYPE.RightParenthesis:
            case TYPE.RightSquareBracket:
              if (token.balance > token.index || token.balance < startIdx) {
                break scan;
              }
              level--;
              break;
            // ... or top-level <semicolon-token> tokens
            case TYPE.Semicolon:
              if (level === 0) {
                break scan;
              }
              break;
            // ... or <delim-token> tokens with a value of "!"
            case TYPE.Delim:
              if (token.value === "!" && level === 0) {
                break scan;
              }
              break;
            case TYPE.Function:
            case TYPE.LeftParenthesis:
            case TYPE.LeftSquareBracket:
            case TYPE.LeftCurlyBracket:
              level++;
              break;
          }
          length++;
          if (token.balance <= startIdx) {
            break;
          }
        } while (token = getNextToken(length));
      return length;
    }
    function anyValue(token, getNextToken) {
      if (!token) {
        return 0;
      }
      var startIdx = token.index;
      var length = 0;
      scan:
        do {
          switch (token.type) {
            // ... does not contain <bad-string-token>, <bad-url-token>,
            case TYPE.BadString:
            case TYPE.BadUrl:
              break scan;
            // ... unmatched <)-token>, <]-token>, or <}-token>,
            case TYPE.RightCurlyBracket:
            case TYPE.RightParenthesis:
            case TYPE.RightSquareBracket:
              if (token.balance > token.index || token.balance < startIdx) {
                break scan;
              }
              break;
          }
          length++;
          if (token.balance <= startIdx) {
            break;
          }
        } while (token = getNextToken(length));
      return length;
    }
    function dimension(type) {
      return function(token, getNextToken, opts) {
        if (token === null || token.type !== TYPE.Dimension) {
          return 0;
        }
        var numberEnd = consumeNumber(token.value, 0);
        if (type !== null) {
          var reverseSolidusOffset = token.value.indexOf("\\", numberEnd);
          var unit = reverseSolidusOffset === -1 || !isPostfixIeHack(token.value, reverseSolidusOffset) ? token.value.substr(numberEnd) : token.value.substring(numberEnd, reverseSolidusOffset);
          if (type.hasOwnProperty(unit.toLowerCase()) === false) {
            return 0;
          }
        }
        if (outOfRange(opts, token.value, numberEnd)) {
          return 0;
        }
        return 1;
      };
    }
    function percentage(token, getNextToken, opts) {
      if (token === null || token.type !== TYPE.Percentage) {
        return 0;
      }
      if (outOfRange(opts, token.value, token.value.length - 1)) {
        return 0;
      }
      return 1;
    }
    function zero(next) {
      if (typeof next !== "function") {
        next = function() {
          return 0;
        };
      }
      return function(token, getNextToken, opts) {
        if (token !== null && token.type === TYPE.Number) {
          if (Number(token.value) === 0) {
            return 1;
          }
        }
        return next(token, getNextToken, opts);
      };
    }
    function number(token, getNextToken, opts) {
      if (token === null) {
        return 0;
      }
      var numberEnd = consumeNumber(token.value, 0);
      var isNumber = numberEnd === token.value.length;
      if (!isNumber && !isPostfixIeHack(token.value, numberEnd)) {
        return 0;
      }
      if (outOfRange(opts, token.value, numberEnd)) {
        return 0;
      }
      return 1;
    }
    function integer(token, getNextToken, opts) {
      if (token === null || token.type !== TYPE.Number) {
        return 0;
      }
      var i = token.value.charCodeAt(0) === 43 || // U+002B PLUS SIGN (+)
      token.value.charCodeAt(0) === 45 ? 1 : 0;
      for (; i < token.value.length; i++) {
        if (!isDigit(token.value.charCodeAt(i))) {
          return 0;
        }
      }
      if (outOfRange(opts, token.value, i)) {
        return 0;
      }
      return 1;
    }
    generic = {
      // token types
      "ident-token": tokenType(TYPE.Ident),
      "function-token": tokenType(TYPE.Function),
      "at-keyword-token": tokenType(TYPE.AtKeyword),
      "hash-token": tokenType(TYPE.Hash),
      "string-token": tokenType(TYPE.String),
      "bad-string-token": tokenType(TYPE.BadString),
      "url-token": tokenType(TYPE.Url),
      "bad-url-token": tokenType(TYPE.BadUrl),
      "delim-token": tokenType(TYPE.Delim),
      "number-token": tokenType(TYPE.Number),
      "percentage-token": tokenType(TYPE.Percentage),
      "dimension-token": tokenType(TYPE.Dimension),
      "whitespace-token": tokenType(TYPE.WhiteSpace),
      "CDO-token": tokenType(TYPE.CDO),
      "CDC-token": tokenType(TYPE.CDC),
      "colon-token": tokenType(TYPE.Colon),
      "semicolon-token": tokenType(TYPE.Semicolon),
      "comma-token": tokenType(TYPE.Comma),
      "[-token": tokenType(TYPE.LeftSquareBracket),
      "]-token": tokenType(TYPE.RightSquareBracket),
      "(-token": tokenType(TYPE.LeftParenthesis),
      ")-token": tokenType(TYPE.RightParenthesis),
      "{-token": tokenType(TYPE.LeftCurlyBracket),
      "}-token": tokenType(TYPE.RightCurlyBracket),
      // token type aliases
      "string": tokenType(TYPE.String),
      "ident": tokenType(TYPE.Ident),
      // complex types
      "custom-ident": customIdent,
      "custom-property-name": customPropertyName,
      "hex-color": hexColor,
      "id-selector": idSelector,
      // element( <id-selector> )
      "an-plus-b": anPlusB,
      "urange": urange,
      "declaration-value": declarationValue,
      "any-value": anyValue,
      // dimensions
      "dimension": calc(dimension(null)),
      "angle": calc(dimension(ANGLE)),
      "decibel": calc(dimension(DECIBEL)),
      "frequency": calc(dimension(FREQUENCY)),
      "flex": calc(dimension(FLEX)),
      "length": calc(zero(dimension(LENGTH))),
      "resolution": calc(dimension(RESOLUTION)),
      "semitones": calc(dimension(SEMITONES)),
      "time": calc(dimension(TIME)),
      // percentage
      "percentage": calc(percentage),
      // numeric
      "zero": zero(),
      "number": calc(number),
      "integer": calc(integer),
      // old IE stuff
      "-ms-legacy-expression": func("expression")
    };
    return generic;
  }
  var _SyntaxError;
  var hasRequired_SyntaxError;
  function require_SyntaxError() {
    if (hasRequired_SyntaxError) return _SyntaxError;
    hasRequired_SyntaxError = 1;
    var createCustomError2 = requireCreateCustomError();
    _SyntaxError = function SyntaxError2(message, input, offset) {
      var error2 = createCustomError2("SyntaxError", message);
      error2.input = input;
      error2.offset = offset;
      error2.rawMessage = message;
      error2.message = error2.rawMessage + "\n  " + error2.input + "\n--" + new Array((error2.offset || error2.input.length) + 1).join("-") + "^";
      return error2;
    };
    return _SyntaxError;
  }
  var tokenizer;
  var hasRequiredTokenizer;
  function requireTokenizer() {
    if (hasRequiredTokenizer) return tokenizer;
    hasRequiredTokenizer = 1;
    var SyntaxError2 = require_SyntaxError();
    var TAB = 9;
    var N = 10;
    var F = 12;
    var R = 13;
    var SPACE = 32;
    var Tokenizer = function(str) {
      this.str = str;
      this.pos = 0;
    };
    Tokenizer.prototype = {
      charCodeAt: function(pos) {
        return pos < this.str.length ? this.str.charCodeAt(pos) : 0;
      },
      charCode: function() {
        return this.charCodeAt(this.pos);
      },
      nextCharCode: function() {
        return this.charCodeAt(this.pos + 1);
      },
      nextNonWsCode: function(pos) {
        return this.charCodeAt(this.findWsEnd(pos));
      },
      findWsEnd: function(pos) {
        for (; pos < this.str.length; pos++) {
          var code = this.str.charCodeAt(pos);
          if (code !== R && code !== N && code !== F && code !== SPACE && code !== TAB) {
            break;
          }
        }
        return pos;
      },
      substringToPos: function(end) {
        return this.str.substring(this.pos, this.pos = end);
      },
      eat: function(code) {
        if (this.charCode() !== code) {
          this.error("Expect `" + String.fromCharCode(code) + "`");
        }
        this.pos++;
      },
      peek: function() {
        return this.pos < this.str.length ? this.str.charAt(this.pos++) : "";
      },
      error: function(message) {
        throw new SyntaxError2(message, this.str, this.pos);
      }
    };
    tokenizer = Tokenizer;
    return tokenizer;
  }
  var parse_1;
  var hasRequiredParse;
  function requireParse() {
    if (hasRequiredParse) return parse_1;
    hasRequiredParse = 1;
    var Tokenizer = requireTokenizer();
    var TAB = 9;
    var N = 10;
    var F = 12;
    var R = 13;
    var SPACE = 32;
    var EXCLAMATIONMARK = 33;
    var NUMBERSIGN = 35;
    var AMPERSAND = 38;
    var APOSTROPHE = 39;
    var LEFTPARENTHESIS = 40;
    var RIGHTPARENTHESIS = 41;
    var ASTERISK = 42;
    var PLUSSIGN = 43;
    var COMMA = 44;
    var HYPERMINUS = 45;
    var LESSTHANSIGN = 60;
    var GREATERTHANSIGN = 62;
    var QUESTIONMARK = 63;
    var COMMERCIALAT = 64;
    var LEFTSQUAREBRACKET = 91;
    var RIGHTSQUAREBRACKET = 93;
    var LEFTCURLYBRACKET = 123;
    var VERTICALLINE = 124;
    var RIGHTCURLYBRACKET = 125;
    var INFINITY = 8734;
    var NAME_CHAR = createCharMap(function(ch) {
      return /[a-zA-Z0-9\-]/.test(ch);
    });
    var COMBINATOR_PRECEDENCE = {
      " ": 1,
      "&&": 2,
      "||": 3,
      "|": 4
    };
    function createCharMap(fn) {
      var array = typeof Uint32Array === "function" ? new Uint32Array(128) : new Array(128);
      for (var i = 0; i < 128; i++) {
        array[i] = fn(String.fromCharCode(i)) ? 1 : 0;
      }
      return array;
    }
    function scanSpaces(tokenizer2) {
      return tokenizer2.substringToPos(
        tokenizer2.findWsEnd(tokenizer2.pos)
      );
    }
    function scanWord(tokenizer2) {
      var end = tokenizer2.pos;
      for (; end < tokenizer2.str.length; end++) {
        var code = tokenizer2.str.charCodeAt(end);
        if (code >= 128 || NAME_CHAR[code] === 0) {
          break;
        }
      }
      if (tokenizer2.pos === end) {
        tokenizer2.error("Expect a keyword");
      }
      return tokenizer2.substringToPos(end);
    }
    function scanNumber(tokenizer2) {
      var end = tokenizer2.pos;
      for (; end < tokenizer2.str.length; end++) {
        var code = tokenizer2.str.charCodeAt(end);
        if (code < 48 || code > 57) {
          break;
        }
      }
      if (tokenizer2.pos === end) {
        tokenizer2.error("Expect a number");
      }
      return tokenizer2.substringToPos(end);
    }
    function scanString(tokenizer2) {
      var end = tokenizer2.str.indexOf("'", tokenizer2.pos + 1);
      if (end === -1) {
        tokenizer2.pos = tokenizer2.str.length;
        tokenizer2.error("Expect an apostrophe");
      }
      return tokenizer2.substringToPos(end + 1);
    }
    function readMultiplierRange(tokenizer2) {
      var min = null;
      var max = null;
      tokenizer2.eat(LEFTCURLYBRACKET);
      min = scanNumber(tokenizer2);
      if (tokenizer2.charCode() === COMMA) {
        tokenizer2.pos++;
        if (tokenizer2.charCode() !== RIGHTCURLYBRACKET) {
          max = scanNumber(tokenizer2);
        }
      } else {
        max = min;
      }
      tokenizer2.eat(RIGHTCURLYBRACKET);
      return {
        min: Number(min),
        max: max ? Number(max) : 0
      };
    }
    function readMultiplier(tokenizer2) {
      var range = null;
      var comma = false;
      switch (tokenizer2.charCode()) {
        case ASTERISK:
          tokenizer2.pos++;
          range = {
            min: 0,
            max: 0
          };
          break;
        case PLUSSIGN:
          tokenizer2.pos++;
          range = {
            min: 1,
            max: 0
          };
          break;
        case QUESTIONMARK:
          tokenizer2.pos++;
          range = {
            min: 0,
            max: 1
          };
          break;
        case NUMBERSIGN:
          tokenizer2.pos++;
          comma = true;
          if (tokenizer2.charCode() === LEFTCURLYBRACKET) {
            range = readMultiplierRange(tokenizer2);
          } else {
            range = {
              min: 1,
              max: 0
            };
          }
          break;
        case LEFTCURLYBRACKET:
          range = readMultiplierRange(tokenizer2);
          break;
        default:
          return null;
      }
      return {
        type: "Multiplier",
        comma,
        min: range.min,
        max: range.max,
        term: null
      };
    }
    function maybeMultiplied(tokenizer2, node2) {
      var multiplier = readMultiplier(tokenizer2);
      if (multiplier !== null) {
        multiplier.term = node2;
        return multiplier;
      }
      return node2;
    }
    function maybeToken(tokenizer2) {
      var ch = tokenizer2.peek();
      if (ch === "") {
        return null;
      }
      return {
        type: "Token",
        value: ch
      };
    }
    function readProperty(tokenizer2) {
      var name;
      tokenizer2.eat(LESSTHANSIGN);
      tokenizer2.eat(APOSTROPHE);
      name = scanWord(tokenizer2);
      tokenizer2.eat(APOSTROPHE);
      tokenizer2.eat(GREATERTHANSIGN);
      return maybeMultiplied(tokenizer2, {
        type: "Property",
        name
      });
    }
    function readTypeRange(tokenizer2) {
      var min = null;
      var max = null;
      var sign = 1;
      tokenizer2.eat(LEFTSQUAREBRACKET);
      if (tokenizer2.charCode() === HYPERMINUS) {
        tokenizer2.peek();
        sign = -1;
      }
      if (sign == -1 && tokenizer2.charCode() === INFINITY) {
        tokenizer2.peek();
      } else {
        min = sign * Number(scanNumber(tokenizer2));
      }
      scanSpaces(tokenizer2);
      tokenizer2.eat(COMMA);
      scanSpaces(tokenizer2);
      if (tokenizer2.charCode() === INFINITY) {
        tokenizer2.peek();
      } else {
        sign = 1;
        if (tokenizer2.charCode() === HYPERMINUS) {
          tokenizer2.peek();
          sign = -1;
        }
        max = sign * Number(scanNumber(tokenizer2));
      }
      tokenizer2.eat(RIGHTSQUAREBRACKET);
      if (min === null && max === null) {
        return null;
      }
      return {
        type: "Range",
        min,
        max
      };
    }
    function readType(tokenizer2) {
      var name;
      var opts = null;
      tokenizer2.eat(LESSTHANSIGN);
      name = scanWord(tokenizer2);
      if (tokenizer2.charCode() === LEFTPARENTHESIS && tokenizer2.nextCharCode() === RIGHTPARENTHESIS) {
        tokenizer2.pos += 2;
        name += "()";
      }
      if (tokenizer2.charCodeAt(tokenizer2.findWsEnd(tokenizer2.pos)) === LEFTSQUAREBRACKET) {
        scanSpaces(tokenizer2);
        opts = readTypeRange(tokenizer2);
      }
      tokenizer2.eat(GREATERTHANSIGN);
      return maybeMultiplied(tokenizer2, {
        type: "Type",
        name,
        opts
      });
    }
    function readKeywordOrFunction(tokenizer2) {
      var name;
      name = scanWord(tokenizer2);
      if (tokenizer2.charCode() === LEFTPARENTHESIS) {
        tokenizer2.pos++;
        return {
          type: "Function",
          name
        };
      }
      return maybeMultiplied(tokenizer2, {
        type: "Keyword",
        name
      });
    }
    function regroupTerms(terms, combinators) {
      function createGroup(terms2, combinator2) {
        return {
          type: "Group",
          terms: terms2,
          combinator: combinator2,
          disallowEmpty: false,
          explicit: false
        };
      }
      combinators = Object.keys(combinators).sort(function(a, b) {
        return COMBINATOR_PRECEDENCE[a] - COMBINATOR_PRECEDENCE[b];
      });
      while (combinators.length > 0) {
        var combinator = combinators.shift();
        for (var i = 0, subgroupStart = 0; i < terms.length; i++) {
          var term = terms[i];
          if (term.type === "Combinator") {
            if (term.value === combinator) {
              if (subgroupStart === -1) {
                subgroupStart = i - 1;
              }
              terms.splice(i, 1);
              i--;
            } else {
              if (subgroupStart !== -1 && i - subgroupStart > 1) {
                terms.splice(
                  subgroupStart,
                  i - subgroupStart,
                  createGroup(terms.slice(subgroupStart, i), combinator)
                );
                i = subgroupStart + 1;
              }
              subgroupStart = -1;
            }
          }
        }
        if (subgroupStart !== -1 && combinators.length) {
          terms.splice(
            subgroupStart,
            i - subgroupStart,
            createGroup(terms.slice(subgroupStart, i), combinator)
          );
        }
      }
      return combinator;
    }
    function readImplicitGroup(tokenizer2) {
      var terms = [];
      var combinators = {};
      var token;
      var prevToken = null;
      var prevTokenPos = tokenizer2.pos;
      while (token = peek(tokenizer2)) {
        if (token.type !== "Spaces") {
          if (token.type === "Combinator") {
            if (prevToken === null || prevToken.type === "Combinator") {
              tokenizer2.pos = prevTokenPos;
              tokenizer2.error("Unexpected combinator");
            }
            combinators[token.value] = true;
          } else if (prevToken !== null && prevToken.type !== "Combinator") {
            combinators[" "] = true;
            terms.push({
              type: "Combinator",
              value: " "
            });
          }
          terms.push(token);
          prevToken = token;
          prevTokenPos = tokenizer2.pos;
        }
      }
      if (prevToken !== null && prevToken.type === "Combinator") {
        tokenizer2.pos -= prevTokenPos;
        tokenizer2.error("Unexpected combinator");
      }
      return {
        type: "Group",
        terms,
        combinator: regroupTerms(terms, combinators) || " ",
        disallowEmpty: false,
        explicit: false
      };
    }
    function readGroup(tokenizer2) {
      var result2;
      tokenizer2.eat(LEFTSQUAREBRACKET);
      result2 = readImplicitGroup(tokenizer2);
      tokenizer2.eat(RIGHTSQUAREBRACKET);
      result2.explicit = true;
      if (tokenizer2.charCode() === EXCLAMATIONMARK) {
        tokenizer2.pos++;
        result2.disallowEmpty = true;
      }
      return result2;
    }
    function peek(tokenizer2) {
      var code = tokenizer2.charCode();
      if (code < 128 && NAME_CHAR[code] === 1) {
        return readKeywordOrFunction(tokenizer2);
      }
      switch (code) {
        case RIGHTSQUAREBRACKET:
          break;
        case LEFTSQUAREBRACKET:
          return maybeMultiplied(tokenizer2, readGroup(tokenizer2));
        case LESSTHANSIGN:
          return tokenizer2.nextCharCode() === APOSTROPHE ? readProperty(tokenizer2) : readType(tokenizer2);
        case VERTICALLINE:
          return {
            type: "Combinator",
            value: tokenizer2.substringToPos(
              tokenizer2.nextCharCode() === VERTICALLINE ? tokenizer2.pos + 2 : tokenizer2.pos + 1
            )
          };
        case AMPERSAND:
          tokenizer2.pos++;
          tokenizer2.eat(AMPERSAND);
          return {
            type: "Combinator",
            value: "&&"
          };
        case COMMA:
          tokenizer2.pos++;
          return {
            type: "Comma"
          };
        case APOSTROPHE:
          return maybeMultiplied(tokenizer2, {
            type: "String",
            value: scanString(tokenizer2)
          });
        case SPACE:
        case TAB:
        case N:
        case R:
        case F:
          return {
            type: "Spaces",
            value: scanSpaces(tokenizer2)
          };
        case COMMERCIALAT:
          code = tokenizer2.nextCharCode();
          if (code < 128 && NAME_CHAR[code] === 1) {
            tokenizer2.pos++;
            return {
              type: "AtKeyword",
              name: scanWord(tokenizer2)
            };
          }
          return maybeToken(tokenizer2);
        case ASTERISK:
        case PLUSSIGN:
        case QUESTIONMARK:
        case NUMBERSIGN:
        case EXCLAMATIONMARK:
          break;
        case LEFTCURLYBRACKET:
          code = tokenizer2.nextCharCode();
          if (code < 48 || code > 57) {
            return maybeToken(tokenizer2);
          }
          break;
        default:
          return maybeToken(tokenizer2);
      }
    }
    function parse2(source) {
      var tokenizer2 = new Tokenizer(source);
      var result2 = readImplicitGroup(tokenizer2);
      if (tokenizer2.pos !== source.length) {
        tokenizer2.error("Unexpected input");
      }
      if (result2.terms.length === 1 && result2.terms[0].type === "Group") {
        result2 = result2.terms[0];
      }
      return result2;
    }
    parse2("[a&&<b>#|<'c'>*||e() f{2} /,(% g#{1,2} h{2,})]!");
    parse_1 = parse2;
    return parse_1;
  }
  var walk;
  var hasRequiredWalk;
  function requireWalk() {
    if (hasRequiredWalk) return walk;
    hasRequiredWalk = 1;
    var noop = function() {
    };
    function ensureFunction(value2) {
      return typeof value2 === "function" ? value2 : noop;
    }
    walk = function(node2, options, context) {
      function walk2(node3) {
        enter.call(context, node3);
        switch (node3.type) {
          case "Group":
            node3.terms.forEach(walk2);
            break;
          case "Multiplier":
            walk2(node3.term);
            break;
          case "Type":
          case "Property":
          case "Keyword":
          case "AtKeyword":
          case "Function":
          case "String":
          case "Token":
          case "Comma":
            break;
          default:
            throw new Error("Unknown type: " + node3.type);
        }
        leave.call(context, node3);
      }
      var enter = noop;
      var leave = noop;
      if (typeof options === "function") {
        enter = options;
      } else if (options) {
        enter = ensureFunction(options.enter);
        leave = ensureFunction(options.leave);
      }
      if (enter === noop && leave === noop) {
        throw new Error("Neither `enter` nor `leave` walker handler is set or both aren't a function");
      }
      walk2(node2);
    };
    return walk;
  }
  var prepareTokens_1;
  var hasRequiredPrepareTokens;
  function requirePrepareTokens() {
    if (hasRequiredPrepareTokens) return prepareTokens_1;
    hasRequiredPrepareTokens = 1;
    var tokenize = requireTokenizer$1();
    var TokenStream = requireTokenStream();
    var tokenStream = new TokenStream();
    var astToTokens = {
      decorator: function(handlers) {
        var curNode = null;
        var prev = { len: 0, node: null };
        var nodes = [prev];
        var buffer = "";
        return {
          children: handlers.children,
          node: function(node2) {
            var tmp = curNode;
            curNode = node2;
            handlers.node.call(this, node2);
            curNode = tmp;
          },
          chunk: function(chunk) {
            buffer += chunk;
            if (prev.node !== curNode) {
              nodes.push({
                len: chunk.length,
                node: curNode
              });
            } else {
              prev.len += chunk.length;
            }
          },
          result: function() {
            return prepareTokens(buffer, nodes);
          }
        };
      }
    };
    function prepareTokens(str, nodes) {
      var tokens = [];
      var nodesOffset = 0;
      var nodesIndex = 0;
      var currentNode = nodes ? nodes[nodesIndex].node : null;
      tokenize(str, tokenStream);
      while (!tokenStream.eof) {
        if (nodes) {
          while (nodesIndex < nodes.length && nodesOffset + nodes[nodesIndex].len <= tokenStream.tokenStart) {
            nodesOffset += nodes[nodesIndex++].len;
            currentNode = nodes[nodesIndex].node;
          }
        }
        tokens.push({
          type: tokenStream.tokenType,
          value: tokenStream.getTokenValue(),
          index: tokenStream.tokenIndex,
          // TODO: remove it, temporary solution
          balance: tokenStream.balance[tokenStream.tokenIndex],
          // TODO: remove it, temporary solution
          node: currentNode
        });
        tokenStream.next();
      }
      return tokens;
    }
    prepareTokens_1 = function(value2, syntax2) {
      if (typeof value2 === "string") {
        return prepareTokens(value2, null);
      }
      return syntax2.generate(value2, astToTokens);
    };
    return prepareTokens_1;
  }
  var matchGraph;
  var hasRequiredMatchGraph;
  function requireMatchGraph() {
    if (hasRequiredMatchGraph) return matchGraph;
    hasRequiredMatchGraph = 1;
    var parse2 = requireParse();
    var MATCH = { type: "Match" };
    var MISMATCH = { type: "Mismatch" };
    var DISALLOW_EMPTY = { type: "DisallowEmpty" };
    var LEFTPARENTHESIS = 40;
    var RIGHTPARENTHESIS = 41;
    function createCondition(match2, thenBranch, elseBranch) {
      if (thenBranch === MATCH && elseBranch === MISMATCH) {
        return match2;
      }
      if (match2 === MATCH && thenBranch === MATCH && elseBranch === MATCH) {
        return match2;
      }
      if (match2.type === "If" && match2.else === MISMATCH && thenBranch === MATCH) {
        thenBranch = match2.then;
        match2 = match2.match;
      }
      return {
        type: "If",
        match: match2,
        then: thenBranch,
        else: elseBranch
      };
    }
    function isFunctionType(name) {
      return name.length > 2 && name.charCodeAt(name.length - 2) === LEFTPARENTHESIS && name.charCodeAt(name.length - 1) === RIGHTPARENTHESIS;
    }
    function isEnumCapatible(term) {
      return term.type === "Keyword" || term.type === "AtKeyword" || term.type === "Function" || term.type === "Type" && isFunctionType(term.name);
    }
    function buildGroupMatchGraph(combinator, terms, atLeastOneTermMatched) {
      switch (combinator) {
        case " ":
          var result2 = MATCH;
          for (var i = terms.length - 1; i >= 0; i--) {
            var term = terms[i];
            result2 = createCondition(
              term,
              result2,
              MISMATCH
            );
          }
          return result2;
        case "|":
          var result2 = MISMATCH;
          var map = null;
          for (var i = terms.length - 1; i >= 0; i--) {
            var term = terms[i];
            if (isEnumCapatible(term)) {
              if (map === null && i > 0 && isEnumCapatible(terms[i - 1])) {
                map = /* @__PURE__ */ Object.create(null);
                result2 = createCondition(
                  {
                    type: "Enum",
                    map
                  },
                  MATCH,
                  result2
                );
              }
              if (map !== null) {
                var key = (isFunctionType(term.name) ? term.name.slice(0, -1) : term.name).toLowerCase();
                if (key in map === false) {
                  map[key] = term;
                  continue;
                }
              }
            }
            map = null;
            result2 = createCondition(
              term,
              MATCH,
              result2
            );
          }
          return result2;
        case "&&":
          if (terms.length > 5) {
            return {
              type: "MatchOnce",
              terms,
              all: true
            };
          }
          var result2 = MISMATCH;
          for (var i = terms.length - 1; i >= 0; i--) {
            var term = terms[i];
            var thenClause;
            if (terms.length > 1) {
              thenClause = buildGroupMatchGraph(
                combinator,
                terms.filter(function(newGroupTerm) {
                  return newGroupTerm !== term;
                }),
                false
              );
            } else {
              thenClause = MATCH;
            }
            result2 = createCondition(
              term,
              thenClause,
              result2
            );
          }
          return result2;
        case "||":
          if (terms.length > 5) {
            return {
              type: "MatchOnce",
              terms,
              all: false
            };
          }
          var result2 = atLeastOneTermMatched ? MATCH : MISMATCH;
          for (var i = terms.length - 1; i >= 0; i--) {
            var term = terms[i];
            var thenClause;
            if (terms.length > 1) {
              thenClause = buildGroupMatchGraph(
                combinator,
                terms.filter(function(newGroupTerm) {
                  return newGroupTerm !== term;
                }),
                true
              );
            } else {
              thenClause = MATCH;
            }
            result2 = createCondition(
              term,
              thenClause,
              result2
            );
          }
          return result2;
      }
    }
    function buildMultiplierMatchGraph(node2) {
      var result2 = MATCH;
      var matchTerm = buildMatchGraph(node2.term);
      if (node2.max === 0) {
        matchTerm = createCondition(
          matchTerm,
          DISALLOW_EMPTY,
          MISMATCH
        );
        result2 = createCondition(
          matchTerm,
          null,
          // will be a loop
          MISMATCH
        );
        result2.then = createCondition(
          MATCH,
          MATCH,
          result2
          // make a loop
        );
        if (node2.comma) {
          result2.then.else = createCondition(
            { type: "Comma", syntax: node2 },
            result2,
            MISMATCH
          );
        }
      } else {
        for (var i = node2.min || 1; i <= node2.max; i++) {
          if (node2.comma && result2 !== MATCH) {
            result2 = createCondition(
              { type: "Comma", syntax: node2 },
              result2,
              MISMATCH
            );
          }
          result2 = createCondition(
            matchTerm,
            createCondition(
              MATCH,
              MATCH,
              result2
            ),
            MISMATCH
          );
        }
      }
      if (node2.min === 0) {
        result2 = createCondition(
          MATCH,
          MATCH,
          result2
        );
      } else {
        for (var i = 0; i < node2.min - 1; i++) {
          if (node2.comma && result2 !== MATCH) {
            result2 = createCondition(
              { type: "Comma", syntax: node2 },
              result2,
              MISMATCH
            );
          }
          result2 = createCondition(
            matchTerm,
            result2,
            MISMATCH
          );
        }
      }
      return result2;
    }
    function buildMatchGraph(node2) {
      if (typeof node2 === "function") {
        return {
          type: "Generic",
          fn: node2
        };
      }
      switch (node2.type) {
        case "Group":
          var result2 = buildGroupMatchGraph(
            node2.combinator,
            node2.terms.map(buildMatchGraph),
            false
          );
          if (node2.disallowEmpty) {
            result2 = createCondition(
              result2,
              DISALLOW_EMPTY,
              MISMATCH
            );
          }
          return result2;
        case "Multiplier":
          return buildMultiplierMatchGraph(node2);
        case "Type":
        case "Property":
          return {
            type: node2.type,
            name: node2.name,
            syntax: node2
          };
        case "Keyword":
          return {
            type: node2.type,
            name: node2.name.toLowerCase(),
            syntax: node2
          };
        case "AtKeyword":
          return {
            type: node2.type,
            name: "@" + node2.name.toLowerCase(),
            syntax: node2
          };
        case "Function":
          return {
            type: node2.type,
            name: node2.name.toLowerCase() + "(",
            syntax: node2
          };
        case "String":
          if (node2.value.length === 3) {
            return {
              type: "Token",
              value: node2.value.charAt(1),
              syntax: node2
            };
          }
          return {
            type: node2.type,
            value: node2.value.substr(1, node2.value.length - 2).replace(/\\'/g, "'"),
            syntax: node2
          };
        case "Token":
          return {
            type: node2.type,
            value: node2.value,
            syntax: node2
          };
        case "Comma":
          return {
            type: node2.type,
            syntax: node2
          };
        default:
          throw new Error("Unknown node type:", node2.type);
      }
    }
    matchGraph = {
      MATCH,
      MISMATCH,
      DISALLOW_EMPTY,
      buildMatchGraph: function(syntaxTree, ref) {
        if (typeof syntaxTree === "string") {
          syntaxTree = parse2(syntaxTree);
        }
        return {
          type: "MatchGraph",
          match: buildMatchGraph(syntaxTree),
          syntax: ref || null,
          source: syntaxTree
        };
      }
    };
    return matchGraph;
  }
  var match;
  var hasRequiredMatch;
  function requireMatch() {
    if (hasRequiredMatch) return match;
    hasRequiredMatch = 1;
    var hasOwnProperty = Object.prototype.hasOwnProperty;
    var matchGraph2 = requireMatchGraph();
    var MATCH = matchGraph2.MATCH;
    var MISMATCH = matchGraph2.MISMATCH;
    var DISALLOW_EMPTY = matchGraph2.DISALLOW_EMPTY;
    var TYPE = require_const().TYPE;
    var STUB = 0;
    var TOKEN = 1;
    var OPEN_SYNTAX = 2;
    var CLOSE_SYNTAX = 3;
    var EXIT_REASON_MATCH = "Match";
    var EXIT_REASON_MISMATCH = "Mismatch";
    var EXIT_REASON_ITERATION_LIMIT = "Maximum iteration number exceeded (please fill an issue on https://github.com/csstree/csstree/issues)";
    var ITERATION_LIMIT = 15e3;
    var totalIterationCount = 0;
    function reverseList(list) {
      var prev = null;
      var next = null;
      var item = list;
      while (item !== null) {
        next = item.prev;
        item.prev = prev;
        prev = item;
        item = next;
      }
      return prev;
    }
    function areStringsEqualCaseInsensitive(testStr, referenceStr) {
      if (testStr.length !== referenceStr.length) {
        return false;
      }
      for (var i = 0; i < testStr.length; i++) {
        var testCode = testStr.charCodeAt(i);
        var referenceCode = referenceStr.charCodeAt(i);
        if (testCode >= 65 && testCode <= 90) {
          testCode = testCode | 32;
        }
        if (testCode !== referenceCode) {
          return false;
        }
      }
      return true;
    }
    function isCommaContextStart(token) {
      if (token === null) {
        return true;
      }
      return token.type === TYPE.Comma || token.type === TYPE.Function || token.type === TYPE.LeftParenthesis || token.type === TYPE.LeftSquareBracket || token.type === TYPE.LeftCurlyBracket || token.type === TYPE.Delim;
    }
    function isCommaContextEnd(token) {
      if (token === null) {
        return true;
      }
      return token.type === TYPE.RightParenthesis || token.type === TYPE.RightSquareBracket || token.type === TYPE.RightCurlyBracket || token.type === TYPE.Delim;
    }
    function internalMatch(tokens, state, syntaxes) {
      function moveToNextToken() {
        do {
          tokenIndex++;
          token = tokenIndex < tokens.length ? tokens[tokenIndex] : null;
        } while (token !== null && (token.type === TYPE.WhiteSpace || token.type === TYPE.Comment));
      }
      function getNextToken(offset) {
        var nextIndex = tokenIndex + offset;
        return nextIndex < tokens.length ? tokens[nextIndex] : null;
      }
      function stateSnapshotFromSyntax(nextState, prev) {
        return {
          nextState,
          matchStack,
          syntaxStack,
          thenStack,
          tokenIndex,
          prev
        };
      }
      function pushThenStack(nextState) {
        thenStack = {
          nextState,
          matchStack,
          syntaxStack,
          prev: thenStack
        };
      }
      function pushElseStack(nextState) {
        elseStack = stateSnapshotFromSyntax(nextState, elseStack);
      }
      function addTokenToMatch() {
        matchStack = {
          type: TOKEN,
          syntax: state.syntax,
          token,
          prev: matchStack
        };
        moveToNextToken();
        syntaxStash = null;
        if (tokenIndex > longestMatch) {
          longestMatch = tokenIndex;
        }
      }
      function openSyntax() {
        syntaxStack = {
          syntax: state.syntax,
          opts: state.syntax.opts || syntaxStack !== null && syntaxStack.opts || null,
          prev: syntaxStack
        };
        matchStack = {
          type: OPEN_SYNTAX,
          syntax: state.syntax,
          token: matchStack.token,
          prev: matchStack
        };
      }
      function closeSyntax() {
        if (matchStack.type === OPEN_SYNTAX) {
          matchStack = matchStack.prev;
        } else {
          matchStack = {
            type: CLOSE_SYNTAX,
            syntax: syntaxStack.syntax,
            token: matchStack.token,
            prev: matchStack
          };
        }
        syntaxStack = syntaxStack.prev;
      }
      var syntaxStack = null;
      var thenStack = null;
      var elseStack = null;
      var syntaxStash = null;
      var iterationCount = 0;
      var exitReason = null;
      var token = null;
      var tokenIndex = -1;
      var longestMatch = 0;
      var matchStack = {
        type: STUB,
        syntax: null,
        token: null,
        prev: null
      };
      moveToNextToken();
      while (exitReason === null && ++iterationCount < ITERATION_LIMIT) {
        switch (state.type) {
          case "Match":
            if (thenStack === null) {
              if (token !== null) {
                if (tokenIndex !== tokens.length - 1 || token.value !== "\\0" && token.value !== "\\9") {
                  state = MISMATCH;
                  break;
                }
              }
              exitReason = EXIT_REASON_MATCH;
              break;
            }
            state = thenStack.nextState;
            if (state === DISALLOW_EMPTY) {
              if (thenStack.matchStack === matchStack) {
                state = MISMATCH;
                break;
              } else {
                state = MATCH;
              }
            }
            while (thenStack.syntaxStack !== syntaxStack) {
              closeSyntax();
            }
            thenStack = thenStack.prev;
            break;
          case "Mismatch":
            if (syntaxStash !== null && syntaxStash !== false) {
              if (elseStack === null || tokenIndex > elseStack.tokenIndex) {
                elseStack = syntaxStash;
                syntaxStash = false;
              }
            } else if (elseStack === null) {
              exitReason = EXIT_REASON_MISMATCH;
              break;
            }
            state = elseStack.nextState;
            thenStack = elseStack.thenStack;
            syntaxStack = elseStack.syntaxStack;
            matchStack = elseStack.matchStack;
            tokenIndex = elseStack.tokenIndex;
            token = tokenIndex < tokens.length ? tokens[tokenIndex] : null;
            elseStack = elseStack.prev;
            break;
          case "MatchGraph":
            state = state.match;
            break;
          case "If":
            if (state.else !== MISMATCH) {
              pushElseStack(state.else);
            }
            if (state.then !== MATCH) {
              pushThenStack(state.then);
            }
            state = state.match;
            break;
          case "MatchOnce":
            state = {
              type: "MatchOnceBuffer",
              syntax: state,
              index: 0,
              mask: 0
            };
            break;
          case "MatchOnceBuffer":
            var terms = state.syntax.terms;
            if (state.index === terms.length) {
              if (state.mask === 0 || state.syntax.all) {
                state = MISMATCH;
                break;
              }
              state = MATCH;
              break;
            }
            if (state.mask === (1 << terms.length) - 1) {
              state = MATCH;
              break;
            }
            for (; state.index < terms.length; state.index++) {
              var matchFlag = 1 << state.index;
              if ((state.mask & matchFlag) === 0) {
                pushElseStack(state);
                pushThenStack({
                  type: "AddMatchOnce",
                  syntax: state.syntax,
                  mask: state.mask | matchFlag
                });
                state = terms[state.index++];
                break;
              }
            }
            break;
          case "AddMatchOnce":
            state = {
              type: "MatchOnceBuffer",
              syntax: state.syntax,
              index: 0,
              mask: state.mask
            };
            break;
          case "Enum":
            if (token !== null) {
              var name = token.value.toLowerCase();
              if (name.indexOf("\\") !== -1) {
                name = name.replace(/\\[09].*$/, "");
              }
              if (hasOwnProperty.call(state.map, name)) {
                state = state.map[name];
                break;
              }
            }
            state = MISMATCH;
            break;
          case "Generic":
            var opts = syntaxStack !== null ? syntaxStack.opts : null;
            var lastTokenIndex = tokenIndex + Math.floor(state.fn(token, getNextToken, opts));
            if (!isNaN(lastTokenIndex) && lastTokenIndex > tokenIndex) {
              while (tokenIndex < lastTokenIndex) {
                addTokenToMatch();
              }
              state = MATCH;
            } else {
              state = MISMATCH;
            }
            break;
          case "Type":
          case "Property":
            var syntaxDict = state.type === "Type" ? "types" : "properties";
            var dictSyntax = hasOwnProperty.call(syntaxes, syntaxDict) ? syntaxes[syntaxDict][state.name] : null;
            if (!dictSyntax || !dictSyntax.match) {
              throw new Error(
                "Bad syntax reference: " + (state.type === "Type" ? "<" + state.name + ">" : "<'" + state.name + "'>")
              );
            }
            if (syntaxStash !== false && token !== null && state.type === "Type") {
              var lowPriorityMatching = (
                // https://drafts.csswg.org/css-values-4/#custom-idents
                // When parsing positionally-ambiguous keywords in a property value, a <custom-ident> production
                // can only claim the keyword if no other unfulfilled production can claim it.
                state.name === "custom-ident" && token.type === TYPE.Ident || // https://drafts.csswg.org/css-values-4/#lengths
                // ... if a `0` could be parsed as either a <number> or a <length> in a property (such as line-height),
                // it must parse as a <number>
                state.name === "length" && token.value === "0"
              );
              if (lowPriorityMatching) {
                if (syntaxStash === null) {
                  syntaxStash = stateSnapshotFromSyntax(state, elseStack);
                }
                state = MISMATCH;
                break;
              }
            }
            openSyntax();
            state = dictSyntax.match;
            break;
          case "Keyword":
            var name = state.name;
            if (token !== null) {
              var keywordName = token.value;
              if (keywordName.indexOf("\\") !== -1) {
                keywordName = keywordName.replace(/\\[09].*$/, "");
              }
              if (areStringsEqualCaseInsensitive(keywordName, name)) {
                addTokenToMatch();
                state = MATCH;
                break;
              }
            }
            state = MISMATCH;
            break;
          case "AtKeyword":
          case "Function":
            if (token !== null && areStringsEqualCaseInsensitive(token.value, state.name)) {
              addTokenToMatch();
              state = MATCH;
              break;
            }
            state = MISMATCH;
            break;
          case "Token":
            if (token !== null && token.value === state.value) {
              addTokenToMatch();
              state = MATCH;
              break;
            }
            state = MISMATCH;
            break;
          case "Comma":
            if (token !== null && token.type === TYPE.Comma) {
              if (isCommaContextStart(matchStack.token)) {
                state = MISMATCH;
              } else {
                addTokenToMatch();
                state = isCommaContextEnd(token) ? MISMATCH : MATCH;
              }
            } else {
              state = isCommaContextStart(matchStack.token) || isCommaContextEnd(token) ? MATCH : MISMATCH;
            }
            break;
          case "String":
            var string = "";
            for (var lastTokenIndex = tokenIndex; lastTokenIndex < tokens.length && string.length < state.value.length; lastTokenIndex++) {
              string += tokens[lastTokenIndex].value;
            }
            if (areStringsEqualCaseInsensitive(string, state.value)) {
              while (tokenIndex < lastTokenIndex) {
                addTokenToMatch();
              }
              state = MATCH;
            } else {
              state = MISMATCH;
            }
            break;
          default:
            throw new Error("Unknown node type: " + state.type);
        }
      }
      totalIterationCount += iterationCount;
      switch (exitReason) {
        case null:
          console.warn("[csstree-match] BREAK after " + ITERATION_LIMIT + " iterations");
          exitReason = EXIT_REASON_ITERATION_LIMIT;
          matchStack = null;
          break;
        case EXIT_REASON_MATCH:
          while (syntaxStack !== null) {
            closeSyntax();
          }
          break;
        default:
          matchStack = null;
      }
      return {
        tokens,
        reason: exitReason,
        iterations: iterationCount,
        match: matchStack,
        longestMatch
      };
    }
    function matchAsList(tokens, matchGraph3, syntaxes) {
      var matchResult = internalMatch(tokens, matchGraph3, syntaxes || {});
      if (matchResult.match !== null) {
        var item = reverseList(matchResult.match).prev;
        matchResult.match = [];
        while (item !== null) {
          switch (item.type) {
            case STUB:
              break;
            case OPEN_SYNTAX:
            case CLOSE_SYNTAX:
              matchResult.match.push({
                type: item.type,
                syntax: item.syntax
              });
              break;
            default:
              matchResult.match.push({
                token: item.token.value,
                node: item.token.node
              });
              break;
          }
          item = item.prev;
        }
      }
      return matchResult;
    }
    function matchAsTree(tokens, matchGraph3, syntaxes) {
      var matchResult = internalMatch(tokens, matchGraph3, syntaxes || {});
      if (matchResult.match === null) {
        return matchResult;
      }
      var item = matchResult.match;
      var host = matchResult.match = {
        syntax: matchGraph3.syntax || null,
        match: []
      };
      var hostStack = [host];
      item = reverseList(item).prev;
      while (item !== null) {
        switch (item.type) {
          case OPEN_SYNTAX:
            host.match.push(host = {
              syntax: item.syntax,
              match: []
            });
            hostStack.push(host);
            break;
          case CLOSE_SYNTAX:
            hostStack.pop();
            host = hostStack[hostStack.length - 1];
            break;
          default:
            host.match.push({
              syntax: item.syntax || null,
              token: item.token.value,
              node: item.token.node
            });
        }
        item = item.prev;
      }
      return matchResult;
    }
    match = {
      matchAsList,
      matchAsTree,
      getTotalIterationCount: function() {
        return totalIterationCount;
      }
    };
    return match;
  }
  var trace;
  var hasRequiredTrace;
  function requireTrace() {
    if (hasRequiredTrace) return trace;
    hasRequiredTrace = 1;
    function getTrace(node2) {
      function shouldPutToTrace(syntax2) {
        if (syntax2 === null) {
          return false;
        }
        return syntax2.type === "Type" || syntax2.type === "Property" || syntax2.type === "Keyword";
      }
      function hasMatch(matchNode) {
        if (Array.isArray(matchNode.match)) {
          for (var i = 0; i < matchNode.match.length; i++) {
            if (hasMatch(matchNode.match[i])) {
              if (shouldPutToTrace(matchNode.syntax)) {
                result2.unshift(matchNode.syntax);
              }
              return true;
            }
          }
        } else if (matchNode.node === node2) {
          result2 = shouldPutToTrace(matchNode.syntax) ? [matchNode.syntax] : [];
          return true;
        }
        return false;
      }
      var result2 = null;
      if (this.matched !== null) {
        hasMatch(this.matched);
      }
      return result2;
    }
    function testNode(match2, node2, fn) {
      var trace2 = getTrace.call(match2, node2);
      if (trace2 === null) {
        return false;
      }
      return trace2.some(fn);
    }
    function isType(node2, type) {
      return testNode(this, node2, function(matchNode) {
        return matchNode.type === "Type" && matchNode.name === type;
      });
    }
    function isProperty(node2, property) {
      return testNode(this, node2, function(matchNode) {
        return matchNode.type === "Property" && matchNode.name === property;
      });
    }
    function isKeyword(node2) {
      return testNode(this, node2, function(matchNode) {
        return matchNode.type === "Keyword";
      });
    }
    trace = {
      getTrace,
      isType,
      isProperty,
      isKeyword
    };
    return trace;
  }
  var search;
  var hasRequiredSearch;
  function requireSearch() {
    if (hasRequiredSearch) return search;
    hasRequiredSearch = 1;
    var List = requireList();
    function getFirstMatchNode(matchNode) {
      if ("node" in matchNode) {
        return matchNode.node;
      }
      return getFirstMatchNode(matchNode.match[0]);
    }
    function getLastMatchNode(matchNode) {
      if ("node" in matchNode) {
        return matchNode.node;
      }
      return getLastMatchNode(matchNode.match[matchNode.match.length - 1]);
    }
    function matchFragments(lexer2, ast, match2, type, name) {
      function findFragments(matchNode) {
        if (matchNode.syntax !== null && matchNode.syntax.type === type && matchNode.syntax.name === name) {
          var start = getFirstMatchNode(matchNode);
          var end = getLastMatchNode(matchNode);
          lexer2.syntax.walk(ast, function(node2, item, list) {
            if (node2 === start) {
              var nodes = new List();
              do {
                nodes.appendData(item.data);
                if (item.data === end) {
                  break;
                }
                item = item.next;
              } while (item !== null);
              fragments.push({
                parent: list,
                nodes
              });
            }
          });
        }
        if (Array.isArray(matchNode.match)) {
          matchNode.match.forEach(findFragments);
        }
      }
      var fragments = [];
      if (match2.matched !== null) {
        findFragments(match2.matched);
      }
      return fragments;
    }
    search = {
      matchFragments
    };
    return search;
  }
  var structure;
  var hasRequiredStructure;
  function requireStructure() {
    if (hasRequiredStructure) return structure;
    hasRequiredStructure = 1;
    var List = requireList();
    var hasOwnProperty = Object.prototype.hasOwnProperty;
    function isValidNumber(value2) {
      return typeof value2 === "number" && isFinite(value2) && Math.floor(value2) === value2 && value2 >= 0;
    }
    function isValidLocation(loc) {
      return Boolean(loc) && isValidNumber(loc.offset) && isValidNumber(loc.line) && isValidNumber(loc.column);
    }
    function createNodeStructureChecker(type, fields) {
      return function checkNode(node2, warn) {
        if (!node2 || node2.constructor !== Object) {
          return warn(node2, "Type of node should be an Object");
        }
        for (var key in node2) {
          var valid = true;
          if (hasOwnProperty.call(node2, key) === false) {
            continue;
          }
          if (key === "type") {
            if (node2.type !== type) {
              warn(node2, "Wrong node type `" + node2.type + "`, expected `" + type + "`");
            }
          } else if (key === "loc") {
            if (node2.loc === null) {
              continue;
            } else if (node2.loc && node2.loc.constructor === Object) {
              if (typeof node2.loc.source !== "string") {
                key += ".source";
              } else if (!isValidLocation(node2.loc.start)) {
                key += ".start";
              } else if (!isValidLocation(node2.loc.end)) {
                key += ".end";
              } else {
                continue;
              }
            }
            valid = false;
          } else if (fields.hasOwnProperty(key)) {
            for (var i = 0, valid = false; !valid && i < fields[key].length; i++) {
              var fieldType = fields[key][i];
              switch (fieldType) {
                case String:
                  valid = typeof node2[key] === "string";
                  break;
                case Boolean:
                  valid = typeof node2[key] === "boolean";
                  break;
                case null:
                  valid = node2[key] === null;
                  break;
                default:
                  if (typeof fieldType === "string") {
                    valid = node2[key] && node2[key].type === fieldType;
                  } else if (Array.isArray(fieldType)) {
                    valid = node2[key] instanceof List;
                  }
              }
            }
          } else {
            warn(node2, "Unknown field `" + key + "` for " + type + " node type");
          }
          if (!valid) {
            warn(node2, "Bad value for `" + type + "." + key + "`");
          }
        }
        for (var key in fields) {
          if (hasOwnProperty.call(fields, key) && hasOwnProperty.call(node2, key) === false) {
            warn(node2, "Field `" + type + "." + key + "` is missed");
          }
        }
      };
    }
    function processStructure(name, nodeType) {
      var structure2 = nodeType.structure;
      var fields = {
        type: String,
        loc: true
      };
      var docs = {
        type: '"' + name + '"'
      };
      for (var key in structure2) {
        if (hasOwnProperty.call(structure2, key) === false) {
          continue;
        }
        var docsTypes = [];
        var fieldTypes = fields[key] = Array.isArray(structure2[key]) ? structure2[key].slice() : [structure2[key]];
        for (var i = 0; i < fieldTypes.length; i++) {
          var fieldType = fieldTypes[i];
          if (fieldType === String || fieldType === Boolean) {
            docsTypes.push(fieldType.name);
          } else if (fieldType === null) {
            docsTypes.push("null");
          } else if (typeof fieldType === "string") {
            docsTypes.push("<" + fieldType + ">");
          } else if (Array.isArray(fieldType)) {
            docsTypes.push("List");
          } else {
            throw new Error("Wrong value `" + fieldType + "` in `" + name + "." + key + "` structure definition");
          }
        }
        docs[key] = docsTypes.join(" | ");
      }
      return {
        docs,
        check: createNodeStructureChecker(name, fields)
      };
    }
    structure = {
      getStructureFromConfig: function(config) {
        var structure2 = {};
        if (config.node) {
          for (var name in config.node) {
            if (hasOwnProperty.call(config.node, name)) {
              var nodeType = config.node[name];
              if (nodeType.structure) {
                structure2[name] = processStructure(name, nodeType);
              } else {
                throw new Error("Missed `structure` field in `" + name + "` node type definition");
              }
            }
          }
        }
        return structure2;
      }
    };
    return structure;
  }
  var Lexer_1;
  var hasRequiredLexer$1;
  function requireLexer$1() {
    if (hasRequiredLexer$1) return Lexer_1;
    hasRequiredLexer$1 = 1;
    var SyntaxReferenceError = requireError().SyntaxReferenceError;
    var MatchError = requireError().MatchError;
    var names2 = requireNames();
    var generic2 = requireGeneric();
    var parse2 = requireParse();
    var generate = requireGenerate();
    var walk2 = requireWalk();
    var prepareTokens = requirePrepareTokens();
    var buildMatchGraph = requireMatchGraph().buildMatchGraph;
    var matchAsTree = requireMatch().matchAsTree;
    var trace2 = requireTrace();
    var search2 = requireSearch();
    var getStructureFromConfig = requireStructure().getStructureFromConfig;
    var cssWideKeywords = buildMatchGraph("inherit | initial | unset");
    var cssWideKeywordsWithExpression = buildMatchGraph("inherit | initial | unset | <-ms-legacy-expression>");
    function dumpMapSyntax(map, compact, syntaxAsAst) {
      var result2 = {};
      for (var name in map) {
        if (map[name].syntax) {
          result2[name] = syntaxAsAst ? map[name].syntax : generate(map[name].syntax, { compact });
        }
      }
      return result2;
    }
    function valueHasVar(tokens) {
      for (var i = 0; i < tokens.length; i++) {
        if (tokens[i].value.toLowerCase() === "var(") {
          return true;
        }
      }
      return false;
    }
    function buildMatchResult(match2, error2, iterations) {
      return {
        matched: match2,
        iterations,
        error: error2,
        getTrace: trace2.getTrace,
        isType: trace2.isType,
        isProperty: trace2.isProperty,
        isKeyword: trace2.isKeyword
      };
    }
    function matchSyntax(lexer2, syntax2, value2, useCommon) {
      var tokens = prepareTokens(value2, lexer2.syntax);
      var result2;
      if (valueHasVar(tokens)) {
        return buildMatchResult(null, new Error("Matching for a tree with var() is not supported"));
      }
      if (useCommon) {
        result2 = matchAsTree(tokens, lexer2.valueCommonSyntax, lexer2);
      }
      if (!useCommon || !result2.match) {
        result2 = matchAsTree(tokens, syntax2.match, lexer2);
        if (!result2.match) {
          return buildMatchResult(
            null,
            new MatchError(result2.reason, syntax2.syntax, value2, result2),
            result2.iterations
          );
        }
      }
      return buildMatchResult(result2.match, null, result2.iterations);
    }
    var Lexer = function(config, syntax2, structure2) {
      this.valueCommonSyntax = cssWideKeywords;
      this.syntax = syntax2;
      this.generic = false;
      this.atrules = {};
      this.properties = {};
      this.types = {};
      this.structure = structure2 || getStructureFromConfig(config);
      if (config) {
        if (config.types) {
          for (var name in config.types) {
            this.addType_(name, config.types[name]);
          }
        }
        if (config.generic) {
          this.generic = true;
          for (var name in generic2) {
            this.addType_(name, generic2[name]);
          }
        }
        if (config.atrules) {
          for (var name in config.atrules) {
            this.addAtrule_(name, config.atrules[name]);
          }
        }
        if (config.properties) {
          for (var name in config.properties) {
            this.addProperty_(name, config.properties[name]);
          }
        }
      }
    };
    Lexer.prototype = {
      structure: {},
      checkStructure: function(ast) {
        function collectWarning(node2, message) {
          warns.push({
            node: node2,
            message
          });
        }
        var structure2 = this.structure;
        var warns = [];
        this.syntax.walk(ast, function(node2) {
          if (structure2.hasOwnProperty(node2.type)) {
            structure2[node2.type].check(node2, collectWarning);
          } else {
            collectWarning(node2, "Unknown node type `" + node2.type + "`");
          }
        });
        return warns.length ? warns : false;
      },
      createDescriptor: function(syntax2, type, name) {
        var ref = {
          type,
          name
        };
        var descriptor = {
          type,
          name,
          syntax: null,
          match: null
        };
        if (typeof syntax2 === "function") {
          descriptor.match = buildMatchGraph(syntax2, ref);
        } else {
          if (typeof syntax2 === "string") {
            Object.defineProperty(descriptor, "syntax", {
              get: function() {
                Object.defineProperty(descriptor, "syntax", {
                  value: parse2(syntax2)
                });
                return descriptor.syntax;
              }
            });
          } else {
            descriptor.syntax = syntax2;
          }
          Object.defineProperty(descriptor, "match", {
            get: function() {
              Object.defineProperty(descriptor, "match", {
                value: buildMatchGraph(descriptor.syntax, ref)
              });
              return descriptor.match;
            }
          });
        }
        return descriptor;
      },
      addAtrule_: function(name, syntax2) {
        this.atrules[name] = {
          prelude: syntax2.prelude ? this.createDescriptor(syntax2.prelude, "AtrulePrelude", name) : null,
          descriptors: syntax2.descriptors ? Object.keys(syntax2.descriptors).reduce((res, name2) => {
            res[name2] = this.createDescriptor(syntax2.descriptors[name2], "AtruleDescriptor", name2);
            return res;
          }, {}) : null
        };
      },
      addProperty_: function(name, syntax2) {
        this.properties[name] = this.createDescriptor(syntax2, "Property", name);
      },
      addType_: function(name, syntax2) {
        this.types[name] = this.createDescriptor(syntax2, "Type", name);
        if (syntax2 === generic2["-ms-legacy-expression"]) {
          this.valueCommonSyntax = cssWideKeywordsWithExpression;
        }
      },
      matchAtrulePrelude: function(atruleName, prelude) {
        var atrule2 = names2.keyword(atruleName);
        var atrulePreludeSyntax = atrule2.vendor ? this.getAtrulePrelude(atrule2.name) || this.getAtrulePrelude(atrule2.basename) : this.getAtrulePrelude(atrule2.name);
        if (!atrulePreludeSyntax) {
          if (atrule2.basename in this.atrules) {
            return buildMatchResult(null, new Error("At-rule `" + atruleName + "` should not contain a prelude"));
          }
          return buildMatchResult(null, new SyntaxReferenceError("Unknown at-rule", atruleName));
        }
        return matchSyntax(this, atrulePreludeSyntax, prelude, true);
      },
      matchAtruleDescriptor: function(atruleName, descriptorName, value2) {
        var atrule2 = names2.keyword(atruleName);
        var descriptor = names2.keyword(descriptorName);
        var atruleEntry = atrule2.vendor ? this.atrules[atrule2.name] || this.atrules[atrule2.basename] : this.atrules[atrule2.name];
        if (!atruleEntry) {
          return buildMatchResult(null, new SyntaxReferenceError("Unknown at-rule", atruleName));
        }
        if (!atruleEntry.descriptors) {
          return buildMatchResult(null, new Error("At-rule `" + atruleName + "` has no known descriptors"));
        }
        var atruleDescriptorSyntax = descriptor.vendor ? atruleEntry.descriptors[descriptor.name] || atruleEntry.descriptors[descriptor.basename] : atruleEntry.descriptors[descriptor.name];
        if (!atruleDescriptorSyntax) {
          return buildMatchResult(null, new SyntaxReferenceError("Unknown at-rule descriptor", descriptorName));
        }
        return matchSyntax(this, atruleDescriptorSyntax, value2, true);
      },
      matchDeclaration: function(node2) {
        if (node2.type !== "Declaration") {
          return buildMatchResult(null, new Error("Not a Declaration node"));
        }
        return this.matchProperty(node2.property, node2.value);
      },
      matchProperty: function(propertyName, value2) {
        var property = names2.property(propertyName);
        if (property.custom) {
          return buildMatchResult(null, new Error("Lexer matching doesn't applicable for custom properties"));
        }
        var propertySyntax = property.vendor ? this.getProperty(property.name) || this.getProperty(property.basename) : this.getProperty(property.name);
        if (!propertySyntax) {
          return buildMatchResult(null, new SyntaxReferenceError("Unknown property", propertyName));
        }
        return matchSyntax(this, propertySyntax, value2, true);
      },
      matchType: function(typeName, value2) {
        var typeSyntax = this.getType(typeName);
        if (!typeSyntax) {
          return buildMatchResult(null, new SyntaxReferenceError("Unknown type", typeName));
        }
        return matchSyntax(this, typeSyntax, value2, false);
      },
      match: function(syntax2, value2) {
        if (typeof syntax2 !== "string" && (!syntax2 || !syntax2.type)) {
          return buildMatchResult(null, new SyntaxReferenceError("Bad syntax"));
        }
        if (typeof syntax2 === "string" || !syntax2.match) {
          syntax2 = this.createDescriptor(syntax2, "Type", "anonymous");
        }
        return matchSyntax(this, syntax2, value2, false);
      },
      findValueFragments: function(propertyName, value2, type, name) {
        return search2.matchFragments(this, value2, this.matchProperty(propertyName, value2), type, name);
      },
      findDeclarationValueFragments: function(declaration, type, name) {
        return search2.matchFragments(this, declaration.value, this.matchDeclaration(declaration), type, name);
      },
      findAllFragments: function(ast, type, name) {
        var result2 = [];
        this.syntax.walk(ast, {
          visit: "Declaration",
          enter: (function(declaration) {
            result2.push.apply(result2, this.findDeclarationValueFragments(declaration, type, name));
          }).bind(this)
        });
        return result2;
      },
      getAtrulePrelude: function(atruleName) {
        return this.atrules.hasOwnProperty(atruleName) ? this.atrules[atruleName].prelude : null;
      },
      getAtruleDescriptor: function(atruleName, name) {
        return this.atrules.hasOwnProperty(atruleName) && this.atrules.declarators ? this.atrules[atruleName].declarators[name] || null : null;
      },
      getProperty: function(name) {
        return this.properties.hasOwnProperty(name) ? this.properties[name] : null;
      },
      getType: function(name) {
        return this.types.hasOwnProperty(name) ? this.types[name] : null;
      },
      validate: function() {
        function validate(syntax2, name, broken, descriptor) {
          if (broken.hasOwnProperty(name)) {
            return broken[name];
          }
          broken[name] = false;
          if (descriptor.syntax !== null) {
            walk2(descriptor.syntax, function(node2) {
              if (node2.type !== "Type" && node2.type !== "Property") {
                return;
              }
              var map = node2.type === "Type" ? syntax2.types : syntax2.properties;
              var brokenMap = node2.type === "Type" ? brokenTypes : brokenProperties;
              if (!map.hasOwnProperty(node2.name) || validate(syntax2, node2.name, brokenMap, map[node2.name])) {
                broken[name] = true;
              }
            }, this);
          }
        }
        var brokenTypes = {};
        var brokenProperties = {};
        for (var key in this.types) {
          validate(this, key, brokenTypes, this.types[key]);
        }
        for (var key in this.properties) {
          validate(this, key, brokenProperties, this.properties[key]);
        }
        brokenTypes = Object.keys(brokenTypes).filter(function(name) {
          return brokenTypes[name];
        });
        brokenProperties = Object.keys(brokenProperties).filter(function(name) {
          return brokenProperties[name];
        });
        if (brokenTypes.length || brokenProperties.length) {
          return {
            types: brokenTypes,
            properties: brokenProperties
          };
        }
        return null;
      },
      dump: function(syntaxAsAst, pretty) {
        return {
          generic: this.generic,
          types: dumpMapSyntax(this.types, !pretty, syntaxAsAst),
          properties: dumpMapSyntax(this.properties, !pretty, syntaxAsAst)
        };
      },
      toString: function() {
        return JSON.stringify(this.dump());
      }
    };
    Lexer_1 = Lexer;
    return Lexer_1;
  }
  var definitionSyntax;
  var hasRequiredDefinitionSyntax;
  function requireDefinitionSyntax() {
    if (hasRequiredDefinitionSyntax) return definitionSyntax;
    hasRequiredDefinitionSyntax = 1;
    definitionSyntax = {
      SyntaxError: require_SyntaxError(),
      parse: requireParse(),
      generate: requireGenerate(),
      walk: requireWalk()
    };
    return definitionSyntax;
  }
  var OffsetToLocation_1;
  var hasRequiredOffsetToLocation;
  function requireOffsetToLocation() {
    if (hasRequiredOffsetToLocation) return OffsetToLocation_1;
    hasRequiredOffsetToLocation = 1;
    var adoptBuffer2 = requireAdoptBuffer();
    var isBOM = requireTokenizer$1().isBOM;
    var N = 10;
    var F = 12;
    var R = 13;
    function computeLinesAndColumns(host, source) {
      var sourceLength = source.length;
      var lines = adoptBuffer2(host.lines, sourceLength);
      var line = host.startLine;
      var columns = adoptBuffer2(host.columns, sourceLength);
      var column = host.startColumn;
      var startOffset = source.length > 0 ? isBOM(source.charCodeAt(0)) : 0;
      for (var i = startOffset; i < sourceLength; i++) {
        var code = source.charCodeAt(i);
        lines[i] = line;
        columns[i] = column++;
        if (code === N || code === R || code === F) {
          if (code === R && i + 1 < sourceLength && source.charCodeAt(i + 1) === N) {
            i++;
            lines[i] = line;
            columns[i] = column;
          }
          line++;
          column = 1;
        }
      }
      lines[i] = line;
      columns[i] = column;
      host.lines = lines;
      host.columns = columns;
    }
    var OffsetToLocation = function() {
      this.lines = null;
      this.columns = null;
      this.linesAndColumnsComputed = false;
    };
    OffsetToLocation.prototype = {
      setSource: function(source, startOffset, startLine, startColumn) {
        this.source = source;
        this.startOffset = typeof startOffset === "undefined" ? 0 : startOffset;
        this.startLine = typeof startLine === "undefined" ? 1 : startLine;
        this.startColumn = typeof startColumn === "undefined" ? 1 : startColumn;
        this.linesAndColumnsComputed = false;
      },
      ensureLinesAndColumnsComputed: function() {
        if (!this.linesAndColumnsComputed) {
          computeLinesAndColumns(this, this.source);
          this.linesAndColumnsComputed = true;
        }
      },
      getLocation: function(offset, filename) {
        this.ensureLinesAndColumnsComputed();
        return {
          source: filename,
          offset: this.startOffset + offset,
          line: this.lines[offset],
          column: this.columns[offset]
        };
      },
      getLocationRange: function(start, end, filename) {
        this.ensureLinesAndColumnsComputed();
        return {
          source: filename,
          start: {
            offset: this.startOffset + start,
            line: this.lines[start],
            column: this.columns[start]
          },
          end: {
            offset: this.startOffset + end,
            line: this.lines[end],
            column: this.columns[end]
          }
        };
      }
    };
    OffsetToLocation_1 = OffsetToLocation;
    return OffsetToLocation_1;
  }
  var sequence;
  var hasRequiredSequence;
  function requireSequence() {
    if (hasRequiredSequence) return sequence;
    hasRequiredSequence = 1;
    var TYPE = requireTokenizer$1().TYPE;
    var WHITESPACE = TYPE.WhiteSpace;
    var COMMENT = TYPE.Comment;
    sequence = function readSequence(recognizer) {
      var children = this.createList();
      var child2 = null;
      var context = {
        recognizer,
        space: null,
        ignoreWS: false,
        ignoreWSAfter: false
      };
      this.scanner.skipSC();
      while (!this.scanner.eof) {
        switch (this.scanner.tokenType) {
          case COMMENT:
            this.scanner.next();
            continue;
          case WHITESPACE:
            if (context.ignoreWS) {
              this.scanner.next();
            } else {
              context.space = this.WhiteSpace();
            }
            continue;
        }
        child2 = recognizer.getNode.call(this, context);
        if (child2 === void 0) {
          break;
        }
        if (context.space !== null) {
          children.push(context.space);
          context.space = null;
        }
        children.push(child2);
        if (context.ignoreWSAfter) {
          context.ignoreWSAfter = false;
          context.ignoreWS = true;
        } else {
          context.ignoreWS = false;
        }
      }
      return children;
    };
    return sequence;
  }
  var create$3;
  var hasRequiredCreate$4;
  function requireCreate$4() {
    if (hasRequiredCreate$4) return create$3;
    hasRequiredCreate$4 = 1;
    var OffsetToLocation = requireOffsetToLocation();
    var SyntaxError2 = require_SyntaxError$1();
    var TokenStream = requireTokenStream();
    var List = requireList();
    var tokenize = requireTokenizer$1();
    var constants = require_const();
    var findWhiteSpaceStart = requireUtils().findWhiteSpaceStart;
    var sequence2 = requireSequence();
    var noop = function() {
    };
    var TYPE = constants.TYPE;
    var NAME = constants.NAME;
    var WHITESPACE = TYPE.WhiteSpace;
    var IDENT = TYPE.Ident;
    var FUNCTION = TYPE.Function;
    var URL = TYPE.Url;
    var HASH = TYPE.Hash;
    var PERCENTAGE = TYPE.Percentage;
    var NUMBER = TYPE.Number;
    var NUMBERSIGN = 35;
    var NULL = 0;
    function createParseContext(name) {
      return function() {
        return this[name]();
      };
    }
    function processConfig(config) {
      var parserConfig = {
        context: {},
        scope: {},
        atrule: {},
        pseudo: {}
      };
      if (config.parseContext) {
        for (var name in config.parseContext) {
          switch (typeof config.parseContext[name]) {
            case "function":
              parserConfig.context[name] = config.parseContext[name];
              break;
            case "string":
              parserConfig.context[name] = createParseContext(config.parseContext[name]);
              break;
          }
        }
      }
      if (config.scope) {
        for (var name in config.scope) {
          parserConfig.scope[name] = config.scope[name];
        }
      }
      if (config.atrule) {
        for (var name in config.atrule) {
          var atrule2 = config.atrule[name];
          if (atrule2.parse) {
            parserConfig.atrule[name] = atrule2.parse;
          }
        }
      }
      if (config.pseudo) {
        for (var name in config.pseudo) {
          var pseudo2 = config.pseudo[name];
          if (pseudo2.parse) {
            parserConfig.pseudo[name] = pseudo2.parse;
          }
        }
      }
      if (config.node) {
        for (var name in config.node) {
          parserConfig[name] = config.node[name].parse;
        }
      }
      return parserConfig;
    }
    create$3 = function createParser(config) {
      var parser2 = {
        scanner: new TokenStream(),
        locationMap: new OffsetToLocation(),
        filename: "<unknown>",
        needPositions: false,
        onParseError: noop,
        onParseErrorThrow: false,
        parseAtrulePrelude: true,
        parseRulePrelude: true,
        parseValue: true,
        parseCustomProperty: false,
        readSequence: sequence2,
        createList: function() {
          return new List();
        },
        createSingleNodeList: function(node2) {
          return new List().appendData(node2);
        },
        getFirstListNode: function(list) {
          return list && list.first();
        },
        getLastListNode: function(list) {
          return list.last();
        },
        parseWithFallback: function(consumer, fallback) {
          var startToken = this.scanner.tokenIndex;
          try {
            return consumer.call(this);
          } catch (e) {
            if (this.onParseErrorThrow) {
              throw e;
            }
            var fallbackNode = fallback.call(this, startToken);
            this.onParseErrorThrow = true;
            this.onParseError(e, fallbackNode);
            this.onParseErrorThrow = false;
            return fallbackNode;
          }
        },
        lookupNonWSType: function(offset) {
          do {
            var type = this.scanner.lookupType(offset++);
            if (type !== WHITESPACE) {
              return type;
            }
          } while (type !== NULL);
          return NULL;
        },
        eat: function(tokenType) {
          if (this.scanner.tokenType !== tokenType) {
            var offset = this.scanner.tokenStart;
            var message = NAME[tokenType] + " is expected";
            switch (tokenType) {
              case IDENT:
                if (this.scanner.tokenType === FUNCTION || this.scanner.tokenType === URL) {
                  offset = this.scanner.tokenEnd - 1;
                  message = "Identifier is expected but function found";
                } else {
                  message = "Identifier is expected";
                }
                break;
              case HASH:
                if (this.scanner.isDelim(NUMBERSIGN)) {
                  this.scanner.next();
                  offset++;
                  message = "Name is expected";
                }
                break;
              case PERCENTAGE:
                if (this.scanner.tokenType === NUMBER) {
                  offset = this.scanner.tokenEnd;
                  message = "Percent sign is expected";
                }
                break;
              default:
                if (this.scanner.source.charCodeAt(this.scanner.tokenStart) === tokenType) {
                  offset = offset + 1;
                }
            }
            this.error(message, offset);
          }
          this.scanner.next();
        },
        consume: function(tokenType) {
          var value2 = this.scanner.getTokenValue();
          this.eat(tokenType);
          return value2;
        },
        consumeFunctionName: function() {
          var name = this.scanner.source.substring(this.scanner.tokenStart, this.scanner.tokenEnd - 1);
          this.eat(FUNCTION);
          return name;
        },
        getLocation: function(start, end) {
          if (this.needPositions) {
            return this.locationMap.getLocationRange(
              start,
              end,
              this.filename
            );
          }
          return null;
        },
        getLocationFromList: function(list) {
          if (this.needPositions) {
            var head = this.getFirstListNode(list);
            var tail = this.getLastListNode(list);
            return this.locationMap.getLocationRange(
              head !== null ? head.loc.start.offset - this.locationMap.startOffset : this.scanner.tokenStart,
              tail !== null ? tail.loc.end.offset - this.locationMap.startOffset : this.scanner.tokenStart,
              this.filename
            );
          }
          return null;
        },
        error: function(message, offset) {
          var location = typeof offset !== "undefined" && offset < this.scanner.source.length ? this.locationMap.getLocation(offset) : this.scanner.eof ? this.locationMap.getLocation(findWhiteSpaceStart(this.scanner.source, this.scanner.source.length - 1)) : this.locationMap.getLocation(this.scanner.tokenStart);
          throw new SyntaxError2(
            message || "Unexpected input",
            this.scanner.source,
            location.offset,
            location.line,
            location.column
          );
        }
      };
      config = processConfig(config || {});
      for (var key in config) {
        parser2[key] = config[key];
      }
      return function(source, options) {
        options = options || {};
        var context = options.context || "default";
        var ast;
        tokenize(source, parser2.scanner);
        parser2.locationMap.setSource(
          source,
          options.offset,
          options.line,
          options.column
        );
        parser2.filename = options.filename || "<unknown>";
        parser2.needPositions = Boolean(options.positions);
        parser2.onParseError = typeof options.onParseError === "function" ? options.onParseError : noop;
        parser2.onParseErrorThrow = false;
        parser2.parseAtrulePrelude = "parseAtrulePrelude" in options ? Boolean(options.parseAtrulePrelude) : true;
        parser2.parseRulePrelude = "parseRulePrelude" in options ? Boolean(options.parseRulePrelude) : true;
        parser2.parseValue = "parseValue" in options ? Boolean(options.parseValue) : true;
        parser2.parseCustomProperty = "parseCustomProperty" in options ? Boolean(options.parseCustomProperty) : false;
        if (!parser2.context.hasOwnProperty(context)) {
          throw new Error("Unknown context `" + context + "`");
        }
        ast = parser2.context[context].call(parser2, options);
        if (!parser2.scanner.eof) {
          parser2.error();
        }
        return ast;
      };
    };
    return create$3;
  }
  var sourceMapGenerator = {};
  var base64Vlq = {};
  var base64 = {};
  var hasRequiredBase64;
  function requireBase64() {
    if (hasRequiredBase64) return base64;
    hasRequiredBase64 = 1;
    var intToCharMap = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".split("");
    base64.encode = function(number) {
      if (0 <= number && number < intToCharMap.length) {
        return intToCharMap[number];
      }
      throw new TypeError("Must be between 0 and 63: " + number);
    };
    base64.decode = function(charCode) {
      var bigA = 65;
      var bigZ = 90;
      var littleA = 97;
      var littleZ = 122;
      var zero = 48;
      var nine = 57;
      var plus = 43;
      var slash = 47;
      var littleOffset = 26;
      var numberOffset = 52;
      if (bigA <= charCode && charCode <= bigZ) {
        return charCode - bigA;
      }
      if (littleA <= charCode && charCode <= littleZ) {
        return charCode - littleA + littleOffset;
      }
      if (zero <= charCode && charCode <= nine) {
        return charCode - zero + numberOffset;
      }
      if (charCode == plus) {
        return 62;
      }
      if (charCode == slash) {
        return 63;
      }
      return -1;
    };
    return base64;
  }
  var hasRequiredBase64Vlq;
  function requireBase64Vlq() {
    if (hasRequiredBase64Vlq) return base64Vlq;
    hasRequiredBase64Vlq = 1;
    var base642 = requireBase64();
    var VLQ_BASE_SHIFT = 5;
    var VLQ_BASE = 1 << VLQ_BASE_SHIFT;
    var VLQ_BASE_MASK = VLQ_BASE - 1;
    var VLQ_CONTINUATION_BIT = VLQ_BASE;
    function toVLQSigned(aValue) {
      return aValue < 0 ? (-aValue << 1) + 1 : (aValue << 1) + 0;
    }
    function fromVLQSigned(aValue) {
      var isNegative = (aValue & 1) === 1;
      var shifted = aValue >> 1;
      return isNegative ? -shifted : shifted;
    }
    base64Vlq.encode = function base64VLQ_encode(aValue) {
      var encoded = "";
      var digit;
      var vlq = toVLQSigned(aValue);
      do {
        digit = vlq & VLQ_BASE_MASK;
        vlq >>>= VLQ_BASE_SHIFT;
        if (vlq > 0) {
          digit |= VLQ_CONTINUATION_BIT;
        }
        encoded += base642.encode(digit);
      } while (vlq > 0);
      return encoded;
    };
    base64Vlq.decode = function base64VLQ_decode(aStr, aIndex, aOutParam) {
      var strLen = aStr.length;
      var result2 = 0;
      var shift = 0;
      var continuation, digit;
      do {
        if (aIndex >= strLen) {
          throw new Error("Expected more digits in base 64 VLQ value.");
        }
        digit = base642.decode(aStr.charCodeAt(aIndex++));
        if (digit === -1) {
          throw new Error("Invalid base64 digit: " + aStr.charAt(aIndex - 1));
        }
        continuation = !!(digit & VLQ_CONTINUATION_BIT);
        digit &= VLQ_BASE_MASK;
        result2 = result2 + (digit << shift);
        shift += VLQ_BASE_SHIFT;
      } while (continuation);
      aOutParam.value = fromVLQSigned(result2);
      aOutParam.rest = aIndex;
    };
    return base64Vlq;
  }
  var util = {};
  var hasRequiredUtil;
  function requireUtil() {
    if (hasRequiredUtil) return util;
    hasRequiredUtil = 1;
    (function(exports) {
      function getArg(aArgs, aName, aDefaultValue) {
        if (aName in aArgs) {
          return aArgs[aName];
        } else if (arguments.length === 3) {
          return aDefaultValue;
        } else {
          throw new Error('"' + aName + '" is a required argument.');
        }
      }
      exports.getArg = getArg;
      var urlRegexp = /^(?:([\w+\-.]+):)?\/\/(?:(\w+:\w+)@)?([\w.-]*)(?::(\d+))?(.*)$/;
      var dataUrlRegexp = /^data:.+\,.+$/;
      function urlParse(aUrl) {
        var match2 = aUrl.match(urlRegexp);
        if (!match2) {
          return null;
        }
        return {
          scheme: match2[1],
          auth: match2[2],
          host: match2[3],
          port: match2[4],
          path: match2[5]
        };
      }
      exports.urlParse = urlParse;
      function urlGenerate(aParsedUrl) {
        var url = "";
        if (aParsedUrl.scheme) {
          url += aParsedUrl.scheme + ":";
        }
        url += "//";
        if (aParsedUrl.auth) {
          url += aParsedUrl.auth + "@";
        }
        if (aParsedUrl.host) {
          url += aParsedUrl.host;
        }
        if (aParsedUrl.port) {
          url += ":" + aParsedUrl.port;
        }
        if (aParsedUrl.path) {
          url += aParsedUrl.path;
        }
        return url;
      }
      exports.urlGenerate = urlGenerate;
      function normalize(aPath) {
        var path = aPath;
        var url = urlParse(aPath);
        if (url) {
          if (!url.path) {
            return aPath;
          }
          path = url.path;
        }
        var isAbsolute = exports.isAbsolute(path);
        var parts = path.split(/\/+/);
        for (var part, up = 0, i = parts.length - 1; i >= 0; i--) {
          part = parts[i];
          if (part === ".") {
            parts.splice(i, 1);
          } else if (part === "..") {
            up++;
          } else if (up > 0) {
            if (part === "") {
              parts.splice(i + 1, up);
              up = 0;
            } else {
              parts.splice(i, 2);
              up--;
            }
          }
        }
        path = parts.join("/");
        if (path === "") {
          path = isAbsolute ? "/" : ".";
        }
        if (url) {
          url.path = path;
          return urlGenerate(url);
        }
        return path;
      }
      exports.normalize = normalize;
      function join(aRoot, aPath) {
        if (aRoot === "") {
          aRoot = ".";
        }
        if (aPath === "") {
          aPath = ".";
        }
        var aPathUrl = urlParse(aPath);
        var aRootUrl = urlParse(aRoot);
        if (aRootUrl) {
          aRoot = aRootUrl.path || "/";
        }
        if (aPathUrl && !aPathUrl.scheme) {
          if (aRootUrl) {
            aPathUrl.scheme = aRootUrl.scheme;
          }
          return urlGenerate(aPathUrl);
        }
        if (aPathUrl || aPath.match(dataUrlRegexp)) {
          return aPath;
        }
        if (aRootUrl && !aRootUrl.host && !aRootUrl.path) {
          aRootUrl.host = aPath;
          return urlGenerate(aRootUrl);
        }
        var joined = aPath.charAt(0) === "/" ? aPath : normalize(aRoot.replace(/\/+$/, "") + "/" + aPath);
        if (aRootUrl) {
          aRootUrl.path = joined;
          return urlGenerate(aRootUrl);
        }
        return joined;
      }
      exports.join = join;
      exports.isAbsolute = function(aPath) {
        return aPath.charAt(0) === "/" || urlRegexp.test(aPath);
      };
      function relative(aRoot, aPath) {
        if (aRoot === "") {
          aRoot = ".";
        }
        aRoot = aRoot.replace(/\/$/, "");
        var level = 0;
        while (aPath.indexOf(aRoot + "/") !== 0) {
          var index2 = aRoot.lastIndexOf("/");
          if (index2 < 0) {
            return aPath;
          }
          aRoot = aRoot.slice(0, index2);
          if (aRoot.match(/^([^\/]+:\/)?\/*$/)) {
            return aPath;
          }
          ++level;
        }
        return Array(level + 1).join("../") + aPath.substr(aRoot.length + 1);
      }
      exports.relative = relative;
      var supportsNullProto = (function() {
        var obj = /* @__PURE__ */ Object.create(null);
        return !("__proto__" in obj);
      })();
      function identity(s) {
        return s;
      }
      function toSetString(aStr) {
        if (isProtoString(aStr)) {
          return "$" + aStr;
        }
        return aStr;
      }
      exports.toSetString = supportsNullProto ? identity : toSetString;
      function fromSetString(aStr) {
        if (isProtoString(aStr)) {
          return aStr.slice(1);
        }
        return aStr;
      }
      exports.fromSetString = supportsNullProto ? identity : fromSetString;
      function isProtoString(s) {
        if (!s) {
          return false;
        }
        var length = s.length;
        if (length < 9) {
          return false;
        }
        if (s.charCodeAt(length - 1) !== 95 || s.charCodeAt(length - 2) !== 95 || s.charCodeAt(length - 3) !== 111 || s.charCodeAt(length - 4) !== 116 || s.charCodeAt(length - 5) !== 111 || s.charCodeAt(length - 6) !== 114 || s.charCodeAt(length - 7) !== 112 || s.charCodeAt(length - 8) !== 95 || s.charCodeAt(length - 9) !== 95) {
          return false;
        }
        for (var i = length - 10; i >= 0; i--) {
          if (s.charCodeAt(i) !== 36) {
            return false;
          }
        }
        return true;
      }
      function compareByOriginalPositions(mappingA, mappingB, onlyCompareOriginal) {
        var cmp = strcmp(mappingA.source, mappingB.source);
        if (cmp !== 0) {
          return cmp;
        }
        cmp = mappingA.originalLine - mappingB.originalLine;
        if (cmp !== 0) {
          return cmp;
        }
        cmp = mappingA.originalColumn - mappingB.originalColumn;
        if (cmp !== 0 || onlyCompareOriginal) {
          return cmp;
        }
        cmp = mappingA.generatedColumn - mappingB.generatedColumn;
        if (cmp !== 0) {
          return cmp;
        }
        cmp = mappingA.generatedLine - mappingB.generatedLine;
        if (cmp !== 0) {
          return cmp;
        }
        return strcmp(mappingA.name, mappingB.name);
      }
      exports.compareByOriginalPositions = compareByOriginalPositions;
      function compareByGeneratedPositionsDeflated(mappingA, mappingB, onlyCompareGenerated) {
        var cmp = mappingA.generatedLine - mappingB.generatedLine;
        if (cmp !== 0) {
          return cmp;
        }
        cmp = mappingA.generatedColumn - mappingB.generatedColumn;
        if (cmp !== 0 || onlyCompareGenerated) {
          return cmp;
        }
        cmp = strcmp(mappingA.source, mappingB.source);
        if (cmp !== 0) {
          return cmp;
        }
        cmp = mappingA.originalLine - mappingB.originalLine;
        if (cmp !== 0) {
          return cmp;
        }
        cmp = mappingA.originalColumn - mappingB.originalColumn;
        if (cmp !== 0) {
          return cmp;
        }
        return strcmp(mappingA.name, mappingB.name);
      }
      exports.compareByGeneratedPositionsDeflated = compareByGeneratedPositionsDeflated;
      function strcmp(aStr1, aStr2) {
        if (aStr1 === aStr2) {
          return 0;
        }
        if (aStr1 === null) {
          return 1;
        }
        if (aStr2 === null) {
          return -1;
        }
        if (aStr1 > aStr2) {
          return 1;
        }
        return -1;
      }
      function compareByGeneratedPositionsInflated(mappingA, mappingB) {
        var cmp = mappingA.generatedLine - mappingB.generatedLine;
        if (cmp !== 0) {
          return cmp;
        }
        cmp = mappingA.generatedColumn - mappingB.generatedColumn;
        if (cmp !== 0) {
          return cmp;
        }
        cmp = strcmp(mappingA.source, mappingB.source);
        if (cmp !== 0) {
          return cmp;
        }
        cmp = mappingA.originalLine - mappingB.originalLine;
        if (cmp !== 0) {
          return cmp;
        }
        cmp = mappingA.originalColumn - mappingB.originalColumn;
        if (cmp !== 0) {
          return cmp;
        }
        return strcmp(mappingA.name, mappingB.name);
      }
      exports.compareByGeneratedPositionsInflated = compareByGeneratedPositionsInflated;
      function parseSourceMapInput(str) {
        return JSON.parse(str.replace(/^\)]}'[^\n]*\n/, ""));
      }
      exports.parseSourceMapInput = parseSourceMapInput;
      function computeSourceURL(sourceRoot, sourceURL, sourceMapURL) {
        sourceURL = sourceURL || "";
        if (sourceRoot) {
          if (sourceRoot[sourceRoot.length - 1] !== "/" && sourceURL[0] !== "/") {
            sourceRoot += "/";
          }
          sourceURL = sourceRoot + sourceURL;
        }
        if (sourceMapURL) {
          var parsed = urlParse(sourceMapURL);
          if (!parsed) {
            throw new Error("sourceMapURL could not be parsed");
          }
          if (parsed.path) {
            var index2 = parsed.path.lastIndexOf("/");
            if (index2 >= 0) {
              parsed.path = parsed.path.substring(0, index2 + 1);
            }
          }
          sourceURL = join(urlGenerate(parsed), sourceURL);
        }
        return normalize(sourceURL);
      }
      exports.computeSourceURL = computeSourceURL;
    })(util);
    return util;
  }
  var arraySet = {};
  var hasRequiredArraySet;
  function requireArraySet() {
    if (hasRequiredArraySet) return arraySet;
    hasRequiredArraySet = 1;
    var util2 = requireUtil();
    var has2 = Object.prototype.hasOwnProperty;
    var hasNativeMap = typeof Map !== "undefined";
    function ArraySet() {
      this._array = [];
      this._set = hasNativeMap ? /* @__PURE__ */ new Map() : /* @__PURE__ */ Object.create(null);
    }
    ArraySet.fromArray = function ArraySet_fromArray(aArray, aAllowDuplicates) {
      var set = new ArraySet();
      for (var i = 0, len = aArray.length; i < len; i++) {
        set.add(aArray[i], aAllowDuplicates);
      }
      return set;
    };
    ArraySet.prototype.size = function ArraySet_size() {
      return hasNativeMap ? this._set.size : Object.getOwnPropertyNames(this._set).length;
    };
    ArraySet.prototype.add = function ArraySet_add(aStr, aAllowDuplicates) {
      var sStr = hasNativeMap ? aStr : util2.toSetString(aStr);
      var isDuplicate = hasNativeMap ? this.has(aStr) : has2.call(this._set, sStr);
      var idx = this._array.length;
      if (!isDuplicate || aAllowDuplicates) {
        this._array.push(aStr);
      }
      if (!isDuplicate) {
        if (hasNativeMap) {
          this._set.set(aStr, idx);
        } else {
          this._set[sStr] = idx;
        }
      }
    };
    ArraySet.prototype.has = function ArraySet_has(aStr) {
      if (hasNativeMap) {
        return this._set.has(aStr);
      } else {
        var sStr = util2.toSetString(aStr);
        return has2.call(this._set, sStr);
      }
    };
    ArraySet.prototype.indexOf = function ArraySet_indexOf(aStr) {
      if (hasNativeMap) {
        var idx = this._set.get(aStr);
        if (idx >= 0) {
          return idx;
        }
      } else {
        var sStr = util2.toSetString(aStr);
        if (has2.call(this._set, sStr)) {
          return this._set[sStr];
        }
      }
      throw new Error('"' + aStr + '" is not in the set.');
    };
    ArraySet.prototype.at = function ArraySet_at(aIdx) {
      if (aIdx >= 0 && aIdx < this._array.length) {
        return this._array[aIdx];
      }
      throw new Error("No element indexed by " + aIdx);
    };
    ArraySet.prototype.toArray = function ArraySet_toArray() {
      return this._array.slice();
    };
    arraySet.ArraySet = ArraySet;
    return arraySet;
  }
  var mappingList = {};
  var hasRequiredMappingList;
  function requireMappingList() {
    if (hasRequiredMappingList) return mappingList;
    hasRequiredMappingList = 1;
    var util2 = requireUtil();
    function generatedPositionAfter(mappingA, mappingB) {
      var lineA = mappingA.generatedLine;
      var lineB = mappingB.generatedLine;
      var columnA = mappingA.generatedColumn;
      var columnB = mappingB.generatedColumn;
      return lineB > lineA || lineB == lineA && columnB >= columnA || util2.compareByGeneratedPositionsInflated(mappingA, mappingB) <= 0;
    }
    function MappingList() {
      this._array = [];
      this._sorted = true;
      this._last = { generatedLine: -1, generatedColumn: 0 };
    }
    MappingList.prototype.unsortedForEach = function MappingList_forEach(aCallback, aThisArg) {
      this._array.forEach(aCallback, aThisArg);
    };
    MappingList.prototype.add = function MappingList_add(aMapping) {
      if (generatedPositionAfter(this._last, aMapping)) {
        this._last = aMapping;
        this._array.push(aMapping);
      } else {
        this._sorted = false;
        this._array.push(aMapping);
      }
    };
    MappingList.prototype.toArray = function MappingList_toArray() {
      if (!this._sorted) {
        this._array.sort(util2.compareByGeneratedPositionsInflated);
        this._sorted = true;
      }
      return this._array;
    };
    mappingList.MappingList = MappingList;
    return mappingList;
  }
  var hasRequiredSourceMapGenerator;
  function requireSourceMapGenerator() {
    if (hasRequiredSourceMapGenerator) return sourceMapGenerator;
    hasRequiredSourceMapGenerator = 1;
    var base64VLQ = requireBase64Vlq();
    var util2 = requireUtil();
    var ArraySet = requireArraySet().ArraySet;
    var MappingList = requireMappingList().MappingList;
    function SourceMapGenerator(aArgs) {
      if (!aArgs) {
        aArgs = {};
      }
      this._file = util2.getArg(aArgs, "file", null);
      this._sourceRoot = util2.getArg(aArgs, "sourceRoot", null);
      this._skipValidation = util2.getArg(aArgs, "skipValidation", false);
      this._sources = new ArraySet();
      this._names = new ArraySet();
      this._mappings = new MappingList();
      this._sourcesContents = null;
    }
    SourceMapGenerator.prototype._version = 3;
    SourceMapGenerator.fromSourceMap = function SourceMapGenerator_fromSourceMap(aSourceMapConsumer) {
      var sourceRoot = aSourceMapConsumer.sourceRoot;
      var generator = new SourceMapGenerator({
        file: aSourceMapConsumer.file,
        sourceRoot
      });
      aSourceMapConsumer.eachMapping(function(mapping) {
        var newMapping = {
          generated: {
            line: mapping.generatedLine,
            column: mapping.generatedColumn
          }
        };
        if (mapping.source != null) {
          newMapping.source = mapping.source;
          if (sourceRoot != null) {
            newMapping.source = util2.relative(sourceRoot, newMapping.source);
          }
          newMapping.original = {
            line: mapping.originalLine,
            column: mapping.originalColumn
          };
          if (mapping.name != null) {
            newMapping.name = mapping.name;
          }
        }
        generator.addMapping(newMapping);
      });
      aSourceMapConsumer.sources.forEach(function(sourceFile) {
        var sourceRelative = sourceFile;
        if (sourceRoot !== null) {
          sourceRelative = util2.relative(sourceRoot, sourceFile);
        }
        if (!generator._sources.has(sourceRelative)) {
          generator._sources.add(sourceRelative);
        }
        var content = aSourceMapConsumer.sourceContentFor(sourceFile);
        if (content != null) {
          generator.setSourceContent(sourceFile, content);
        }
      });
      return generator;
    };
    SourceMapGenerator.prototype.addMapping = function SourceMapGenerator_addMapping(aArgs) {
      var generated = util2.getArg(aArgs, "generated");
      var original = util2.getArg(aArgs, "original", null);
      var source = util2.getArg(aArgs, "source", null);
      var name = util2.getArg(aArgs, "name", null);
      if (!this._skipValidation) {
        this._validateMapping(generated, original, source, name);
      }
      if (source != null) {
        source = String(source);
        if (!this._sources.has(source)) {
          this._sources.add(source);
        }
      }
      if (name != null) {
        name = String(name);
        if (!this._names.has(name)) {
          this._names.add(name);
        }
      }
      this._mappings.add({
        generatedLine: generated.line,
        generatedColumn: generated.column,
        originalLine: original != null && original.line,
        originalColumn: original != null && original.column,
        source,
        name
      });
    };
    SourceMapGenerator.prototype.setSourceContent = function SourceMapGenerator_setSourceContent(aSourceFile, aSourceContent) {
      var source = aSourceFile;
      if (this._sourceRoot != null) {
        source = util2.relative(this._sourceRoot, source);
      }
      if (aSourceContent != null) {
        if (!this._sourcesContents) {
          this._sourcesContents = /* @__PURE__ */ Object.create(null);
        }
        this._sourcesContents[util2.toSetString(source)] = aSourceContent;
      } else if (this._sourcesContents) {
        delete this._sourcesContents[util2.toSetString(source)];
        if (Object.keys(this._sourcesContents).length === 0) {
          this._sourcesContents = null;
        }
      }
    };
    SourceMapGenerator.prototype.applySourceMap = function SourceMapGenerator_applySourceMap(aSourceMapConsumer, aSourceFile, aSourceMapPath) {
      var sourceFile = aSourceFile;
      if (aSourceFile == null) {
        if (aSourceMapConsumer.file == null) {
          throw new Error(
            `SourceMapGenerator.prototype.applySourceMap requires either an explicit source file, or the source map's "file" property. Both were omitted.`
          );
        }
        sourceFile = aSourceMapConsumer.file;
      }
      var sourceRoot = this._sourceRoot;
      if (sourceRoot != null) {
        sourceFile = util2.relative(sourceRoot, sourceFile);
      }
      var newSources = new ArraySet();
      var newNames = new ArraySet();
      this._mappings.unsortedForEach(function(mapping) {
        if (mapping.source === sourceFile && mapping.originalLine != null) {
          var original = aSourceMapConsumer.originalPositionFor({
            line: mapping.originalLine,
            column: mapping.originalColumn
          });
          if (original.source != null) {
            mapping.source = original.source;
            if (aSourceMapPath != null) {
              mapping.source = util2.join(aSourceMapPath, mapping.source);
            }
            if (sourceRoot != null) {
              mapping.source = util2.relative(sourceRoot, mapping.source);
            }
            mapping.originalLine = original.line;
            mapping.originalColumn = original.column;
            if (original.name != null) {
              mapping.name = original.name;
            }
          }
        }
        var source = mapping.source;
        if (source != null && !newSources.has(source)) {
          newSources.add(source);
        }
        var name = mapping.name;
        if (name != null && !newNames.has(name)) {
          newNames.add(name);
        }
      }, this);
      this._sources = newSources;
      this._names = newNames;
      aSourceMapConsumer.sources.forEach(function(sourceFile2) {
        var content = aSourceMapConsumer.sourceContentFor(sourceFile2);
        if (content != null) {
          if (aSourceMapPath != null) {
            sourceFile2 = util2.join(aSourceMapPath, sourceFile2);
          }
          if (sourceRoot != null) {
            sourceFile2 = util2.relative(sourceRoot, sourceFile2);
          }
          this.setSourceContent(sourceFile2, content);
        }
      }, this);
    };
    SourceMapGenerator.prototype._validateMapping = function SourceMapGenerator_validateMapping(aGenerated, aOriginal, aSource, aName) {
      if (aOriginal && typeof aOriginal.line !== "number" && typeof aOriginal.column !== "number") {
        throw new Error(
          "original.line and original.column are not numbers -- you probably meant to omit the original mapping entirely and only map the generated position. If so, pass null for the original mapping instead of an object with empty or null values."
        );
      }
      if (aGenerated && "line" in aGenerated && "column" in aGenerated && aGenerated.line > 0 && aGenerated.column >= 0 && !aOriginal && !aSource && !aName) {
        return;
      } else if (aGenerated && "line" in aGenerated && "column" in aGenerated && aOriginal && "line" in aOriginal && "column" in aOriginal && aGenerated.line > 0 && aGenerated.column >= 0 && aOriginal.line > 0 && aOriginal.column >= 0 && aSource) {
        return;
      } else {
        throw new Error("Invalid mapping: " + JSON.stringify({
          generated: aGenerated,
          source: aSource,
          original: aOriginal,
          name: aName
        }));
      }
    };
    SourceMapGenerator.prototype._serializeMappings = function SourceMapGenerator_serializeMappings() {
      var previousGeneratedColumn = 0;
      var previousGeneratedLine = 1;
      var previousOriginalColumn = 0;
      var previousOriginalLine = 0;
      var previousName = 0;
      var previousSource = 0;
      var result2 = "";
      var next;
      var mapping;
      var nameIdx;
      var sourceIdx;
      var mappings = this._mappings.toArray();
      for (var i = 0, len = mappings.length; i < len; i++) {
        mapping = mappings[i];
        next = "";
        if (mapping.generatedLine !== previousGeneratedLine) {
          previousGeneratedColumn = 0;
          while (mapping.generatedLine !== previousGeneratedLine) {
            next += ";";
            previousGeneratedLine++;
          }
        } else {
          if (i > 0) {
            if (!util2.compareByGeneratedPositionsInflated(mapping, mappings[i - 1])) {
              continue;
            }
            next += ",";
          }
        }
        next += base64VLQ.encode(mapping.generatedColumn - previousGeneratedColumn);
        previousGeneratedColumn = mapping.generatedColumn;
        if (mapping.source != null) {
          sourceIdx = this._sources.indexOf(mapping.source);
          next += base64VLQ.encode(sourceIdx - previousSource);
          previousSource = sourceIdx;
          next += base64VLQ.encode(mapping.originalLine - 1 - previousOriginalLine);
          previousOriginalLine = mapping.originalLine - 1;
          next += base64VLQ.encode(mapping.originalColumn - previousOriginalColumn);
          previousOriginalColumn = mapping.originalColumn;
          if (mapping.name != null) {
            nameIdx = this._names.indexOf(mapping.name);
            next += base64VLQ.encode(nameIdx - previousName);
            previousName = nameIdx;
          }
        }
        result2 += next;
      }
      return result2;
    };
    SourceMapGenerator.prototype._generateSourcesContent = function SourceMapGenerator_generateSourcesContent(aSources, aSourceRoot) {
      return aSources.map(function(source) {
        if (!this._sourcesContents) {
          return null;
        }
        if (aSourceRoot != null) {
          source = util2.relative(aSourceRoot, source);
        }
        var key = util2.toSetString(source);
        return Object.prototype.hasOwnProperty.call(this._sourcesContents, key) ? this._sourcesContents[key] : null;
      }, this);
    };
    SourceMapGenerator.prototype.toJSON = function SourceMapGenerator_toJSON() {
      var map = {
        version: this._version,
        sources: this._sources.toArray(),
        names: this._names.toArray(),
        mappings: this._serializeMappings()
      };
      if (this._file != null) {
        map.file = this._file;
      }
      if (this._sourceRoot != null) {
        map.sourceRoot = this._sourceRoot;
      }
      if (this._sourcesContents) {
        map.sourcesContent = this._generateSourcesContent(map.sources, map.sourceRoot);
      }
      return map;
    };
    SourceMapGenerator.prototype.toString = function SourceMapGenerator_toString() {
      return JSON.stringify(this.toJSON());
    };
    sourceMapGenerator.SourceMapGenerator = SourceMapGenerator;
    return sourceMapGenerator;
  }
  var sourceMap;
  var hasRequiredSourceMap;
  function requireSourceMap() {
    if (hasRequiredSourceMap) return sourceMap;
    hasRequiredSourceMap = 1;
    var SourceMapGenerator = requireSourceMapGenerator().SourceMapGenerator;
    var trackNodes = {
      Atrule: true,
      Selector: true,
      Declaration: true
    };
    sourceMap = function generateSourceMap(handlers) {
      var map = new SourceMapGenerator();
      var line = 1;
      var column = 0;
      var generated = {
        line: 1,
        column: 0
      };
      var original = {
        line: 0,
        // should be zero to add first mapping
        column: 0
      };
      var sourceMappingActive = false;
      var activatedGenerated = {
        line: 1,
        column: 0
      };
      var activatedMapping = {
        generated: activatedGenerated
      };
      var handlersNode = handlers.node;
      handlers.node = function(node2) {
        if (node2.loc && node2.loc.start && trackNodes.hasOwnProperty(node2.type)) {
          var nodeLine = node2.loc.start.line;
          var nodeColumn = node2.loc.start.column - 1;
          if (original.line !== nodeLine || original.column !== nodeColumn) {
            original.line = nodeLine;
            original.column = nodeColumn;
            generated.line = line;
            generated.column = column;
            if (sourceMappingActive) {
              sourceMappingActive = false;
              if (generated.line !== activatedGenerated.line || generated.column !== activatedGenerated.column) {
                map.addMapping(activatedMapping);
              }
            }
            sourceMappingActive = true;
            map.addMapping({
              source: node2.loc.source,
              original,
              generated
            });
          }
        }
        handlersNode.call(this, node2);
        if (sourceMappingActive && trackNodes.hasOwnProperty(node2.type)) {
          activatedGenerated.line = line;
          activatedGenerated.column = column;
        }
      };
      var handlersChunk = handlers.chunk;
      handlers.chunk = function(chunk) {
        for (var i = 0; i < chunk.length; i++) {
          if (chunk.charCodeAt(i) === 10) {
            line++;
            column = 0;
          } else {
            column++;
          }
        }
        handlersChunk(chunk);
      };
      var handlersResult = handlers.result;
      handlers.result = function() {
        if (sourceMappingActive) {
          map.addMapping(activatedMapping);
        }
        return {
          css: handlersResult(),
          map
        };
      };
      return handlers;
    };
    return sourceMap;
  }
  var create$2;
  var hasRequiredCreate$3;
  function requireCreate$3() {
    if (hasRequiredCreate$3) return create$2;
    hasRequiredCreate$3 = 1;
    var sourceMap2 = requireSourceMap();
    var hasOwnProperty = Object.prototype.hasOwnProperty;
    function processChildren(node2, delimeter) {
      var list = node2.children;
      var prev = null;
      if (typeof delimeter !== "function") {
        list.forEach(this.node, this);
      } else {
        list.forEach(function(node3) {
          if (prev !== null) {
            delimeter.call(this, prev);
          }
          this.node(node3);
          prev = node3;
        }, this);
      }
    }
    create$2 = function createGenerator(config) {
      function processNode(node2) {
        if (hasOwnProperty.call(types2, node2.type)) {
          types2[node2.type].call(this, node2);
        } else {
          throw new Error("Unknown node type: " + node2.type);
        }
      }
      var types2 = {};
      if (config.node) {
        for (var name in config.node) {
          types2[name] = config.node[name].generate;
        }
      }
      return function(node2, options) {
        var buffer = "";
        var handlers = {
          children: processChildren,
          node: processNode,
          chunk: function(chunk) {
            buffer += chunk;
          },
          result: function() {
            return buffer;
          }
        };
        if (options) {
          if (typeof options.decorator === "function") {
            handlers = options.decorator(handlers);
          }
          if (options.sourceMap) {
            handlers = sourceMap2(handlers);
          }
        }
        handlers.node(node2);
        return handlers.result();
      };
    };
    return create$2;
  }
  var create$1;
  var hasRequiredCreate$2;
  function requireCreate$2() {
    if (hasRequiredCreate$2) return create$1;
    hasRequiredCreate$2 = 1;
    var List = requireList();
    create$1 = function createConvertors(walk2) {
      return {
        fromPlainObject: function(ast) {
          walk2(ast, {
            enter: function(node2) {
              if (node2.children && node2.children instanceof List === false) {
                node2.children = new List().fromArray(node2.children);
              }
            }
          });
          return ast;
        },
        toPlainObject: function(ast) {
          walk2(ast, {
            leave: function(node2) {
              if (node2.children && node2.children instanceof List) {
                node2.children = node2.children.toArray();
              }
            }
          });
          return ast;
        }
      };
    };
    return create$1;
  }
  var create;
  var hasRequiredCreate$1;
  function requireCreate$1() {
    if (hasRequiredCreate$1) return create;
    hasRequiredCreate$1 = 1;
    var hasOwnProperty = Object.prototype.hasOwnProperty;
    var noop = function() {
    };
    function ensureFunction(value2) {
      return typeof value2 === "function" ? value2 : noop;
    }
    function invokeForType(fn, type) {
      return function(node2, item, list) {
        if (node2.type === type) {
          fn.call(this, node2, item, list);
        }
      };
    }
    function getWalkersFromStructure(name, nodeType) {
      var structure2 = nodeType.structure;
      var walkers = [];
      for (var key in structure2) {
        if (hasOwnProperty.call(structure2, key) === false) {
          continue;
        }
        var fieldTypes = structure2[key];
        var walker2 = {
          name: key,
          type: false,
          nullable: false
        };
        if (!Array.isArray(structure2[key])) {
          fieldTypes = [structure2[key]];
        }
        for (var i = 0; i < fieldTypes.length; i++) {
          var fieldType = fieldTypes[i];
          if (fieldType === null) {
            walker2.nullable = true;
          } else if (typeof fieldType === "string") {
            walker2.type = "node";
          } else if (Array.isArray(fieldType)) {
            walker2.type = "list";
          }
        }
        if (walker2.type) {
          walkers.push(walker2);
        }
      }
      if (walkers.length) {
        return {
          context: nodeType.walkContext,
          fields: walkers
        };
      }
      return null;
    }
    function getTypesFromConfig(config) {
      var types2 = {};
      for (var name in config.node) {
        if (hasOwnProperty.call(config.node, name)) {
          var nodeType = config.node[name];
          if (!nodeType.structure) {
            throw new Error("Missed `structure` field in `" + name + "` node type definition");
          }
          types2[name] = getWalkersFromStructure(name, nodeType);
        }
      }
      return types2;
    }
    function createTypeIterator(config, reverse) {
      var fields = config.fields.slice();
      var contextName = config.context;
      var useContext = typeof contextName === "string";
      if (reverse) {
        fields.reverse();
      }
      return function(node2, context, walk2) {
        var prevContextValue;
        if (useContext) {
          prevContextValue = context[contextName];
          context[contextName] = node2;
        }
        for (var i = 0; i < fields.length; i++) {
          var field = fields[i];
          var ref = node2[field.name];
          if (!field.nullable || ref) {
            if (field.type === "list") {
              if (reverse) {
                ref.forEachRight(walk2);
              } else {
                ref.forEach(walk2);
              }
            } else {
              walk2(ref);
            }
          }
        }
        if (useContext) {
          context[contextName] = prevContextValue;
        }
      };
    }
    function createFastTraveralMap(iterators) {
      return {
        Atrule: {
          StyleSheet: iterators.StyleSheet,
          Atrule: iterators.Atrule,
          Rule: iterators.Rule,
          Block: iterators.Block
        },
        Rule: {
          StyleSheet: iterators.StyleSheet,
          Atrule: iterators.Atrule,
          Rule: iterators.Rule,
          Block: iterators.Block
        },
        Declaration: {
          StyleSheet: iterators.StyleSheet,
          Atrule: iterators.Atrule,
          Rule: iterators.Rule,
          Block: iterators.Block,
          DeclarationList: iterators.DeclarationList
        }
      };
    }
    create = function createWalker(config) {
      var types2 = getTypesFromConfig(config);
      var iteratorsNatural = {};
      var iteratorsReverse = {};
      for (var name in types2) {
        if (hasOwnProperty.call(types2, name) && types2[name] !== null) {
          iteratorsNatural[name] = createTypeIterator(types2[name], false);
          iteratorsReverse[name] = createTypeIterator(types2[name], true);
        }
      }
      var fastTraversalIteratorsNatural = createFastTraveralMap(iteratorsNatural);
      var fastTraversalIteratorsReverse = createFastTraveralMap(iteratorsReverse);
      var walk2 = function(root, options) {
        function walkNode(node2, item, list) {
          enter.call(context, node2, item, list);
          if (iterators.hasOwnProperty(node2.type)) {
            iterators[node2.type](node2, context, walkNode);
          }
          leave.call(context, node2, item, list);
        }
        var enter = noop;
        var leave = noop;
        var iterators = iteratorsNatural;
        var context = {
          root,
          stylesheet: null,
          atrule: null,
          atrulePrelude: null,
          rule: null,
          selector: null,
          block: null,
          declaration: null,
          function: null
        };
        if (typeof options === "function") {
          enter = options;
        } else if (options) {
          enter = ensureFunction(options.enter);
          leave = ensureFunction(options.leave);
          if (options.reverse) {
            iterators = iteratorsReverse;
          }
          if (options.visit) {
            if (fastTraversalIteratorsNatural.hasOwnProperty(options.visit)) {
              iterators = options.reverse ? fastTraversalIteratorsReverse[options.visit] : fastTraversalIteratorsNatural[options.visit];
            } else if (!types2.hasOwnProperty(options.visit)) {
              throw new Error("Bad value `" + options.visit + "` for `visit` option (should be: " + Object.keys(types2).join(", ") + ")");
            }
            enter = invokeForType(enter, options.visit);
            leave = invokeForType(leave, options.visit);
          }
        }
        if (enter === noop && leave === noop) {
          throw new Error("Neither `enter` nor `leave` walker handler is set or both aren't a function");
        }
        if (options.reverse) {
          var tmp = enter;
          enter = leave;
          leave = tmp;
        }
        walkNode(root);
      };
      walk2.find = function(ast, fn) {
        var found = null;
        walk2(ast, function(node2, item, list) {
          if (found === null && fn.call(this, node2, item, list)) {
            found = node2;
          }
        });
        return found;
      };
      walk2.findLast = function(ast, fn) {
        var found = null;
        walk2(ast, {
          reverse: true,
          enter: function(node2, item, list) {
            if (found === null && fn.call(this, node2, item, list)) {
              found = node2;
            }
          }
        });
        return found;
      };
      walk2.findAll = function(ast, fn) {
        var found = [];
        walk2(ast, function(node2, item, list) {
          if (fn.call(this, node2, item, list)) {
            found.push(node2);
          }
        });
        return found;
      };
      return walk2;
    };
    return create;
  }
  var clone;
  var hasRequiredClone;
  function requireClone() {
    if (hasRequiredClone) return clone;
    hasRequiredClone = 1;
    var List = requireList();
    clone = function clone2(node2) {
      var result2 = {};
      for (var key in node2) {
        var value2 = node2[key];
        if (value2) {
          if (Array.isArray(value2) || value2 instanceof List) {
            value2 = value2.map(clone2);
          } else if (value2.constructor === Object) {
            value2 = clone2(value2);
          }
        }
        result2[key] = value2;
      }
      return result2;
    };
    return clone;
  }
  var mix_1;
  var hasRequiredMix;
  function requireMix() {
    if (hasRequiredMix) return mix_1;
    hasRequiredMix = 1;
    var hasOwnProperty = Object.prototype.hasOwnProperty;
    var shape = {
      generic: true,
      types: {},
      atrules: {},
      properties: {},
      parseContext: {},
      scope: {},
      atrule: ["parse"],
      pseudo: ["parse"],
      node: ["name", "structure", "parse", "generate", "walkContext"]
    };
    function isObject(value2) {
      return value2 && value2.constructor === Object;
    }
    function copy(value2) {
      if (isObject(value2)) {
        return Object.assign({}, value2);
      } else {
        return value2;
      }
    }
    function extend(dest, src) {
      for (var key in src) {
        if (hasOwnProperty.call(src, key)) {
          if (isObject(dest[key])) {
            extend(dest[key], copy(src[key]));
          } else {
            dest[key] = copy(src[key]);
          }
        }
      }
    }
    function mix(dest, src, shape2) {
      for (var key in shape2) {
        if (hasOwnProperty.call(shape2, key) === false) {
          continue;
        }
        if (shape2[key] === true) {
          if (key in src) {
            if (hasOwnProperty.call(src, key)) {
              dest[key] = copy(src[key]);
            }
          }
        } else if (shape2[key]) {
          if (isObject(shape2[key])) {
            var res = {};
            extend(res, dest[key]);
            extend(res, src[key]);
            dest[key] = res;
          } else if (Array.isArray(shape2[key])) {
            var res = {};
            var innerShape = shape2[key].reduce(function(s, k) {
              s[k] = true;
              return s;
            }, {});
            for (var name in dest[key]) {
              if (hasOwnProperty.call(dest[key], name)) {
                res[name] = {};
                if (dest[key] && dest[key][name]) {
                  mix(res[name], dest[key][name], innerShape);
                }
              }
            }
            for (var name in src[key]) {
              if (hasOwnProperty.call(src[key], name)) {
                if (!res[name]) {
                  res[name] = {};
                }
                if (src[key] && src[key][name]) {
                  mix(res[name], src[key][name], innerShape);
                }
              }
            }
            dest[key] = res;
          }
        }
      }
      return dest;
    }
    mix_1 = function(dest, src) {
      return mix(dest, src, shape);
    };
    return mix_1;
  }
  var hasRequiredCreate;
  function requireCreate() {
    if (hasRequiredCreate) return create$4;
    hasRequiredCreate = 1;
    var List = requireList();
    var SyntaxError2 = require_SyntaxError$1();
    var TokenStream = requireTokenStream();
    var Lexer = requireLexer$1();
    var definitionSyntax2 = requireDefinitionSyntax();
    var tokenize = requireTokenizer$1();
    var createParser = requireCreate$4();
    var createGenerator = requireCreate$3();
    var createConvertor = requireCreate$2();
    var createWalker = requireCreate$1();
    var clone2 = requireClone();
    var names2 = requireNames();
    var mix = requireMix();
    function createSyntax(config) {
      var parse2 = createParser(config);
      var walk2 = createWalker(config);
      var generate = createGenerator(config);
      var convert = createConvertor(walk2);
      var syntax2 = {
        List,
        SyntaxError: SyntaxError2,
        TokenStream,
        Lexer,
        vendorPrefix: names2.vendorPrefix,
        keyword: names2.keyword,
        property: names2.property,
        isCustomProperty: names2.isCustomProperty,
        definitionSyntax: definitionSyntax2,
        lexer: null,
        createLexer: function(config2) {
          return new Lexer(config2, syntax2, syntax2.lexer.structure);
        },
        tokenize,
        parse: parse2,
        walk: walk2,
        generate,
        find: walk2.find,
        findLast: walk2.findLast,
        findAll: walk2.findAll,
        clone: clone2,
        fromPlainObject: convert.fromPlainObject,
        toPlainObject: convert.toPlainObject,
        createSyntax: function(config2) {
          return createSyntax(mix({}, config2));
        },
        fork: function(extension) {
          var base = mix({}, config);
          return createSyntax(
            typeof extension === "function" ? extension(base, Object.assign) : mix(base, extension)
          );
        }
      };
      syntax2.lexer = new Lexer({
        generic: true,
        types: config.types,
        atrules: config.atrules,
        properties: config.properties,
        node: config.node
      }, syntax2);
      return syntax2;
    }
    create$4.create = function(config) {
      return createSyntax(mix({}, config));
    };
    return create$4;
  }
  const types = /* @__PURE__ */ JSON.parse(`{"absolute-size":"xx-small|x-small|small|medium|large|x-large|xx-large","alpha-value":"<number>|<percentage>","angle-percentage":"<angle>|<percentage>","angular-color-hint":"<angle-percentage>","angular-color-stop":"<color>&&<color-stop-angle>?","angular-color-stop-list":"[<angular-color-stop> [, <angular-color-hint>]?]# , <angular-color-stop>","animateable-feature":"scroll-position|contents|<custom-ident>","attachment":"scroll|fixed|local","attr()":"attr( <attr-name> <type-or-unit>? [, <attr-fallback>]? )","attr-matcher":"['~'|'|'|'^'|'$'|'*']? '='","attr-modifier":"i|s","attribute-selector":"'[' <wq-name> ']'|'[' <wq-name> <attr-matcher> [<string-token>|<ident-token>] <attr-modifier>? ']'","auto-repeat":"repeat( [auto-fill|auto-fit] , [<line-names>? <fixed-size>]+ <line-names>? )","auto-track-list":"[<line-names>? [<fixed-size>|<fixed-repeat>]]* <line-names>? <auto-repeat> [<line-names>? [<fixed-size>|<fixed-repeat>]]* <line-names>?","baseline-position":"[first|last]? baseline","basic-shape":"<inset()>|<circle()>|<ellipse()>|<polygon()>","bg-image":"none|<image>","bg-layer":"<bg-image>||<bg-position> [/ <bg-size>]?||<repeat-style>||<attachment>||<box>||<box>","bg-position":"[[left|center|right|top|bottom|<length-percentage>]|[left|center|right|<length-percentage>] [top|center|bottom|<length-percentage>]|[center|[left|right] <length-percentage>?]&&[center|[top|bottom] <length-percentage>?]]","bg-size":"[<length-percentage>|auto]{1,2}|cover|contain","blur()":"blur( <length> )","blend-mode":"normal|multiply|screen|overlay|darken|lighten|color-dodge|color-burn|hard-light|soft-light|difference|exclusion|hue|saturation|color|luminosity","box":"border-box|padding-box|content-box","brightness()":"brightness( <number-percentage> )","calc()":"calc( <calc-sum> )","calc-sum":"<calc-product> [['+'|'-'] <calc-product>]*","calc-product":"<calc-value> ['*' <calc-value>|'/' <number>]*","calc-value":"<number>|<dimension>|<percentage>|( <calc-sum> )","cf-final-image":"<image>|<color>","cf-mixing-image":"<percentage>?&&<image>","circle()":"circle( [<shape-radius>]? [at <position>]? )","clamp()":"clamp( <calc-sum>#{3} )","class-selector":"'.' <ident-token>","clip-source":"<url>","color":"<rgb()>|<rgba()>|<hsl()>|<hsla()>|<hex-color>|<named-color>|currentcolor|<deprecated-system-color>","color-stop":"<color-stop-length>|<color-stop-angle>","color-stop-angle":"<angle-percentage>{1,2}","color-stop-length":"<length-percentage>{1,2}","color-stop-list":"[<linear-color-stop> [, <linear-color-hint>]?]# , <linear-color-stop>","combinator":"'>'|'+'|'~'|['||']","common-lig-values":"[common-ligatures|no-common-ligatures]","compat":"searchfield|textarea|push-button|button-bevel|slider-horizontal|checkbox|radio|square-button|menulist|menulist-button|listbox|meter|progress-bar","composite-style":"clear|copy|source-over|source-in|source-out|source-atop|destination-over|destination-in|destination-out|destination-atop|xor","compositing-operator":"add|subtract|intersect|exclude","compound-selector":"[<type-selector>? <subclass-selector>* [<pseudo-element-selector> <pseudo-class-selector>*]*]!","compound-selector-list":"<compound-selector>#","complex-selector":"<compound-selector> [<combinator>? <compound-selector>]*","complex-selector-list":"<complex-selector>#","conic-gradient()":"conic-gradient( [from <angle>]? [at <position>]? , <angular-color-stop-list> )","contextual-alt-values":"[contextual|no-contextual]","content-distribution":"space-between|space-around|space-evenly|stretch","content-list":"[<string>|contents|<url>|<quote>|<attr()>|counter( <ident> , <'list-style-type'>? )]+","content-position":"center|start|end|flex-start|flex-end","content-replacement":"<image>","contrast()":"contrast( [<number-percentage>] )","counter()":"counter( <custom-ident> , [<counter-style>|none]? )","counter-style":"<counter-style-name>|symbols( )","counter-style-name":"<custom-ident>","counters()":"counters( <custom-ident> , <string> , [<counter-style>|none]? )","cross-fade()":"cross-fade( <cf-mixing-image> , <cf-final-image>? )","cubic-bezier-timing-function":"ease|ease-in|ease-out|ease-in-out|cubic-bezier( <number> , <number> , <number> , <number> )","deprecated-system-color":"ActiveBorder|ActiveCaption|AppWorkspace|Background|ButtonFace|ButtonHighlight|ButtonShadow|ButtonText|CaptionText|GrayText|Highlight|HighlightText|InactiveBorder|InactiveCaption|InactiveCaptionText|InfoBackground|InfoText|Menu|MenuText|Scrollbar|ThreeDDarkShadow|ThreeDFace|ThreeDHighlight|ThreeDLightShadow|ThreeDShadow|Window|WindowFrame|WindowText","discretionary-lig-values":"[discretionary-ligatures|no-discretionary-ligatures]","display-box":"contents|none","display-inside":"flow|flow-root|table|flex|grid|ruby","display-internal":"table-row-group|table-header-group|table-footer-group|table-row|table-cell|table-column-group|table-column|table-caption|ruby-base|ruby-text|ruby-base-container|ruby-text-container","display-legacy":"inline-block|inline-list-item|inline-table|inline-flex|inline-grid","display-listitem":"<display-outside>?&&[flow|flow-root]?&&list-item","display-outside":"block|inline|run-in","drop-shadow()":"drop-shadow( <length>{2,3} <color>? )","east-asian-variant-values":"[jis78|jis83|jis90|jis04|simplified|traditional]","east-asian-width-values":"[full-width|proportional-width]","element()":"element( <id-selector> )","ellipse()":"ellipse( [<shape-radius>{2}]? [at <position>]? )","ending-shape":"circle|ellipse","env()":"env( <custom-ident> , <declaration-value>? )","explicit-track-list":"[<line-names>? <track-size>]+ <line-names>?","family-name":"<string>|<custom-ident>+","feature-tag-value":"<string> [<integer>|on|off]?","feature-type":"@stylistic|@historical-forms|@styleset|@character-variant|@swash|@ornaments|@annotation","feature-value-block":"<feature-type> '{' <feature-value-declaration-list> '}'","feature-value-block-list":"<feature-value-block>+","feature-value-declaration":"<custom-ident> : <integer>+ ;","feature-value-declaration-list":"<feature-value-declaration>","feature-value-name":"<custom-ident>","fill-rule":"nonzero|evenodd","filter-function":"<blur()>|<brightness()>|<contrast()>|<drop-shadow()>|<grayscale()>|<hue-rotate()>|<invert()>|<opacity()>|<saturate()>|<sepia()>","filter-function-list":"[<filter-function>|<url>]+","final-bg-layer":"<'background-color'>||<bg-image>||<bg-position> [/ <bg-size>]?||<repeat-style>||<attachment>||<box>||<box>","fit-content()":"fit-content( [<length>|<percentage>] )","fixed-breadth":"<length-percentage>","fixed-repeat":"repeat( [<positive-integer>] , [<line-names>? <fixed-size>]+ <line-names>? )","fixed-size":"<fixed-breadth>|minmax( <fixed-breadth> , <track-breadth> )|minmax( <inflexible-breadth> , <fixed-breadth> )","font-stretch-absolute":"normal|ultra-condensed|extra-condensed|condensed|semi-condensed|semi-expanded|expanded|extra-expanded|ultra-expanded|<percentage>","font-variant-css21":"[normal|small-caps]","font-weight-absolute":"normal|bold|<number>","frequency-percentage":"<frequency>|<percentage>","general-enclosed":"[<function-token> <any-value> )]|( <ident> <any-value> )","generic-family":"serif|sans-serif|cursive|fantasy|monospace|-apple-system","generic-name":"serif|sans-serif|cursive|fantasy|monospace","geometry-box":"<shape-box>|fill-box|stroke-box|view-box","gradient":"<linear-gradient()>|<repeating-linear-gradient()>|<radial-gradient()>|<repeating-radial-gradient()>|<conic-gradient()>|<-legacy-gradient>","grayscale()":"grayscale( <number-percentage> )","grid-line":"auto|<custom-ident>|[<integer>&&<custom-ident>?]|[span&&[<integer>||<custom-ident>]]","historical-lig-values":"[historical-ligatures|no-historical-ligatures]","hsl()":"hsl( <hue> <percentage> <percentage> [/ <alpha-value>]? )|hsl( <hue> , <percentage> , <percentage> , <alpha-value>? )","hsla()":"hsla( <hue> <percentage> <percentage> [/ <alpha-value>]? )|hsla( <hue> , <percentage> , <percentage> , <alpha-value>? )","hue":"<number>|<angle>","hue-rotate()":"hue-rotate( <angle> )","image":"<url>|<image()>|<image-set()>|<element()>|<cross-fade()>|<gradient>","image()":"image( <image-tags>? [<image-src>? , <color>?]! )","image-set()":"image-set( <image-set-option># )","image-set-option":"[<image>|<string>] <resolution>","image-src":"<url>|<string>","image-tags":"ltr|rtl","inflexible-breadth":"<length>|<percentage>|min-content|max-content|auto","inset()":"inset( <length-percentage>{1,4} [round <'border-radius'>]? )","invert()":"invert( <number-percentage> )","keyframes-name":"<custom-ident>|<string>","keyframe-block":"<keyframe-selector># { <declaration-list> }","keyframe-block-list":"<keyframe-block>+","keyframe-selector":"from|to|<percentage>","leader()":"leader( <leader-type> )","leader-type":"dotted|solid|space|<string>","length-percentage":"<length>|<percentage>","line-names":"'[' <custom-ident>* ']'","line-name-list":"[<line-names>|<name-repeat>]+","line-style":"none|hidden|dotted|dashed|solid|double|groove|ridge|inset|outset","line-width":"<length>|thin|medium|thick","linear-color-hint":"<length-percentage>","linear-color-stop":"<color> <color-stop-length>?","linear-gradient()":"linear-gradient( [<angle>|to <side-or-corner>]? , <color-stop-list> )","mask-layer":"<mask-reference>||<position> [/ <bg-size>]?||<repeat-style>||<geometry-box>||[<geometry-box>|no-clip]||<compositing-operator>||<masking-mode>","mask-position":"[<length-percentage>|left|center|right] [<length-percentage>|top|center|bottom]?","mask-reference":"none|<image>|<mask-source>","mask-source":"<url>","masking-mode":"alpha|luminance|match-source","matrix()":"matrix( <number>#{6} )","matrix3d()":"matrix3d( <number>#{16} )","max()":"max( <calc-sum># )","media-and":"<media-in-parens> [and <media-in-parens>]+","media-condition":"<media-not>|<media-and>|<media-or>|<media-in-parens>","media-condition-without-or":"<media-not>|<media-and>|<media-in-parens>","media-feature":"( [<mf-plain>|<mf-boolean>|<mf-range>] )","media-in-parens":"( <media-condition> )|<media-feature>|<general-enclosed>","media-not":"not <media-in-parens>","media-or":"<media-in-parens> [or <media-in-parens>]+","media-query":"<media-condition>|[not|only]? <media-type> [and <media-condition-without-or>]?","media-query-list":"<media-query>#","media-type":"<ident>","mf-boolean":"<mf-name>","mf-name":"<ident>","mf-plain":"<mf-name> : <mf-value>","mf-range":"<mf-name> ['<'|'>']? '='? <mf-value>|<mf-value> ['<'|'>']? '='? <mf-name>|<mf-value> '<' '='? <mf-name> '<' '='? <mf-value>|<mf-value> '>' '='? <mf-name> '>' '='? <mf-value>","mf-value":"<number>|<dimension>|<ident>|<ratio>","min()":"min( <calc-sum># )","minmax()":"minmax( [<length>|<percentage>|<flex>|min-content|max-content|auto] , [<length>|<percentage>|<flex>|min-content|max-content|auto] )","named-color":"transparent|aliceblue|antiquewhite|aqua|aquamarine|azure|beige|bisque|black|blanchedalmond|blue|blueviolet|brown|burlywood|cadetblue|chartreuse|chocolate|coral|cornflowerblue|cornsilk|crimson|cyan|darkblue|darkcyan|darkgoldenrod|darkgray|darkgreen|darkgrey|darkkhaki|darkmagenta|darkolivegreen|darkorange|darkorchid|darkred|darksalmon|darkseagreen|darkslateblue|darkslategray|darkslategrey|darkturquoise|darkviolet|deeppink|deepskyblue|dimgray|dimgrey|dodgerblue|firebrick|floralwhite|forestgreen|fuchsia|gainsboro|ghostwhite|gold|goldenrod|gray|green|greenyellow|grey|honeydew|hotpink|indianred|indigo|ivory|khaki|lavender|lavenderblush|lawngreen|lemonchiffon|lightblue|lightcoral|lightcyan|lightgoldenrodyellow|lightgray|lightgreen|lightgrey|lightpink|lightsalmon|lightseagreen|lightskyblue|lightslategray|lightslategrey|lightsteelblue|lightyellow|lime|limegreen|linen|magenta|maroon|mediumaquamarine|mediumblue|mediumorchid|mediumpurple|mediumseagreen|mediumslateblue|mediumspringgreen|mediumturquoise|mediumvioletred|midnightblue|mintcream|mistyrose|moccasin|navajowhite|navy|oldlace|olive|olivedrab|orange|orangered|orchid|palegoldenrod|palegreen|paleturquoise|palevioletred|papayawhip|peachpuff|peru|pink|plum|powderblue|purple|rebeccapurple|red|rosybrown|royalblue|saddlebrown|salmon|sandybrown|seagreen|seashell|sienna|silver|skyblue|slateblue|slategray|slategrey|snow|springgreen|steelblue|tan|teal|thistle|tomato|turquoise|violet|wheat|white|whitesmoke|yellow|yellowgreen|<-non-standard-color>","namespace-prefix":"<ident>","ns-prefix":"[<ident-token>|'*']? '|'","number-percentage":"<number>|<percentage>","numeric-figure-values":"[lining-nums|oldstyle-nums]","numeric-fraction-values":"[diagonal-fractions|stacked-fractions]","numeric-spacing-values":"[proportional-nums|tabular-nums]","nth":"<an-plus-b>|even|odd","opacity()":"opacity( [<number-percentage>] )","overflow-position":"unsafe|safe","outline-radius":"<length>|<percentage>","page-body":"<declaration>? [; <page-body>]?|<page-margin-box> <page-body>","page-margin-box":"<page-margin-box-type> '{' <declaration-list> '}'","page-margin-box-type":"@top-left-corner|@top-left|@top-center|@top-right|@top-right-corner|@bottom-left-corner|@bottom-left|@bottom-center|@bottom-right|@bottom-right-corner|@left-top|@left-middle|@left-bottom|@right-top|@right-middle|@right-bottom","page-selector-list":"[<page-selector>#]?","page-selector":"<pseudo-page>+|<ident> <pseudo-page>*","perspective()":"perspective( <length> )","polygon()":"polygon( <fill-rule>? , [<length-percentage> <length-percentage>]# )","position":"[[left|center|right]||[top|center|bottom]|[left|center|right|<length-percentage>] [top|center|bottom|<length-percentage>]?|[[left|right] <length-percentage>]&&[[top|bottom] <length-percentage>]]","pseudo-class-selector":"':' <ident-token>|':' <function-token> <any-value> ')'","pseudo-element-selector":"':' <pseudo-class-selector>","pseudo-page":": [left|right|first|blank]","quote":"open-quote|close-quote|no-open-quote|no-close-quote","radial-gradient()":"radial-gradient( [<ending-shape>||<size>]? [at <position>]? , <color-stop-list> )","relative-selector":"<combinator>? <complex-selector>","relative-selector-list":"<relative-selector>#","relative-size":"larger|smaller","repeat-style":"repeat-x|repeat-y|[repeat|space|round|no-repeat]{1,2}","repeating-linear-gradient()":"repeating-linear-gradient( [<angle>|to <side-or-corner>]? , <color-stop-list> )","repeating-radial-gradient()":"repeating-radial-gradient( [<ending-shape>||<size>]? [at <position>]? , <color-stop-list> )","rgb()":"rgb( <percentage>{3} [/ <alpha-value>]? )|rgb( <number>{3} [/ <alpha-value>]? )|rgb( <percentage>#{3} , <alpha-value>? )|rgb( <number>#{3} , <alpha-value>? )","rgba()":"rgba( <percentage>{3} [/ <alpha-value>]? )|rgba( <number>{3} [/ <alpha-value>]? )|rgba( <percentage>#{3} , <alpha-value>? )|rgba( <number>#{3} , <alpha-value>? )","rotate()":"rotate( [<angle>|<zero>] )","rotate3d()":"rotate3d( <number> , <number> , <number> , [<angle>|<zero>] )","rotateX()":"rotateX( [<angle>|<zero>] )","rotateY()":"rotateY( [<angle>|<zero>] )","rotateZ()":"rotateZ( [<angle>|<zero>] )","saturate()":"saturate( <number-percentage> )","scale()":"scale( <number> , <number>? )","scale3d()":"scale3d( <number> , <number> , <number> )","scaleX()":"scaleX( <number> )","scaleY()":"scaleY( <number> )","scaleZ()":"scaleZ( <number> )","self-position":"center|start|end|self-start|self-end|flex-start|flex-end","shape-radius":"<length-percentage>|closest-side|farthest-side","skew()":"skew( [<angle>|<zero>] , [<angle>|<zero>]? )","skewX()":"skewX( [<angle>|<zero>] )","skewY()":"skewY( [<angle>|<zero>] )","sepia()":"sepia( <number-percentage> )","shadow":"inset?&&<length>{2,4}&&<color>?","shadow-t":"[<length>{2,3}&&<color>?]","shape":"rect( <top> , <right> , <bottom> , <left> )|rect( <top> <right> <bottom> <left> )","shape-box":"<box>|margin-box","side-or-corner":"[left|right]||[top|bottom]","single-animation":"<time>||<timing-function>||<time>||<single-animation-iteration-count>||<single-animation-direction>||<single-animation-fill-mode>||<single-animation-play-state>||[none|<keyframes-name>]","single-animation-direction":"normal|reverse|alternate|alternate-reverse","single-animation-fill-mode":"none|forwards|backwards|both","single-animation-iteration-count":"infinite|<number>","single-animation-play-state":"running|paused","single-transition":"[none|<single-transition-property>]||<time>||<timing-function>||<time>","single-transition-property":"all|<custom-ident>","size":"closest-side|farthest-side|closest-corner|farthest-corner|<length>|<length-percentage>{2}","step-position":"jump-start|jump-end|jump-none|jump-both|start|end","step-timing-function":"step-start|step-end|steps( <integer> [, <step-position>]? )","subclass-selector":"<id-selector>|<class-selector>|<attribute-selector>|<pseudo-class-selector>","supports-condition":"not <supports-in-parens>|<supports-in-parens> [and <supports-in-parens>]*|<supports-in-parens> [or <supports-in-parens>]*","supports-in-parens":"( <supports-condition> )|<supports-feature>|<general-enclosed>","supports-feature":"<supports-decl>|<supports-selector-fn>","supports-decl":"( <declaration> )","supports-selector-fn":"selector( <complex-selector> )","symbol":"<string>|<image>|<custom-ident>","target":"<target-counter()>|<target-counters()>|<target-text()>","target-counter()":"target-counter( [<string>|<url>] , <custom-ident> , <counter-style>? )","target-counters()":"target-counters( [<string>|<url>] , <custom-ident> , <string> , <counter-style>? )","target-text()":"target-text( [<string>|<url>] , [content|before|after|first-letter]? )","time-percentage":"<time>|<percentage>","timing-function":"linear|<cubic-bezier-timing-function>|<step-timing-function>","track-breadth":"<length-percentage>|<flex>|min-content|max-content|auto","track-list":"[<line-names>? [<track-size>|<track-repeat>]]+ <line-names>?","track-repeat":"repeat( [<positive-integer>] , [<line-names>? <track-size>]+ <line-names>? )","track-size":"<track-breadth>|minmax( <inflexible-breadth> , <track-breadth> )|fit-content( [<length>|<percentage>] )","transform-function":"<matrix()>|<translate()>|<translateX()>|<translateY()>|<scale()>|<scaleX()>|<scaleY()>|<rotate()>|<skew()>|<skewX()>|<skewY()>|<matrix3d()>|<translate3d()>|<translateZ()>|<scale3d()>|<scaleZ()>|<rotate3d()>|<rotateX()>|<rotateY()>|<rotateZ()>|<perspective()>","transform-list":"<transform-function>+","translate()":"translate( <length-percentage> , <length-percentage>? )","translate3d()":"translate3d( <length-percentage> , <length-percentage> , <length> )","translateX()":"translateX( <length-percentage> )","translateY()":"translateY( <length-percentage> )","translateZ()":"translateZ( <length> )","type-or-unit":"string|color|url|integer|number|length|angle|time|frequency|cap|ch|em|ex|ic|lh|rlh|rem|vb|vi|vw|vh|vmin|vmax|mm|Q|cm|in|pt|pc|px|deg|grad|rad|turn|ms|s|Hz|kHz|%","type-selector":"<wq-name>|<ns-prefix>? '*'","var()":"var( <custom-property-name> , <declaration-value>? )","viewport-length":"auto|<length-percentage>","wq-name":"<ns-prefix>? <ident-token>","-legacy-gradient":"<-webkit-gradient()>|<-legacy-linear-gradient>|<-legacy-repeating-linear-gradient>|<-legacy-radial-gradient>|<-legacy-repeating-radial-gradient>","-legacy-linear-gradient":"-moz-linear-gradient( <-legacy-linear-gradient-arguments> )|-webkit-linear-gradient( <-legacy-linear-gradient-arguments> )|-o-linear-gradient( <-legacy-linear-gradient-arguments> )","-legacy-repeating-linear-gradient":"-moz-repeating-linear-gradient( <-legacy-linear-gradient-arguments> )|-webkit-repeating-linear-gradient( <-legacy-linear-gradient-arguments> )|-o-repeating-linear-gradient( <-legacy-linear-gradient-arguments> )","-legacy-linear-gradient-arguments":"[<angle>|<side-or-corner>]? , <color-stop-list>","-legacy-radial-gradient":"-moz-radial-gradient( <-legacy-radial-gradient-arguments> )|-webkit-radial-gradient( <-legacy-radial-gradient-arguments> )|-o-radial-gradient( <-legacy-radial-gradient-arguments> )","-legacy-repeating-radial-gradient":"-moz-repeating-radial-gradient( <-legacy-radial-gradient-arguments> )|-webkit-repeating-radial-gradient( <-legacy-radial-gradient-arguments> )|-o-repeating-radial-gradient( <-legacy-radial-gradient-arguments> )","-legacy-radial-gradient-arguments":"[<position> ,]? [[[<-legacy-radial-gradient-shape>||<-legacy-radial-gradient-size>]|[<length>|<percentage>]{2}] ,]? <color-stop-list>","-legacy-radial-gradient-size":"closest-side|closest-corner|farthest-side|farthest-corner|contain|cover","-legacy-radial-gradient-shape":"circle|ellipse","-non-standard-font":"-apple-system-body|-apple-system-headline|-apple-system-subheadline|-apple-system-caption1|-apple-system-caption2|-apple-system-footnote|-apple-system-short-body|-apple-system-short-headline|-apple-system-short-subheadline|-apple-system-short-caption1|-apple-system-short-footnote|-apple-system-tall-body","-non-standard-color":"-moz-ButtonDefault|-moz-ButtonHoverFace|-moz-ButtonHoverText|-moz-CellHighlight|-moz-CellHighlightText|-moz-Combobox|-moz-ComboboxText|-moz-Dialog|-moz-DialogText|-moz-dragtargetzone|-moz-EvenTreeRow|-moz-Field|-moz-FieldText|-moz-html-CellHighlight|-moz-html-CellHighlightText|-moz-mac-accentdarkestshadow|-moz-mac-accentdarkshadow|-moz-mac-accentface|-moz-mac-accentlightesthighlight|-moz-mac-accentlightshadow|-moz-mac-accentregularhighlight|-moz-mac-accentregularshadow|-moz-mac-chrome-active|-moz-mac-chrome-inactive|-moz-mac-focusring|-moz-mac-menuselect|-moz-mac-menushadow|-moz-mac-menutextselect|-moz-MenuHover|-moz-MenuHoverText|-moz-MenuBarText|-moz-MenuBarHoverText|-moz-nativehyperlinktext|-moz-OddTreeRow|-moz-win-communicationstext|-moz-win-mediatext|-moz-activehyperlinktext|-moz-default-background-color|-moz-default-color|-moz-hyperlinktext|-moz-visitedhyperlinktext|-webkit-activelink|-webkit-focus-ring-color|-webkit-link|-webkit-text","-non-standard-image-rendering":"optimize-contrast|-moz-crisp-edges|-o-crisp-edges|-webkit-optimize-contrast","-non-standard-overflow":"-moz-scrollbars-none|-moz-scrollbars-horizontal|-moz-scrollbars-vertical|-moz-hidden-unscrollable","-non-standard-width":"min-intrinsic|intrinsic|-moz-min-content|-moz-max-content|-webkit-min-content|-webkit-max-content","-webkit-gradient()":"-webkit-gradient( <-webkit-gradient-type> , <-webkit-gradient-point> [, <-webkit-gradient-point>|, <-webkit-gradient-radius> , <-webkit-gradient-point>] [, <-webkit-gradient-radius>]? [, <-webkit-gradient-color-stop>]* )","-webkit-gradient-color-stop":"from( <color> )|color-stop( [<number-zero-one>|<percentage>] , <color> )|to( <color> )","-webkit-gradient-point":"[left|center|right|<length-percentage>] [top|center|bottom|<length-percentage>]","-webkit-gradient-radius":"<length>|<percentage>","-webkit-gradient-type":"linear|radial","-webkit-mask-box-repeat":"repeat|stretch|round","-webkit-mask-clip-style":"border|border-box|padding|padding-box|content|content-box|text","-ms-filter-function-list":"<-ms-filter-function>+","-ms-filter-function":"<-ms-filter-function-progid>|<-ms-filter-function-legacy>","-ms-filter-function-progid":"'progid:' [<ident-token> '.']* [<ident-token>|<function-token> <any-value>? )]","-ms-filter-function-legacy":"<ident-token>|<function-token> <any-value>? )","-ms-filter":"<string>","age":"child|young|old","attr-name":"<wq-name>","attr-fallback":"<any-value>","border-radius":"<length-percentage>{1,2}","bottom":"<length>|auto","generic-voice":"[<age>? <gender> <integer>?]","gender":"male|female|neutral","left":"<length>|auto","mask-image":"<mask-reference>#","name-repeat":"repeat( [<positive-integer>|auto-fill] , <line-names>+ )","paint":"none|<color>|<url> [none|<color>]?|context-fill|context-stroke","path()":"path( <string> )","ratio":"<integer> / <integer>","right":"<length>|auto","svg-length":"<percentage>|<length>|<number>","svg-writing-mode":"lr-tb|rl-tb|tb-rl|lr|rl|tb","top":"<length>|auto","track-group":"'(' [<string>* <track-minmax> <string>*]+ ')' ['[' <positive-integer> ']']?|<track-minmax>","track-list-v0":"[<string>* <track-group> <string>*]+|none","track-minmax":"minmax( <track-breadth> , <track-breadth> )|auto|<track-breadth>|fit-content","x":"<number>","y":"<number>","declaration":"<ident-token> : <declaration-value>? ['!' important]?","declaration-list":"[<declaration>? ';']* <declaration>?","url":"url( <string> <url-modifier>* )|<url-token>","url-modifier":"<ident>|<function-token> <any-value> )","number-zero-one":"<number [0,1]>","number-one-or-greater":"<number [1,∞]>","positive-integer":"<integer [0,∞]>"}`);
  const properties = /* @__PURE__ */ JSON.parse(`{"--*":"<declaration-value>","-ms-accelerator":"false|true","-ms-block-progression":"tb|rl|bt|lr","-ms-content-zoom-chaining":"none|chained","-ms-content-zooming":"none|zoom","-ms-content-zoom-limit":"<'-ms-content-zoom-limit-min'> <'-ms-content-zoom-limit-max'>","-ms-content-zoom-limit-max":"<percentage>","-ms-content-zoom-limit-min":"<percentage>","-ms-content-zoom-snap":"<'-ms-content-zoom-snap-type'>||<'-ms-content-zoom-snap-points'>","-ms-content-zoom-snap-points":"snapInterval( <percentage> , <percentage> )|snapList( <percentage># )","-ms-content-zoom-snap-type":"none|proximity|mandatory","-ms-filter":"<string>","-ms-flow-from":"[none|<custom-ident>]#","-ms-flow-into":"[none|<custom-ident>]#","-ms-high-contrast-adjust":"auto|none","-ms-hyphenate-limit-chars":"auto|<integer>{1,3}","-ms-hyphenate-limit-lines":"no-limit|<integer>","-ms-hyphenate-limit-zone":"<percentage>|<length>","-ms-ime-align":"auto|after","-ms-overflow-style":"auto|none|scrollbar|-ms-autohiding-scrollbar","-ms-scrollbar-3dlight-color":"<color>","-ms-scrollbar-arrow-color":"<color>","-ms-scrollbar-base-color":"<color>","-ms-scrollbar-darkshadow-color":"<color>","-ms-scrollbar-face-color":"<color>","-ms-scrollbar-highlight-color":"<color>","-ms-scrollbar-shadow-color":"<color>","-ms-scrollbar-track-color":"<color>","-ms-scroll-chaining":"chained|none","-ms-scroll-limit":"<'-ms-scroll-limit-x-min'> <'-ms-scroll-limit-y-min'> <'-ms-scroll-limit-x-max'> <'-ms-scroll-limit-y-max'>","-ms-scroll-limit-x-max":"auto|<length>","-ms-scroll-limit-x-min":"<length>","-ms-scroll-limit-y-max":"auto|<length>","-ms-scroll-limit-y-min":"<length>","-ms-scroll-rails":"none|railed","-ms-scroll-snap-points-x":"snapInterval( <length-percentage> , <length-percentage> )|snapList( <length-percentage># )","-ms-scroll-snap-points-y":"snapInterval( <length-percentage> , <length-percentage> )|snapList( <length-percentage># )","-ms-scroll-snap-type":"none|proximity|mandatory","-ms-scroll-snap-x":"<'-ms-scroll-snap-type'> <'-ms-scroll-snap-points-x'>","-ms-scroll-snap-y":"<'-ms-scroll-snap-type'> <'-ms-scroll-snap-points-y'>","-ms-scroll-translation":"none|vertical-to-horizontal","-ms-text-autospace":"none|ideograph-alpha|ideograph-numeric|ideograph-parenthesis|ideograph-space","-ms-touch-select":"grippers|none","-ms-user-select":"none|element|text","-ms-wrap-flow":"auto|both|start|end|maximum|clear","-ms-wrap-margin":"<length>","-ms-wrap-through":"wrap|none","-moz-appearance":"none|button|button-arrow-down|button-arrow-next|button-arrow-previous|button-arrow-up|button-bevel|button-focus|caret|checkbox|checkbox-container|checkbox-label|checkmenuitem|dualbutton|groupbox|listbox|listitem|menuarrow|menubar|menucheckbox|menuimage|menuitem|menuitemtext|menulist|menulist-button|menulist-text|menulist-textfield|menupopup|menuradio|menuseparator|meterbar|meterchunk|progressbar|progressbar-vertical|progresschunk|progresschunk-vertical|radio|radio-container|radio-label|radiomenuitem|range|range-thumb|resizer|resizerpanel|scale-horizontal|scalethumbend|scalethumb-horizontal|scalethumbstart|scalethumbtick|scalethumb-vertical|scale-vertical|scrollbarbutton-down|scrollbarbutton-left|scrollbarbutton-right|scrollbarbutton-up|scrollbarthumb-horizontal|scrollbarthumb-vertical|scrollbartrack-horizontal|scrollbartrack-vertical|searchfield|separator|sheet|spinner|spinner-downbutton|spinner-textfield|spinner-upbutton|splitter|statusbar|statusbarpanel|tab|tabpanel|tabpanels|tab-scroll-arrow-back|tab-scroll-arrow-forward|textfield|textfield-multiline|toolbar|toolbarbutton|toolbarbutton-dropdown|toolbargripper|toolbox|tooltip|treeheader|treeheadercell|treeheadersortarrow|treeitem|treeline|treetwisty|treetwistyopen|treeview|-moz-mac-unified-toolbar|-moz-win-borderless-glass|-moz-win-browsertabbar-toolbox|-moz-win-communicationstext|-moz-win-communications-toolbox|-moz-win-exclude-glass|-moz-win-glass|-moz-win-mediatext|-moz-win-media-toolbox|-moz-window-button-box|-moz-window-button-box-maximized|-moz-window-button-close|-moz-window-button-maximize|-moz-window-button-minimize|-moz-window-button-restore|-moz-window-frame-bottom|-moz-window-frame-left|-moz-window-frame-right|-moz-window-titlebar|-moz-window-titlebar-maximized","-moz-binding":"<url>|none","-moz-border-bottom-colors":"<color>+|none","-moz-border-left-colors":"<color>+|none","-moz-border-right-colors":"<color>+|none","-moz-border-top-colors":"<color>+|none","-moz-context-properties":"none|[fill|fill-opacity|stroke|stroke-opacity]#","-moz-float-edge":"border-box|content-box|margin-box|padding-box","-moz-force-broken-image-icon":"<integer>","-moz-image-region":"<shape>|auto","-moz-orient":"inline|block|horizontal|vertical","-moz-outline-radius":"<outline-radius>{1,4} [/ <outline-radius>{1,4}]?","-moz-outline-radius-bottomleft":"<outline-radius>","-moz-outline-radius-bottomright":"<outline-radius>","-moz-outline-radius-topleft":"<outline-radius>","-moz-outline-radius-topright":"<outline-radius>","-moz-stack-sizing":"ignore|stretch-to-fit","-moz-text-blink":"none|blink","-moz-user-focus":"ignore|normal|select-after|select-before|select-menu|select-same|select-all|none","-moz-user-input":"auto|none|enabled|disabled","-moz-user-modify":"read-only|read-write|write-only","-moz-window-dragging":"drag|no-drag","-moz-window-shadow":"default|menu|tooltip|sheet|none","-webkit-appearance":"none|button|button-bevel|caps-lock-indicator|caret|checkbox|default-button|listbox|listitem|media-fullscreen-button|media-mute-button|media-play-button|media-seek-back-button|media-seek-forward-button|media-slider|media-sliderthumb|menulist|menulist-button|menulist-text|menulist-textfield|push-button|radio|scrollbarbutton-down|scrollbarbutton-left|scrollbarbutton-right|scrollbarbutton-up|scrollbargripper-horizontal|scrollbargripper-vertical|scrollbarthumb-horizontal|scrollbarthumb-vertical|scrollbartrack-horizontal|scrollbartrack-vertical|searchfield|searchfield-cancel-button|searchfield-decoration|searchfield-results-button|searchfield-results-decoration|slider-horizontal|slider-vertical|sliderthumb-horizontal|sliderthumb-vertical|square-button|textarea|textfield","-webkit-border-before":"<'border-width'>||<'border-style'>||<'color'>","-webkit-border-before-color":"<'color'>","-webkit-border-before-style":"<'border-style'>","-webkit-border-before-width":"<'border-width'>","-webkit-box-reflect":"[above|below|right|left]? <length>? <image>?","-webkit-line-clamp":"none|<integer>","-webkit-mask":"[<mask-reference>||<position> [/ <bg-size>]?||<repeat-style>||[<box>|border|padding|content|text]||[<box>|border|padding|content]]#","-webkit-mask-attachment":"<attachment>#","-webkit-mask-clip":"[<box>|border|padding|content|text]#","-webkit-mask-composite":"<composite-style>#","-webkit-mask-image":"<mask-reference>#","-webkit-mask-origin":"[<box>|border|padding|content]#","-webkit-mask-position":"<position>#","-webkit-mask-position-x":"[<length-percentage>|left|center|right]#","-webkit-mask-position-y":"[<length-percentage>|top|center|bottom]#","-webkit-mask-repeat":"<repeat-style>#","-webkit-mask-repeat-x":"repeat|no-repeat|space|round","-webkit-mask-repeat-y":"repeat|no-repeat|space|round","-webkit-mask-size":"<bg-size>#","-webkit-overflow-scrolling":"auto|touch","-webkit-tap-highlight-color":"<color>","-webkit-text-fill-color":"<color>","-webkit-text-stroke":"<length>||<color>","-webkit-text-stroke-color":"<color>","-webkit-text-stroke-width":"<length>","-webkit-touch-callout":"default|none","-webkit-user-modify":"read-only|read-write|read-write-plaintext-only","align-content":"normal|<baseline-position>|<content-distribution>|<overflow-position>? <content-position>","align-items":"normal|stretch|<baseline-position>|[<overflow-position>? <self-position>]","align-self":"auto|normal|stretch|<baseline-position>|<overflow-position>? <self-position>","all":"initial|inherit|unset|revert","animation":"<single-animation>#","animation-delay":"<time>#","animation-direction":"<single-animation-direction>#","animation-duration":"<time>#","animation-fill-mode":"<single-animation-fill-mode>#","animation-iteration-count":"<single-animation-iteration-count>#","animation-name":"[none|<keyframes-name>]#","animation-play-state":"<single-animation-play-state>#","animation-timing-function":"<timing-function>#","appearance":"none|auto|button|textfield|<compat>","azimuth":"<angle>|[[left-side|far-left|left|center-left|center|center-right|right|far-right|right-side]||behind]|leftwards|rightwards","backdrop-filter":"none|<filter-function-list>","backface-visibility":"visible|hidden","background":"[<bg-layer> ,]* <final-bg-layer>","background-attachment":"<attachment>#","background-blend-mode":"<blend-mode>#","background-clip":"<box>#","background-color":"<color>","background-image":"<bg-image>#","background-origin":"<box>#","background-position":"<bg-position>#","background-position-x":"[center|[left|right|x-start|x-end]? <length-percentage>?]#","background-position-y":"[center|[top|bottom|y-start|y-end]? <length-percentage>?]#","background-repeat":"<repeat-style>#","background-size":"<bg-size>#","block-overflow":"clip|ellipsis|<string>","block-size":"<'width'>","border":"<line-width>||<line-style>||<color>","border-block":"<'border-top-width'>||<'border-top-style'>||<'color'>","border-block-color":"<'border-top-color'>{1,2}","border-block-style":"<'border-top-style'>","border-block-width":"<'border-top-width'>","border-block-end":"<'border-top-width'>||<'border-top-style'>||<'color'>","border-block-end-color":"<'border-top-color'>","border-block-end-style":"<'border-top-style'>","border-block-end-width":"<'border-top-width'>","border-block-start":"<'border-top-width'>||<'border-top-style'>||<'color'>","border-block-start-color":"<'border-top-color'>","border-block-start-style":"<'border-top-style'>","border-block-start-width":"<'border-top-width'>","border-bottom":"<line-width>||<line-style>||<color>","border-bottom-color":"<'border-top-color'>","border-bottom-left-radius":"<length-percentage>{1,2}","border-bottom-right-radius":"<length-percentage>{1,2}","border-bottom-style":"<line-style>","border-bottom-width":"<line-width>","border-collapse":"collapse|separate","border-color":"<color>{1,4}","border-end-end-radius":"<length-percentage>{1,2}","border-end-start-radius":"<length-percentage>{1,2}","border-image":"<'border-image-source'>||<'border-image-slice'> [/ <'border-image-width'>|/ <'border-image-width'>? / <'border-image-outset'>]?||<'border-image-repeat'>","border-image-outset":"[<length>|<number>]{1,4}","border-image-repeat":"[stretch|repeat|round|space]{1,2}","border-image-slice":"<number-percentage>{1,4}&&fill?","border-image-source":"none|<image>","border-image-width":"[<length-percentage>|<number>|auto]{1,4}","border-inline":"<'border-top-width'>||<'border-top-style'>||<'color'>","border-inline-end":"<'border-top-width'>||<'border-top-style'>||<'color'>","border-inline-color":"<'border-top-color'>{1,2}","border-inline-style":"<'border-top-style'>","border-inline-width":"<'border-top-width'>","border-inline-end-color":"<'border-top-color'>","border-inline-end-style":"<'border-top-style'>","border-inline-end-width":"<'border-top-width'>","border-inline-start":"<'border-top-width'>||<'border-top-style'>||<'color'>","border-inline-start-color":"<'border-top-color'>","border-inline-start-style":"<'border-top-style'>","border-inline-start-width":"<'border-top-width'>","border-left":"<line-width>||<line-style>||<color>","border-left-color":"<color>","border-left-style":"<line-style>","border-left-width":"<line-width>","border-radius":"<length-percentage>{1,4} [/ <length-percentage>{1,4}]?","border-right":"<line-width>||<line-style>||<color>","border-right-color":"<color>","border-right-style":"<line-style>","border-right-width":"<line-width>","border-spacing":"<length> <length>?","border-start-end-radius":"<length-percentage>{1,2}","border-start-start-radius":"<length-percentage>{1,2}","border-style":"<line-style>{1,4}","border-top":"<line-width>||<line-style>||<color>","border-top-color":"<color>","border-top-left-radius":"<length-percentage>{1,2}","border-top-right-radius":"<length-percentage>{1,2}","border-top-style":"<line-style>","border-top-width":"<line-width>","border-width":"<line-width>{1,4}","bottom":"<length>|<percentage>|auto","box-align":"start|center|end|baseline|stretch","box-decoration-break":"slice|clone","box-direction":"normal|reverse|inherit","box-flex":"<number>","box-flex-group":"<integer>","box-lines":"single|multiple","box-ordinal-group":"<integer>","box-orient":"horizontal|vertical|inline-axis|block-axis|inherit","box-pack":"start|center|end|justify","box-shadow":"none|<shadow>#","box-sizing":"content-box|border-box","break-after":"auto|avoid|always|all|avoid-page|page|left|right|recto|verso|avoid-column|column|avoid-region|region","break-before":"auto|avoid|always|all|avoid-page|page|left|right|recto|verso|avoid-column|column|avoid-region|region","break-inside":"auto|avoid|avoid-page|avoid-column|avoid-region","caption-side":"top|bottom|block-start|block-end|inline-start|inline-end","caret-color":"auto|<color>","clear":"none|left|right|both|inline-start|inline-end","clip":"<shape>|auto","clip-path":"<clip-source>|[<basic-shape>||<geometry-box>]|none","color":"<color>","color-adjust":"economy|exact","column-count":"<integer>|auto","column-fill":"auto|balance|balance-all","column-gap":"normal|<length-percentage>","column-rule":"<'column-rule-width'>||<'column-rule-style'>||<'column-rule-color'>","column-rule-color":"<color>","column-rule-style":"<'border-style'>","column-rule-width":"<'border-width'>","column-span":"none|all","column-width":"<length>|auto","columns":"<'column-width'>||<'column-count'>","contain":"none|strict|content|[size||layout||style||paint]","content":"normal|none|[<content-replacement>|<content-list>] [/ <string>]?","counter-increment":"[<custom-ident> <integer>?]+|none","counter-reset":"[<custom-ident> <integer>?]+|none","counter-set":"[<custom-ident> <integer>?]+|none","cursor":"[[<url> [<x> <y>]? ,]* [auto|default|none|context-menu|help|pointer|progress|wait|cell|crosshair|text|vertical-text|alias|copy|move|no-drop|not-allowed|e-resize|n-resize|ne-resize|nw-resize|s-resize|se-resize|sw-resize|w-resize|ew-resize|ns-resize|nesw-resize|nwse-resize|col-resize|row-resize|all-scroll|zoom-in|zoom-out|grab|grabbing|hand|-webkit-grab|-webkit-grabbing|-webkit-zoom-in|-webkit-zoom-out|-moz-grab|-moz-grabbing|-moz-zoom-in|-moz-zoom-out]]","direction":"ltr|rtl","display":"block|contents|flex|flow|flow-root|grid|inline|inline-block|inline-flex|inline-grid|inline-list-item|inline-table|list-item|none|ruby|ruby-base|ruby-base-container|ruby-text|ruby-text-container|run-in|table|table-caption|table-cell|table-column|table-column-group|table-footer-group|table-header-group|table-row|table-row-group|-ms-flexbox|-ms-inline-flexbox|-ms-grid|-ms-inline-grid|-webkit-flex|-webkit-inline-flex|-webkit-box|-webkit-inline-box|-moz-inline-stack|-moz-box|-moz-inline-box","empty-cells":"show|hide","filter":"none|<filter-function-list>|<-ms-filter-function-list>","flex":"none|[<'flex-grow'> <'flex-shrink'>?||<'flex-basis'>]","flex-basis":"content|<'width'>","flex-direction":"row|row-reverse|column|column-reverse","flex-flow":"<'flex-direction'>||<'flex-wrap'>","flex-grow":"<number>","flex-shrink":"<number>","flex-wrap":"nowrap|wrap|wrap-reverse","float":"left|right|none|inline-start|inline-end","font":"[[<'font-style'>||<font-variant-css21>||<'font-weight'>||<'font-stretch'>]? <'font-size'> [/ <'line-height'>]? <'font-family'>]|caption|icon|menu|message-box|small-caption|status-bar","font-family":"[<family-name>|<generic-family>]#","font-feature-settings":"normal|<feature-tag-value>#","font-kerning":"auto|normal|none","font-language-override":"normal|<string>","font-optical-sizing":"auto|none","font-variation-settings":"normal|[<string> <number>]#","font-size":"<absolute-size>|<relative-size>|<length-percentage>","font-size-adjust":"none|<number>","font-stretch":"<font-stretch-absolute>","font-style":"normal|italic|oblique <angle>?","font-synthesis":"none|[weight||style]","font-variant":"normal|none|[<common-lig-values>||<discretionary-lig-values>||<historical-lig-values>||<contextual-alt-values>||stylistic( <feature-value-name> )||historical-forms||styleset( <feature-value-name># )||character-variant( <feature-value-name># )||swash( <feature-value-name> )||ornaments( <feature-value-name> )||annotation( <feature-value-name> )||[small-caps|all-small-caps|petite-caps|all-petite-caps|unicase|titling-caps]||<numeric-figure-values>||<numeric-spacing-values>||<numeric-fraction-values>||ordinal||slashed-zero||<east-asian-variant-values>||<east-asian-width-values>||ruby]","font-variant-alternates":"normal|[stylistic( <feature-value-name> )||historical-forms||styleset( <feature-value-name># )||character-variant( <feature-value-name># )||swash( <feature-value-name> )||ornaments( <feature-value-name> )||annotation( <feature-value-name> )]","font-variant-caps":"normal|small-caps|all-small-caps|petite-caps|all-petite-caps|unicase|titling-caps","font-variant-east-asian":"normal|[<east-asian-variant-values>||<east-asian-width-values>||ruby]","font-variant-ligatures":"normal|none|[<common-lig-values>||<discretionary-lig-values>||<historical-lig-values>||<contextual-alt-values>]","font-variant-numeric":"normal|[<numeric-figure-values>||<numeric-spacing-values>||<numeric-fraction-values>||ordinal||slashed-zero]","font-variant-position":"normal|sub|super","font-weight":"<font-weight-absolute>|bolder|lighter","gap":"<'row-gap'> <'column-gap'>?","grid":"<'grid-template'>|<'grid-template-rows'> / [auto-flow&&dense?] <'grid-auto-columns'>?|[auto-flow&&dense?] <'grid-auto-rows'>? / <'grid-template-columns'>","grid-area":"<grid-line> [/ <grid-line>]{0,3}","grid-auto-columns":"<track-size>+","grid-auto-flow":"[row|column]||dense","grid-auto-rows":"<track-size>+","grid-column":"<grid-line> [/ <grid-line>]?","grid-column-end":"<grid-line>","grid-column-gap":"<length-percentage>","grid-column-start":"<grid-line>","grid-gap":"<'grid-row-gap'> <'grid-column-gap'>?","grid-row":"<grid-line> [/ <grid-line>]?","grid-row-end":"<grid-line>","grid-row-gap":"<length-percentage>","grid-row-start":"<grid-line>","grid-template":"none|[<'grid-template-rows'> / <'grid-template-columns'>]|[<line-names>? <string> <track-size>? <line-names>?]+ [/ <explicit-track-list>]?","grid-template-areas":"none|<string>+","grid-template-columns":"none|<track-list>|<auto-track-list>","grid-template-rows":"none|<track-list>|<auto-track-list>","hanging-punctuation":"none|[first||[force-end|allow-end]||last]","height":"[<length>|<percentage>]&&[border-box|content-box]?|available|min-content|max-content|fit-content|auto","hyphens":"none|manual|auto","image-orientation":"from-image|<angle>|[<angle>? flip]","image-rendering":"auto|crisp-edges|pixelated|optimizeSpeed|optimizeQuality|<-non-standard-image-rendering>","image-resolution":"[from-image||<resolution>]&&snap?","ime-mode":"auto|normal|active|inactive|disabled","initial-letter":"normal|[<number> <integer>?]","initial-letter-align":"[auto|alphabetic|hanging|ideographic]","inline-size":"<'width'>","inset":"<'top'>{1,4}","inset-block":"<'top'>{1,2}","inset-block-end":"<'top'>","inset-block-start":"<'top'>","inset-inline":"<'top'>{1,2}","inset-inline-end":"<'top'>","inset-inline-start":"<'top'>","isolation":"auto|isolate","justify-content":"normal|<content-distribution>|<overflow-position>? [<content-position>|left|right]","justify-items":"normal|stretch|<baseline-position>|<overflow-position>? [<self-position>|left|right]|legacy|legacy&&[left|right|center]","justify-self":"auto|normal|stretch|<baseline-position>|<overflow-position>? [<self-position>|left|right]","left":"<length>|<percentage>|auto","letter-spacing":"normal|<length-percentage>","line-break":"auto|loose|normal|strict","line-clamp":"none|<integer>","line-height":"normal|<number>|<length>|<percentage>","line-height-step":"<length>","list-style":"<'list-style-type'>||<'list-style-position'>||<'list-style-image'>","list-style-image":"<url>|none","list-style-position":"inside|outside","list-style-type":"<counter-style>|<string>|none","margin":"[<length>|<percentage>|auto]{1,4}","margin-block":"<'margin-left'>{1,2}","margin-block-end":"<'margin-left'>","margin-block-start":"<'margin-left'>","margin-bottom":"<length>|<percentage>|auto","margin-inline":"<'margin-left'>{1,2}","margin-inline-end":"<'margin-left'>","margin-inline-start":"<'margin-left'>","margin-left":"<length>|<percentage>|auto","margin-right":"<length>|<percentage>|auto","margin-top":"<length>|<percentage>|auto","mask":"<mask-layer>#","mask-border":"<'mask-border-source'>||<'mask-border-slice'> [/ <'mask-border-width'>? [/ <'mask-border-outset'>]?]?||<'mask-border-repeat'>||<'mask-border-mode'>","mask-border-mode":"luminance|alpha","mask-border-outset":"[<length>|<number>]{1,4}","mask-border-repeat":"[stretch|repeat|round|space]{1,2}","mask-border-slice":"<number-percentage>{1,4} fill?","mask-border-source":"none|<image>","mask-border-width":"[<length-percentage>|<number>|auto]{1,4}","mask-clip":"[<geometry-box>|no-clip]#","mask-composite":"<compositing-operator>#","mask-image":"<mask-reference>#","mask-mode":"<masking-mode>#","mask-origin":"<geometry-box>#","mask-position":"<position>#","mask-repeat":"<repeat-style>#","mask-size":"<bg-size>#","mask-type":"luminance|alpha","max-block-size":"<'max-width'>","max-height":"<length>|<percentage>|none|max-content|min-content|fit-content|fill-available","max-inline-size":"<'max-width'>","max-lines":"none|<integer>","max-width":"<length>|<percentage>|none|max-content|min-content|fit-content|fill-available|<-non-standard-width>","min-block-size":"<'min-width'>","min-height":"<length>|<percentage>|auto|max-content|min-content|fit-content|fill-available","min-inline-size":"<'min-width'>","min-width":"<length>|<percentage>|auto|max-content|min-content|fit-content|fill-available|<-non-standard-width>","mix-blend-mode":"<blend-mode>","object-fit":"fill|contain|cover|none|scale-down","object-position":"<position>","offset":"[<'offset-position'>? [<'offset-path'> [<'offset-distance'>||<'offset-rotate'>]?]?]! [/ <'offset-anchor'>]?","offset-anchor":"auto|<position>","offset-distance":"<length-percentage>","offset-path":"none|ray( [<angle>&&<size>?&&contain?] )|<path()>|<url>|[<basic-shape>||<geometry-box>]","offset-position":"auto|<position>","offset-rotate":"[auto|reverse]||<angle>","opacity":"<number-zero-one>","order":"<integer>","orphans":"<integer>","outline":"[<'outline-color'>||<'outline-style'>||<'outline-width'>]","outline-color":"<color>|invert","outline-offset":"<length>","outline-style":"auto|<'border-style'>","outline-width":"<line-width>","overflow":"[visible|hidden|clip|scroll|auto]{1,2}|<-non-standard-overflow>","overflow-anchor":"auto|none","overflow-block":"visible|hidden|clip|scroll|auto","overflow-clip-box":"padding-box|content-box","overflow-inline":"visible|hidden|clip|scroll|auto","overflow-wrap":"normal|break-word|anywhere","overflow-x":"visible|hidden|clip|scroll|auto","overflow-y":"visible|hidden|clip|scroll|auto","overscroll-behavior":"[contain|none|auto]{1,2}","overscroll-behavior-x":"contain|none|auto","overscroll-behavior-y":"contain|none|auto","padding":"[<length>|<percentage>]{1,4}","padding-block":"<'padding-left'>{1,2}","padding-block-end":"<'padding-left'>","padding-block-start":"<'padding-left'>","padding-bottom":"<length>|<percentage>","padding-inline":"<'padding-left'>{1,2}","padding-inline-end":"<'padding-left'>","padding-inline-start":"<'padding-left'>","padding-left":"<length>|<percentage>","padding-right":"<length>|<percentage>","padding-top":"<length>|<percentage>","page-break-after":"auto|always|avoid|left|right|recto|verso","page-break-before":"auto|always|avoid|left|right|recto|verso","page-break-inside":"auto|avoid","paint-order":"normal|[fill||stroke||markers]","perspective":"none|<length>","perspective-origin":"<position>","place-content":"<'align-content'> <'justify-content'>?","place-items":"<'align-items'> <'justify-items'>?","place-self":"<'align-self'> <'justify-self'>?","pointer-events":"auto|none|visiblePainted|visibleFill|visibleStroke|visible|painted|fill|stroke|all|inherit","position":"static|relative|absolute|sticky|fixed|-webkit-sticky","quotes":"none|[<string> <string>]+","resize":"none|both|horizontal|vertical|block|inline","right":"<length>|<percentage>|auto","rotate":"none|<angle>|[x|y|z|<number>{3}]&&<angle>","row-gap":"normal|<length-percentage>","ruby-align":"start|center|space-between|space-around","ruby-merge":"separate|collapse|auto","ruby-position":"over|under|inter-character","scale":"none|<number>{1,3}","scrollbar-color":"auto|dark|light|<color>{2}","scrollbar-width":"auto|thin|none","scroll-behavior":"auto|smooth","scroll-margin":"<length>{1,4}","scroll-margin-block":"<length>{1,2}","scroll-margin-block-start":"<length>","scroll-margin-block-end":"<length>","scroll-margin-bottom":"<length>","scroll-margin-inline":"<length>{1,2}","scroll-margin-inline-start":"<length>","scroll-margin-inline-end":"<length>","scroll-margin-left":"<length>","scroll-margin-right":"<length>","scroll-margin-top":"<length>","scroll-padding":"[auto|<length-percentage>]{1,4}","scroll-padding-block":"[auto|<length-percentage>]{1,2}","scroll-padding-block-start":"auto|<length-percentage>","scroll-padding-block-end":"auto|<length-percentage>","scroll-padding-bottom":"auto|<length-percentage>","scroll-padding-inline":"[auto|<length-percentage>]{1,2}","scroll-padding-inline-start":"auto|<length-percentage>","scroll-padding-inline-end":"auto|<length-percentage>","scroll-padding-left":"auto|<length-percentage>","scroll-padding-right":"auto|<length-percentage>","scroll-padding-top":"auto|<length-percentage>","scroll-snap-align":"[none|start|end|center]{1,2}","scroll-snap-coordinate":"none|<position>#","scroll-snap-destination":"<position>","scroll-snap-points-x":"none|repeat( <length-percentage> )","scroll-snap-points-y":"none|repeat( <length-percentage> )","scroll-snap-stop":"normal|always","scroll-snap-type":"none|[x|y|block|inline|both] [mandatory|proximity]?","scroll-snap-type-x":"none|mandatory|proximity","scroll-snap-type-y":"none|mandatory|proximity","shape-image-threshold":"<number>","shape-margin":"<length-percentage>","shape-outside":"none|<shape-box>||<basic-shape>|<image>","tab-size":"<integer>|<length>","table-layout":"auto|fixed","text-align":"start|end|left|right|center|justify|match-parent","text-align-last":"auto|start|end|left|right|center|justify","text-combine-upright":"none|all|[digits <integer>?]","text-decoration":"<'text-decoration-line'>||<'text-decoration-style'>||<'text-decoration-color'>","text-decoration-color":"<color>","text-decoration-line":"none|[underline||overline||line-through||blink]","text-decoration-skip":"none|[objects||[spaces|[leading-spaces||trailing-spaces]]||edges||box-decoration]","text-decoration-skip-ink":"auto|none","text-decoration-style":"solid|double|dotted|dashed|wavy","text-emphasis":"<'text-emphasis-style'>||<'text-emphasis-color'>","text-emphasis-color":"<color>","text-emphasis-position":"[over|under]&&[right|left]","text-emphasis-style":"none|[[filled|open]||[dot|circle|double-circle|triangle|sesame]]|<string>","text-indent":"<length-percentage>&&hanging?&&each-line?","text-justify":"auto|inter-character|inter-word|none","text-orientation":"mixed|upright|sideways","text-overflow":"[clip|ellipsis|<string>]{1,2}","text-rendering":"auto|optimizeSpeed|optimizeLegibility|geometricPrecision","text-shadow":"none|<shadow-t>#","text-size-adjust":"none|auto|<percentage>","text-transform":"none|capitalize|uppercase|lowercase|full-width|full-size-kana","text-underline-position":"auto|[under||[left|right]]","top":"<length>|<percentage>|auto","touch-action":"auto|none|[[pan-x|pan-left|pan-right]||[pan-y|pan-up|pan-down]||pinch-zoom]|manipulation","transform":"none|<transform-list>","transform-box":"border-box|fill-box|view-box","transform-origin":"[<length-percentage>|left|center|right|top|bottom]|[[<length-percentage>|left|center|right]&&[<length-percentage>|top|center|bottom]] <length>?","transform-style":"flat|preserve-3d","transition":"<single-transition>#","transition-delay":"<time>#","transition-duration":"<time>#","transition-property":"none|<single-transition-property>#","transition-timing-function":"<timing-function>#","translate":"none|<length-percentage> [<length-percentage> <length>?]?","unicode-bidi":"normal|embed|isolate|bidi-override|isolate-override|plaintext|-moz-isolate|-moz-isolate-override|-moz-plaintext|-webkit-isolate","user-select":"auto|text|none|contain|all","vertical-align":"baseline|sub|super|text-top|text-bottom|middle|top|bottom|<percentage>|<length>","visibility":"visible|hidden|collapse","white-space":"normal|pre|nowrap|pre-wrap|pre-line","widows":"<integer>","width":"[<length>|<percentage>]&&[border-box|content-box]?|available|min-content|max-content|fit-content|auto","will-change":"auto|<animateable-feature>#","word-break":"normal|break-all|keep-all|break-word","word-spacing":"normal|<length-percentage>","word-wrap":"normal|break-word","writing-mode":"horizontal-tb|vertical-rl|vertical-lr|sideways-rl|sideways-lr|<svg-writing-mode>","z-index":"auto|<integer>","zoom":"normal|reset|<number>|<percentage>","-moz-background-clip":"padding|border","-moz-border-radius-bottomleft":"<'border-bottom-left-radius'>","-moz-border-radius-bottomright":"<'border-bottom-right-radius'>","-moz-border-radius-topleft":"<'border-top-left-radius'>","-moz-border-radius-topright":"<'border-bottom-right-radius'>","-moz-control-character-visibility":"visible|hidden","-moz-osx-font-smoothing":"auto|grayscale","-moz-user-select":"none|text|all|-moz-none","-ms-flex-align":"start|end|center|baseline|stretch","-ms-flex-item-align":"auto|start|end|center|baseline|stretch","-ms-flex-line-pack":"start|end|center|justify|distribute|stretch","-ms-flex-negative":"<'flex-shrink'>","-ms-flex-pack":"start|end|center|justify|distribute","-ms-flex-order":"<integer>","-ms-flex-positive":"<'flex-grow'>","-ms-flex-preferred-size":"<'flex-basis'>","-ms-interpolation-mode":"nearest-neighbor|bicubic","-ms-grid-column-align":"start|end|center|stretch","-ms-grid-columns":"<track-list-v0>","-ms-grid-row-align":"start|end|center|stretch","-ms-grid-rows":"<track-list-v0>","-ms-hyphenate-limit-last":"none|always|column|page|spread","-webkit-background-clip":"[<box>|border|padding|content|text]#","-webkit-column-break-after":"always|auto|avoid","-webkit-column-break-before":"always|auto|avoid","-webkit-column-break-inside":"always|auto|avoid","-webkit-font-smoothing":"auto|none|antialiased|subpixel-antialiased","-webkit-mask-box-image":"[<url>|<gradient>|none] [<length-percentage>{4} <-webkit-mask-box-repeat>{2}]?","-webkit-print-color-adjust":"economy|exact","-webkit-text-security":"none|circle|disc|square","-webkit-user-drag":"none|element|auto","-webkit-user-select":"auto|none|text|all","alignment-baseline":"auto|baseline|before-edge|text-before-edge|middle|central|after-edge|text-after-edge|ideographic|alphabetic|hanging|mathematical","baseline-shift":"baseline|sub|super|<svg-length>","behavior":"<url>+","clip-rule":"nonzero|evenodd","cue":"<'cue-before'> <'cue-after'>?","cue-after":"<url> <decibel>?|none","cue-before":"<url> <decibel>?|none","dominant-baseline":"auto|use-script|no-change|reset-size|ideographic|alphabetic|hanging|mathematical|central|middle|text-after-edge|text-before-edge","fill":"<paint>","fill-opacity":"<number-zero-one>","fill-rule":"nonzero|evenodd","glyph-orientation-horizontal":"<angle>","glyph-orientation-vertical":"<angle>","kerning":"auto|<svg-length>","marker":"none|<url>","marker-end":"none|<url>","marker-mid":"none|<url>","marker-start":"none|<url>","pause":"<'pause-before'> <'pause-after'>?","pause-after":"<time>|none|x-weak|weak|medium|strong|x-strong","pause-before":"<time>|none|x-weak|weak|medium|strong|x-strong","rest":"<'rest-before'> <'rest-after'>?","rest-after":"<time>|none|x-weak|weak|medium|strong|x-strong","rest-before":"<time>|none|x-weak|weak|medium|strong|x-strong","shape-rendering":"auto|optimizeSpeed|crispEdges|geometricPrecision","src":"[<url> [format( <string># )]?|local( <family-name> )]#","speak":"auto|none|normal","speak-as":"normal|spell-out||digits||[literal-punctuation|no-punctuation]","stroke":"<paint>","stroke-dasharray":"none|[<svg-length>+]#","stroke-dashoffset":"<svg-length>","stroke-linecap":"butt|round|square","stroke-linejoin":"miter|round|bevel","stroke-miterlimit":"<number-one-or-greater>","stroke-opacity":"<number-zero-one>","stroke-width":"<svg-length>","text-anchor":"start|middle|end","unicode-range":"<urange>#","voice-balance":"<number>|left|center|right|leftwards|rightwards","voice-duration":"auto|<time>","voice-family":"[[<family-name>|<generic-voice>] ,]* [<family-name>|<generic-voice>]|preserve","voice-pitch":"<frequency>&&absolute|[[x-low|low|medium|high|x-high]||[<frequency>|<semitones>|<percentage>]]","voice-range":"<frequency>&&absolute|[[x-low|low|medium|high|x-high]||[<frequency>|<semitones>|<percentage>]]","voice-rate":"[normal|x-slow|slow|medium|fast|x-fast]||<percentage>","voice-stress":"normal|strong|moderate|none|reduced","voice-volume":"silent|[[x-soft|soft|medium|loud|x-loud]||<decibel>]"}`);
  const require$$0 = {
    types,
    properties
  };
  var AnPlusB;
  var hasRequiredAnPlusB;
  function requireAnPlusB() {
    if (hasRequiredAnPlusB) return AnPlusB;
    hasRequiredAnPlusB = 1;
    var cmpChar = requireTokenizer$1().cmpChar;
    var isDigit = requireTokenizer$1().isDigit;
    var TYPE = requireTokenizer$1().TYPE;
    var WHITESPACE = TYPE.WhiteSpace;
    var COMMENT = TYPE.Comment;
    var IDENT = TYPE.Ident;
    var NUMBER = TYPE.Number;
    var DIMENSION = TYPE.Dimension;
    var PLUSSIGN = 43;
    var HYPHENMINUS = 45;
    var N = 110;
    var DISALLOW_SIGN = true;
    var ALLOW_SIGN = false;
    function checkInteger(offset, disallowSign) {
      var pos = this.scanner.tokenStart + offset;
      var code = this.scanner.source.charCodeAt(pos);
      if (code === PLUSSIGN || code === HYPHENMINUS) {
        if (disallowSign) {
          this.error("Number sign is not allowed");
        }
        pos++;
      }
      for (; pos < this.scanner.tokenEnd; pos++) {
        if (!isDigit(this.scanner.source.charCodeAt(pos))) {
          this.error("Integer is expected", pos);
        }
      }
    }
    function checkTokenIsInteger(disallowSign) {
      return checkInteger.call(this, 0, disallowSign);
    }
    function expectCharCode(offset, code) {
      if (!cmpChar(this.scanner.source, this.scanner.tokenStart + offset, code)) {
        var msg = "";
        switch (code) {
          case N:
            msg = "N is expected";
            break;
          case HYPHENMINUS:
            msg = "HyphenMinus is expected";
            break;
        }
        this.error(msg, this.scanner.tokenStart + offset);
      }
    }
    function consumeB() {
      var offset = 0;
      var sign = 0;
      var type = this.scanner.tokenType;
      while (type === WHITESPACE || type === COMMENT) {
        type = this.scanner.lookupType(++offset);
      }
      if (type !== NUMBER) {
        if (this.scanner.isDelim(PLUSSIGN, offset) || this.scanner.isDelim(HYPHENMINUS, offset)) {
          sign = this.scanner.isDelim(PLUSSIGN, offset) ? PLUSSIGN : HYPHENMINUS;
          do {
            type = this.scanner.lookupType(++offset);
          } while (type === WHITESPACE || type === COMMENT);
          if (type !== NUMBER) {
            this.scanner.skip(offset);
            checkTokenIsInteger.call(this, DISALLOW_SIGN);
          }
        } else {
          return null;
        }
      }
      if (offset > 0) {
        this.scanner.skip(offset);
      }
      if (sign === 0) {
        type = this.scanner.source.charCodeAt(this.scanner.tokenStart);
        if (type !== PLUSSIGN && type !== HYPHENMINUS) {
          this.error("Number sign is expected");
        }
      }
      checkTokenIsInteger.call(this, sign !== 0);
      return sign === HYPHENMINUS ? "-" + this.consume(NUMBER) : this.consume(NUMBER);
    }
    AnPlusB = {
      name: "AnPlusB",
      structure: {
        a: [String, null],
        b: [String, null]
      },
      parse: function() {
        var start = this.scanner.tokenStart;
        var a = null;
        var b = null;
        if (this.scanner.tokenType === NUMBER) {
          checkTokenIsInteger.call(this, ALLOW_SIGN);
          b = this.consume(NUMBER);
        } else if (this.scanner.tokenType === IDENT && cmpChar(this.scanner.source, this.scanner.tokenStart, HYPHENMINUS)) {
          a = "-1";
          expectCharCode.call(this, 1, N);
          switch (this.scanner.getTokenLength()) {
            // -n
            // -n <signed-integer>
            // -n ['+' | '-'] <signless-integer>
            case 2:
              this.scanner.next();
              b = consumeB.call(this);
              break;
            // -n- <signless-integer>
            case 3:
              expectCharCode.call(this, 2, HYPHENMINUS);
              this.scanner.next();
              this.scanner.skipSC();
              checkTokenIsInteger.call(this, DISALLOW_SIGN);
              b = "-" + this.consume(NUMBER);
              break;
            // <dashndashdigit-ident>
            default:
              expectCharCode.call(this, 2, HYPHENMINUS);
              checkInteger.call(this, 3, DISALLOW_SIGN);
              this.scanner.next();
              b = this.scanner.substrToCursor(start + 2);
          }
        } else if (this.scanner.tokenType === IDENT || this.scanner.isDelim(PLUSSIGN) && this.scanner.lookupType(1) === IDENT) {
          var sign = 0;
          a = "1";
          if (this.scanner.isDelim(PLUSSIGN)) {
            sign = 1;
            this.scanner.next();
          }
          expectCharCode.call(this, 0, N);
          switch (this.scanner.getTokenLength()) {
            // '+'? n
            // '+'? n <signed-integer>
            // '+'? n ['+' | '-'] <signless-integer>
            case 1:
              this.scanner.next();
              b = consumeB.call(this);
              break;
            // '+'? n- <signless-integer>
            case 2:
              expectCharCode.call(this, 1, HYPHENMINUS);
              this.scanner.next();
              this.scanner.skipSC();
              checkTokenIsInteger.call(this, DISALLOW_SIGN);
              b = "-" + this.consume(NUMBER);
              break;
            // '+'? <ndashdigit-ident>
            default:
              expectCharCode.call(this, 1, HYPHENMINUS);
              checkInteger.call(this, 2, DISALLOW_SIGN);
              this.scanner.next();
              b = this.scanner.substrToCursor(start + sign + 1);
          }
        } else if (this.scanner.tokenType === DIMENSION) {
          var code = this.scanner.source.charCodeAt(this.scanner.tokenStart);
          var sign = code === PLUSSIGN || code === HYPHENMINUS;
          for (var i = this.scanner.tokenStart + sign; i < this.scanner.tokenEnd; i++) {
            if (!isDigit(this.scanner.source.charCodeAt(i))) {
              break;
            }
          }
          if (i === this.scanner.tokenStart + sign) {
            this.error("Integer is expected", this.scanner.tokenStart + sign);
          }
          expectCharCode.call(this, i - this.scanner.tokenStart, N);
          a = this.scanner.source.substring(start, i);
          if (i + 1 === this.scanner.tokenEnd) {
            this.scanner.next();
            b = consumeB.call(this);
          } else {
            expectCharCode.call(this, i - this.scanner.tokenStart + 1, HYPHENMINUS);
            if (i + 2 === this.scanner.tokenEnd) {
              this.scanner.next();
              this.scanner.skipSC();
              checkTokenIsInteger.call(this, DISALLOW_SIGN);
              b = "-" + this.consume(NUMBER);
            } else {
              checkInteger.call(this, i - this.scanner.tokenStart + 2, DISALLOW_SIGN);
              this.scanner.next();
              b = this.scanner.substrToCursor(i + 1);
            }
          }
        } else {
          this.error();
        }
        if (a !== null && a.charCodeAt(0) === PLUSSIGN) {
          a = a.substr(1);
        }
        if (b !== null && b.charCodeAt(0) === PLUSSIGN) {
          b = b.substr(1);
        }
        return {
          type: "AnPlusB",
          loc: this.getLocation(start, this.scanner.tokenStart),
          a,
          b
        };
      },
      generate: function(node2) {
        var a = node2.a !== null && node2.a !== void 0;
        var b = node2.b !== null && node2.b !== void 0;
        if (a) {
          this.chunk(
            node2.a === "+1" ? "+n" : (
              // eslint-disable-line operator-linebreak, indent
              node2.a === "1" ? "n" : (
                // eslint-disable-line operator-linebreak, indent
                node2.a === "-1" ? "-n" : (
                  // eslint-disable-line operator-linebreak, indent
                  node2.a + "n"
                )
              )
            )
            // eslint-disable-line operator-linebreak, indent
          );
          if (b) {
            b = String(node2.b);
            if (b.charAt(0) === "-" || b.charAt(0) === "+") {
              this.chunk(b.charAt(0));
              this.chunk(b.substr(1));
            } else {
              this.chunk("+");
              this.chunk(b);
            }
          }
        } else {
          this.chunk(String(node2.b));
        }
      }
    };
    return AnPlusB;
  }
  var Raw;
  var hasRequiredRaw;
  function requireRaw() {
    if (hasRequiredRaw) return Raw;
    hasRequiredRaw = 1;
    var tokenizer2 = requireTokenizer$1();
    var TYPE = tokenizer2.TYPE;
    var WhiteSpace2 = TYPE.WhiteSpace;
    var Semicolon = TYPE.Semicolon;
    var LeftCurlyBracket = TYPE.LeftCurlyBracket;
    var Delim = TYPE.Delim;
    var EXCLAMATIONMARK = 33;
    function getOffsetExcludeWS() {
      if (this.scanner.tokenIndex > 0) {
        if (this.scanner.lookupType(-1) === WhiteSpace2) {
          return this.scanner.tokenIndex > 1 ? this.scanner.getTokenStart(this.scanner.tokenIndex - 1) : this.scanner.firstCharOffset;
        }
      }
      return this.scanner.tokenStart;
    }
    function balanceEnd() {
      return 0;
    }
    function leftCurlyBracket(tokenType) {
      return tokenType === LeftCurlyBracket ? 1 : 0;
    }
    function leftCurlyBracketOrSemicolon(tokenType) {
      return tokenType === LeftCurlyBracket || tokenType === Semicolon ? 1 : 0;
    }
    function exclamationMarkOrSemicolon(tokenType, source, offset) {
      if (tokenType === Delim && source.charCodeAt(offset) === EXCLAMATIONMARK) {
        return 1;
      }
      return tokenType === Semicolon ? 1 : 0;
    }
    function semicolonIncluded(tokenType) {
      return tokenType === Semicolon ? 2 : 0;
    }
    Raw = {
      name: "Raw",
      structure: {
        value: String
      },
      parse: function(startToken, mode, excludeWhiteSpace) {
        var startOffset = this.scanner.getTokenStart(startToken);
        var endOffset;
        this.scanner.skip(
          this.scanner.getRawLength(startToken, mode || balanceEnd)
        );
        if (excludeWhiteSpace && this.scanner.tokenStart > startOffset) {
          endOffset = getOffsetExcludeWS.call(this);
        } else {
          endOffset = this.scanner.tokenStart;
        }
        return {
          type: "Raw",
          loc: this.getLocation(startOffset, endOffset),
          value: this.scanner.source.substring(startOffset, endOffset)
        };
      },
      generate: function(node2) {
        this.chunk(node2.value);
      },
      mode: {
        default: balanceEnd,
        leftCurlyBracket,
        leftCurlyBracketOrSemicolon,
        exclamationMarkOrSemicolon,
        semicolonIncluded
      }
    };
    return Raw;
  }
  var Atrule;
  var hasRequiredAtrule$1;
  function requireAtrule$1() {
    if (hasRequiredAtrule$1) return Atrule;
    hasRequiredAtrule$1 = 1;
    var TYPE = requireTokenizer$1().TYPE;
    var rawMode = requireRaw().mode;
    var ATKEYWORD = TYPE.AtKeyword;
    var SEMICOLON = TYPE.Semicolon;
    var LEFTCURLYBRACKET = TYPE.LeftCurlyBracket;
    var RIGHTCURLYBRACKET = TYPE.RightCurlyBracket;
    function consumeRaw(startToken) {
      return this.Raw(startToken, rawMode.leftCurlyBracketOrSemicolon, true);
    }
    function isDeclarationBlockAtrule() {
      for (var offset = 1, type; type = this.scanner.lookupType(offset); offset++) {
        if (type === RIGHTCURLYBRACKET) {
          return true;
        }
        if (type === LEFTCURLYBRACKET || type === ATKEYWORD) {
          return false;
        }
      }
      return false;
    }
    Atrule = {
      name: "Atrule",
      structure: {
        name: String,
        prelude: ["AtrulePrelude", "Raw", null],
        block: ["Block", null]
      },
      parse: function() {
        var start = this.scanner.tokenStart;
        var name;
        var nameLowerCase;
        var prelude = null;
        var block = null;
        this.eat(ATKEYWORD);
        name = this.scanner.substrToCursor(start + 1);
        nameLowerCase = name.toLowerCase();
        this.scanner.skipSC();
        if (this.scanner.eof === false && this.scanner.tokenType !== LEFTCURLYBRACKET && this.scanner.tokenType !== SEMICOLON) {
          if (this.parseAtrulePrelude) {
            prelude = this.parseWithFallback(this.AtrulePrelude.bind(this, name), consumeRaw);
            if (prelude.type === "AtrulePrelude" && prelude.children.head === null) {
              prelude = null;
            }
          } else {
            prelude = consumeRaw.call(this, this.scanner.tokenIndex);
          }
          this.scanner.skipSC();
        }
        switch (this.scanner.tokenType) {
          case SEMICOLON:
            this.scanner.next();
            break;
          case LEFTCURLYBRACKET:
            if (this.atrule.hasOwnProperty(nameLowerCase) && typeof this.atrule[nameLowerCase].block === "function") {
              block = this.atrule[nameLowerCase].block.call(this);
            } else {
              block = this.Block(isDeclarationBlockAtrule.call(this));
            }
            break;
        }
        return {
          type: "Atrule",
          loc: this.getLocation(start, this.scanner.tokenStart),
          name,
          prelude,
          block
        };
      },
      generate: function(node2) {
        this.chunk("@");
        this.chunk(node2.name);
        if (node2.prelude !== null) {
          this.chunk(" ");
          this.node(node2.prelude);
        }
        if (node2.block) {
          this.node(node2.block);
        } else {
          this.chunk(";");
        }
      },
      walkContext: "atrule"
    };
    return Atrule;
  }
  var AtrulePrelude;
  var hasRequiredAtrulePrelude$1;
  function requireAtrulePrelude$1() {
    if (hasRequiredAtrulePrelude$1) return AtrulePrelude;
    hasRequiredAtrulePrelude$1 = 1;
    var TYPE = requireTokenizer$1().TYPE;
    var SEMICOLON = TYPE.Semicolon;
    var LEFTCURLYBRACKET = TYPE.LeftCurlyBracket;
    AtrulePrelude = {
      name: "AtrulePrelude",
      structure: {
        children: [[]]
      },
      parse: function(name) {
        var children = null;
        if (name !== null) {
          name = name.toLowerCase();
        }
        this.scanner.skipSC();
        if (this.atrule.hasOwnProperty(name) && typeof this.atrule[name].prelude === "function") {
          children = this.atrule[name].prelude.call(this);
        } else {
          children = this.readSequence(this.scope.AtrulePrelude);
        }
        this.scanner.skipSC();
        if (this.scanner.eof !== true && this.scanner.tokenType !== LEFTCURLYBRACKET && this.scanner.tokenType !== SEMICOLON) {
          this.error("Semicolon or block is expected");
        }
        if (children === null) {
          children = this.createList();
        }
        return {
          type: "AtrulePrelude",
          loc: this.getLocationFromList(children),
          children
        };
      },
      generate: function(node2) {
        this.children(node2);
      },
      walkContext: "atrulePrelude"
    };
    return AtrulePrelude;
  }
  var AttributeSelector;
  var hasRequiredAttributeSelector;
  function requireAttributeSelector() {
    if (hasRequiredAttributeSelector) return AttributeSelector;
    hasRequiredAttributeSelector = 1;
    var TYPE = requireTokenizer$1().TYPE;
    var IDENT = TYPE.Ident;
    var STRING = TYPE.String;
    var COLON = TYPE.Colon;
    var LEFTSQUAREBRACKET = TYPE.LeftSquareBracket;
    var RIGHTSQUAREBRACKET = TYPE.RightSquareBracket;
    var DOLLARSIGN = 36;
    var ASTERISK = 42;
    var EQUALSSIGN = 61;
    var CIRCUMFLEXACCENT = 94;
    var VERTICALLINE = 124;
    var TILDE = 126;
    function getAttributeName() {
      if (this.scanner.eof) {
        this.error("Unexpected end of input");
      }
      var start = this.scanner.tokenStart;
      var expectIdent = false;
      var checkColon = true;
      if (this.scanner.isDelim(ASTERISK)) {
        expectIdent = true;
        checkColon = false;
        this.scanner.next();
      } else if (!this.scanner.isDelim(VERTICALLINE)) {
        this.eat(IDENT);
      }
      if (this.scanner.isDelim(VERTICALLINE)) {
        if (this.scanner.source.charCodeAt(this.scanner.tokenStart + 1) !== EQUALSSIGN) {
          this.scanner.next();
          this.eat(IDENT);
        } else if (expectIdent) {
          this.error("Identifier is expected", this.scanner.tokenEnd);
        }
      } else if (expectIdent) {
        this.error("Vertical line is expected");
      }
      if (checkColon && this.scanner.tokenType === COLON) {
        this.scanner.next();
        this.eat(IDENT);
      }
      return {
        type: "Identifier",
        loc: this.getLocation(start, this.scanner.tokenStart),
        name: this.scanner.substrToCursor(start)
      };
    }
    function getOperator() {
      var start = this.scanner.tokenStart;
      var code = this.scanner.source.charCodeAt(start);
      if (code !== EQUALSSIGN && // =
      code !== TILDE && // ~=
      code !== CIRCUMFLEXACCENT && // ^=
      code !== DOLLARSIGN && // $=
      code !== ASTERISK && // *=
      code !== VERTICALLINE) {
        this.error("Attribute selector (=, ~=, ^=, $=, *=, |=) is expected");
      }
      this.scanner.next();
      if (code !== EQUALSSIGN) {
        if (!this.scanner.isDelim(EQUALSSIGN)) {
          this.error("Equal sign is expected");
        }
        this.scanner.next();
      }
      return this.scanner.substrToCursor(start);
    }
    AttributeSelector = {
      name: "AttributeSelector",
      structure: {
        name: "Identifier",
        matcher: [String, null],
        value: ["String", "Identifier", null],
        flags: [String, null]
      },
      parse: function() {
        var start = this.scanner.tokenStart;
        var name;
        var matcher = null;
        var value2 = null;
        var flags = null;
        this.eat(LEFTSQUAREBRACKET);
        this.scanner.skipSC();
        name = getAttributeName.call(this);
        this.scanner.skipSC();
        if (this.scanner.tokenType !== RIGHTSQUAREBRACKET) {
          if (this.scanner.tokenType !== IDENT) {
            matcher = getOperator.call(this);
            this.scanner.skipSC();
            value2 = this.scanner.tokenType === STRING ? this.String() : this.Identifier();
            this.scanner.skipSC();
          }
          if (this.scanner.tokenType === IDENT) {
            flags = this.scanner.getTokenValue();
            this.scanner.next();
            this.scanner.skipSC();
          }
        }
        this.eat(RIGHTSQUAREBRACKET);
        return {
          type: "AttributeSelector",
          loc: this.getLocation(start, this.scanner.tokenStart),
          name,
          matcher,
          value: value2,
          flags
        };
      },
      generate: function(node2) {
        var flagsPrefix = " ";
        this.chunk("[");
        this.node(node2.name);
        if (node2.matcher !== null) {
          this.chunk(node2.matcher);
          if (node2.value !== null) {
            this.node(node2.value);
            if (node2.value.type === "String") {
              flagsPrefix = "";
            }
          }
        }
        if (node2.flags !== null) {
          this.chunk(flagsPrefix);
          this.chunk(node2.flags);
        }
        this.chunk("]");
      }
    };
    return AttributeSelector;
  }
  var Block;
  var hasRequiredBlock;
  function requireBlock() {
    if (hasRequiredBlock) return Block;
    hasRequiredBlock = 1;
    var TYPE = requireTokenizer$1().TYPE;
    var rawMode = requireRaw().mode;
    var WHITESPACE = TYPE.WhiteSpace;
    var COMMENT = TYPE.Comment;
    var SEMICOLON = TYPE.Semicolon;
    var ATKEYWORD = TYPE.AtKeyword;
    var LEFTCURLYBRACKET = TYPE.LeftCurlyBracket;
    var RIGHTCURLYBRACKET = TYPE.RightCurlyBracket;
    function consumeRaw(startToken) {
      return this.Raw(startToken, null, true);
    }
    function consumeRule() {
      return this.parseWithFallback(this.Rule, consumeRaw);
    }
    function consumeRawDeclaration(startToken) {
      return this.Raw(startToken, rawMode.semicolonIncluded, true);
    }
    function consumeDeclaration() {
      if (this.scanner.tokenType === SEMICOLON) {
        return consumeRawDeclaration.call(this, this.scanner.tokenIndex);
      }
      var node2 = this.parseWithFallback(this.Declaration, consumeRawDeclaration);
      if (this.scanner.tokenType === SEMICOLON) {
        this.scanner.next();
      }
      return node2;
    }
    Block = {
      name: "Block",
      structure: {
        children: [[
          "Atrule",
          "Rule",
          "Declaration"
        ]]
      },
      parse: function(isDeclaration) {
        var consumer = isDeclaration ? consumeDeclaration : consumeRule;
        var start = this.scanner.tokenStart;
        var children = this.createList();
        this.eat(LEFTCURLYBRACKET);
        scan:
          while (!this.scanner.eof) {
            switch (this.scanner.tokenType) {
              case RIGHTCURLYBRACKET:
                break scan;
              case WHITESPACE:
              case COMMENT:
                this.scanner.next();
                break;
              case ATKEYWORD:
                children.push(this.parseWithFallback(this.Atrule, consumeRaw));
                break;
              default:
                children.push(consumer.call(this));
            }
          }
        if (!this.scanner.eof) {
          this.eat(RIGHTCURLYBRACKET);
        }
        return {
          type: "Block",
          loc: this.getLocation(start, this.scanner.tokenStart),
          children
        };
      },
      generate: function(node2) {
        this.chunk("{");
        this.children(node2, function(prev) {
          if (prev.type === "Declaration") {
            this.chunk(";");
          }
        });
        this.chunk("}");
      },
      walkContext: "block"
    };
    return Block;
  }
  var Brackets;
  var hasRequiredBrackets;
  function requireBrackets() {
    if (hasRequiredBrackets) return Brackets;
    hasRequiredBrackets = 1;
    var TYPE = requireTokenizer$1().TYPE;
    var LEFTSQUAREBRACKET = TYPE.LeftSquareBracket;
    var RIGHTSQUAREBRACKET = TYPE.RightSquareBracket;
    Brackets = {
      name: "Brackets",
      structure: {
        children: [[]]
      },
      parse: function(readSequence, recognizer) {
        var start = this.scanner.tokenStart;
        var children = null;
        this.eat(LEFTSQUAREBRACKET);
        children = readSequence.call(this, recognizer);
        if (!this.scanner.eof) {
          this.eat(RIGHTSQUAREBRACKET);
        }
        return {
          type: "Brackets",
          loc: this.getLocation(start, this.scanner.tokenStart),
          children
        };
      },
      generate: function(node2) {
        this.chunk("[");
        this.children(node2);
        this.chunk("]");
      }
    };
    return Brackets;
  }
  var CDC_1;
  var hasRequiredCDC;
  function requireCDC() {
    if (hasRequiredCDC) return CDC_1;
    hasRequiredCDC = 1;
    var CDC = requireTokenizer$1().TYPE.CDC;
    CDC_1 = {
      name: "CDC",
      structure: [],
      parse: function() {
        var start = this.scanner.tokenStart;
        this.eat(CDC);
        return {
          type: "CDC",
          loc: this.getLocation(start, this.scanner.tokenStart)
        };
      },
      generate: function() {
        this.chunk("-->");
      }
    };
    return CDC_1;
  }
  var CDO_1;
  var hasRequiredCDO;
  function requireCDO() {
    if (hasRequiredCDO) return CDO_1;
    hasRequiredCDO = 1;
    var CDO = requireTokenizer$1().TYPE.CDO;
    CDO_1 = {
      name: "CDO",
      structure: [],
      parse: function() {
        var start = this.scanner.tokenStart;
        this.eat(CDO);
        return {
          type: "CDO",
          loc: this.getLocation(start, this.scanner.tokenStart)
        };
      },
      generate: function() {
        this.chunk("<!--");
      }
    };
    return CDO_1;
  }
  var ClassSelector;
  var hasRequiredClassSelector;
  function requireClassSelector() {
    if (hasRequiredClassSelector) return ClassSelector;
    hasRequiredClassSelector = 1;
    var TYPE = requireTokenizer$1().TYPE;
    var IDENT = TYPE.Ident;
    var FULLSTOP = 46;
    ClassSelector = {
      name: "ClassSelector",
      structure: {
        name: String
      },
      parse: function() {
        if (!this.scanner.isDelim(FULLSTOP)) {
          this.error("Full stop is expected");
        }
        this.scanner.next();
        return {
          type: "ClassSelector",
          loc: this.getLocation(this.scanner.tokenStart - 1, this.scanner.tokenEnd),
          name: this.consume(IDENT)
        };
      },
      generate: function(node2) {
        this.chunk(".");
        this.chunk(node2.name);
      }
    };
    return ClassSelector;
  }
  var Combinator;
  var hasRequiredCombinator;
  function requireCombinator() {
    if (hasRequiredCombinator) return Combinator;
    hasRequiredCombinator = 1;
    var TYPE = requireTokenizer$1().TYPE;
    var IDENT = TYPE.Ident;
    var PLUSSIGN = 43;
    var SOLIDUS = 47;
    var GREATERTHANSIGN = 62;
    var TILDE = 126;
    Combinator = {
      name: "Combinator",
      structure: {
        name: String
      },
      parse: function() {
        var start = this.scanner.tokenStart;
        var code = this.scanner.source.charCodeAt(this.scanner.tokenStart);
        switch (code) {
          case GREATERTHANSIGN:
          case PLUSSIGN:
          case TILDE:
            this.scanner.next();
            break;
          case SOLIDUS:
            this.scanner.next();
            if (this.scanner.tokenType !== IDENT || this.scanner.lookupValue(0, "deep") === false) {
              this.error("Identifier `deep` is expected");
            }
            this.scanner.next();
            if (!this.scanner.isDelim(SOLIDUS)) {
              this.error("Solidus is expected");
            }
            this.scanner.next();
            break;
          default:
            this.error("Combinator is expected");
        }
        return {
          type: "Combinator",
          loc: this.getLocation(start, this.scanner.tokenStart),
          name: this.scanner.substrToCursor(start)
        };
      },
      generate: function(node2) {
        this.chunk(node2.name);
      }
    };
    return Combinator;
  }
  var Comment;
  var hasRequiredComment;
  function requireComment() {
    if (hasRequiredComment) return Comment;
    hasRequiredComment = 1;
    var TYPE = requireTokenizer$1().TYPE;
    var COMMENT = TYPE.Comment;
    var ASTERISK = 42;
    var SOLIDUS = 47;
    Comment = {
      name: "Comment",
      structure: {
        value: String
      },
      parse: function() {
        var start = this.scanner.tokenStart;
        var end = this.scanner.tokenEnd;
        this.eat(COMMENT);
        if (end - start + 2 >= 2 && this.scanner.source.charCodeAt(end - 2) === ASTERISK && this.scanner.source.charCodeAt(end - 1) === SOLIDUS) {
          end -= 2;
        }
        return {
          type: "Comment",
          loc: this.getLocation(start, this.scanner.tokenStart),
          value: this.scanner.source.substring(start + 2, end)
        };
      },
      generate: function(node2) {
        this.chunk("/*");
        this.chunk(node2.value);
        this.chunk("*/");
      }
    };
    return Comment;
  }
  var Declaration;
  var hasRequiredDeclaration;
  function requireDeclaration() {
    if (hasRequiredDeclaration) return Declaration;
    hasRequiredDeclaration = 1;
    var isCustomProperty = requireNames().isCustomProperty;
    var TYPE = requireTokenizer$1().TYPE;
    var rawMode = requireRaw().mode;
    var IDENT = TYPE.Ident;
    var HASH = TYPE.Hash;
    var COLON = TYPE.Colon;
    var SEMICOLON = TYPE.Semicolon;
    var DELIM = TYPE.Delim;
    var EXCLAMATIONMARK = 33;
    var NUMBERSIGN = 35;
    var DOLLARSIGN = 36;
    var AMPERSAND = 38;
    var ASTERISK = 42;
    var PLUSSIGN = 43;
    var SOLIDUS = 47;
    function consumeValueRaw(startToken) {
      return this.Raw(startToken, rawMode.exclamationMarkOrSemicolon, true);
    }
    function consumeCustomPropertyRaw(startToken) {
      return this.Raw(startToken, rawMode.exclamationMarkOrSemicolon, false);
    }
    function consumeValue() {
      var startValueToken = this.scanner.tokenIndex;
      var value2 = this.Value();
      if (value2.type !== "Raw" && this.scanner.eof === false && this.scanner.tokenType !== SEMICOLON && this.scanner.isDelim(EXCLAMATIONMARK) === false && this.scanner.isBalanceEdge(startValueToken) === false) {
        this.error();
      }
      return value2;
    }
    Declaration = {
      name: "Declaration",
      structure: {
        important: [Boolean, String],
        property: String,
        value: ["Value", "Raw"]
      },
      parse: function() {
        var start = this.scanner.tokenStart;
        var startToken = this.scanner.tokenIndex;
        var property = readProperty.call(this);
        var customProperty = isCustomProperty(property);
        var parseValue = customProperty ? this.parseCustomProperty : this.parseValue;
        var consumeRaw = customProperty ? consumeCustomPropertyRaw : consumeValueRaw;
        var important = false;
        var value2;
        this.scanner.skipSC();
        this.eat(COLON);
        if (!customProperty) {
          this.scanner.skipSC();
        }
        if (parseValue) {
          value2 = this.parseWithFallback(consumeValue, consumeRaw);
        } else {
          value2 = consumeRaw.call(this, this.scanner.tokenIndex);
        }
        if (this.scanner.isDelim(EXCLAMATIONMARK)) {
          important = getImportant.call(this);
          this.scanner.skipSC();
        }
        if (this.scanner.eof === false && this.scanner.tokenType !== SEMICOLON && this.scanner.isBalanceEdge(startToken) === false) {
          this.error();
        }
        return {
          type: "Declaration",
          loc: this.getLocation(start, this.scanner.tokenStart),
          important,
          property,
          value: value2
        };
      },
      generate: function(node2) {
        this.chunk(node2.property);
        this.chunk(":");
        this.node(node2.value);
        if (node2.important) {
          this.chunk(node2.important === true ? "!important" : "!" + node2.important);
        }
      },
      walkContext: "declaration"
    };
    function readProperty() {
      var start = this.scanner.tokenStart;
      if (this.scanner.tokenType === DELIM) {
        switch (this.scanner.source.charCodeAt(this.scanner.tokenStart)) {
          case ASTERISK:
          case DOLLARSIGN:
          case PLUSSIGN:
          case NUMBERSIGN:
          case AMPERSAND:
            this.scanner.next();
            break;
          // TODO: not sure we should support this hack
          case SOLIDUS:
            this.scanner.next();
            if (this.scanner.isDelim(SOLIDUS)) {
              this.scanner.next();
            }
            break;
        }
      }
      if (this.scanner.tokenType === HASH) {
        this.eat(HASH);
      } else {
        this.eat(IDENT);
      }
      return this.scanner.substrToCursor(start);
    }
    function getImportant() {
      this.eat(DELIM);
      this.scanner.skipSC();
      var important = this.consume(IDENT);
      return important === "important" ? true : important;
    }
    return Declaration;
  }
  var DeclarationList;
  var hasRequiredDeclarationList;
  function requireDeclarationList() {
    if (hasRequiredDeclarationList) return DeclarationList;
    hasRequiredDeclarationList = 1;
    var TYPE = requireTokenizer$1().TYPE;
    var rawMode = requireRaw().mode;
    var WHITESPACE = TYPE.WhiteSpace;
    var COMMENT = TYPE.Comment;
    var SEMICOLON = TYPE.Semicolon;
    function consumeRaw(startToken) {
      return this.Raw(startToken, rawMode.semicolonIncluded, true);
    }
    DeclarationList = {
      name: "DeclarationList",
      structure: {
        children: [[
          "Declaration"
        ]]
      },
      parse: function() {
        var children = this.createList();
        while (!this.scanner.eof) {
          switch (this.scanner.tokenType) {
            case WHITESPACE:
            case COMMENT:
            case SEMICOLON:
              this.scanner.next();
              break;
            default:
              children.push(this.parseWithFallback(this.Declaration, consumeRaw));
          }
        }
        return {
          type: "DeclarationList",
          loc: this.getLocationFromList(children),
          children
        };
      },
      generate: function(node2) {
        this.children(node2, function(prev) {
          if (prev.type === "Declaration") {
            this.chunk(";");
          }
        });
      }
    };
    return DeclarationList;
  }
  var Dimension;
  var hasRequiredDimension;
  function requireDimension() {
    if (hasRequiredDimension) return Dimension;
    hasRequiredDimension = 1;
    var consumeNumber = requireUtils().consumeNumber;
    var TYPE = requireTokenizer$1().TYPE;
    var DIMENSION = TYPE.Dimension;
    Dimension = {
      name: "Dimension",
      structure: {
        value: String,
        unit: String
      },
      parse: function() {
        var start = this.scanner.tokenStart;
        var numberEnd = consumeNumber(this.scanner.source, start);
        this.eat(DIMENSION);
        return {
          type: "Dimension",
          loc: this.getLocation(start, this.scanner.tokenStart),
          value: this.scanner.source.substring(start, numberEnd),
          unit: this.scanner.source.substring(numberEnd, this.scanner.tokenStart)
        };
      },
      generate: function(node2) {
        this.chunk(node2.value);
        this.chunk(node2.unit);
      }
    };
    return Dimension;
  }
  var _Function;
  var hasRequired_Function;
  function require_Function() {
    if (hasRequired_Function) return _Function;
    hasRequired_Function = 1;
    var TYPE = requireTokenizer$1().TYPE;
    var RIGHTPARENTHESIS = TYPE.RightParenthesis;
    _Function = {
      name: "Function",
      structure: {
        name: String,
        children: [[]]
      },
      parse: function(readSequence, recognizer) {
        var start = this.scanner.tokenStart;
        var name = this.consumeFunctionName();
        var nameLowerCase = name.toLowerCase();
        var children;
        children = recognizer.hasOwnProperty(nameLowerCase) ? recognizer[nameLowerCase].call(this, recognizer) : readSequence.call(this, recognizer);
        if (!this.scanner.eof) {
          this.eat(RIGHTPARENTHESIS);
        }
        return {
          type: "Function",
          loc: this.getLocation(start, this.scanner.tokenStart),
          name,
          children
        };
      },
      generate: function(node2) {
        this.chunk(node2.name);
        this.chunk("(");
        this.children(node2);
        this.chunk(")");
      },
      walkContext: "function"
    };
    return _Function;
  }
  var HexColor;
  var hasRequiredHexColor;
  function requireHexColor() {
    if (hasRequiredHexColor) return HexColor;
    hasRequiredHexColor = 1;
    var TYPE = requireTokenizer$1().TYPE;
    var HASH = TYPE.Hash;
    HexColor = {
      name: "HexColor",
      structure: {
        value: String
      },
      parse: function() {
        var start = this.scanner.tokenStart;
        this.eat(HASH);
        return {
          type: "HexColor",
          loc: this.getLocation(start, this.scanner.tokenStart),
          value: this.scanner.substrToCursor(start + 1)
        };
      },
      generate: function(node2) {
        this.chunk("#");
        this.chunk(node2.value);
      }
    };
    return HexColor;
  }
  var Identifier;
  var hasRequiredIdentifier;
  function requireIdentifier() {
    if (hasRequiredIdentifier) return Identifier;
    hasRequiredIdentifier = 1;
    var TYPE = requireTokenizer$1().TYPE;
    var IDENT = TYPE.Ident;
    Identifier = {
      name: "Identifier",
      structure: {
        name: String
      },
      parse: function() {
        return {
          type: "Identifier",
          loc: this.getLocation(this.scanner.tokenStart, this.scanner.tokenEnd),
          name: this.consume(IDENT)
        };
      },
      generate: function(node2) {
        this.chunk(node2.name);
      }
    };
    return Identifier;
  }
  var IdSelector;
  var hasRequiredIdSelector;
  function requireIdSelector() {
    if (hasRequiredIdSelector) return IdSelector;
    hasRequiredIdSelector = 1;
    var TYPE = requireTokenizer$1().TYPE;
    var HASH = TYPE.Hash;
    IdSelector = {
      name: "IdSelector",
      structure: {
        name: String
      },
      parse: function() {
        var start = this.scanner.tokenStart;
        this.eat(HASH);
        return {
          type: "IdSelector",
          loc: this.getLocation(start, this.scanner.tokenStart),
          name: this.scanner.substrToCursor(start + 1)
        };
      },
      generate: function(node2) {
        this.chunk("#");
        this.chunk(node2.name);
      }
    };
    return IdSelector;
  }
  var MediaFeature;
  var hasRequiredMediaFeature;
  function requireMediaFeature() {
    if (hasRequiredMediaFeature) return MediaFeature;
    hasRequiredMediaFeature = 1;
    var TYPE = requireTokenizer$1().TYPE;
    var IDENT = TYPE.Ident;
    var NUMBER = TYPE.Number;
    var DIMENSION = TYPE.Dimension;
    var LEFTPARENTHESIS = TYPE.LeftParenthesis;
    var RIGHTPARENTHESIS = TYPE.RightParenthesis;
    var COLON = TYPE.Colon;
    var DELIM = TYPE.Delim;
    MediaFeature = {
      name: "MediaFeature",
      structure: {
        name: String,
        value: ["Identifier", "Number", "Dimension", "Ratio", null]
      },
      parse: function() {
        var start = this.scanner.tokenStart;
        var name;
        var value2 = null;
        this.eat(LEFTPARENTHESIS);
        this.scanner.skipSC();
        name = this.consume(IDENT);
        this.scanner.skipSC();
        if (this.scanner.tokenType !== RIGHTPARENTHESIS) {
          this.eat(COLON);
          this.scanner.skipSC();
          switch (this.scanner.tokenType) {
            case NUMBER:
              if (this.lookupNonWSType(1) === DELIM) {
                value2 = this.Ratio();
              } else {
                value2 = this.Number();
              }
              break;
            case DIMENSION:
              value2 = this.Dimension();
              break;
            case IDENT:
              value2 = this.Identifier();
              break;
            default:
              this.error("Number, dimension, ratio or identifier is expected");
          }
          this.scanner.skipSC();
        }
        this.eat(RIGHTPARENTHESIS);
        return {
          type: "MediaFeature",
          loc: this.getLocation(start, this.scanner.tokenStart),
          name,
          value: value2
        };
      },
      generate: function(node2) {
        this.chunk("(");
        this.chunk(node2.name);
        if (node2.value !== null) {
          this.chunk(":");
          this.node(node2.value);
        }
        this.chunk(")");
      }
    };
    return MediaFeature;
  }
  var MediaQuery;
  var hasRequiredMediaQuery;
  function requireMediaQuery() {
    if (hasRequiredMediaQuery) return MediaQuery;
    hasRequiredMediaQuery = 1;
    var TYPE = requireTokenizer$1().TYPE;
    var WHITESPACE = TYPE.WhiteSpace;
    var COMMENT = TYPE.Comment;
    var IDENT = TYPE.Ident;
    var LEFTPARENTHESIS = TYPE.LeftParenthesis;
    MediaQuery = {
      name: "MediaQuery",
      structure: {
        children: [[
          "Identifier",
          "MediaFeature",
          "WhiteSpace"
        ]]
      },
      parse: function() {
        this.scanner.skipSC();
        var children = this.createList();
        var child2 = null;
        var space = null;
        scan:
          while (!this.scanner.eof) {
            switch (this.scanner.tokenType) {
              case COMMENT:
                this.scanner.next();
                continue;
              case WHITESPACE:
                space = this.WhiteSpace();
                continue;
              case IDENT:
                child2 = this.Identifier();
                break;
              case LEFTPARENTHESIS:
                child2 = this.MediaFeature();
                break;
              default:
                break scan;
            }
            if (space !== null) {
              children.push(space);
              space = null;
            }
            children.push(child2);
          }
        if (child2 === null) {
          this.error("Identifier or parenthesis is expected");
        }
        return {
          type: "MediaQuery",
          loc: this.getLocationFromList(children),
          children
        };
      },
      generate: function(node2) {
        this.children(node2);
      }
    };
    return MediaQuery;
  }
  var MediaQueryList;
  var hasRequiredMediaQueryList;
  function requireMediaQueryList() {
    if (hasRequiredMediaQueryList) return MediaQueryList;
    hasRequiredMediaQueryList = 1;
    var COMMA = requireTokenizer$1().TYPE.Comma;
    MediaQueryList = {
      name: "MediaQueryList",
      structure: {
        children: [[
          "MediaQuery"
        ]]
      },
      parse: function(relative) {
        var children = this.createList();
        this.scanner.skipSC();
        while (!this.scanner.eof) {
          children.push(this.MediaQuery(relative));
          if (this.scanner.tokenType !== COMMA) {
            break;
          }
          this.scanner.next();
        }
        return {
          type: "MediaQueryList",
          loc: this.getLocationFromList(children),
          children
        };
      },
      generate: function(node2) {
        this.children(node2, function() {
          this.chunk(",");
        });
      }
    };
    return MediaQueryList;
  }
  var Nth;
  var hasRequiredNth$1;
  function requireNth$1() {
    if (hasRequiredNth$1) return Nth;
    hasRequiredNth$1 = 1;
    Nth = {
      name: "Nth",
      structure: {
        nth: ["AnPlusB", "Identifier"],
        selector: ["SelectorList", null]
      },
      parse: function(allowOfClause) {
        this.scanner.skipSC();
        var start = this.scanner.tokenStart;
        var end = start;
        var selector2 = null;
        var query;
        if (this.scanner.lookupValue(0, "odd") || this.scanner.lookupValue(0, "even")) {
          query = this.Identifier();
        } else {
          query = this.AnPlusB();
        }
        this.scanner.skipSC();
        if (allowOfClause && this.scanner.lookupValue(0, "of")) {
          this.scanner.next();
          selector2 = this.SelectorList();
          if (this.needPositions) {
            end = this.getLastListNode(selector2.children).loc.end.offset;
          }
        } else {
          if (this.needPositions) {
            end = query.loc.end.offset;
          }
        }
        return {
          type: "Nth",
          loc: this.getLocation(start, end),
          nth: query,
          selector: selector2
        };
      },
      generate: function(node2) {
        this.node(node2.nth);
        if (node2.selector !== null) {
          this.chunk(" of ");
          this.node(node2.selector);
        }
      }
    };
    return Nth;
  }
  var _Number;
  var hasRequired_Number;
  function require_Number() {
    if (hasRequired_Number) return _Number;
    hasRequired_Number = 1;
    var NUMBER = requireTokenizer$1().TYPE.Number;
    _Number = {
      name: "Number",
      structure: {
        value: String
      },
      parse: function() {
        return {
          type: "Number",
          loc: this.getLocation(this.scanner.tokenStart, this.scanner.tokenEnd),
          value: this.consume(NUMBER)
        };
      },
      generate: function(node2) {
        this.chunk(node2.value);
      }
    };
    return _Number;
  }
  var Operator;
  var hasRequiredOperator;
  function requireOperator() {
    if (hasRequiredOperator) return Operator;
    hasRequiredOperator = 1;
    Operator = {
      name: "Operator",
      structure: {
        value: String
      },
      parse: function() {
        var start = this.scanner.tokenStart;
        this.scanner.next();
        return {
          type: "Operator",
          loc: this.getLocation(start, this.scanner.tokenStart),
          value: this.scanner.substrToCursor(start)
        };
      },
      generate: function(node2) {
        this.chunk(node2.value);
      }
    };
    return Operator;
  }
  var Parentheses;
  var hasRequiredParentheses;
  function requireParentheses() {
    if (hasRequiredParentheses) return Parentheses;
    hasRequiredParentheses = 1;
    var TYPE = requireTokenizer$1().TYPE;
    var LEFTPARENTHESIS = TYPE.LeftParenthesis;
    var RIGHTPARENTHESIS = TYPE.RightParenthesis;
    Parentheses = {
      name: "Parentheses",
      structure: {
        children: [[]]
      },
      parse: function(readSequence, recognizer) {
        var start = this.scanner.tokenStart;
        var children = null;
        this.eat(LEFTPARENTHESIS);
        children = readSequence.call(this, recognizer);
        if (!this.scanner.eof) {
          this.eat(RIGHTPARENTHESIS);
        }
        return {
          type: "Parentheses",
          loc: this.getLocation(start, this.scanner.tokenStart),
          children
        };
      },
      generate: function(node2) {
        this.chunk("(");
        this.children(node2);
        this.chunk(")");
      }
    };
    return Parentheses;
  }
  var Percentage;
  var hasRequiredPercentage;
  function requirePercentage() {
    if (hasRequiredPercentage) return Percentage;
    hasRequiredPercentage = 1;
    var consumeNumber = requireUtils().consumeNumber;
    var TYPE = requireTokenizer$1().TYPE;
    var PERCENTAGE = TYPE.Percentage;
    Percentage = {
      name: "Percentage",
      structure: {
        value: String
      },
      parse: function() {
        var start = this.scanner.tokenStart;
        var numberEnd = consumeNumber(this.scanner.source, start);
        this.eat(PERCENTAGE);
        return {
          type: "Percentage",
          loc: this.getLocation(start, this.scanner.tokenStart),
          value: this.scanner.source.substring(start, numberEnd)
        };
      },
      generate: function(node2) {
        this.chunk(node2.value);
        this.chunk("%");
      }
    };
    return Percentage;
  }
  var PseudoClassSelector;
  var hasRequiredPseudoClassSelector;
  function requirePseudoClassSelector() {
    if (hasRequiredPseudoClassSelector) return PseudoClassSelector;
    hasRequiredPseudoClassSelector = 1;
    var TYPE = requireTokenizer$1().TYPE;
    var IDENT = TYPE.Ident;
    var FUNCTION = TYPE.Function;
    var COLON = TYPE.Colon;
    var RIGHTPARENTHESIS = TYPE.RightParenthesis;
    PseudoClassSelector = {
      name: "PseudoClassSelector",
      structure: {
        name: String,
        children: [["Raw"], null]
      },
      parse: function() {
        var start = this.scanner.tokenStart;
        var children = null;
        var name;
        var nameLowerCase;
        this.eat(COLON);
        if (this.scanner.tokenType === FUNCTION) {
          name = this.consumeFunctionName();
          nameLowerCase = name.toLowerCase();
          if (this.pseudo.hasOwnProperty(nameLowerCase)) {
            this.scanner.skipSC();
            children = this.pseudo[nameLowerCase].call(this);
            this.scanner.skipSC();
          } else {
            children = this.createList();
            children.push(
              this.Raw(this.scanner.tokenIndex, null, false)
            );
          }
          this.eat(RIGHTPARENTHESIS);
        } else {
          name = this.consume(IDENT);
        }
        return {
          type: "PseudoClassSelector",
          loc: this.getLocation(start, this.scanner.tokenStart),
          name,
          children
        };
      },
      generate: function(node2) {
        this.chunk(":");
        this.chunk(node2.name);
        if (node2.children !== null) {
          this.chunk("(");
          this.children(node2);
          this.chunk(")");
        }
      },
      walkContext: "function"
    };
    return PseudoClassSelector;
  }
  var PseudoElementSelector;
  var hasRequiredPseudoElementSelector;
  function requirePseudoElementSelector() {
    if (hasRequiredPseudoElementSelector) return PseudoElementSelector;
    hasRequiredPseudoElementSelector = 1;
    var TYPE = requireTokenizer$1().TYPE;
    var IDENT = TYPE.Ident;
    var FUNCTION = TYPE.Function;
    var COLON = TYPE.Colon;
    var RIGHTPARENTHESIS = TYPE.RightParenthesis;
    PseudoElementSelector = {
      name: "PseudoElementSelector",
      structure: {
        name: String,
        children: [["Raw"], null]
      },
      parse: function() {
        var start = this.scanner.tokenStart;
        var children = null;
        var name;
        var nameLowerCase;
        this.eat(COLON);
        this.eat(COLON);
        if (this.scanner.tokenType === FUNCTION) {
          name = this.consumeFunctionName();
          nameLowerCase = name.toLowerCase();
          if (this.pseudo.hasOwnProperty(nameLowerCase)) {
            this.scanner.skipSC();
            children = this.pseudo[nameLowerCase].call(this);
            this.scanner.skipSC();
          } else {
            children = this.createList();
            children.push(
              this.Raw(this.scanner.tokenIndex, null, false)
            );
          }
          this.eat(RIGHTPARENTHESIS);
        } else {
          name = this.consume(IDENT);
        }
        return {
          type: "PseudoElementSelector",
          loc: this.getLocation(start, this.scanner.tokenStart),
          name,
          children
        };
      },
      generate: function(node2) {
        this.chunk("::");
        this.chunk(node2.name);
        if (node2.children !== null) {
          this.chunk("(");
          this.children(node2);
          this.chunk(")");
        }
      },
      walkContext: "function"
    };
    return PseudoElementSelector;
  }
  var Ratio;
  var hasRequiredRatio;
  function requireRatio() {
    if (hasRequiredRatio) return Ratio;
    hasRequiredRatio = 1;
    var isDigit = requireTokenizer$1().isDigit;
    var TYPE = requireTokenizer$1().TYPE;
    var NUMBER = TYPE.Number;
    var DELIM = TYPE.Delim;
    var SOLIDUS = 47;
    var FULLSTOP = 46;
    function consumeNumber() {
      this.scanner.skipWS();
      var value2 = this.consume(NUMBER);
      for (var i = 0; i < value2.length; i++) {
        var code = value2.charCodeAt(i);
        if (!isDigit(code) && code !== FULLSTOP) {
          this.error("Unsigned number is expected", this.scanner.tokenStart - value2.length + i);
        }
      }
      if (Number(value2) === 0) {
        this.error("Zero number is not allowed", this.scanner.tokenStart - value2.length);
      }
      return value2;
    }
    Ratio = {
      name: "Ratio",
      structure: {
        left: String,
        right: String
      },
      parse: function() {
        var start = this.scanner.tokenStart;
        var left = consumeNumber.call(this);
        var right;
        this.scanner.skipWS();
        if (!this.scanner.isDelim(SOLIDUS)) {
          this.error("Solidus is expected");
        }
        this.eat(DELIM);
        right = consumeNumber.call(this);
        return {
          type: "Ratio",
          loc: this.getLocation(start, this.scanner.tokenStart),
          left,
          right
        };
      },
      generate: function(node2) {
        this.chunk(node2.left);
        this.chunk("/");
        this.chunk(node2.right);
      }
    };
    return Ratio;
  }
  var Rule;
  var hasRequiredRule;
  function requireRule() {
    if (hasRequiredRule) return Rule;
    hasRequiredRule = 1;
    var TYPE = requireTokenizer$1().TYPE;
    var rawMode = requireRaw().mode;
    var LEFTCURLYBRACKET = TYPE.LeftCurlyBracket;
    function consumeRaw(startToken) {
      return this.Raw(startToken, rawMode.leftCurlyBracket, true);
    }
    function consumePrelude() {
      var prelude = this.SelectorList();
      if (prelude.type !== "Raw" && this.scanner.eof === false && this.scanner.tokenType !== LEFTCURLYBRACKET) {
        this.error();
      }
      return prelude;
    }
    Rule = {
      name: "Rule",
      structure: {
        prelude: ["SelectorList", "Raw"],
        block: ["Block"]
      },
      parse: function() {
        var startToken = this.scanner.tokenIndex;
        var startOffset = this.scanner.tokenStart;
        var prelude;
        var block;
        if (this.parseRulePrelude) {
          prelude = this.parseWithFallback(consumePrelude, consumeRaw);
        } else {
          prelude = consumeRaw.call(this, startToken);
        }
        block = this.Block(true);
        return {
          type: "Rule",
          loc: this.getLocation(startOffset, this.scanner.tokenStart),
          prelude,
          block
        };
      },
      generate: function(node2) {
        this.node(node2.prelude);
        this.node(node2.block);
      },
      walkContext: "rule"
    };
    return Rule;
  }
  var Selector;
  var hasRequiredSelector$1;
  function requireSelector$1() {
    if (hasRequiredSelector$1) return Selector;
    hasRequiredSelector$1 = 1;
    Selector = {
      name: "Selector",
      structure: {
        children: [[
          "TypeSelector",
          "IdSelector",
          "ClassSelector",
          "AttributeSelector",
          "PseudoClassSelector",
          "PseudoElementSelector",
          "Combinator",
          "WhiteSpace"
        ]]
      },
      parse: function() {
        var children = this.readSequence(this.scope.Selector);
        if (this.getFirstListNode(children) === null) {
          this.error("Selector is expected");
        }
        return {
          type: "Selector",
          loc: this.getLocationFromList(children),
          children
        };
      },
      generate: function(node2) {
        this.children(node2);
      }
    };
    return Selector;
  }
  var SelectorList;
  var hasRequiredSelectorList$1;
  function requireSelectorList$1() {
    if (hasRequiredSelectorList$1) return SelectorList;
    hasRequiredSelectorList$1 = 1;
    var TYPE = requireTokenizer$1().TYPE;
    var COMMA = TYPE.Comma;
    SelectorList = {
      name: "SelectorList",
      structure: {
        children: [[
          "Selector",
          "Raw"
        ]]
      },
      parse: function() {
        var children = this.createList();
        while (!this.scanner.eof) {
          children.push(this.Selector());
          if (this.scanner.tokenType === COMMA) {
            this.scanner.next();
            continue;
          }
          break;
        }
        return {
          type: "SelectorList",
          loc: this.getLocationFromList(children),
          children
        };
      },
      generate: function(node2) {
        this.children(node2, function() {
          this.chunk(",");
        });
      },
      walkContext: "selector"
    };
    return SelectorList;
  }
  var _String;
  var hasRequired_String;
  function require_String() {
    if (hasRequired_String) return _String;
    hasRequired_String = 1;
    var STRING = requireTokenizer$1().TYPE.String;
    _String = {
      name: "String",
      structure: {
        value: String
      },
      parse: function() {
        return {
          type: "String",
          loc: this.getLocation(this.scanner.tokenStart, this.scanner.tokenEnd),
          value: this.consume(STRING)
        };
      },
      generate: function(node2) {
        this.chunk(node2.value);
      }
    };
    return _String;
  }
  var StyleSheet;
  var hasRequiredStyleSheet;
  function requireStyleSheet() {
    if (hasRequiredStyleSheet) return StyleSheet;
    hasRequiredStyleSheet = 1;
    var TYPE = requireTokenizer$1().TYPE;
    var WHITESPACE = TYPE.WhiteSpace;
    var COMMENT = TYPE.Comment;
    var ATKEYWORD = TYPE.AtKeyword;
    var CDO = TYPE.CDO;
    var CDC = TYPE.CDC;
    var EXCLAMATIONMARK = 33;
    function consumeRaw(startToken) {
      return this.Raw(startToken, null, false);
    }
    StyleSheet = {
      name: "StyleSheet",
      structure: {
        children: [[
          "Comment",
          "CDO",
          "CDC",
          "Atrule",
          "Rule",
          "Raw"
        ]]
      },
      parse: function() {
        var start = this.scanner.tokenStart;
        var children = this.createList();
        var child2;
        while (!this.scanner.eof) {
          switch (this.scanner.tokenType) {
            case WHITESPACE:
              this.scanner.next();
              continue;
            case COMMENT:
              if (this.scanner.source.charCodeAt(this.scanner.tokenStart + 2) !== EXCLAMATIONMARK) {
                this.scanner.next();
                continue;
              }
              child2 = this.Comment();
              break;
            case CDO:
              child2 = this.CDO();
              break;
            case CDC:
              child2 = this.CDC();
              break;
            // CSS Syntax Module Level 3
            // §2.2 Error handling
            // At the "top level" of a stylesheet, an <at-keyword-token> starts an at-rule.
            case ATKEYWORD:
              child2 = this.parseWithFallback(this.Atrule, consumeRaw);
              break;
            // Anything else starts a qualified rule ...
            default:
              child2 = this.parseWithFallback(this.Rule, consumeRaw);
          }
          children.push(child2);
        }
        return {
          type: "StyleSheet",
          loc: this.getLocation(start, this.scanner.tokenStart),
          children
        };
      },
      generate: function(node2) {
        this.children(node2);
      },
      walkContext: "stylesheet"
    };
    return StyleSheet;
  }
  var TypeSelector;
  var hasRequiredTypeSelector;
  function requireTypeSelector() {
    if (hasRequiredTypeSelector) return TypeSelector;
    hasRequiredTypeSelector = 1;
    var TYPE = requireTokenizer$1().TYPE;
    var IDENT = TYPE.Ident;
    var ASTERISK = 42;
    var VERTICALLINE = 124;
    function eatIdentifierOrAsterisk() {
      if (this.scanner.tokenType !== IDENT && this.scanner.isDelim(ASTERISK) === false) {
        this.error("Identifier or asterisk is expected");
      }
      this.scanner.next();
    }
    TypeSelector = {
      name: "TypeSelector",
      structure: {
        name: String
      },
      parse: function() {
        var start = this.scanner.tokenStart;
        if (this.scanner.isDelim(VERTICALLINE)) {
          this.scanner.next();
          eatIdentifierOrAsterisk.call(this);
        } else {
          eatIdentifierOrAsterisk.call(this);
          if (this.scanner.isDelim(VERTICALLINE)) {
            this.scanner.next();
            eatIdentifierOrAsterisk.call(this);
          }
        }
        return {
          type: "TypeSelector",
          loc: this.getLocation(start, this.scanner.tokenStart),
          name: this.scanner.substrToCursor(start)
        };
      },
      generate: function(node2) {
        this.chunk(node2.name);
      }
    };
    return TypeSelector;
  }
  var UnicodeRange;
  var hasRequiredUnicodeRange;
  function requireUnicodeRange() {
    if (hasRequiredUnicodeRange) return UnicodeRange;
    hasRequiredUnicodeRange = 1;
    var isHexDigit = requireTokenizer$1().isHexDigit;
    var cmpChar = requireTokenizer$1().cmpChar;
    var TYPE = requireTokenizer$1().TYPE;
    var NAME = requireTokenizer$1().NAME;
    var IDENT = TYPE.Ident;
    var NUMBER = TYPE.Number;
    var DIMENSION = TYPE.Dimension;
    var PLUSSIGN = 43;
    var HYPHENMINUS = 45;
    var QUESTIONMARK = 63;
    var U = 117;
    function eatHexSequence(offset, allowDash) {
      for (var pos = this.scanner.tokenStart + offset, len = 0; pos < this.scanner.tokenEnd; pos++) {
        var code = this.scanner.source.charCodeAt(pos);
        if (code === HYPHENMINUS && allowDash && len !== 0) {
          if (eatHexSequence.call(this, offset + len + 1, false) === 0) {
            this.error();
          }
          return -1;
        }
        if (!isHexDigit(code)) {
          this.error(
            allowDash && len !== 0 ? "HyphenMinus" + (len < 6 ? " or hex digit" : "") + " is expected" : len < 6 ? "Hex digit is expected" : "Unexpected input",
            pos
          );
        }
        if (++len > 6) {
          this.error("Too many hex digits", pos);
        }
      }
      this.scanner.next();
      return len;
    }
    function eatQuestionMarkSequence(max) {
      var count = 0;
      while (this.scanner.isDelim(QUESTIONMARK)) {
        if (++count > max) {
          this.error("Too many question marks");
        }
        this.scanner.next();
      }
    }
    function startsWith(code) {
      if (this.scanner.source.charCodeAt(this.scanner.tokenStart) !== code) {
        this.error(NAME[code] + " is expected");
      }
    }
    function scanUnicodeRange() {
      var hexLength = 0;
      if (this.scanner.isDelim(PLUSSIGN)) {
        this.scanner.next();
        if (this.scanner.tokenType === IDENT) {
          hexLength = eatHexSequence.call(this, 0, true);
          if (hexLength > 0) {
            eatQuestionMarkSequence.call(this, 6 - hexLength);
          }
          return;
        }
        if (this.scanner.isDelim(QUESTIONMARK)) {
          this.scanner.next();
          eatQuestionMarkSequence.call(this, 5);
          return;
        }
        this.error("Hex digit or question mark is expected");
        return;
      }
      if (this.scanner.tokenType === NUMBER) {
        startsWith.call(this, PLUSSIGN);
        hexLength = eatHexSequence.call(this, 1, true);
        if (this.scanner.isDelim(QUESTIONMARK)) {
          eatQuestionMarkSequence.call(this, 6 - hexLength);
          return;
        }
        if (this.scanner.tokenType === DIMENSION || this.scanner.tokenType === NUMBER) {
          startsWith.call(this, HYPHENMINUS);
          eatHexSequence.call(this, 1, false);
          return;
        }
        return;
      }
      if (this.scanner.tokenType === DIMENSION) {
        startsWith.call(this, PLUSSIGN);
        hexLength = eatHexSequence.call(this, 1, true);
        if (hexLength > 0) {
          eatQuestionMarkSequence.call(this, 6 - hexLength);
        }
        return;
      }
      this.error();
    }
    UnicodeRange = {
      name: "UnicodeRange",
      structure: {
        value: String
      },
      parse: function() {
        var start = this.scanner.tokenStart;
        if (!cmpChar(this.scanner.source, start, U)) {
          this.error("U is expected");
        }
        if (!cmpChar(this.scanner.source, start + 1, PLUSSIGN)) {
          this.error("Plus sign is expected");
        }
        this.scanner.next();
        scanUnicodeRange.call(this);
        return {
          type: "UnicodeRange",
          loc: this.getLocation(start, this.scanner.tokenStart),
          value: this.scanner.substrToCursor(start)
        };
      },
      generate: function(node2) {
        this.chunk(node2.value);
      }
    };
    return UnicodeRange;
  }
  var Url;
  var hasRequiredUrl;
  function requireUrl() {
    if (hasRequiredUrl) return Url;
    hasRequiredUrl = 1;
    var isWhiteSpace = requireTokenizer$1().isWhiteSpace;
    var cmpStr = requireTokenizer$1().cmpStr;
    var TYPE = requireTokenizer$1().TYPE;
    var FUNCTION = TYPE.Function;
    var URL = TYPE.Url;
    var RIGHTPARENTHESIS = TYPE.RightParenthesis;
    Url = {
      name: "Url",
      structure: {
        value: ["String", "Raw"]
      },
      parse: function() {
        var start = this.scanner.tokenStart;
        var value2;
        switch (this.scanner.tokenType) {
          case URL:
            var rawStart = start + 4;
            var rawEnd = this.scanner.tokenEnd - 1;
            while (rawStart < rawEnd && isWhiteSpace(this.scanner.source.charCodeAt(rawStart))) {
              rawStart++;
            }
            while (rawStart < rawEnd && isWhiteSpace(this.scanner.source.charCodeAt(rawEnd - 1))) {
              rawEnd--;
            }
            value2 = {
              type: "Raw",
              loc: this.getLocation(rawStart, rawEnd),
              value: this.scanner.source.substring(rawStart, rawEnd)
            };
            this.eat(URL);
            break;
          case FUNCTION:
            if (!cmpStr(this.scanner.source, this.scanner.tokenStart, this.scanner.tokenEnd, "url(")) {
              this.error("Function name must be `url`");
            }
            this.eat(FUNCTION);
            this.scanner.skipSC();
            value2 = this.String();
            this.scanner.skipSC();
            this.eat(RIGHTPARENTHESIS);
            break;
          default:
            this.error("Url or Function is expected");
        }
        return {
          type: "Url",
          loc: this.getLocation(start, this.scanner.tokenStart),
          value: value2
        };
      },
      generate: function(node2) {
        this.chunk("url");
        this.chunk("(");
        this.node(node2.value);
        this.chunk(")");
      }
    };
    return Url;
  }
  var Value;
  var hasRequiredValue$1;
  function requireValue$1() {
    if (hasRequiredValue$1) return Value;
    hasRequiredValue$1 = 1;
    Value = {
      name: "Value",
      structure: {
        children: [[]]
      },
      parse: function() {
        var start = this.scanner.tokenStart;
        var children = this.readSequence(this.scope.Value);
        return {
          type: "Value",
          loc: this.getLocation(start, this.scanner.tokenStart),
          children
        };
      },
      generate: function(node2) {
        this.children(node2);
      }
    };
    return Value;
  }
  var WhiteSpace;
  var hasRequiredWhiteSpace;
  function requireWhiteSpace() {
    if (hasRequiredWhiteSpace) return WhiteSpace;
    hasRequiredWhiteSpace = 1;
    var WHITESPACE = requireTokenizer$1().TYPE.WhiteSpace;
    var SPACE = Object.freeze({
      type: "WhiteSpace",
      loc: null,
      value: " "
    });
    WhiteSpace = {
      name: "WhiteSpace",
      structure: {
        value: String
      },
      parse: function() {
        this.eat(WHITESPACE);
        return SPACE;
      },
      generate: function(node2) {
        this.chunk(node2.value);
      }
    };
    return WhiteSpace;
  }
  var node;
  var hasRequiredNode;
  function requireNode() {
    if (hasRequiredNode) return node;
    hasRequiredNode = 1;
    node = {
      AnPlusB: requireAnPlusB(),
      Atrule: requireAtrule$1(),
      AtrulePrelude: requireAtrulePrelude$1(),
      AttributeSelector: requireAttributeSelector(),
      Block: requireBlock(),
      Brackets: requireBrackets(),
      CDC: requireCDC(),
      CDO: requireCDO(),
      ClassSelector: requireClassSelector(),
      Combinator: requireCombinator(),
      Comment: requireComment(),
      Declaration: requireDeclaration(),
      DeclarationList: requireDeclarationList(),
      Dimension: requireDimension(),
      Function: require_Function(),
      HexColor: requireHexColor(),
      Identifier: requireIdentifier(),
      IdSelector: requireIdSelector(),
      MediaFeature: requireMediaFeature(),
      MediaQuery: requireMediaQuery(),
      MediaQueryList: requireMediaQueryList(),
      Nth: requireNth$1(),
      Number: require_Number(),
      Operator: requireOperator(),
      Parentheses: requireParentheses(),
      Percentage: requirePercentage(),
      PseudoClassSelector: requirePseudoClassSelector(),
      PseudoElementSelector: requirePseudoElementSelector(),
      Ratio: requireRatio(),
      Raw: requireRaw(),
      Rule: requireRule(),
      Selector: requireSelector$1(),
      SelectorList: requireSelectorList$1(),
      String: require_String(),
      StyleSheet: requireStyleSheet(),
      TypeSelector: requireTypeSelector(),
      UnicodeRange: requireUnicodeRange(),
      Url: requireUrl(),
      Value: requireValue$1(),
      WhiteSpace: requireWhiteSpace()
    };
    return node;
  }
  var lexer;
  var hasRequiredLexer;
  function requireLexer() {
    if (hasRequiredLexer) return lexer;
    hasRequiredLexer = 1;
    var data = require$$0;
    lexer = {
      generic: true,
      types: data.types,
      atrules: data.atrules,
      properties: data.properties,
      node: requireNode()
    };
    return lexer;
  }
  var _default;
  var hasRequired_default;
  function require_default() {
    if (hasRequired_default) return _default;
    hasRequired_default = 1;
    var cmpChar = requireTokenizer$1().cmpChar;
    var cmpStr = requireTokenizer$1().cmpStr;
    var TYPE = requireTokenizer$1().TYPE;
    var IDENT = TYPE.Ident;
    var STRING = TYPE.String;
    var NUMBER = TYPE.Number;
    var FUNCTION = TYPE.Function;
    var URL = TYPE.Url;
    var HASH = TYPE.Hash;
    var DIMENSION = TYPE.Dimension;
    var PERCENTAGE = TYPE.Percentage;
    var LEFTPARENTHESIS = TYPE.LeftParenthesis;
    var LEFTSQUAREBRACKET = TYPE.LeftSquareBracket;
    var COMMA = TYPE.Comma;
    var DELIM = TYPE.Delim;
    var NUMBERSIGN = 35;
    var ASTERISK = 42;
    var PLUSSIGN = 43;
    var HYPHENMINUS = 45;
    var SOLIDUS = 47;
    var U = 117;
    _default = function defaultRecognizer(context) {
      switch (this.scanner.tokenType) {
        case HASH:
          return this.HexColor();
        case COMMA:
          context.space = null;
          context.ignoreWSAfter = true;
          return this.Operator();
        case LEFTPARENTHESIS:
          return this.Parentheses(this.readSequence, context.recognizer);
        case LEFTSQUAREBRACKET:
          return this.Brackets(this.readSequence, context.recognizer);
        case STRING:
          return this.String();
        case DIMENSION:
          return this.Dimension();
        case PERCENTAGE:
          return this.Percentage();
        case NUMBER:
          return this.Number();
        case FUNCTION:
          return cmpStr(this.scanner.source, this.scanner.tokenStart, this.scanner.tokenEnd, "url(") ? this.Url() : this.Function(this.readSequence, context.recognizer);
        case URL:
          return this.Url();
        case IDENT:
          if (cmpChar(this.scanner.source, this.scanner.tokenStart, U) && cmpChar(this.scanner.source, this.scanner.tokenStart + 1, PLUSSIGN)) {
            return this.UnicodeRange();
          } else {
            return this.Identifier();
          }
        case DELIM:
          var code = this.scanner.source.charCodeAt(this.scanner.tokenStart);
          if (code === SOLIDUS || code === ASTERISK || code === PLUSSIGN || code === HYPHENMINUS) {
            return this.Operator();
          }
          if (code === NUMBERSIGN) {
            this.error("Hex or identifier is expected", this.scanner.tokenStart + 1);
          }
          break;
      }
    };
    return _default;
  }
  var atrulePrelude;
  var hasRequiredAtrulePrelude;
  function requireAtrulePrelude() {
    if (hasRequiredAtrulePrelude) return atrulePrelude;
    hasRequiredAtrulePrelude = 1;
    atrulePrelude = {
      getNode: require_default()
    };
    return atrulePrelude;
  }
  var selector;
  var hasRequiredSelector;
  function requireSelector() {
    if (hasRequiredSelector) return selector;
    hasRequiredSelector = 1;
    var TYPE = requireTokenizer$1().TYPE;
    var DELIM = TYPE.Delim;
    var IDENT = TYPE.Ident;
    var DIMENSION = TYPE.Dimension;
    var PERCENTAGE = TYPE.Percentage;
    var NUMBER = TYPE.Number;
    var HASH = TYPE.Hash;
    var COLON = TYPE.Colon;
    var LEFTSQUAREBRACKET = TYPE.LeftSquareBracket;
    var NUMBERSIGN = 35;
    var ASTERISK = 42;
    var PLUSSIGN = 43;
    var SOLIDUS = 47;
    var FULLSTOP = 46;
    var GREATERTHANSIGN = 62;
    var VERTICALLINE = 124;
    var TILDE = 126;
    function getNode(context) {
      switch (this.scanner.tokenType) {
        case LEFTSQUAREBRACKET:
          return this.AttributeSelector();
        case HASH:
          return this.IdSelector();
        case COLON:
          if (this.scanner.lookupType(1) === COLON) {
            return this.PseudoElementSelector();
          } else {
            return this.PseudoClassSelector();
          }
        case IDENT:
          return this.TypeSelector();
        case NUMBER:
        case PERCENTAGE:
          return this.Percentage();
        case DIMENSION:
          if (this.scanner.source.charCodeAt(this.scanner.tokenStart) === FULLSTOP) {
            this.error("Identifier is expected", this.scanner.tokenStart + 1);
          }
          break;
        case DELIM:
          var code = this.scanner.source.charCodeAt(this.scanner.tokenStart);
          switch (code) {
            case PLUSSIGN:
            case GREATERTHANSIGN:
            case TILDE:
              context.space = null;
              context.ignoreWSAfter = true;
              return this.Combinator();
            case SOLIDUS:
              return this.Combinator();
            case FULLSTOP:
              return this.ClassSelector();
            case ASTERISK:
            case VERTICALLINE:
              return this.TypeSelector();
            case NUMBERSIGN:
              return this.IdSelector();
          }
          break;
      }
    }
    selector = {
      getNode
    };
    return selector;
  }
  var element;
  var hasRequiredElement;
  function requireElement() {
    if (hasRequiredElement) return element;
    hasRequiredElement = 1;
    element = function() {
      this.scanner.skipSC();
      var children = this.createSingleNodeList(
        this.IdSelector()
      );
      this.scanner.skipSC();
      return children;
    };
    return element;
  }
  var expression;
  var hasRequiredExpression;
  function requireExpression() {
    if (hasRequiredExpression) return expression;
    hasRequiredExpression = 1;
    expression = function() {
      return this.createSingleNodeList(
        this.Raw(this.scanner.tokenIndex, null, false)
      );
    };
    return expression;
  }
  var _var;
  var hasRequired_var;
  function require_var() {
    if (hasRequired_var) return _var;
    hasRequired_var = 1;
    var TYPE = requireTokenizer$1().TYPE;
    var rawMode = requireRaw().mode;
    var COMMA = TYPE.Comma;
    _var = function() {
      var children = this.createList();
      this.scanner.skipSC();
      children.push(this.Identifier());
      this.scanner.skipSC();
      if (this.scanner.tokenType === COMMA) {
        children.push(this.Operator());
        children.push(
          this.parseCustomProperty ? this.Value(null) : this.Raw(this.scanner.tokenIndex, rawMode.exclamationMarkOrSemicolon, false)
        );
      }
      return children;
    };
    return _var;
  }
  var value;
  var hasRequiredValue;
  function requireValue() {
    if (hasRequiredValue) return value;
    hasRequiredValue = 1;
    value = {
      getNode: require_default(),
      "-moz-element": requireElement(),
      "element": requireElement(),
      "expression": requireExpression(),
      "var": require_var()
    };
    return value;
  }
  var scope;
  var hasRequiredScope;
  function requireScope() {
    if (hasRequiredScope) return scope;
    hasRequiredScope = 1;
    scope = {
      AtrulePrelude: requireAtrulePrelude(),
      Selector: requireSelector(),
      Value: requireValue()
    };
    return scope;
  }
  var fontFace;
  var hasRequiredFontFace;
  function requireFontFace() {
    if (hasRequiredFontFace) return fontFace;
    hasRequiredFontFace = 1;
    fontFace = {
      parse: {
        prelude: null,
        block: function() {
          return this.Block(true);
        }
      }
    };
    return fontFace;
  }
  var _import;
  var hasRequired_import;
  function require_import() {
    if (hasRequired_import) return _import;
    hasRequired_import = 1;
    var TYPE = requireTokenizer$1().TYPE;
    var STRING = TYPE.String;
    var IDENT = TYPE.Ident;
    var URL = TYPE.Url;
    var FUNCTION = TYPE.Function;
    var LEFTPARENTHESIS = TYPE.LeftParenthesis;
    _import = {
      parse: {
        prelude: function() {
          var children = this.createList();
          this.scanner.skipSC();
          switch (this.scanner.tokenType) {
            case STRING:
              children.push(this.String());
              break;
            case URL:
            case FUNCTION:
              children.push(this.Url());
              break;
            default:
              this.error("String or url() is expected");
          }
          if (this.lookupNonWSType(0) === IDENT || this.lookupNonWSType(0) === LEFTPARENTHESIS) {
            children.push(this.WhiteSpace());
            children.push(this.MediaQueryList());
          }
          return children;
        },
        block: null
      }
    };
    return _import;
  }
  var media;
  var hasRequiredMedia;
  function requireMedia() {
    if (hasRequiredMedia) return media;
    hasRequiredMedia = 1;
    media = {
      parse: {
        prelude: function() {
          return this.createSingleNodeList(
            this.MediaQueryList()
          );
        },
        block: function() {
          return this.Block(false);
        }
      }
    };
    return media;
  }
  var page;
  var hasRequiredPage;
  function requirePage() {
    if (hasRequiredPage) return page;
    hasRequiredPage = 1;
    page = {
      parse: {
        prelude: function() {
          return this.createSingleNodeList(
            this.SelectorList()
          );
        },
        block: function() {
          return this.Block(true);
        }
      }
    };
    return page;
  }
  var supports;
  var hasRequiredSupports;
  function requireSupports() {
    if (hasRequiredSupports) return supports;
    hasRequiredSupports = 1;
    var TYPE = requireTokenizer$1().TYPE;
    var WHITESPACE = TYPE.WhiteSpace;
    var COMMENT = TYPE.Comment;
    var IDENT = TYPE.Ident;
    var FUNCTION = TYPE.Function;
    var COLON = TYPE.Colon;
    var LEFTPARENTHESIS = TYPE.LeftParenthesis;
    function consumeRaw() {
      return this.createSingleNodeList(
        this.Raw(this.scanner.tokenIndex, null, false)
      );
    }
    function parentheses() {
      this.scanner.skipSC();
      if (this.scanner.tokenType === IDENT && this.lookupNonWSType(1) === COLON) {
        return this.createSingleNodeList(
          this.Declaration()
        );
      }
      return readSequence.call(this);
    }
    function readSequence() {
      var children = this.createList();
      var space = null;
      var child2;
      this.scanner.skipSC();
      scan:
        while (!this.scanner.eof) {
          switch (this.scanner.tokenType) {
            case WHITESPACE:
              space = this.WhiteSpace();
              continue;
            case COMMENT:
              this.scanner.next();
              continue;
            case FUNCTION:
              child2 = this.Function(consumeRaw, this.scope.AtrulePrelude);
              break;
            case IDENT:
              child2 = this.Identifier();
              break;
            case LEFTPARENTHESIS:
              child2 = this.Parentheses(parentheses, this.scope.AtrulePrelude);
              break;
            default:
              break scan;
          }
          if (space !== null) {
            children.push(space);
            space = null;
          }
          children.push(child2);
        }
      return children;
    }
    supports = {
      parse: {
        prelude: function() {
          var children = readSequence.call(this);
          if (this.getFirstListNode(children) === null) {
            this.error("Condition is expected");
          }
          return children;
        },
        block: function() {
          return this.Block(false);
        }
      }
    };
    return supports;
  }
  var atrule;
  var hasRequiredAtrule;
  function requireAtrule() {
    if (hasRequiredAtrule) return atrule;
    hasRequiredAtrule = 1;
    atrule = {
      "font-face": requireFontFace(),
      "import": require_import(),
      "media": requireMedia(),
      "page": requirePage(),
      "supports": requireSupports()
    };
    return atrule;
  }
  var dir;
  var hasRequiredDir;
  function requireDir() {
    if (hasRequiredDir) return dir;
    hasRequiredDir = 1;
    dir = {
      parse: function() {
        return this.createSingleNodeList(
          this.Identifier()
        );
      }
    };
    return dir;
  }
  var has;
  var hasRequiredHas;
  function requireHas() {
    if (hasRequiredHas) return has;
    hasRequiredHas = 1;
    has = {
      parse: function() {
        return this.createSingleNodeList(
          this.SelectorList()
        );
      }
    };
    return has;
  }
  var lang;
  var hasRequiredLang;
  function requireLang() {
    if (hasRequiredLang) return lang;
    hasRequiredLang = 1;
    lang = {
      parse: function() {
        return this.createSingleNodeList(
          this.Identifier()
        );
      }
    };
    return lang;
  }
  var selectorList;
  var hasRequiredSelectorList;
  function requireSelectorList() {
    if (hasRequiredSelectorList) return selectorList;
    hasRequiredSelectorList = 1;
    selectorList = {
      parse: function selectorList2() {
        return this.createSingleNodeList(
          this.SelectorList()
        );
      }
    };
    return selectorList;
  }
  var matches;
  var hasRequiredMatches;
  function requireMatches() {
    if (hasRequiredMatches) return matches;
    hasRequiredMatches = 1;
    matches = requireSelectorList();
    return matches;
  }
  var not;
  var hasRequiredNot;
  function requireNot() {
    if (hasRequiredNot) return not;
    hasRequiredNot = 1;
    not = requireSelectorList();
    return not;
  }
  var nthWithOfClause;
  var hasRequiredNthWithOfClause;
  function requireNthWithOfClause() {
    if (hasRequiredNthWithOfClause) return nthWithOfClause;
    hasRequiredNthWithOfClause = 1;
    var ALLOW_OF_CLAUSE = true;
    nthWithOfClause = {
      parse: function nthWithOfClause2() {
        return this.createSingleNodeList(
          this.Nth(ALLOW_OF_CLAUSE)
        );
      }
    };
    return nthWithOfClause;
  }
  var nthChild;
  var hasRequiredNthChild;
  function requireNthChild() {
    if (hasRequiredNthChild) return nthChild;
    hasRequiredNthChild = 1;
    nthChild = requireNthWithOfClause();
    return nthChild;
  }
  var nthLastChild;
  var hasRequiredNthLastChild;
  function requireNthLastChild() {
    if (hasRequiredNthLastChild) return nthLastChild;
    hasRequiredNthLastChild = 1;
    nthLastChild = requireNthWithOfClause();
    return nthLastChild;
  }
  var nth;
  var hasRequiredNth;
  function requireNth() {
    if (hasRequiredNth) return nth;
    hasRequiredNth = 1;
    var DISALLOW_OF_CLAUSE = false;
    nth = {
      parse: function nth2() {
        return this.createSingleNodeList(
          this.Nth(DISALLOW_OF_CLAUSE)
        );
      }
    };
    return nth;
  }
  var nthLastOfType;
  var hasRequiredNthLastOfType;
  function requireNthLastOfType() {
    if (hasRequiredNthLastOfType) return nthLastOfType;
    hasRequiredNthLastOfType = 1;
    nthLastOfType = requireNth();
    return nthLastOfType;
  }
  var nthOfType;
  var hasRequiredNthOfType;
  function requireNthOfType() {
    if (hasRequiredNthOfType) return nthOfType;
    hasRequiredNthOfType = 1;
    nthOfType = requireNth();
    return nthOfType;
  }
  var slotted;
  var hasRequiredSlotted;
  function requireSlotted() {
    if (hasRequiredSlotted) return slotted;
    hasRequiredSlotted = 1;
    slotted = {
      parse: function compoundSelector() {
        return this.createSingleNodeList(
          this.Selector()
        );
      }
    };
    return slotted;
  }
  var pseudo;
  var hasRequiredPseudo;
  function requirePseudo() {
    if (hasRequiredPseudo) return pseudo;
    hasRequiredPseudo = 1;
    pseudo = {
      "dir": requireDir(),
      "has": requireHas(),
      "lang": requireLang(),
      "matches": requireMatches(),
      "not": requireNot(),
      "nth-child": requireNthChild(),
      "nth-last-child": requireNthLastChild(),
      "nth-last-of-type": requireNthLastOfType(),
      "nth-of-type": requireNthOfType(),
      "slotted": requireSlotted()
    };
    return pseudo;
  }
  var parser;
  var hasRequiredParser;
  function requireParser() {
    if (hasRequiredParser) return parser;
    hasRequiredParser = 1;
    parser = {
      parseContext: {
        default: "StyleSheet",
        stylesheet: "StyleSheet",
        atrule: "Atrule",
        atrulePrelude: function(options) {
          return this.AtrulePrelude(options.atrule ? String(options.atrule) : null);
        },
        mediaQueryList: "MediaQueryList",
        mediaQuery: "MediaQuery",
        rule: "Rule",
        selectorList: "SelectorList",
        selector: "Selector",
        block: function() {
          return this.Block(true);
        },
        declarationList: "DeclarationList",
        declaration: "Declaration",
        value: "Value"
      },
      scope: requireScope(),
      atrule: requireAtrule(),
      pseudo: requirePseudo(),
      node: requireNode()
    };
    return parser;
  }
  var walker;
  var hasRequiredWalker;
  function requireWalker() {
    if (hasRequiredWalker) return walker;
    hasRequiredWalker = 1;
    walker = {
      node: requireNode()
    };
    return walker;
  }
  var syntax;
  var hasRequiredSyntax;
  function requireSyntax() {
    if (hasRequiredSyntax) return syntax;
    hasRequiredSyntax = 1;
    function merge() {
      var dest = {};
      for (var i = 0; i < arguments.length; i++) {
        var src = arguments[i];
        for (var key in src) {
          dest[key] = src[key];
        }
      }
      return dest;
    }
    syntax = requireCreate().create(
      merge(
        requireLexer(),
        requireParser(),
        requireWalker()
      )
    );
    return syntax;
  }
  var lib;
  var hasRequiredLib;
  function requireLib() {
    if (hasRequiredLib) return lib;
    hasRequiredLib = 1;
    lib = requireSyntax();
    return lib;
  }
  var libExports = requireLib();
  const index = /* @__PURE__ */ getDefaultExportFromCjs(libExports);
  const __CJS__import__0__$4 = /* @__PURE__ */ _mergeNamespaces({
    __proto__: null,
    default: index
  }, [libExports]);
  var module$m = { exports: {} };
  module$m.exports = {
    type: "assignmentExpression",
    transform(node2, ctx) {
      let left;
      let right;
      if (node2.left.type == "TypeSelector") {
        left = this.Identifier(node2.left);
      } else if (node2.left) {
        left = this.MemberExpression({ object: ctx.param, property: node2.left });
      } else {
        this.error(node2.left);
      }
      if (node2.right.type == "IdSelector") {
        right = this.CallExpression(node2.right, ctx);
      } else if (node2.right.type == "Block") {
        right = this.ObjectExpression(node2.right, ctx);
      } else if (node2.right.type == "Value") {
        right = this.ValueExpression(node2.right, ctx);
      } else {
        this.error(node2.right);
      }
      return {
        type: "assignmentExpression",
        operator: "=",
        left,
        right
      };
    },
    transpile(node2, ctx) {
      this.Node(node2.left);
      this.emit(` ${node2.operator} `);
      this.Node(node2.right);
    }
  };
  const __CJS__export_default__$m = (module$m.exports == null ? {} : module$m.exports).default || module$m.exports;
  const __CJS__import__0__$3 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
    __proto__: null,
    default: __CJS__export_default__$m
  }, Symbol.toStringTag, { value: "Module" }));
  var module$l = { exports: {} };
  module$l.exports = {
    type: "binaryExpression",
    transform(left, right, operator) {
      return {
        type: "binaryExpression",
        left,
        operator,
        right
      };
    },
    transpile(node2) {
      this.Node(node2.left);
      this.emit(` ${node2.operator} `);
      this.Node(node2.right);
    }
  };
  const __CJS__export_default__$l = (module$l.exports == null ? {} : module$l.exports).default || module$l.exports;
  const __CJS__import__1__$2 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
    __proto__: null,
    default: __CJS__export_default__$l
  }, Symbol.toStringTag, { value: "Module" }));
  var module$k = { exports: {} };
  module$k.exports = {
    type: "blockStatement",
    transform(node2, ctx) {
      const body = [];
      node2.children.forEach((child2) => {
        const statement = this.AssignmentExpression({ left: child2.property, right: child2.value }, ctx);
        body.push(statement);
      });
      const returnStatement = this.ReturnStatement(null, ctx);
      body.push(returnStatement);
      return {
        type: "blockStatement",
        body
      };
    },
    transpile(node2, ctx) {
      node2.body.forEach((child2) => {
        switch (child2.type) {
          case "assignmentExpression":
            this.AssignmentExpression(child2, ctx);
            break;
          case "returnStatement":
            this.ReturnStatement(child2, ctx);
            break;
          default:
            this.error(child2);
        }
        this.emit(";");
        this.newline();
      });
    }
  };
  const __CJS__export_default__$k = (module$k.exports == null ? {} : module$k.exports).default || module$k.exports;
  const __CJS__import__2__ = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
    __proto__: null,
    default: __CJS__export_default__$k
  }, Symbol.toStringTag, { value: "Module" }));
  var module$j = { exports: {} };
  module$j.exports = {
    type: "callExpression",
    transform(node2, ctx) {
      const callee = this.Identifier(node2.callee);
      let argument;
      const context = {
        type: "callExpression",
        callee,
        param: "ctx"
      };
      if (node2.argument.type == "block") {
        argument = this.ObjectExpression(ctx.block, context);
      } else if (node2.argument) {
        argument = this.Identifier(node2.argument);
      }
      return {
        type: "callExpression",
        callee,
        argument
      };
    },
    transpile(node2) {
      this.Node(node2.callee);
      this.emit("(");
      this.Node(node2.argument);
      this.emit(")");
    }
  };
  const __CJS__export_default__$j = (module$j.exports == null ? {} : module$j.exports).default || module$j.exports;
  const __CJS__import__3__ = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
    __proto__: null,
    default: __CJS__export_default__$j
  }, Symbol.toStringTag, { value: "Module" }));
  var module$i = { exports: {} };
  module$i.exports = {
    type: "expressionStatement",
    transform(node2) {
      const expression2 = this.CallExpression(node2);
      return {
        type: "expressionStatement",
        expression: expression2
      };
    },
    transpile(node2) {
      this.Node(node2.expression);
      if (node2.expression.type != "functionDeclaration")
        this.emit(";");
    }
  };
  const __CJS__export_default__$i = (module$i.exports == null ? {} : module$i.exports).default || module$i.exports;
  const __CJS__import__4__ = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
    __proto__: null,
    default: __CJS__export_default__$i
  }, Symbol.toStringTag, { value: "Module" }));
  var module$h = { exports: {} };
  module$h.exports = {
    type: "functionDeclaration",
    transform(node2, ctx) {
      const identifier = this.Identifier(node2);
      const context = {
        type: "functionDeclaration",
        identifier,
        param: "ctx"
      };
      const body = this.BlockStatement(ctx.block, context);
      return {
        type: "functionDeclaration",
        identifier,
        body
      };
    },
    transpile(node2) {
      this.emit("function ");
      this.Identifier(node2.identifier);
      const context = {
        type: "functionDeclaration",
        identifier: node2.identifier,
        param: "ctx"
      };
      this.emit(`(${context.param}) {`);
      this.newline();
      this.indent();
      this.BlockStatement(node2.body, context);
      this.unindent();
      this.emit("}");
    }
  };
  const __CJS__export_default__$h = (module$h.exports == null ? {} : module$h.exports).default || module$h.exports;
  const __CJS__import__5__ = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
    __proto__: null,
    default: __CJS__export_default__$h
  }, Symbol.toStringTag, { value: "Module" }));
  var module$g = { exports: {} };
  function sanitize$1(value2 = "") {
    return value2.replace(/-/g, "");
  }
  module$g.exports = {
    sanitize: sanitize$1
  };
  const __CJS__export_default__$g = (module$g.exports == null ? {} : module$g.exports).default || module$g.exports;
  const __CJS__import__0__$2 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
    __proto__: null,
    default: __CJS__export_default__$g
  }, Symbol.toStringTag, { value: "Module" }));
  var module$f = { exports: {} };
  const { sanitize } = __CJS__export_default__$g || __CJS__import__0__$2;
  module$f.exports = {
    type: "identifier",
    transform(node2, ctx = "") {
      let name;
      if (typeof node2 == "string") {
        name = sanitize(node2);
      } else {
        switch (node2.type) {
          case "ClassSelector":
          case "TypeSelector":
          case "IdSelector":
          case "Identifier":
          case "identifier":
            name = ctx + sanitize(node2.name);
            break;
          default:
            throw new Error(`Identifier: no case for ${node2.type}`);
        }
      }
      return {
        type: "identifier",
        name
      };
    },
    transpile(node2) {
      this.emit(node2.name);
    }
  };
  const __CJS__export_default__$f = (module$f.exports == null ? {} : module$f.exports).default || module$f.exports;
  const __CJS__import__6__ = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
    __proto__: null,
    default: __CJS__export_default__$f
  }, Symbol.toStringTag, { value: "Module" }));
  var module$e = { exports: {} };
  module$e.exports = {
    type: "ifStatement",
    transform(node2, ctx) {
    },
    transpile(node2, ctx) {
      this.emit("if(!");
      this.Node(node2.test);
      this.emit("){");
      this.newline();
      this.indent();
      this.Node(node2.consequent);
      this.newline();
      this.unindent();
      this.emit("}");
    }
  };
  const __CJS__export_default__$e = (module$e.exports == null ? {} : module$e.exports).default || module$e.exports;
  const __CJS__import__7__ = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
    __proto__: null,
    default: __CJS__export_default__$e
  }, Symbol.toStringTag, { value: "Module" }));
  var module$d = { exports: {} };
  module$d.exports = {
    type: "literal",
    transform(node2) {
      let value2;
      if (node2.type == "Number") {
        value2 = node2.value;
      } else if (node2.type == "Identifier") {
        value2 = `'${node2.name}'`;
      } else if (node2.type == "String") {
        value2 = `${node2.value}`;
      }
      return {
        type: "literal",
        value: value2
      };
    },
    transpile(node2) {
      this.emit(node2.value);
    }
  };
  const __CJS__export_default__$d = (module$d.exports == null ? {} : module$d.exports).default || module$d.exports;
  const __CJS__import__8__ = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
    __proto__: null,
    default: __CJS__export_default__$d
  }, Symbol.toStringTag, { value: "Module" }));
  var module$c = { exports: {} };
  module$c.exports = {
    type: "memberExpression",
    transform(node2, ctx) {
      let object;
      let property;
      if (node2.object.type == "TypeSelector") {
        object = this.Identifier(node2.object);
      } else if (node2.object) {
        object = this.Identifier(node2.object);
      } else {
        this.error(node2);
      }
      if (node2.property.type == "IdSelector") {
        property = this.CallExpression(node2.property, ctx);
      } else if (node2.property) {
        property = this.Identifier(node2.property);
      } else {
        this.error(node2);
      }
      return {
        type: "memberExpression",
        object,
        property
      };
    },
    transpile(node2, ctx) {
      this.Node(node2.object);
      this.emit(".");
      this.Node(node2.property);
    }
  };
  const __CJS__export_default__$c = (module$c.exports == null ? {} : module$c.exports).default || module$c.exports;
  const __CJS__import__9__ = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
    __proto__: null,
    default: __CJS__export_default__$c
  }, Symbol.toStringTag, { value: "Module" }));
  var module$b = { exports: {} };
  module$b.exports = {
    type: "objectExpression",
    transform(node2, ctx) {
      const properties2 = [];
      node2.children.forEach((child2) => {
        const property = this.Property(child2, ctx);
        properties2.push(property);
      });
      return {
        type: "objectExpression",
        properties: properties2
      };
    },
    transpile(node2, ctx) {
      this.emit("{");
      if (node2.properties.length > 1) {
        this.newline();
        this.indent();
        node2.properties.forEach((child2, i) => {
          this.Property(child2, ctx);
          if (i !== node2.properties.length - 1) this.emit(",");
          this.newline();
        });
        this.unindent();
      } else {
        node2.properties.forEach((child2, i) => {
          this.Property(child2, ctx);
          if (i !== node2.properties.length - 1) this.emit(",");
        });
      }
      this.emit("}");
    }
  };
  const __CJS__export_default__$b = (module$b.exports == null ? {} : module$b.exports).default || module$b.exports;
  const __CJS__import__10__ = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
    __proto__: null,
    default: __CJS__export_default__$b
  }, Symbol.toStringTag, { value: "Module" }));
  var module$a = { exports: {} };
  module$a.exports = {
    type: "pipeExpression",
    transform(node2, ctx) {
      let param, target, argument = "$1";
      return {
        type: "pipeExpression",
        param,
        target,
        argument
      };
    },
    /* 
    (function(<arg>) {
        <target>
    })(<param>)
    */
    transpile(node2) {
      this.emit("(function(");
      this.Node(node2.argument);
      this.emit("){");
      this.newline();
      this.indent();
      this.Node(node2.target);
      this.newline();
      this.unindent();
      this.emit("})(");
      this.Node(node2.param);
      this.emit(")");
    }
  };
  const __CJS__export_default__$a = (module$a.exports == null ? {} : module$a.exports).default || module$a.exports;
  const __CJS__import__11__ = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
    __proto__: null,
    default: __CJS__export_default__$a
  }, Symbol.toStringTag, { value: "Module" }));
  var module$9 = { exports: {} };
  module$9.exports = {
    type: "property",
    transform(node2, ctx) {
      const key = this.Identifier(node2.property);
      const value2 = this.ValueExpression(node2.value, ctx);
      return {
        type: "property",
        key,
        value: value2
      };
    },
    transpile(node2, ctx) {
      this.Node(node2.key);
      this.emit(": ");
      this.Node(node2.value);
    }
  };
  const __CJS__export_default__$9 = (module$9.exports == null ? {} : module$9.exports).default || module$9.exports;
  const __CJS__import__12__ = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
    __proto__: null,
    default: __CJS__export_default__$9
  }, Symbol.toStringTag, { value: "Module" }));
  var module$8 = { exports: {} };
  module$8.exports = {
    type: "returnStatement",
    transform(node2, ctx) {
      return {
        type: "returnStatement",
        argument: ctx.param
      };
    },
    transpile(node2, ctx) {
      this.emit(`return ${node2.argument}`);
    }
  };
  const __CJS__export_default__$8 = (module$8.exports == null ? {} : module$8.exports).default || module$8.exports;
  const __CJS__import__13__ = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
    __proto__: null,
    default: __CJS__export_default__$8
  }, Symbol.toStringTag, { value: "Module" }));
  var module$7 = { exports: {} };
  class Context {
    constructor(options) {
      this.current = options.head;
      this.block = options.block;
      this.argId = 0;
    }
    next() {
      this.current = this.current.next;
      return this.current && this.current.data;
    }
    node() {
      return this.current && this.current.data;
    }
    getArg() {
      return `$${this.argId++}`;
    }
  }
  function getStatementNodes(node2) {
    const statements = [];
    node2.prelude.children.forEach((child2) => {
      switch (child2.type) {
        case "Selector":
          const expression2 = getExpression.call(this, child2, node2.block);
          statements.push(expression2);
          break;
        default:
          this.error(child2);
      }
    });
    return statements;
  }
  function getExpression(node2, block) {
    const ctx = new Context({ head: node2.children.head, block });
    let next = ctx.node();
    switch (next.type) {
      case "IdSelector":
      case "TypeSelector":
        const arg = ctx.getArg();
        const target = pipeExpr.call(this, ctx, arg);
        const param = this.ObjectExpression(block, ctx);
        const argument = this.Identifier(arg);
        return {
          type: "expressionStatement",
          expression: buildPipeExpr(param, target, argument)
        };
      case "ClassSelector":
        const functionDecl = this.FunctionDeclaration(next, ctx);
        return functionDecl;
      default:
        this.error(child);
    }
  }
  function buildPipeExpr(param, target, argument) {
    return {
      type: "pipeExpression",
      argument,
      target: {
        type: "expressionStatement",
        expression: target
      },
      param
    };
  }
  function pipeExpr(ctx, arg) {
    let left = memberExp.call(this, ctx, arg);
    if (left.type != "callExpression") {
      left = {
        type: "assignmentExpression",
        operator: "=",
        left,
        right: this.Identifier(arg)
      };
    }
    left = ifExpr.call(this, ctx, arg, left);
    return left;
  }
  function memberExp(ctx, arg) {
    let curr = ctx.node();
    let left = identifierExpr.call(this, ctx, arg);
    if (curr.type == "IdSelector") {
      left = {
        type: "callExpression",
        callee: left,
        argument: this.Identifier(arg)
      };
    }
    let right = memberExp$.call(this, ctx, arg, left);
    return right;
  }
  function memberExp$(ctx, arg, child2) {
    let curr = ctx.node();
    if (curr && curr.type == "WhiteSpace") {
      curr = ctx.next();
      const right = identifierExpr.call(this, ctx, arg);
      let left = {
        type: "memberExpression",
        object: child2,
        property: right
      };
      if (curr.type == "IdSelector") {
        left = {
          type: "callExpression",
          callee: left,
          argument: this.Identifier(arg)
        };
      } else if (curr.type != "TypeSelector") {
        throw new Error();
      }
      return memberExp$.call(this, ctx, arg, left);
    } else {
      return child2;
    }
  }
  function ifExpr(ctx, arg, child2) {
    let curr = ctx.node();
    if (curr && curr.type == "PseudoClassSelector" && curr.name == "not") {
      const childCtx = new Context({ head: curr.children.head.data.children.head.data.children.head });
      const test = memberExp.call(this, childCtx, arg);
      ctx.next();
      const ch = ifExpr.call(this, ctx, arg, child2);
      return {
        type: "ifStatement",
        test,
        consequent: ch
      };
    } else if (curr && curr.type == "PseudoClassSelector" && curr.name == "matches") {
      const childCtx = new Context({ head: curr.children.head.data.children.head.data.children.head });
      const test = memberExp.call(this, childCtx, arg);
      ctx.next();
      const ch = ifExpr.call(this, ctx, arg, child2);
      return {
        type: "whileStatement",
        test,
        body: ch
      };
    } else if (curr && curr.name == ">") {
      ctx.next();
      const argument = this.Identifier(ctx.getArg());
      const right = pipeExpr.call(this, ctx, argument);
      return buildPipeExpr(child2, right, argument);
    }
    return child2;
  }
  function identifierExpr(ctx) {
    const next = ctx.node();
    ctx.next();
    switch (next.type) {
      case "IdSelector":
      case "TypeSelector":
        return this.Identifier(next);
      default:
        this.error(next);
    }
  }
  module$7.exports = {
    type: "root",
    transform(node2) {
      const statements = [];
      node2.children.forEach((child2) => {
        switch (child2.type) {
          case "Rule":
            const statement = getStatementNodes.call(this, child2);
            statements.push(...statement);
            break;
          default:
            this.error(child2);
            break;
        }
      });
      return {
        type: "root",
        statements
      };
    },
    transpile(node2) {
      node2.statements.forEach((child2) => {
        this.Node(child2);
        this.newline(false);
      });
    }
  };
  const __CJS__export_default__$7 = (module$7.exports == null ? {} : module$7.exports).default || module$7.exports;
  const __CJS__import__14__ = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
    __proto__: null,
    default: __CJS__export_default__$7
  }, Symbol.toStringTag, { value: "Module" }));
  var module$6 = { exports: {} };
  module$6.exports = {
    type: "valueExpression",
    transform(node2, ctx) {
      let left;
      let right;
      let operator;
      node2.children.forEach((child2) => {
        switch (child2.type) {
          case "Identifier":
          case "String":
          case "Number":
            if (!left) {
              left = this.Literal(child2);
            } else {
              right = this.Literal(child2);
              left = this.BinaryExpression(left, right, operator);
            }
            break;
          case "Operator":
            operator = child2.value;
            break;
          case "Function":
            if (child2.name == "calc")
              left = this.ValueExpression(child2);
            if (child2.name == "var") {
              if (!left) {
                left = this.Identifier(child2.children.head.data, "ctx.");
              } else {
                right = this.Identifier(child2.children.head.data, "ctx.");
                left = this.BinaryExpression(left, right, operator);
              }
            }
            break;
        }
      });
      node2.children.head;
      return left;
    },
    transpile(node2, ctx) {
      this.Node(node2);
    }
  };
  const __CJS__export_default__$6 = (module$6.exports == null ? {} : module$6.exports).default || module$6.exports;
  const __CJS__import__15__ = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
    __proto__: null,
    default: __CJS__export_default__$6
  }, Symbol.toStringTag, { value: "Module" }));
  var module$5 = { exports: {} };
  module$5.exports = {
    type: "whileStatement",
    transform(node2, ctx) {
    },
    transpile(node2, ctx) {
      if (this.guardLoops) {
        this.includeLoopGuard();
        this.emit("const $g = loop_guard(100);");
        this.newline();
      }
      this.emit("while(");
      this.Node(node2.test);
      this.emit("){");
      this.newline();
      this.indent();
      if (this.guardLoops) {
        this.emit("$g();");
        this.newline();
      }
      this.Node(node2.body);
      this.newline();
      this.unindent();
      this.emit("}");
    }
  };
  const __CJS__export_default__$5 = (module$5.exports == null ? {} : module$5.exports).default || module$5.exports;
  const __CJS__import__16__ = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
    __proto__: null,
    default: __CJS__export_default__$5
  }, Symbol.toStringTag, { value: "Module" }));
  var module$4 = { exports: {} };
  module$4.exports = {
    AssignmentExpression: __CJS__export_default__$m || __CJS__import__0__$3,
    BinaryExpression: __CJS__export_default__$l || __CJS__import__1__$2,
    BlockStatement: __CJS__export_default__$k || __CJS__import__2__,
    CallExpression: __CJS__export_default__$j || __CJS__import__3__,
    ExpressionStatement: __CJS__export_default__$i || __CJS__import__4__,
    FunctionDeclaration: __CJS__export_default__$h || __CJS__import__5__,
    Identifier: __CJS__export_default__$f || __CJS__import__6__,
    IfStatement: __CJS__export_default__$e || __CJS__import__7__,
    Literal: __CJS__export_default__$d || __CJS__import__8__,
    MemberExpression: __CJS__export_default__$c || __CJS__import__9__,
    ObjectExpression: __CJS__export_default__$b || __CJS__import__10__,
    PipeExpression: __CJS__export_default__$a || __CJS__import__11__,
    Property: __CJS__export_default__$9 || __CJS__import__12__,
    ReturnStatement: __CJS__export_default__$8 || __CJS__import__13__,
    Root: __CJS__export_default__$7 || __CJS__import__14__,
    ValueExpression: __CJS__export_default__$6 || __CJS__import__15__,
    WhileStatement: __CJS__export_default__$5 || __CJS__import__16__
  };
  const __CJS__export_default__$4 = (module$4.exports == null ? {} : module$4.exports).default || module$4.exports;
  const __CJS__import__0__$1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
    __proto__: null,
    default: __CJS__export_default__$4
  }, Symbol.toStringTag, { value: "Module" }));
  var module$3 = { exports: {} };
  const csstree = index || __CJS__import__0__$4;
  const nodeSettings$1 = __CJS__export_default__$4 || __CJS__import__0__$1;
  const transformer$1 = {
    parse(source) {
      const root = this.source_ast = csstree.parse(source, { parseValue: true, parseCustomProperty: true });
      switch (root.type) {
        case "StyleSheet":
          return this.Root(root);
        default:
          this.error(root);
          break;
      }
    },
    error(node2) {
      throw new Error(`This.error transforming ${node2.type} node`, node2);
    }
  };
  for (const key in nodeSettings$1) {
    transformer$1[key] = nodeSettings$1[key].transform;
  }
  module$3.exports = transformer$1;
  const __CJS__export_default__$3 = (module$3.exports == null ? {} : module$3.exports).default || module$3.exports;
  const __CJS__import__0__ = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
    __proto__: null,
    default: __CJS__export_default__$3
  }, Symbol.toStringTag, { value: "Module" }));
  var module$2 = { exports: {} };
  function loop_guard$1(timeout) {
    const start = Date.now();
    return () => {
      if (Date.now() - start > timeout) {
        throw new Error(`Infinite loop detected`);
      }
    };
  }
  module$2.exports = {
    loop_guard: loop_guard$1
  };
  const __CJS__export_default__$2 = (module$2.exports == null ? {} : module$2.exports).default || module$2.exports;
  const __CJS__import__1__$1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
    __proto__: null,
    default: __CJS__export_default__$2
  }, Symbol.toStringTag, { value: "Module" }));
  var module$1 = { exports: {} };
  const nodeSettings = __CJS__export_default__$4 || __CJS__import__0__$1;
  const { loop_guard } = __CJS__export_default__$2 || __CJS__import__1__$1;
  const transpiler$1 = {
    parse(ast, options = {}) {
      this.guardLoops = options.guardLoops !== void 0 ? options.guardLoops : true;
      this.buffer = "";
      this.whitespace = "";
      this.runtimeBuffer = "";
      this.hasLoopGuard = false;
      switch (ast.type) {
        case "root":
          this.Root(ast);
          break;
        default:
          this.error(ast);
          break;
      }
      if (this.runtimeBuffer) {
        this.newline();
        this.emit(this.runtimeBuffer);
      }
      return this.buffer;
    },
    emit(token) {
      this.buffer += token;
    },
    newline(tab = true) {
      this.buffer += "\n";
      if (tab)
        this.buffer += this.whitespace;
    },
    indent() {
      this.whitespace += "  ";
      this.buffer += "  ";
    },
    unindent() {
      this.whitespace = this.whitespace.substring(0, this.whitespace.length - 2);
      this.buffer = this.buffer.substring(0, this.buffer.length - 2);
    },
    error(node2) {
      throw new Error(`This.error transpiling ${node2.type} node`, node2);
    },
    Node(node2) {
      if (node2 && this.nodes.has(node2.type)) {
        this.nodes.get(node2.type).call(this, node2);
      } else {
        this.error(node2);
      }
    },
    includeLoopGuard() {
      if (!this.hasLoopGuard) {
        this.hasLoopGuard = true;
        this.runtimeBuffer += loop_guard.toString();
      }
    }
  };
  transpiler$1.nodes = /* @__PURE__ */ new Map();
  for (const key in nodeSettings) {
    const node2 = nodeSettings[key];
    transpiler$1.nodes.set(node2.type, node2.transpile);
    transpiler$1[key] = node2.transpile;
  }
  module$1.exports = transpiler$1;
  const __CJS__export_default__$1 = (module$1.exports == null ? {} : module$1.exports).default || module$1.exports;
  const __CJS__import__1__ = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
    __proto__: null,
    default: __CJS__export_default__$1
  }, Symbol.toStringTag, { value: "Module" }));
  var module = { exports: {} };
  const transformer = __CJS__export_default__$3 || __CJS__import__0__;
  const transpiler = __CJS__export_default__$1 || __CJS__import__1__;
  function parse(source) {
    const ast = transformer.parse(source);
    const target = transpiler.parse(ast);
    return target;
  }
  module.exports = {
    transform: (src) => transformer.parse(src),
    transpile: (ast) => transpiler.parse(ast),
    parse
  };
  const __CJS__export_default__ = (module.exports == null ? {} : module.exports).default || module.exports;
  const examples = {
    call: `.sum {
	height: calc(10 + 20);
}

#sum > console #log {
	height: 10;
}`,
    if: `.is-not-5 {
	--result: calc(var(--a) - 5);
}
console #log:not(#is-not-5 result) {
	--a: 5;
	--logged: 'A is 5';
}`,
    loop: `.is-not-0 {
	--a: calc(var(--a) - 1);
	--result: calc(var(--a));
}

console #log:matches(#is-not-0 result) {
	--a: 10;
}`,
    fibonacci: `.fib {
	--prevPrev: calc(var(--prev));
	--prev: calc(var(--curr));
	--curr: calc(var(--prevPrev) + var(--prev));
}

.fib-init {
	--prev: 0;
	--curr: 1;
}

.loop {
	--n: calc(var(--n) - 1);
}

#fib-init > #fib:matches(#loop n) > console #log {
	--n: 10;
}`
  };
  const cm = CodeMirror(document.getElementById("code"), {
    value: loadValue(),
    mode: "css",
    lineNumbers: true,
    styleActiveLine: true,
    matchBrackets: true
  });
  console.log(document.getElementById("code"), cm);
  function loadValue() {
    if (window.location.hash) {
      const key = window.location.hash.substr(1);
      if (examples[key])
        return examples[key];
    }
    if (localStorage.getItem("last_value"))
      return localStorage.getItem("last_value");
    return examples["call"];
  }
  const resultElement = document.getElementById("result");
  const cm_js = CodeMirror(document.getElementById("js-code"), {
    value: ``,
    mode: "javascript",
    lineNumbers: true,
    styleActiveLine: true,
    readOnly: true
  });
  function onChange(cm) {
    const value = cm.getValue();
    localStorage.setItem("last_value", value);
    try {
      let js = "";
      console.log(js);
      try {
        window.ast = __CJS__export_default__.transform(value);
        js = __CJS__export_default__.transpile(window.ast);
        cm_js.setValue(js);
      } catch (e) {
        console.error(e);
        cm_js.setValue(e.stack);
      }
      const result = eval(js);
      console.log("result:", result);
      resultElement.textContent = JSON.stringify(result, null, "	");
    } catch (e) {
      console.error(e);
      resultElement.textContent = e.toString();
    }
  }
  cm.on("change", onChange);
  onChange(cm);
}));
//# sourceMappingURL=cssp.js.map
