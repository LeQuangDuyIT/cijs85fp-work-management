import React, { useEffect, useRef, useState } from 'react';
import classNames from 'classnames/bind';
import { v4 as uuidv4 } from 'uuid';

import Button from '../../../components/Button';
import styles from './AddForm.module.scss';
import { plusIcon, xIcon } from '../../../utils/icons';

let cx = classNames.bind(styles);

const AddForm = props => {
  const {
    columnId,
    handleAddNewCard,
    setCloseAddCardForm,
    isAddColumnForm,
    setCloseAddColumnForm,
    handleAddNewColumn
  } = props || {};

  const [title, setTitle] = useState('');
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current.focus();
  }, []);

  const onSubmitToAdd = e => {
    e.preventDefault();
    if (title !== '') {
      if (isAddColumnForm) {
        const newColumn = {
          columnId: `co-${uuidv4()}`,
          columnTitle: title,
          cardsList: []
        };
        handleAddNewColumn(newColumn);
      } else {
        const newCard = {
          cardId: `ca-${uuidv4()}`,
          cardTitle: title
        };
        handleAddNewCard(columnId, newCard);
      }
      setTitle('');
      handleCloseForm(e);
    }
  };

  const onEnterToSubmit = e => {
    if (e.key === 'Enter' && !e.shiftKey) {
      onSubmitToAdd(e);
    }
  };

  const handleCloseForm = e => {
    e.preventDefault();
    if (isAddColumnForm) {
      setCloseAddColumnForm();
    } else setCloseAddCardForm();
  };

  const InputTagElement = isAddColumnForm ? 'input' : 'textarea';

  return (
    <form className={cx('add-item-form')} onSubmit={onSubmitToAdd}>
      <InputTagElement
        placeholder={isAddColumnForm ? 'Enter list title...' : 'Enter a title for this card...'}
        className={cx('textarea', { 'add-column-input': isAddColumnForm })}
        value={title}
        onChange={e => setTitle(e.target.value)}
        onKeyDown={onEnterToSubmit}
        ref={inputRef}
      ></InputTagElement>
      <div className={cx('form-btns')}>
        <Button type="submit" leftIcon={plusIcon} className={cx('add-item-form-submit-btn')}>
          {isAddColumnForm ? 'Add column' : 'Add card'}
        </Button>
        <Button className={cx('add-item-form-cancel-btn')} onClick={handleCloseForm}>
          {xIcon}
        </Button>
      </div>
    </form>
  );
};

AddForm.defaultProps = {
  isAddColumnForm: false
};

export default AddForm;
