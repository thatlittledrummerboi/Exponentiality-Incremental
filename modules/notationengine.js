function biNotation(val, exp, decpoint, notation) {
    if (notation = null) { notation = 0; }

    if (val < 1000) {
        val.toFixed(decpoint);
    }

    if (notation = 0) {
        if (val.lt(1_000_000_000_000_000_000_000_000_000_000_000)) { //1 decillion
            return(StandardNotation(val, exp));
        }
        return(SciNotation(val, exp));
    } else if (notation = 1) {
        return(StandardNotation(val, exp));
    } else if (notation = 2) {
        return(SciNotation(val, exp));
    }
}

function notation(val, decpoint, notation) {
    let exp = Math.floor(Math.log10(val));
    var valstring = val.toString();
    if (notation = null) { notation = 0; }
    if (decpoint = null) { decpoint = 2; }

    if (val < 1000) {
        return(valstring.toFixed(decpoint));
    }
    
    if (notation = 0) {
        if (val < 1_000_000_000_000_000_000_000_000_000_000_000) { //1 decillion
            return(StandardNotation(valstring, exp));
        }
        return(SciNotation(valstring, exp));
    } else if (notation = 1) {
        return(StandardNotation(valstring, exp));
    } else if (notation = 2) {
        return(SciNotation(valstring, exp));
    }
}

function StandardNotation(valstring, exp) {
    var suffixes = ["", "K", "M", "B", "T", "Qa", "Qt", "Sx", "Sp", "Oc", "No", "Dc"];

    switch(exp % 3) {
        case 0:
            return(valstring[0] + "." + valstring[1] + valstring[2] + valstring[3] + suffixes[Math.floor(exp/3)]);
        case 1:
            return(valstring[0] + valstring[1] + "." + valstring[2] + valstring[3] + valstring[4] + suffixes[Math.floor(exp/3)]);
        case 2:
            return(valstring[0] + valstring[1] + valstring[2] + "." + valstring[3] + valstring[4] + valstring[5] + suffixes[Math.floor(exp/3)]);
    }
}

function SciNotation(valstring, exp) { return(valstring[0] + "." + valstring[1] + valstring[2] + valstring[3] + "e" + exp); }

export {notation, biNotation};