function tabSelector(evt, tabName) {
    // declare all variables
    var i, tabcontent, tablinks;

    // get all elements with class "tabcontent" and hide
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }

    // get all elements with class "tablinks" and remove class "active"
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }

    //  show the current tab, and add an "active" classto the button
    document.getElementById(tabName).style.display = "block";
    evt.currentTarget.className += " active";
}

// set default-open tab
document.getElementById("defaultOpen").click();
