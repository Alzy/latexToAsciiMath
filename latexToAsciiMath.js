/**
 * Converts mathquill latext output to parsable AsciiMath to be evaluated.
 *     for use with http://nerdamer.com/demo.html
 * @param  {String} latexString LaTeX string of equation.
 * @return {String}             AsciiMath string
 */
window.latexToAsciiMath = function (latexString) {
    let originalString = latexString;
    var asciiString = '';
    
    // find next command
    let cmdIndex = latexString.search(/[\\^_].?/);
    if (cmdIndex < 0) {
        return asciiString + latexString;
    }
    asciiString += latexString.slice(0, cmdIndex);
    latexString = latexString.substr(cmdIndex).trim();


    // parse command
    let cmdEndIndex = latexString.search(/[\0\ \\\(){+-=_^]/);
    let cmd = latexString.slice(0, cmdEndIndex);

    if (latexString.substr(0,1) == '^' || latexString.substr(0,1) == '_') {
        cmd = latexString.substr(0,1);
        asciiString += cmd;
        latexString = latexString.substr(1).trim();
    } else {
        latexString = latexString.substr(1).trim();
        cmdEndIndex = latexString.search(/[\ \\\(){+-=_^]/);
        cmd = latexString.slice(0, cmdEndIndex).trim();
    }

    var ipsa = [];
    switch(cmd) {
        // single character command, sometimes followed by single {}
        case '^':
        case '_':
            if (latexString.substr(0, 1) != '{') {break};

            ipsa = getInnerParenString(latexString, '{');
            if (ipsa[1] > 1) { asciiString += '('}
            asciiString += latexToAsciiMath(ipsa[0]);
            if (ipsa[1] > 1) { asciiString += ')'}
            latexString = latexString.substr(ipsa[1] + 2).trim();
            break;

        // followed by single {}
        case 'sqrt':
        case 'log':
        case 'ln':
            asciiString += cmd;
            latexString = latexString.substr(cmd.length).trim();

            ipsa = getInnerParenString(latexString, '{');
            asciiString += '(';
            asciiString += latexToAsciiMath(ipsa[0]);
            asciiString += ')';
            latexString = latexString.substr(ipsa[1] + 2).trim();
            break;


        // followed by by {}{}
        case 'frac':
            latexString = latexString.substr(cmd.length).trim();

            // wrap fraction in parenthesis first
            // weird parsing happens otherwise
            asciiString += '(';
            // ^^ fraction open paren
            ipsa = getInnerParenString(latexString, '{');
            if (ipsa[1] > 1) { asciiString += '('}
            asciiString += latexToAsciiMath(ipsa[0]);
            if (ipsa[1] > 1) { asciiString += ')'}
            latexString = latexString.substr(ipsa[1] + 2).trim();

            asciiString += '/';

            ipsa = getInnerParenString(latexString, '{');
            if (ipsa[1] > 1) { asciiString += '('}
            asciiString += latexToAsciiMath(ipsa[0]);
            if (ipsa[1] > 1) { asciiString += ')'}
            latexString = latexString.substr(ipsa[1] + 2).trim();
            asciiString += ')';
            // ^^ fraction closing paren
            break;

        // followed by \left( and \right)
        case 'arcsin':
        case 'arccos':
        case 'arctan':
        case 'sin':
        case 'cos':
        case 'tan':
        case 'arcsec':
        case 'arccsc':
        case 'arccot':
        case 'sec':
        case 'csc':
        case 'cot':
            asciiString += cmd; 
            latexString = latexString.substr(cmd.length);
            break;

        case 'left':
            asciiString += '(';
            latexString = latexString.substr(cmd.length + 1).trim();
            break;
        case 'right':
            asciiString += ')';
            latexString = latexString.substr(cmd.length + 1).trim();
            break;

        case 'cdot':
            asciiString += '*';
            latexString = latexString.substr(cmd.length).trim();
            break;

        case 'alpha':
        case 'beta':
        case 'gamma':
        case 'delta':
        case 'epsilon':
        case 'zeta':
        case 'eta':
        case 'theta':
        case 'iota':
        case 'kappa':
        case 'lambda':
        case 'mu':
        case 'nu':
        case 'xi':
        case 'omnicron':
        case 'pi':
        case 'rho':
        case 'sigma':
        case 'tau':
        case 'upsilon':
        case 'phi':
        case 'chi':
        case 'psi':
        case 'omega':
        case 'Alpha':
        case 'Beta':
        case 'Gamma':
        case 'Delta':
        case 'Epsilon':
        case 'Zeta':
        case 'Eta':
        case 'Theta':
        case 'Iota':
        case 'Kappa':
        case 'Lambda':
        case 'Mu':
        case 'Nu':
        case 'Xi':
        case 'Omnicron':
        case 'Pi':
        case 'Rho':
        case 'Sigma':
        case 'Tau':
        case 'Upsilon':
        case 'Phi':
        case 'Chi':
        case 'Psi':
        case 'Omega':
            asciiString += cmd;
            latexString = latexString.substr(cmd.length).trim();
            break;
        
        default:
            console.log('unrecognized command');
            break;
    }

    // DEBUG LOGS
    // console.log('\n\n');
    // console.log('  org: ', originalString);
    // console.log('\n\n');
    // console.log('  cmd: ', cmdIndex);
    // console.log('  cmd: ', cmd);
    // console.log('ascii: ', asciiString);
    // console.log('rmtex: ', latexString);

    // console.log('\n\n');
    // console.log('chRem:: ', latexString.length);
    // console.log('\n\n\n\n');

    if (latexString.length == originalString.length) {
        throw('Unable to parse LaTeX string.');
        return;
    } else if (latexString.length > 0) {
        asciiString += latexToAsciiMath(latexString);
    }
    return asciiString;
}


function getInnerParenString(str, openParen) {
    let innerString = '';
    let innerStringLength = 0;

    let closeParen = '';
    switch (openParen) {
        case '(':
            closeParen = ')';
            break;
        case '{':
            closeParen = '}';
            break;
        case '[':
            closeParen = ']';
            break;
        default:
            closeParen = ')';
            break;
    }
    let nextOpenParenIndex = str.search(openParen);
    let nextCloseParenIndex = str.search(closeParen);

    // start after initial ({[ if any.
    if (nextOpenParenIndex == 0) {
        str = str.substr(1);
        nextOpenParenIndex = str.search(openParen);
        nextCloseParenIndex = str.search(closeParen);
    } else if (nextCloseParenIndex < 0) {
        alert('Syntax Error: No matching close bracket in entry.');
        return;
    }

    var openCount = 0;
    var closeCount = 0;
    for (let i = 0; i < str.length; i++) {
        let strChar = str.charAt(i);
        if (strChar == openParen) {
            openCount++;
        }
        if (strChar == closeParen) {
            closeCount++;
        }

        if (closeCount > openCount) {
            return [innerString, innerStringLength];
        }
        innerString += strChar;
        innerStringLength++;
    }
}