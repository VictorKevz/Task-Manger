import React, { useContext, useState } from "react";
import { AppThemeContext, DataContext } from "../../App";
import { ArrowDropDown, ArrowDropUp, Check, Close } from "@mui/icons-material";
import "./addTask.css";
import uuid from "react-uuid";
function AddTaskModal({
  taskName,
  host,
  taskDescription,
  taskId,
  columnTitle,
  columnId,
}) {
  const { boards, dispatchBoards } = useContext(DataContext);
  const { isDark } = useContext(AppThemeContext);
  const [editing, setEditing] = useState({
    userTaskTitle: taskName,
    userTaskDescription: taskDescription,
  });
  const [isValid, setValid] = useState({
    userTaskTitle: true,
    userTaskDescription: true,
  });
  const [isOpen, setOpen] = useState(false);
  const [editColumn, setEditColumn] = useState(columnTitle);

  const currentBoardObj = boards?.boardsList?.find(
    (item) => item?.id === boards?.selectedBoard
  );
  const handleChange = (e) => {
    const { name, value } = e.target;
    setValid((prevValid) => ({
      ...prevValid,
      [name]: true,
    }));
    host === "add"
      ? dispatchBoards({
          type: "UPDATE_TASKS_INPUT",
          payload: {
            name,
            value,
          },
        })
      : setEditing((prevVal) => ({
          ...prevVal,
          [name]: value,
        }));
  };
  const { userTaskTitle, userTaskDescription } = boards;

  const handleCreate = () => {
    if (!userTaskDescription.trim()) {
      setValid((prev) => ({ ...prev, userTaskDescription: false }));
      return;
    }
    if (!userTaskTitle.trim()) {
      setValid((prev) => ({ ...prev, userTaskTitle: false }));
      return;
    }

    if (!currentBoardObj) {
      console.warn("No matching board found.");
      return;
    }

    const updatedBoard = {
      ...currentBoardObj,
      columns: currentBoardObj?.columns?.map((item) =>
        item?.columnTitle === boards?.status
          ? {
              ...item,
              tasks: [
                ...item.tasks,
                {
                  taskId: uuid(),
                  taskName: boards?.userTaskTitle,
                  taskDescription: boards?.userTaskDescription,
                },
              ],
            }
          : item
      ),
    };

    dispatchBoards({
      type: "ADD_NEW_TASK",
      payload: { updatedBoard },
    });
  };

  const handleEdit = () => {
    if (!editing.userTaskDescription.trim()) {
      setValid((prev) => ({ ...prev, userTaskDescription: false }));
      return;
    }
    if (!editing.userTaskTitle.trim()) {
      setValid((prev) => ({ ...prev, userTaskTitle: false }));
      return;
    }

    if (!currentBoardObj) {
      console.warn("No matching board found.");
      return;
    }

    const updatedBoardObj = {
      ...currentBoardObj,
      columns: currentBoardObj.columns.map((column) => {
        // If the column is where the task currently exists
        if (column.columnTitle === columnTitle) {
          // Check if the status is changing (i.e., the task is being moved)
          if (editColumn !== columnTitle) {
            // If status has changed, remove the task from the current column
            return {
              ...column,
              tasks: column.tasks.filter((task) => task.taskId !== taskId),
            };
          }

          // If only title and description are being edited, update those properties
          return {
            ...column,
            tasks: column.tasks.map((task) =>
              task.taskId === taskId
                ? {
                    ...task,
                    taskName: editing.userTaskTitle,
                    taskDescription: editing.userTaskDescription,
                  }
                : task
            ),
          };
        }

        // If the column is where the task is being moved (target column)
        if (column.columnTitle === editColumn) {
          // Only add the task to the target column if the status is changing
          if (editColumn !== columnTitle) {
            return {
              ...column,
              tasks: [
                ...column.tasks,
                {
                  taskId: taskId, // Keep the same task ID
                  taskName: editing.userTaskTitle, // Updated task name
                  taskDescription: editing.userTaskDescription, // Updated task description
                },
              ],
            };
          }
        }

        // For all other columns, leave them unchanged
        return column;
      }),
    };

    dispatchBoards({ type: "EDIT_TASK", payload: { updatedBoardObj } });
  };
  return (
    <div className={`modal-wrapper ${!isDark && "light-modal-wrapper"}`}>
      <article className={`modal-container ${!isDark && "light-modal"}`}>
        <header className={`modal-header ${!isDark && "light-text"}`}>
          <h2 className="text-2xl title">
            {host === "add" ? "New Task" : "Edit Task"}
          </h2>
          <button
            type="button"
            className="close-modal-btn"
            onClick={() =>
              dispatchBoards({
                type: "CLOSE_MODAL",
                key: host === "add" ? "taskModal" : "editTaskModal",
              })
            }
          >
            <Close className="text-2xl" />
          </button>
        </header>
        <fieldset className={`field ${!isDark && "light-text"}`}>
          <label htmlFor="taskName" className="board-label">
            Task Title
          </label>
          <input
            type="text"
            id="taskName"
            name="userTaskTitle"
            value={
              host === "add" ? boards?.userTaskTitle : editing.userTaskTitle
            }
            className={`board-input task ${
              !isValid.userTaskTitle && "border-error"
            }`}
            onChange={handleChange}
            placeholder="eg Task 1."
          />
          {!isValid.userTaskTitle && (
            <span className="text-xs text-crimson">
              Can't be empty nor too short!
            </span>
          )}
        </fieldset>

        <fieldset className={`field ${!isDark && "light-text"}`}>
          <label htmlFor="taskDescription" className="board-label">
            Task Description
          </label>
          <textarea
            type="text"
            id="taskDescription"
            name="userTaskDescription"
            value={
              host === "add"
                ? boards?.userTaskDescription
                : editing.userTaskDescription
            }
            className={`task-description ${
              !isValid.userTaskDescription && "border-error"
            }`}
            onChange={handleChange}
            placeholder="Use this place to describe what your task is about..."
            rows={6}
          />
          {!isValid.userTaskDescription && (
            <span className="text-xs text-crimson">
              Can't be empty nor too short!
            </span>
          )}
        </fieldset>
        {/*
         *
         *
         * Choosing Status
         *
         *
         */}
        <div className={`status-wrapper ${!isDark && "light-text"}`}>
          <p className="status-header">Status</p>
          <button
            type="button"
            onClick={() => setOpen(!isOpen)}
            className="status-btn"
          >
            {host === "add" ? boards?.status : editColumn}
            {isOpen ? (
              <ArrowDropUp className="status-icon" />
            ) : (
              <ArrowDropDown className="status-icon" />
            )}
          </button>
          {isOpen && (
            <ul className={`status-list ${!isDark && "light-card"}`}>
              {currentBoardObj?.columns?.map((item) => {
                const isSelected =
                  host === "add"
                    ? boards?.status === item?.columnTitle
                    : editColumn === item?.columnTitle;
                return (
                  <li key={item?.columnId} className="status-item">
                    <button
                      type="button"
                      className={`status-option ${isSelected && "current"} `}
                      onClick={() => {
                        host === "add"
                          ? dispatchBoards({
                              type: "UPDATE_TASKS_STATUS",
                              status: item?.columnTitle,
                            })
                          : setEditColumn(item?.columnTitle);
                        setOpen(false);
                      }}
                    >
                      {item?.columnTitle}
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {/*
         *
         * ACTIONS CONTENT
         *
         *
         *
         *
         *
         */}
        <div className="actions-wrapper">
          <button
            type="button"
            className="btn create"
            onClick={host === "add" ? handleCreate : handleEdit}
          >
            Create task <Check />
          </button>
          <button
            type="button"
            className={`btn cancel ${!isDark && "light-text"}`}
            onClick={() =>
              dispatchBoards({
                type: "CLOSE_MODAL",
                key: host === "add" ? "taskModal" : "editTaskModal",
              })
            }
          >
            Cancel
          </button>
        </div>
      </article>
    </div>
  );
}

export default AddTaskModal;
