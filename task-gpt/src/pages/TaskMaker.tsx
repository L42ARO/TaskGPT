import { IonButton, IonContent, IonHeader, IonIcon, IonInput, IonItem, IonLabel, IonPage, IonProgressBar, IonTextarea, IonTitle, IonToolbar } from '@ionic/react';
import { addOutline, clipboard, clipboardOutline, copy, send, trash } from 'ionicons/icons';
import { useEffect, useState } from 'react';
import {sendRequest} from '../components/api/client';
import './TaskMaker.css';

class TaskData {
  constructor(
    public request: string,
    public taskID: number,
    public response: string,
    public inProgress: boolean = false
  ) {}
}

const TaskMakerTab: React.FC = () => {
  //Create list of tasks, that can be added to and removed from
  const [tasks, setTasks] = useState<TaskData[]>([
    new TaskData("", 0, ""),
  ]);

  const removeTask = (index: number) => {
    const newTasks = [...tasks];
    newTasks.splice(index, 1);
    setTasks(newTasks);
  };

  const updateTask = (index: number, task: TaskData) => {
    const newTasks = [...tasks];
    newTasks[index] = task;
    console.log("newTasks");
    console.log(newTasks);
    setTasks(newTasks);
  };
  useEffect(()=>{
    console.log(tasks);
  }, [tasks])
  const sendTask = async (index: number) => {
    //Make task in progress true
    updateTask(index, {...tasks[index], inProgress: true});
    var resString = "";
    try{
      const res = await sendRequest(tasks[index].request);
      //Check if the response is valid
      if(res.status === 0){
        resString = res.data as string;
      }
      else{
        throw new Error(res.message);
      }
    }
    catch(e){
      console.log(e);
    }
    //Update the task with the response and set in progress to false
    updateTask(index, {...tasks[index], response: resString, inProgress: false});
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Task Maker</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <div className="task-container">
          {tasks.map((task, index) => (
            <Task
              key={index}
              task={task}
              index={index}
              removeTask={removeTask}
              updateTask={updateTask}
              sendTask={sendTask}
              hideDelete={tasks.length === 1}
            />
          ))}
          {/* Add button to add more tasks */}
          <IonButton
            onClick={() =>
              setTasks([...tasks, new TaskData("", tasks.length, "")])
            }
          >
            <IonIcon aria-hidden="true" icon={addOutline} />
          </IonButton>
        </div>
      </IonContent>
    </IonPage>
  );
};

interface TaskProps {
  task: TaskData;
  index: number;
  hideDelete?: boolean;
  removeTask: (index: number) => void;
  updateTask: (index: number, task: TaskData) => void;
  sendTask: (index: number) => void;
}

const Task: React.FC<TaskProps> = ({ task, index, removeTask, updateTask, hideDelete, sendTask }) => {
  return (
    <div key={index} className="task-item">
      <div className="header">
        <span>Task {index + 1}</span>
        {/* Remove button to remove tasks */
        !hideDelete &&
        <IonButton
          onClick={() => {
            removeTask(index);
          }}
        >
          <IonIcon aria-hidden="true" icon={trash} />
        </IonButton>
        }
      </div>
      <IonItem>
        <IonTextarea
          style={{maxHeight: "200px", overflow: "auto"}}
          value={task.request}
          placeholder="Task Description"
          rows={2}
          autoGrow={true}
          onIonChange={(e) => {
            const newTask = new TaskData(
              e.detail.value!,
              task.taskID,
              task.response
            );
            updateTask(index, newTask);
          }}
        />
        <button className="task-send" onClick={e=>sendTask(index)}>
          <IonIcon aria-hidden="true" icon={send} />
        </button>
      </IonItem>
      {/*If task in progress use progressbar from ionic */
      task.inProgress &&
      <IonProgressBar type="indeterminate"></IonProgressBar>}
      {/*If response is not empty, display it*/
      task.response !== "" && !task.inProgress &&
      <div className='response-container'>
        <div className='response-head'>
          {/*Button to copy the response to the clipboard*/}
          <IonButton onClick={e=>{
            navigator.clipboard.writeText(task.response);
          }}>
            <IonIcon aria-hidden="true" icon={clipboardOutline} />
          </IonButton>
        </div>
      <IonItem>
        <IonLabel>
          <h4>Response</h4>
          <p>{task.response}</p>
        </IonLabel>
      </IonItem>
      </div>
      }
    </div>
  );
};
export default TaskMakerTab;
