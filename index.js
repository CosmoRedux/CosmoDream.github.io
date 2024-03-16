const code_input = document.getElementById("code-input");
const time_input = document.getElementById("time-input");
const stage_input = document.getElementById("stage-input");

const add_button = document.getElementById("add-item");
const user_message = document.getElementById("user-message");

const tracker_list = document.getElementById("tracker-list");
const tracker_item = document.getElementById("tracker-template");

let tracker = new Map();
let codes = new Map();

function validate_input(code, time, stage){
    if (!(Number(code) && code.length == 4)) {
        user_message.textContent = "That is not a valid code";
        return false;
    } else if (!(Number(time.slice(0, 2) + time.slice(3, 5)) &&  time.length == 5)) {
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

function change_time(change, button, target_track){
    let track = target_track || button.parentNode.parentNode;
    let time_display = track.querySelector('.time-block').querySelector('.time-display');
    let current_time = time_display.textContent;
    let time_minutes = Number(current_time.slice(0, 2)) * 60 + Number(current_time.slice(3, 5));
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
    let array = [...tracker.entries()];
    tracker = new Map(array.sort((a, b) => a[1].get("time") - b[1].get("time")));

    for (let track of tracker.keys()) {
        tracker_list.appendChild(track);
    }
}

function add_track(){
    let code = code_input.value;
    let time = time_input.value;
    let stage = stage_input.value;

    valid = validate_input(code, time, stage);
    if (!valid) {
        return;
    }

    let next_stage = (Number(stage) % 4) + 1;
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

    if (codes.get(code)){
        codes.get(code).remove();
        codes.delete(code);
    }

    codes.set(code, element_clone);
    tracker.set(element_clone, track);

    tracker_list.appendChild(element_clone);
    sort();

    console.log(codes);
}

function share(){
    let share_string = "Current codes in the tracker: \n";
    for (let track of tracker.values()) {
        let time = String(Math.floor(track.get("time") / 60)) + ":" + String(track.get("time") % 60);

        share_string += track.get("code") + " ";
        share_string += time + " ";
        share_string += track.get("beast") + "\n"
    }
    navigator.clipboard.writeText(share_string)
}

setInterval(check_tracker, 1000);
function check_tracker() {
    let time = new Date();
    let now_minutes = time.getHours() * 60 + time.getMinutes();
    for (let [track, data] of tracker.entries()) {
        if (data.get("time") <= now_minutes){
            let compensation = data.get("beast") == "Hydra" ? 7 : 3;
            change_time(65 + compensation, null, track);

            data.set("stage", (data.get("stage") % 4) + 1);

            let new_beast = data.get("stage") == 4 ? "Hydra" : "Sea King " + "I".repeat(data.get("stage"));
            data.set("beast", new_beast);
            track.querySelector(".beast-display").textContent = new_beast;
            
            sort();
        }
    }
}