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
var pJSON = pico.export('pico/json');
var baseJson;

// ready the DOM
E(document).ready(function () {
    
    // INITIALIZE CODEMIRROR
    // ------------------------------
    
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
    
    // LOCAL STORAGE
    // ------------------------------
    if (localStorage.getItem('jsoncode') === null) {
        var defaultJSON = ```
		{
			"topic": {
			}
		}
		```;
        localStorage.setItem('jsoncode', defaultJSON);
    }
    
    if (localStorage.getItem('jscode') === null) {
        var defaultJS = '$';
        localStorage.setItem('jscode', defaultJS);
    }
    
    // get local storage
    editorJS.setValue(localStorage.getItem('jscode'));
    editorJSON.setValue(localStorage.getItem('jsoncode'));
	baseJson = parse(editorJSON.getValue());
    
    
    // EDITOR UPDATES
    // ------------------------------
    
    // editor update (js)
    editorJSON.on('changes', function (cm, arr) {
		if ('setValue' === arr[0].origin) return
		var json = editorJSON.getValue();
        localStorage.setItem('jsoncode', json);
		baseJson = parse(json);
    });
    
    // editor update (js)
    editorJS.on('changes', function (cm, arr) {
		if ('setValue' === arr[0].origin) return
		const jsBody = editorJS.getValue();
        localStorage.setItem('jscode', jsBody);

		if (!baseJson) return;

		try {
			const func = new Function('$', 'return '+jsBody);
			const jwalk = func(pJSON.path(baseJson));
			if (!jwalk || !jwalk.prototype) return;
			editorJSON.setValue(JSON.stringify(jwalk(), null, '\t'));
		} catch (ex) {
		}
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
		editorJSON.setValue(JSON.stringify(parse(editorJSON.getValue())))
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
