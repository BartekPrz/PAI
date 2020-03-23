/*function isEmpty(text) {
    return text.length ? true : false;
}*/

function isWhiteSpaceOrEmpty(str) {
    return /^[\s\t\r\n]*$/.test(str);
}

/*function checkString(string, message) {
    if(isWhiteSpaceOrEmpty(string)) {
        alert(message);
        return false;
    }
    else return true;
}*/

function isEmailInvalid(str) {
    let email = /^[a-zA-Z_0-9\.]+@[a-zA-Z_0-9\.]+\.[a-zA-Z][a-zA-Z]+$/;
    if (email.test(str))
        return false;
    else {
        return true;
    }
}
   
/*function checkStringAndFocus(obj, msg) {
    let str = obj.value;
    let errorFieldName = "e_" + obj.name.substr(2, obj.name.length);
    if (isWhiteSpaceOrEmpty(str)) {
        document.getElementById(errorFieldName).innerHTML = msg;
        obj.focus();
        return false;
    }
    else {
        document.getElementById(errorFieldName).innerHTML = "";
        return true;
    }
}

function checkEmailAndFocus(obj, msg) {
    let str = obj.value;
    let errorFieldName = "e_" + obj.name.substr(2, obj.name.length);
    if (!checkEmail(str)) {
        document.getElementById(errorFieldName).innerHTML = msg;
        obj.focus();
        return false;
    }
    else {
        document.getElementById(errorFieldName).innerHTML = "";
        return true;
    }
}*/
   

function checkStringAndFocus(obj, msg, validateFunction) {
    let str = obj.value;
    let errorFieldName = "e_" + obj.name.substr(2, obj.name.length);
    //console.log(getElementsBtTagName("TR"))
    if (validateFunction(str)) {
        document.getElementById(errorFieldName).innerHTML = msg;
        obj.focus();
        return false;
    }
    else {
        document.getElementById(errorFieldName).innerHTML = "";
        return true;
    }
}

function validate(formularz) {
    //alterRows(1, document.getElementsByTagName("tr")[0])
    var imie = formularz.elements["f_imie"];
    var nazwisko = formularz.elements["f_nazwisko"];
    var kod = formularz.elements["f_kod"];
    var ulica = formularz.elements["f_ulica"];
    var miasto = formularz.elements["f_miasto"];
    var email = formularz.elements["f_email"];
    if (checkStringAndFocus(imie, "Podaj imię!", isWhiteSpaceOrEmpty) && checkStringAndFocus(nazwisko, "Podaj nazwisko!", isWhiteSpaceOrEmpty) && checkStringAndFocus(kod, "Podaj kod pocztowy!", isWhiteSpaceOrEmpty) 
        && checkStringAndFocus(ulica, "Podaj nazwę ulicę!", isWhiteSpaceOrEmpty) && checkStringAndFocus(miasto, "Podaj nazwę miasta!", isWhiteSpaceOrEmpty) && 
        checkStringAndFocus(email, "Podaj właściwy e-mail", isEmailInvalid))
        return true;
    else 
        return false;
}

function showElement(e) {
    document.getElementById(e).style.visibility = 'visible';
}

function hideElement(e) {
    document.getElementById(e).style.visibility = 'hidden';
}

function alterRows(i, e) {
    if (e) {
        if (i % 2 == 1) {
            e.setAttribute("style", "background-color: Aqua;");
        }
        e = e.nextSibling;
        while (e && e.nodeType != 1) {
            e = e.nextSibling;
        }
        alterRows(++i, e);
    }
 }

 function nextNode(e) {
    while (e && e.nodeType != 1) {
        e = e.nextSibling;
    }
    return e;
}

function prevNode(e) {
    while (e && e.nodeType != 1) {
    e = e.previousSibling;
    }
return e;
}

function swapRows(b) {
    let tab = prevNode(b.previousSibling);
    let tBody = nextNode(tab.firstChild);
    let lastNode = prevNode(tBody.lastChild);
    tBody.removeChild(lastNode);
    let firstNode = nextNode(tBody.firstChild);
    tBody.insertBefore(lastNode, firstNode);
}

function cnt(form, msg, maxSize) {
    if (form.value.length > maxSize)
        form.value = form.value.substring(0, maxSize);
    else
        msg.innerHTML = maxSize - form.value.length;
}
 