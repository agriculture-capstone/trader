/*----------------------- State -----------------------*/
/** currentFarmer State*/
export interface CurrentFarmerState{
  currentFarmerUUID: string;
}

/*----------------------- Actions -----------------------*/
/** currentFarmer Action Types */
export type Action = {
  type: 'UPDATE_CURRENT_FARMER',
  currentFarmerUUID: string,
} | {
  type: 'CLEAR_CURRENT_FARMER',
} | {
  type: 'DO_NOT_USE',
}; 