const code_input = document.getElementById("code-input");
const time_input = document.getElementById("time-input");
const stage_input = document.getElementById("stage-input");

const add_button = document.getElementById("add-item");
const user_message = document.getElementById("user-message");

const tracker_list = document.getElementById("tracker-list");
const tracker_item = document.getElementById("tracker-template");

const tracker = new Map();

const delay = ms => new Promise(res => setTimeout(res, ms));

function validate_input(code, time, stage){
    if (!(Number(code) && code.length == 4)) {
        user_message.textContent = "That is not a valid code";
        return false;
    } else if (!(Number(time.slice(0, 2)) && Number(time.slice(3, 5)) &&  time.length == 5)) {
        user_message.textContent = "That is not a valid time";
        return false;
    } else if (!((Number(stage)) && (stage.length == 1) && (stage > 0) && (stage < 5))) {
        user_message.textContent = "That is not a valid stage";
        return false;
    } else {
        user_message.textContent = "";
        return true;
    }

}

function change_time(change, button){
    let track = button.parentNode.parentNode;
    let time_display = button.parentNode.querySelector('.time-display');
    let current_time = time_display.textContent;
    let time_minutes = Number(current_time.slice(0, 2)) * 60 + Number(current_time.slice(3, 5));
    
    console.log(time_minutes, change)
    time_minutes += change
    tracker.get(track).set("time", time_minutes)
    
    new_time = String(Math.floor(time_minutes / 60)) + ":" + String(time_minutes % 60);
    time_display.textContent = new_time;
}

function copy_code(button){
    let code_display = button.parentNode.parentNode.querySelector('.code-display')
    navigator.clipboard.writeText(code_display.textContent)
}

function delete_track(button){
    let track = button.parentNode.parentNode
    tracker.delete(track)
    track.remove()
}

function sort(){

}

function add_track(){
    let code = code_input.value;
    let time = time_input.value;
    let stage = stage_input.value;

    valid = validate_input(code, time, stage);
    if (!valid) {
        return;
    }

    let next_stage = Number(stage) + 1;
    let beast = next_stage == 4 ? "Hydra" : "Sea King ".concat("I".repeat(next_stage));

    let time_minutes = Number(time.slice(0, 2)) * 60 + Number(time.slice(3, 5));
    let new_time = (time_minutes + 65) % 1440;
    let new_time_string = String(Math.floor(new_time / 60)) + ":" + String(new_time % 60);

    let element_clone = tracker_item.cloneNode(true);
    element_clone.style.display = "grid";
    element_clone.className = "tracker-item";
    element_clone.removeAttribute("id");

    let code_display = element_clone.querySelector('.code-display');
    code_display.textContent = code;

    let time_display = element_clone.querySelector('.time-block').querySelector('.time-display');
    time_display.textContent = new_time_string;

    let beast_display = element_clone.querySelector('.beast-display');
    beast_display.textContent = beast;


    let track = new Map();
    track.set("time", new_time);
    track.set("stage", next_stage);
    track.set("beast", beast);
    track.set("code", code);

    tracker.set(element_clone, track);
    console.log(tracker);

    tracker_list.appendChild(element_clone);
}

setInterval(check_tracker, 1000);
function check_tracker() {
    
}