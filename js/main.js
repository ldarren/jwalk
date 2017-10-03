/*!
███████ ██████  ██ ████████  ██████  ██████
██      ██   ██ ██    ██    ██    ██ ██   ██
█████   ██   ██ ██    ██    ██    ██ ██████
██      ██   ██ ██    ██    ██    ██ ██   ██
███████ ██████  ██    ██     ██████  ██   ██
2016 ~ Mark Hillard | (mark@)markhillard.com
*/


/*! Table Of Contents:
// ------------------------------
// INITIALIZE CODEMIRROR
// CODE LOADING
// LOCAL STORAGE
// EDITOR UPDATES
// DEPENDENCY INJECTION
// RESIZE FUNCTIONS
// GENERAL FUNCTIONS
// UTILITY FUNCTIONS
// REFRESH EDITOR
// ------------------------------
*/


// make jQuery play nice
var E = $.noConflict(true);

// ready the DOM
E(document).ready(function () {
    
    // INITIALIZE CODEMIRROR
    // ------------------------------
    
    // js code
    var editorJS = CodeMirror.fromTextArea(jscode, {
        mode: 'javascript',
        keyMap: 'sublime',
        lineNumbers: true,
        lineWrapping: false,
        theme: 'dracula',
        tabSize: 4,
        indentUnit: 4,
        foldGutter: true,
        gutters: ['CodeMirror-linenumbers', 'CodeMirror-foldgutter'],
        matchBrackets: true,
        autoCloseBrackets: true,
        scrollbarStyle: 'overlay',
        styleActiveLine: true
    });
    
    // json code
    var editorJSON = CodeMirror.fromTextArea(jsoncode, {
        mode: 'application/json',
        keyMap: 'sublime',
        lineNumbers: true,
        lineWrapping: false,
        theme: 'dracula',
        tabSize: 4,
        indentUnit: 4,
        foldGutter: true,
        gutters: ['CodeMirror-linenumbers', 'CodeMirror-foldgutter'],
        matchBrackets: true,
        autoCloseBrackets: true,
        scrollbarStyle: 'overlay',
        styleActiveLine: true,
		lint: true
    });
    
    // LOCAL STORAGE
    // ------------------------------
    if (localStorage.getItem('jscode') === null) {
        var defaultJS = '$(document).ready(function () {\n    $(\'h1\').fadeOut(800).fadeIn(800);\n    $(\'p\').first().delay(400).fadeOut(800).fadeIn(400);\n    $(\'p\').last().delay(800).fadeOut(800).fadeIn(400);\n});';
        localStorage.setItem('jscode', defaultJS);
    }
    
    if (localStorage.getItem('jsoncode') === null) {
        var defaultJSON = '{"hello":"world"}';
        localStorage.setItem('jsoncode', defaultJSON);
    }
    
    // get local storage
    editorJS.setValue(localStorage.getItem('jscode'));
    editorJSON.setValue(localStorage.getItem('jsoncode'));
    
    
    // EDITOR UPDATES
    // ------------------------------
    
    // editor update (js)
    editorJS.on('change', function () {
        localStorage.setItem('jscode', editorJS.getValue());
    });
    
    // editor update (js)
    editorJSON.on('change', function () {
        localStorage.setItem('jsoncode', editorJSON.getValue());
    });
    
    
    // RESIZE FUNCTIONS
    // ------------------------------
    // drag handle to resize code pane
    var resizeHandle = E('.code-pane');
    var windowHeight = E(window).height();
    
    resizeHandle.resizable({
        handles: 's',
        minHeight: 0,
        maxHeight: windowHeight - 16,
        create: function () {
        },
        resize: function (e, ui) {
            ui.element.next().css('height', windowHeight - ui.size.height + 'px');
        },
        stop: function (e, ui) {
            editorJSON.refresh();
            editorJS.refresh();
        }
    });
    
    
    // GENERAL FUNCTIONS
    // ------------------------------
    
    // expanding scrollbars
    var vScroll = E('.CodeMirror-overlayscroll-vertical');
    var hScroll = E('.CodeMirror-overlayscroll-horizontal');
    
    vScroll.on('mousedown', function () {
        E(this).addClass('hold');
    });
    
    hScroll.on('mousedown', function () {
        E(this).addClass('hold');
    });
    
    E(document).on('mouseup', function () {
        vScroll.removeClass('hold');
        hScroll.removeClass('hold');
    });
    
    // indent wrapped lines
    function indentWrappedLines(editor) {
        var charWidth = editor.defaultCharWidth(),
            basePadding = 4;
        editor.on('renderLine', function (cm, line, elt) {
            var off = CodeMirror.countColumn(line.text, null, cm.getOption('tabSize')) * charWidth;
            elt.style.textIndent = '-' + off + 'px';
            elt.style.paddingLeft = (basePadding + off) + 'px';
        });
    }
    
    // run indent wrapped lines
    indentWrappedLines(editorJS);
    
    
    // UTILITY FUNCTIONS
    // ------------------------------
    
    // toggle tools
    E('.toggle-tools').on('click', function () {
        E(this).toggleClass('active');
        if (E(this).hasClass('active')) {
            E(this).html('tools <i class="fa fa-chevron-up"></i>');
        } else {
            E(this).html('tools <i class="fa fa-chevron-down"></i>');
        }
    });
    
    // toggle line wrapping (js)
    E('.toggle-lineWrapping.js').on('mousedown', function () {
        E(this).toggleClass('active');
        if (E(this).hasClass('active')) {
            editorJS.setOption('lineWrapping', true);
            E(this).html('wrap <i class="fa fa-toggle-on"></i>');
        } else {
            editorJS.setOption('lineWrapping', false);
            E(this).html('wrap <i class="fa fa-toggle-off"></i>');
        }
    });
    
    // vim
    E('.toggle-vim').on('click', function () {
        E(this).toggleClass('active');
        if (E(this).hasClass('active')) {
            emmetCodeMirror(editorJSON);
        } else {
            emmetCodeMirror.dispose(editorJSON);
        }
    });

	function parse(str){
		try { str = JSON.parse(str) }
		catch (ex) { return alert('Failed to parse') }
		if (!str) return alert('Not a valid json')
		if (str.charAt) return parse(str)
		return str
	}
    
    // json pretty
    E('.json-pretty').on('click', function () {
		editorJSON.setValue(JSON.stringify(parse(editorJSON.getValue()), null, '\t'))
    });
    
    // json stringify
    E('.json-stringify').on('click', function () {
		try { editorJSON.setValue(JSON.stringify(JSON.parse(editorJSON.getValue()))) }
		catch (exp) { console.error(exp) }
    });
    
    // clear editor
    E('.clear-editor').on('click', function () {
        editorJSON.setValue('');
        editorJS.setValue('');
    });
    
    // save as html file
    E('.save').on('click', function () {
        var text = editorJSON.getValue();
        var blob = new Blob([text], {
            type: 'application/json; charset=utf-8'
        });
        
        saveAs(blob, 'result.json');
    });
    
    
    // REFRESH EDITOR
    // ------------------------------
    editorJS.refresh();
    editorJSON.refresh();
    
});
