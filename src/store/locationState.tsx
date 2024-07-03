import {initialState} from "./initialState";
import * as actionTypes from "./actionTypes";

const locationState = (
    state: LocationState = initialState,
    action: LocationAction
  ): LocationState => {
    switch (action.type) {
      case actionTypes.LOCATION_COUNT:
        return {
          ...state,
          locations: action.locations
        }
        default: 
            return state
  }
}
  export default locationState;