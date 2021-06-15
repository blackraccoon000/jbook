import { ActionType } from '../action-types';
import { CellTypes } from '../cell';

export type DirectionTypes = 'up' | 'down';

export type MoveCellAction = {
  type: ActionType.MOVE_CELL;
  payload: {
    id: string;
    direction: DirectionTypes;
  };
};

export type DeleteCellAction = {
  type: ActionType.DELETE_CELL;
  payload: string;
};

export type InsertCellAfterAction = {
  type: ActionType.INSERT_CELL_AFTER;
  payload: {
    id: string | null;
    type: CellTypes;
  };
};

export type UpdateCellAction = {
  type: ActionType.UPDATE_CELL;
  payload: {
    id: string;
    content: string;
  };
};

export type Action =
  | MoveCellAction
  | DeleteCellAction
  | InsertCellAfterAction
  | UpdateCellAction;
