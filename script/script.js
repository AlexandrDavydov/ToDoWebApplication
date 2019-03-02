const az = true;
const za = false;

let saved_items = [];
let titlesSortedOrder = az;
let descriptionSortedOrder = az;
let sortMethod = az
let sortedByTitle = true;
let settings = {};

$(document).ready(function () {
    loadFromStorage();
    showLines();
});

function getSetting(){
    let settings = {};
    settings.titlesSortedOrder = titlesSortedOrder;
    settings.descriptionSortedOrder = descriptionSortedOrder;
    settings.sortedByTitle = sortedByTitle;
    settings.sortMethod = sortMethod;
    return settings;
}

function traceSettings(){
    console.log("===============================");
    console.log("titlesSortedOrder = "+titlesSortedOrder);
    console.log("descriptionSortedOrder = "+descriptionSortedOrder);
    console.log("sortedByTitle = "+sortedByTitle);
}

function setSetting(settings){
    console.log("titlesSortedOrder = "+settings.titlesSortedOrder);
    console.log("descriptionSortedOrder = "+settings.descriptionSortedOrder);
    console.log("sortedByTitle = "+settings.sortedByTitle);
    console.log("sortMethod = "+settings.sortMethod);
    titlesSortedOrder = settings.titlesSortedOrder;
    descriptionSortedOrder = settings.descriptionSortedOrder;
    sortedByTitle = settings.sortedByTitle;
    sortMethod = settings.sortMethod;
}

function loadFromStorage(){
    console.log("localStorage = "+localStorage.length);
    for(i=0; i<localStorage.length-1; i++){
        saved_items[i] = JSON.parse(localStorage.getItem(localStorage.key(i)));
        //console.log("saved_items["+(i)+"] = "+saved_items[i].title);
    }

    for(i=0; i<localStorage.length-1; i++){
        console.log("localStorage["+i+"] = "+JSON.parse(localStorage.getItem(localStorage.key(i))).title);
    }
    setSetting(JSON.parse(localStorage.getItem(
        localStorage.key(localStorage.length-1))));
}

function saveToStorage(){
    localStorage.clear();
    console.log("settings = "+getSetting());
    localStorage.setItem("settings", JSON.stringify(getSetting()));
    // console.log("settings = "+JSON.stringify(getSetting()));
    for(i=0; i<saved_items.length; i++){
        localStorage.setItem(i+1, JSON.stringify(saved_items[i]));
        //console.log("localStorage["+(i+1)+"] = "+saved_items[i].title);
    }

}

function showLines(){
    $('.row').remove();
    for(i=0; i<saved_items.length; i++){
        addLine(
            saved_items[i].title,
            saved_items[i].description,
            saved_items[i].complete,
            saved_items[i].selected);
    }
}

function addLine(title, description, completed, selected){
    let tableRef = document.getElementById('myTable');
    let newRow = tableRef.insertRow(tableRef.rows.length);
    newRow.className = "row";

    let newCell = newRow.insertCell(0);
    let selectedCB = document.createElement("input");
    selectedCB.type = "checkbox";
    selectedCB.checked = selected;
    selectedCB.className = "selectedCH";
    newCell.appendChild(selectedCB);

    newCell = newRow.insertCell(1);
    let titleText = document.createElement("input");
    titleText.value = title;
    titleText.className = "titleTF";
    newCell.appendChild(titleText);

    newCell = newRow.insertCell(2);
    let descriptionText = document.createElement("input");
    descriptionText.value = description;
    descriptionText.className = "descriptionTF";
    newCell.appendChild(descriptionText);

    newCell = newRow.insertCell(3);
    let completeCB = document.createElement("input");
    completeCB.type = "checkbox";
    completeCB.checked = completed;
    completeCB.className = "completedCH";
    newCell.appendChild(completeCB);
}

$("#addNewTask").click(function(){
    $( ".row" ).remove();
    saved_items[saved_items.length] = {
        complete: false,
        title: "New task title",
        description: "New task description."
    };
    saved_items = sorting(saved_items, titlesSortedOrder);
    saveToStorage();
    showLines();
});

$("#deleteTask").on('click', function(){
    var selectedBoxes = $(".selectedCH");
    var selected = [];
    for(var i=0; i<selectedBoxes.length; i++){
        if(selectedBoxes[i].checked === true){
            selected.push(i);
        }
    }
    if(selected.length === 0){
        alert("Select items!");
        return;
    }
    saved_items = removeSelectedFromArray(saved_items, selected);
    traceArray(saved_items);
    saveToStorage();
    showLines();
});

function traceArray(arr){
    console.log("=========traceArray==========");
    for(var i=0; i<arr.length; i++){
        console.log(arr[i].title);
    }
}

function removeSelectedFromArray(all, selected){
    var newAll = [];
    for(var i=0; i<all.length; i++){
        var contains = false;
        for(var j=0; j<selected.length; j++){
            if(i === selected[j]){
                contains = true;
            }
        }
        if(!contains) {
            newAll.push(all[i]);
        }
    }
    return newAll;
}

$("#myTable").on('change', 'input',function(event){
    saveData();

});

function saveData(){
    var selectedBoxes = $(".selectedCH");
    //console.log("selectedBoxes.length = "+selectedBoxes.length);
    var titles = $(".titleTF");
    var descriptions = $(".descriptionTF");
    var completedBoxes = $(".completedCH");
    for(var i=0; i<selectedBoxes.length; i++){
        var lineObj = {};
        lineObj.complete = completedBoxes[i].checked;
        lineObj.title = titles[i].value;
        lineObj.description = descriptions[i].value;
        lineObj.selected = selectedBoxes[i].checked;
        saved_items[i] = lineObj;

        //console.log("lineObj.title = "+lineObj.title);
    }
    saveToStorage();
}
function markSorted(){
    if(sortedByTitle){
        $("#title").className("sort");
    }else{
        $("#description").className("sort");
    }
}
function sorting(arr, order){
    traceSettings();
    var byName = arr.slice(0);
    byName.sort(function(a,b) {
        let y;
        let x;
        if(sortedByTitle) {
            x = a.title.toLowerCase();
            y = b.title.toLowerCase();
        }else{
            x = a.description.toLowerCase();
            y = b.description.toLowerCase();
        }
        if(order) {
            return x < y ? -1 : x > y ? 1 : 0;
        }else{
            return x < y ? 1 : x > y ? -1 : 0;
        }
    });
    return byName;
}

$("#sort1").on('click', function(){
    titlesSortedOrder = !titlesSortedOrder;
    sortMethod = !sortMethod;
    sortedByTitle = true;
    saved_items = sorting(saved_items, titlesSortedOrder);
    saveToStorage();
    showLines();
});

$("#sort2").on('click', function(){
    descriptionSortedOrder = !descriptionSortedOrder;
    sortMethod = !sortMethod;
    sortedByTitle = false;
    saved_items = sorting(saved_items, descriptionSortedOrder);
    saveToStorage();
    showLines();
});
