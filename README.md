# latexToAsciiMath
Converts latex strings to google searchable ascii math strings

    // EXAMPLE:
    let latexStr = 'y=\cos{\frac{\pi}{2}}+2x';

    // will return y=cos(pi/2)+2x
    latexToAsciiMath(latexStr);


NOTE: This library is under active development. It was built to work as a middle-man between javascript libraries which output latex equation and libraries which recieve ascii math or some derivative of it. Because of it's prototypical nature, it was written somewhat roughly. It may fail without proper warning.
