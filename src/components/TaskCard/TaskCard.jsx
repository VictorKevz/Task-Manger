import React, { useContext, useEffect, useState } from "react";
import "./taskCard.css";
import { Delete, EditNote, MoreVert } from "@mui/icons-material";
import { AppThemeContext, DataContext } from "../../App";

function TaskCard({ task, columnId, columnTitle }) {
  const { boards, dispatchBoards } = useContext(DataContext);
  const { isDark } = useContext(AppThemeContext);
  const [isOpen, setOpen] = useState(false);

  
  const isComplete = columnTitle === "Completed";
  return (
    <div className={`task-card ${!isDark && "light-card"} `}>
      <div className="info-actions-wrapper">
        <div className={`card-info ${!isDark && "light-text"}`}>
          <h3
            className={`task-title ${isComplete && "complete"} ${
              !isDark && "light-title"
            }`}
          >
            {task.taskName}
          </h3>
          <p
            className={`task-parag ${!isDark && "light-text"}  ${
              isComplete && "complete"
            }`}
          >
            {task.taskDescription}
          </p>
          {/* <ul className="tags-wrapper">
            {task?.tags?.map((tag, i) => (
              <li key={i} className="tag-item">
                {tag}
              </li>
            ))}
          </ul> */}
        </div>
        <div className="options-container">
          <button
            type="button"
            className="open-options-btn"
            onClick={() => setOpen(!isOpen)}
          >
            <MoreVert />
          </button>
          {isOpen && (
            <div
              className={`options-btn-wrapper ${!isDark && "light-wrapper"}`}
            >
              <button
                type="button"
                className={`edit-task-btn ${!isDark && "light-text"}`}
                onClick={() => {
                  dispatchBoards({
                    type: "OPEN_MODAL",
                    payload: {
                      key: "editTaskModal",
                      modalData: {
                        taskName: task.taskName,
                        taskId: task.taskId,
                        columnId: columnId,
                        taskDescription: task.taskDescription,
                        columnTitle: columnTitle,
                      },
                    },
                  });
                  setOpen(!isOpen);
                }}
              >
                 <EditNote /> Edit
              </button>
              <button
                type="button"
                className={`delete-task-btn ${!isDark && "light-delete-btn"}`}
                onClick={() => {
                  dispatchBoards({
                    type: "OPEN_MODAL",
                    payload: {
                      key: "taskWarningModal",
                      modalData: {
                        taskId: task.taskId,
                        columnId: columnId,
                        taskName: task.taskName,
                      },
                    },
                  });
                  setOpen(!isOpen);
                }}
              >
                <Delete /> Delete
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default TaskCard;
