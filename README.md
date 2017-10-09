# JSon

JSon is an online JSON viewer that supported jwalk/jsonpath, json pretify and json stringify.
JSon is heavily based on the [Editor](https://markhillard.github.io/Editor/)

- [jQuery](http://jquery.com/)
- [jQuery UI - Resizable](https://jqueryui.com/resizable/)
- [CodeMirror](https://codemirror.net/)
- [FileSaver.js](https://github.com/eligrey/FileSaver.js)
- [pico-common](https://github.com/ldarren/pico-common/bin/pico.js) provides acutal jWalk implementation

## Features

- json parse
- json stringify
- jwalk/jsonpath
- Auto-Save (Local Storage)
- Resizable Code/Preview Pane
- Preview Pane Width Indicator
- Syntax Highlighting
- Code Folding
- Tag/Bracket Matching
- Auto-Close HTML Tags
- Text Wrapping Toggles
- Clear Editor
- Save As JSON File
- Dependency Injection

### CodeMirror Addons

- [Sublime Keymap](https://codemirror.net/demo/sublime.html)
- [VIM Keymap](https://codemirror.net/demo/vim.html)

**Note:** If VIM is enabled the Sublime Keymap will be disabled, and vice-versa.

## Browser Support

JSon works in all modern web browsers and IE10+.

## JWalk

The JWalk tool uses in this editor is derived from [Stefan Goessner's JSON Path](http://goessner.net/articles/JsonPath/). JWalk uses valid javascript syntax instead of dot-notation or bracket notation

### JWalk VS JSONPath

Here is a complete overview and a side by side comparison of the JWalk syntax elements with its JSONPath counterparts.

| JSONPath | JWalk | Description |
| ------------- | ------------- | ------------- |
| $ | $ | the root object/element |
| @ | function paramter | the current object/element, Jwalk supported standard javascript function, current object is the first pass-in parameter |
| . or [] | () | child operator, JWalk uses chained function |
| .. | ('..', 'key') | recursive descent. JSONPath borrows this syntax from E4X. |
| * | * | wildcard. All objects/elements regardless their names. |
| [] | () | subscript operator. XPath uses it to iterate over element collections and for predicates. In Javascript and JSON it is the native array operator. |
| [,] | (,) | Union operator in XPath results in a combination of node sets. JSONPath allows alternate names or array indices as a set. |
| [start:end:step] | ([start, end, step]) | array slice operator borrowed from ES4. |
| ?() | ( curr => {} ) | applies a filter (script) expression. |
| () | ( curr => {} ) | script expression, using the underlying script engine, JWalk has same syntax for filter and script expression |

### Jwalk Examples

Let's practice JWalk expressions by some more examples. We start with a simple JSON structure built after Stefen's example representing a bookstore

```json
{ "store": {
    "book": [ 
      { "category": "reference",
        "author": "Nigel Rees",
        "title": "Sayings of the Century",
        "price": 8.95
      },
      { "category": "fiction",
        "author": "Evelyn Waugh",
        "title": "Sword of Honour",
        "price": 12.99
      },
      { "category": "fiction",
        "author": "Herman Melville",
        "title": "Moby Dick",
        "isbn": "0-553-21311-3",
        "price": 8.99
      },
      { "category": "fiction",
        "author": "J. R. R. Tolkien",
        "title": "The Lord of the Rings",
        "isbn": "0-395-19395-8",
        "price": 22.99
      }
    ],
    "bicycle": {
      "color": "red",
      "price": 19.95
    }
  }
}
```
| JSOPNPath | JWalk | Result |
| ------------- | ------------- | ------------- |
| $.store.book[*].author | $('store')('book')('*')('author') | the authors of all books in the store |
| $..author | $('..', 'author') | all authors |
| $.store.* | $('store')('*') | all things in store, which are some books and a red bicycle. |
| $.store..price | $('store')('..', 'price') | the price of everything in the store. |
| $..book[2] | $('..', 'book')([2]) | the third book |
| $..book[-1:] | $('..', 'book')( [-1] ) | the last book in order. |
| $..book[0,1] | $('..', 'book')([0, 1]) | the first two books |
| $..book[:2] | $('..', 'book')(0, 2) | the first two books |
| $..book[?(@.isbn)] | $('..', 'book')( curr => curr.isbn ? curr : void 0 ) | filter all books with isbn number |
| $..book[?(@.price<10)] | $('..', 'book')( curr => curr.price < 10 ? curr : void 0 ) | filter all books cheapier than 10 |
| N.A | $('..', 'book')( curr => curr.price * 3 ) | map all book prices multiple by 3 |
| $..* | $('..', '*') | all Elements in XML document. All members of JSON structure. |
