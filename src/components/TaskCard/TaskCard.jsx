import React, { useContext, useEffect, useState } from "react";
import { coverImages } from "../MainBoard/coverImages";
import "./taskCard.css";
import { Delete, EditNote } from "@mui/icons-material";
import { AppThemeContext, DataContext } from "../../App";

let coverIndex = 0;
function TaskCard({ task, columnId,columnTitle }) {
  const { boards, dispatchBoards } = useContext(DataContext);
  const{isDark} = useContext(AppThemeContext)

  const coverImage = coverImages[coverIndex];
  coverIndex = (coverIndex + 1) % coverImages.length;
  
  const isComplete = columnTitle === "Completed"
  return (
    <div 
    className={`task-card ${!isDark && "light-card"}`}
    style={{
      background: `url(${coverImage}) no-repeat center/cover`,
    }}
    >

      <div className="info-actions-wrapper">
        <div className="card-info">
          <h3 className={`task-title ${isComplete && "complete"} ${!isDark && "light-title"}`}>{task.taskName}</h3>
          <p className={`task-parag ${!isDark && "light-card-text"} ${isComplete && "complete"}`}>{task.taskDescription}</p>
          {/* <ul className="tags-wrapper">
            {task?.tags?.map((tag, i) => (
              <li key={i} className="tag-item">
                {tag}
              </li>
            ))}
          </ul> */}
        </div>
        <div className="options-btn-wrapper">
          <button type="button" 
          className={`edit-task-btn ${!isDark && "light-edit-btn"}`}
          onClick={() => dispatchBoards({type:"OPEN_MODAL",
            payload:{
            key:"editTaskModal",
            modalData:{
                taskName:task.taskName,
                taskId:task.taskId,
                columnId: columnId,
                taskDescription:task.taskDescription,
                columnTitle:columnTitle
            }
        }})}
          >
            <EditNote />
          </button>
          <button
            type="button"
            className={`delete-task-btn ${!isDark && "light-delete-btn"}`}
            onClick={() =>
              dispatchBoards({ type: "OPEN_MODAL", payload:{
                key: "taskWarningModal",
                modalData:{
                    taskId:task.taskId,
                    columnId:columnId,
                    taskName:task.taskName
                }
            } })
            }
          >
            <Delete />
          </button>
        </div>
      </div>
      <div className={`overlay task-cover ${!isDark && "light-overlay.card"}`}></div>
    </div>
  );
}

export default TaskCard;
