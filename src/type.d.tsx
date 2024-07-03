interface ILocation {
    count: number
    location: string
  }
  
  type LocationState = {
    locations: ILocation[]
  }
  
  type LocationAction = {
    type: string
    locations: ILocation[]
  }
  
  type DispatchType = (args: LocationAction) => LocationAction;
  