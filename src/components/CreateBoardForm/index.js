import React, { useEffect, useRef, useState, useMemo } from 'react';
import classNames from 'classnames/bind';
import { v4 as uuidv4 } from 'uuid';

import styles from './CreateBoardForm.module.scss';
import Button from '../Button';
import BackgroundForm from './_BackgroundForm';
import { backgroundColorsList, backgroundImagesList } from '../../utils/constants';
import { checkIcon, threeDotsIcon, xIcon } from '../../utils/icons';
import { columnsListStorage } from '../../utils/local-storage';

let cx = classNames.bind(styles);

const CreateBoardForm = ({ handleCloseForm, handleAddBoard, onCloseCreateForm }) => {
  const [titleValue, setTitleValue] = useState('');
  const [showRequied, setShowRequied] = useState(false);
  const [bgImageValue, setBgImageValue] = useState(backgroundImagesList[0].imgSrc);
  const [bgColorValue, setBgColorValue] = useState(null);
  const [openSubForm, setOpenSubForm] = useState(false);

  const wrapperRef = useRef(null);
  const inputRef = useRef(null);

  const onClickOutside = e => {
    if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
      handleCloseForm();
    }
  };

  useEffect(() => {
    inputRef.current.focus();
    document.addEventListener('mousedown', onClickOutside);
    return () => {
      document.removeEventListener('mousedown', onClickOutside);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSubmitForm = e => {
    e.preventDefault();
    if (titleValue.length > 0) {
      const newBoard = {
        boardId: `bo-${uuidv4()}`,
        boardTitle: titleValue,
        isStarred: false,
        lastVisiting: 0
      };
      if (bgImageValue) {
        newBoard['boardImageBg'] = bgImageValue;
      } else if (bgColorValue) {
        newBoard['boardColorBg'] = bgColorValue;
      }
      handleAddBoard(newBoard);
      setTitleValue('');
    } else {
      setShowRequied(true);
      inputRef.current.focus();
    }
  };

  const handleKeyDown = e => {
    if (e.key === 'Enter') {
      e.preventDefault();
      onSubmitForm(e);
    }
  };

  const handleCheckInput = () => {
    const isError = titleValue.replace(/\s+/g, '') === '';
    if (isError) {
      setShowRequied(true);
      inputRef.current.focus();
    }
  };

  const onImgBgSelected = imgSrc => {
    setBgImageValue(imgSrc);
    setBgColorValue(null);
  };

  const onColorBgSelected = color => {
    setBgColorValue(color);
    setBgImageValue(null);
  };

  const getImageBgElements = arrData =>
    arrData.map(image => (
      <span
        key={image.id}
        className={cx('bgSelectBox')}
        style={{ backgroundImage: `url(${image.imgSrc})` }}
        onClick={() => onImgBgSelected(image.imgSrc)}
      >
        {image.imgSrc === bgImageValue && checkIcon}
      </span>
    ));

  const getColorBgElements = arrData =>
    arrData.map((color, index) => (
      <span
        key={index}
        className={cx('bgSelectBox')}
        style={{ backgroundColor: color }}
        onClick={() => onColorBgSelected(color)}
      >
        {color === bgColorValue && checkIcon}
      </span>
    ));

  const bgImageElements = useMemo(
    () => getImageBgElements(backgroundImagesList.slice(0, 4)),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [bgImageValue]
  );

  const bgMonoColorElements = useMemo(
    () => getColorBgElements(backgroundColorsList.monoColor.slice(0, 5)),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [bgColorValue]
  );

  const demoBackground = {
    backgroundImage: bgImageValue ? `url(${bgImageValue})` : '',
    backgroundColor: bgColorValue
  };

  return (
    <div className={cx('backLayer')}>
      <form className={cx('wrapper')} ref={wrapperRef} onSubmit={onSubmitForm}>
        <Button className={cx('closeFormBtn')} onClick={onCloseCreateForm}>
          {xIcon}
        </Button>
        <h4>Create board</h4>
        <div className={cx('boardWhiteFrame')} style={demoBackground}>
          <img src="/assets/white-frame/board.svg" alt="board-white-frame" />
        </div>
        <div className={cx('background')}>
          <h5>Background</h5>
          <div className={cx('images')}>{bgImageElements}</div>
          <div className={cx('colors-mono')}>
            {bgMonoColorElements}
            <Button className={cx('moreBackgroundBtn')} onClick={() => setOpenSubForm(true)}>
              {threeDotsIcon}
            </Button>
          </div>
        </div>
        <div className={cx('boardTitle')}>
          <label htmlFor="inputBoardTitle">
            <h5>Board title</h5>
          </label>
          <input
            id="inputBoardTitle"
            ref={inputRef}
            type="text"
            className={cx({ requied: showRequied })}
            value={titleValue}
            onChange={e => setTitleValue(e.target.value)}
            onBlur={handleCheckInput}
            onInput={() => setShowRequied(false)}
            onKeyDown={handleKeyDown}
          />
          <p>Board title is required</p>
        </div>
        <Button className={cx('formBtn')} type="submit" fullWidth>
          Create
        </Button>
        <Button className={cx('formBtn')} fullWidth>
          Start with temple
        </Button>
        {openSubForm && (
          <BackgroundForm
            wrapperClassName={cx('wrapper')}
            onCloseSubForm={() => setOpenSubForm(false)}
            getImageBgElements={getImageBgElements}
            getColorBgElements={getColorBgElements}
          />
        )}
      </form>
    </div>
  );
};

export default CreateBoardForm;
