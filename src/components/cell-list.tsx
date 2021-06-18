import './cell-list.css';
import { Fragment } from 'react';
import { useTypedSelector } from '../hooks/use-typed-selector';
import AddCell from './add-cell';
import CellListItem from './cell-list-item';

const CellList: React.FC = () => {
  const cells = useTypedSelector(({ cells: { order, data } }) =>
    order.map((id) => data[id])
  );

  const renderedCells = cells.map((cell, num) => {
    return (
      <Fragment key={cell.id}>
        <CellListItem cell={cell} />
        <AddCell prevCellId={cell.id} />
      </Fragment>
    );
  });

  return (
    <>
      <div className="cell-list">
        <AddCell forceVisible={cells.length === 0} prevCellId={null} />
        {renderedCells}
      </div>
      <div className="github-link">
        <a href="https://github.com/blackraccoon000/jbook">github:jbook</a>
      </div>
    </>
  );
};

export default CellList;
