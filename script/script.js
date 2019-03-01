const az = true;
const za = false;

var saved_items = [];
var titlesSortedOrder = az;
var descriptionSortedOrder = az;
var sortedByTitle = true;

$(document).ready(function () {
    loadFromStorage();
    showLines();

});

function loadFromStorage(){
    console.log("localStorage.length = "+localStorage.length);
    for(i=0; i<localStorage.length; i++){
        saved_items[i] = JSON.parse(localStorage.getItem(localStorage.key(i)));
        console.log(saved_items[i])
    }
}

function saveToStorage(){
    localStorage.clear();
    for(i=0; i<saved_items.length; i++){
        localStorage.setItem(i.toString(), JSON.stringify(saved_items[i]));
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
    var tableRef = document.getElementById('myTable');
    var newRow   = tableRef.insertRow(tableRef.rows.length);
    newRow.className = "row";

    var newCell  = newRow.insertCell(0);
    var selectedCB  = document.createElement("input");
    selectedCB.type = "checkbox";
    selectedCB.checked = selected;
    selectedCB.className = "selectedCH";
    newCell.appendChild(selectedCB);

    var newCell  = newRow.insertCell(1);
    var titleText  = document.createElement("input");
    titleText.value = title;
    titleText.className = "titleTF";
    newCell.appendChild(titleText);

    var newCell  = newRow.insertCell(2);
    var descriptionText  = document.createElement("input");
    descriptionText.value = description;
    descriptionText.className = "descriptionTF";
    newCell.appendChild(descriptionText);

    var newCell  = newRow.insertCell(3);
    var completeCB  = document.createElement("input");
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
    saved_items = sorting(saved_items, titlesSortedOrder, true);
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
    console.log("selectedBoxes.length = "+selectedBoxes.length);
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

        console.log("lineObj.title = "+lineObj.title);
    }
    saveToStorage();
}

function sorting(arr, order, titleField){
    var byName = arr.slice(0);
    byName.sort(function(a,b) {
        let y;
        let x;
        if(titleField) {
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
    saved_items = sorting(saved_items, titlesSortedOrder, true);
    saveToStorage();
    showLines();
});
$("#sort2").on('click', function(){
    descriptionSortedOrder = !descriptionSortedOrder;
    saved_items = sorting(saved_items, descriptionSortedOrder, false);
    saveToStorage();
    showLines();
});
