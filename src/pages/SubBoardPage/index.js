import { useEffect, useState, useContext } from 'react';
import classNames from 'classnames/bind';

import styles from './SubBoardPage.module.scss';
import { useParams } from 'react-router-dom';
import { boardsListStorage, columnsListStorage } from '../../utils/local-storage';
import Button from '../../components/Button';
import { plusIcon } from '../../utils/icons';
import AddForm from './AddForm';
import ThemeContext from '../../contexts/ThemeContext';
import Column from './Column';
import SubBoardHeader from './SubBoardHeader';

let cx = classNames.bind(styles);

const SubBoardPage = () => {
  const { boardId } = useParams();
  const [boardData, setBoardData] = useState({});
  const [columnsData, setColumnsData] = useState([]);
  const [openAddColumnForm, setOpenAddColumnForm] = useState(false);

  const { darkMode } = useContext(ThemeContext);

  const handleFetchData = () => {
    const boardsListData = boardsListStorage.load();
    const boardData = boardsListData.find(board => board.boardId === boardId);
    setBoardData(boardData);

    const columnsListData = columnsListStorage.load();
    const columnsData = columnsListData.filter(column => column.parentId === boardId);
    setColumnsData(columnsData);

    // Update lastVisting
    const time = new Date().getTime();
    const newBoardsListData = boardsListData.map(board =>
      board.boardId === boardId ? { ...board, lastVisiting: time } : board
    );
    boardsListStorage.save(newBoardsListData);
  };

  useEffect(() => {
    handleFetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { boardTitle, boardImageBg, boardColorBg } = boardData;

  const handleAddNewColumn = newColumn => {
    const newColumnsList = [...columnsData, newColumn];
    setColumnsData(newColumnsList);

    const columnsListData = columnsListStorage.load();
    const newColumnsListData = [...columnsListData, newColumn];
    columnsListStorage.save(newColumnsListData);
  };

  const handleRemoveColumn = columnId => {
    const newColumnsList = columnsData.filter(column => column.columnId !== columnId);
    setColumnsData(newColumnsList);

    const columnsListData = columnsListStorage.load();
    const newColumnsListData = columnsListData.filter(column => column.columnId !== columnId);
    columnsListStorage.save(newColumnsListData);
  };

  const pageBackground =
    (boardImageBg && { backgroundImage: `url(${boardImageBg})` }) ||
    (boardColorBg && { backgroundColor: boardColorBg });

  return (
    <div className={cx('wrapper', {'dark-layer': darkMode})} style={pageBackground}>
      {boardTitle && <SubBoardHeader boardData={boardData} />}
      <div className={cx('columns-list')}>
        {/* Render Column */}
        {(columnsData || []).map(column => (
          <Column key={column.columnId} {...column} handleRemoveColumn={handleRemoveColumn} />
        ))}
        {/* Add Column Form/Button */}
        {openAddColumnForm ? (
          <div className={cx('add-column-form')}>
            <AddForm
              isAddColumnForm
              boardId={boardId}
              setCloseAddColumnForm={() => setOpenAddColumnForm(false)}
              handleAddNewColumn={handleAddNewColumn}
            />
          </div>
        ) : (
          <Button
            leftIcon={plusIcon}
            className={cx('add-column-btn')}
            onClick={() => setOpenAddColumnForm(true)}
          >
            Add another column
          </Button>
        )}
      </div>
    </div>
  );
};

export default SubBoardPage;
