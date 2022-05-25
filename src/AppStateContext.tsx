import { createContext, useReducer, useContext } from "react"
//2. import the createContext hook
import { v4 as uuidv4 } from "uuid"

import { findItemIndexById } from "./utils/findItemIndexById"
//import the uuid library

//1. first we create our data with types
const appData: AppState = {
  lists: [
    {
      id: "0",
      text: "To Do",
      tasks: [{ id: "c0", text: "Generate app scaffold" }]
    },
    {
      id: "1",
      text: "In Progress",
      tasks: [{ id: "c2", text: "Learn Typescript" }]
    },
    {
      id: "2",
      text: "Done",
      tasks: [{ id: "c3", text: "Begin to use static typing" }]
    }
  ]
}

//3. Initialize createContext with initial state
const AppStateContext = createContext<AppStateContextProps>(
  {} as AppStateContextProps
)

//4. export the context provider
export const AppStateProvider = ({ children }: React.PropsWithChildren<{}>) => {
  const [state, dispatch] = useReducer(appStateReducer, appData)

  return (
    <AppStateContext.Provider value={{ state, dispatch }}>
      {children}
    </AppStateContext.Provider>
  )
}

//5. Consume the AppState
export const useAppState = () => {
  return useContext(AppStateContext)
}

//6. create appStateReducer
const appStateReducer = (state: AppState, action: Action): AppState => {
  switch (action.type) {
    //add new list
    case "ADD_LIST": {
      return {
        ...state,
        lists: [
          ...state.lists,
          { id: uuidv4(), text: action.payload, tasks: [] }
        ]
      }
    }

    //add new task
    case "ADD_TASK": {
      const targetLaneIndex = findItemIndexById(
        state.lists,
        action.payload.taskId
      )

      const newState = JSON.parse(JSON.stringify(state)) as AppState

      newState.lists[targetLaneIndex].tasks.push({
        id: uuidv4(),
        text: action.payload.text
      })

      return newState
    }

    default: {
      return state
    }
  }
}

//types for the state
interface AppStateContextProps {
  state: AppState
  dispatch: React.Dispatch<Action>
}

//type for individual task, reminds me of GraphQL
interface Task {
  id: string
  text: string
}

//type for Tasks renamed as List
interface List {
  id: string
  text: string
  tasks: Task[]
}

export interface AppState {
  lists: List[]
}

//reducer actions
type Action =
  | {
      type: "ADD_LIST"
      payload: string
    }
  | {
      type: "ADD_TASK"
      payload: { text: string; taskId: string }
    }
