import * as actionTypes from "./actionTypes";

export function updateLocationCount(locations: ILocation[]) {
    return (dispatch: DispatchType) => {
        const action: LocationAction = {
            type: actionTypes.LOCATION_COUNT,
            locations,
        }
        dispatch(action);
    }
  }