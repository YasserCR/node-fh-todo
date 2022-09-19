//const { showMenu, pause } = require("./helpers/messages");
const {
    inquirerMenu,
    pause,
    readInput,
    listTasksDelete,
    confirm,
    showChecklist,
    toggleCompleted
} = require("./helpers/inquirer");
const { saveDB, readDB } = require("./helpers/saveFile");
const Tasks = require("./models/tasks");

require("colors");

const main = async () => {
    let opt = "";
    const tasks = new Tasks();

    const tasksDB = readDB();
    if (tasksDB) {
        tasks.loadTasksFromArray(tasksDB);
    }

    do {
        opt = await inquirerMenu();

        switch (opt) {
            case "1":
                const description = await readInput("Description: ");
                tasks.createTask(description);
                break;
            case "2":
                tasks.listCompleted();
                break;
            case "3":
                tasks.listPendingCompleted(true);
                break;
            case "4":
                tasks.listPendingCompleted(false);
                break;
            case "5":
                const ids = await showChecklist(tasks.listArr);
                tasks.toggleCompleted(ids);
                break;
            case "6":
                const id = await listTasksDelete(tasks.listArr);
                if (id !== "0") {
                    const ok = await confirm("Are you sure?");
                    if (ok) {
                        tasks.deleteTask(id);
                        console.log("Task deleted");
                    }
                }
                break;
        }
        saveDB(tasks.listArr);
        await pause();

        //if (opt !== "0") await pause();
    } while (opt !== "0");
};

main();
