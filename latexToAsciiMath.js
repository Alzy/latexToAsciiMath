/**
 * Converts mathquill latext output to parsable AsciiMath to be evaluated.
 *     for use with http://nerdamer.com/demo.html
 * @param  {String} latexString LaTeX string of equation.
 * @return {String}             AsciiMath string
 */
window.latexToAsciiMath = function (latexString) {
    var asciiString = '';
    
    //while(latexString.length) {
        // find next command
        let cmdIndex = latexString.search(/[\\^_].?/);
        if (cmdIndex < 0) {
            asciiString = latexString;
            //break;
        }


        // parse command
        asciiString += latexString.slice(0, cmdIndex);
        latexString = latexString.substr(cmdIndex);

        let cmdEndIndex = latexString.search(/[\ \\{]/);
        let cmd = latexString.slice(1, cmdEndIndex);

        switch(cmd) {
            case 'sin':
            case 'cos':
            case 'tan':
                console.log('function: ', cmd);
                break;

            case 'frac':
                console.log('fraction');
                break;

            case 'left':
            case 'right':
                console.log('match paren');
                break;
        }

        console.log('\n\n');
        console.log('cmd: ', cmdIndex);
        console.log('cmd: ', cmd);
        console.log('ascii: ', asciiString);
        console.log('latex: ', latexString);

        console.log('\n\n');
        console.log('chRem:: ', latexString.length);
    //}
}