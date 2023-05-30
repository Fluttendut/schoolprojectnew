"use strict";

const endpoint = "https://race-school-system-default-rtdb.firebaseio.com/";
let teachers = [];
let selectedTeacherId;

window.addEventListener("load", initApp);

async function initApp() {
    console.log("app.js is running 🎉");
    await updateTeacherTable();

    //events
    //The events that only needs to be done once should be put under initApp
    document.querySelector("#form-create-teacher").addEventListener("submit", createTeacherSubmit);
    document.querySelector("#form-update-teacher").addEventListener("submit", updateTeacherSubmit);
}

async function updateTeacherTable() {
    document.querySelector("#teachers-table tbody").innerHTML = "";
    teachers = await getTeachers();
    console.log(teachers);
    sortByName();

    showTeachers(teachers);
}

function createTeacherSubmit(event) {
    event.preventDefault();
    const form = event.target;
    const name = form.name.value;
    const email = form.email.value;
    createTeacher(name, email);
}

async function createTeacher(name, email) {
    const newTeacher = {
        name: name,
        email: email
    };
    console.log(newTeacher);
    const json = JSON.stringify(newTeacher);
    console.log(json);

    const response = await fetch(endpoint + "teachers.json", { method: "POST", body: json });

    if (response.ok) {
        await updateTeacherTable();
    }
}

function showTeachers(listOfTeachers) {
    for (const teacher of listOfTeachers) {
        const html = /*html*/ `
        <tr>
            <td>${teacher.name}</td>
            <td>${teacher.email}</td>
            <td>
                <button class="btn-delete">Delete</button>
                <button class="btn-update">Update</button>
            </td>
           
        </tr>
        
    `;
        document.querySelector("#teachers-table tbody").insertAdjacentHTML("beforeend", html);
        document
            //the function is inside the event listener to be able to reach the const teacher
            .querySelector("#teachers-table tbody tr:last-child .btn-delete")
            .addEventListener("click", function (){
            console.log(teacher);
                deleteTeacher(teacher.id);
        })
        document

            .querySelector("#teachers-table tbody tr:last-child .btn-update")
            .addEventListener("click", function (){
                showUpdateDialog(teacher);
            })
    }
}

async function showUpdateDialog(teacher){
    console.log(teacher);
    selectedTeacherId = teacher.id;
    const form = document.querySelector("#form-update-teacher");
    //We select form and put the value of teacher name on the name input.
    form.name.value =teacher.name;
    form.email.value =teacher.email;
    document.querySelector("#dialog-update-teacher").showModal();
}

function updateTeacherSubmit(event){
    //preventDefault
    event.preventDefault();
    const form = event.target;
    const name = form.name.value;
    const email = form.email.value;
    console.log(name, email)
    updateTeacher(selectedTeacherId, name, email)
    document.querySelector("#dialog-update-teacher").close();
}

async function updateTeacher(id, name, email){
    const teacher = {name, email};
    const json = JSON.stringify(teacher)
    const response = await fetch(`${endpoint}teachers/${id}.json`,
        {method: "PUT",
            body:json
        });

    if(response.ok){
        updateTeacherTable();
    }
}

async function deleteTeacher(id){
    console.log(id);
    //`${} backtick strings lets javascript know that something incoming is dynamic.
    //Remember the method
    const response = await fetch(`${endpoint}teachers/${id}.json`, {method: "DELETE"});

    //test om response gik godt
    if(response.ok){
        updateTeacherTable();
    }
}

function sortByName() {
    // teachers.sort((teacher1, teacher2) => teacher1.name.localeCompare(teacher2.name));
    teachers.sort(function (teacher1, teacher2) {
        return teacher1.name.localeCompare(teacher2.name);
    });
}

async function getTeachers() {
    const response = await fetch(endpoint + "teachers.json");
    const data = await response.json();
    console.log(data);
    return prepareData(data);
}

// convert object of objects til an array of objects
function prepareData(dataObject) {
    const array = []; // define empty array
    // loop through every key in dataObject
    // the value of every key is an object
    for (const key in dataObject) {
        const object = dataObject[key]; // define object
        object.id = key; // add the key in the prop id
        array.push(object); // add the object to array
    }
    return array; // return array back to "the caller"
}
