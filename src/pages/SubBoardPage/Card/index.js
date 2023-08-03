import { useRef, useState, useEffect, useMemo } from 'react';
import classNames from 'classnames/bind';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

import Button from '../../../components/Button';
import {
  arrowRightIcon,
  clockIcon,
  copyIcon,
  editIcon,
  openIcon,
  photoIcon,
  tagIcon,
  trashIcon,
  userIcon
} from '../../../utils/icons';
import styles from './Card.module.scss';
import { cardsListStorage } from '../../../utils/local-storage';
import EditLabelSubBox from './SettingSubBox/EditLabelSubBox';
import { CARD_SETTING_SUBBOX } from '../../../utils/constants';
import ChangeCoverSubBox from './SettingSubBox/ChangeCoverSubBox';

let cx = classNames.bind(styles);

const Card = ({
  cardData,
  cardIndex,
  cardsLength,
  handleRemoveCard,
  extendLabels,
  handleClickLabel
}) => {
  const { cardId, cardTitle, cardLabels, isFullSizeCover, cardColorCover } = cardData;

  const [cardDataState, setCardDataState] = useState({ ...cardData });
  const [cardTitleValue, setCardTitleValue] = useState(cardTitle);
  const [cardLabelsArr, setCardLabelArr] = useState([...cardLabels]);
  const [cardCoverObj, setCardCoverObj] = useState({
    isFullSize: isFullSizeCover,
    coverColor: cardColorCover
  });
  const [openSettingBox, setOpenSettingBox] = useState(false);
  const [openSettingSubBox, setOpenSettingSubBox] = useState(null);

  const settingBoxRef = useRef(null);
  const titleInputRef = useRef(null);
  const labelsRef = useRef(null);
  const saveBtnRef = useRef(null);
  const prevCardTitle = useRef(null);

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: cardId,
    data: { ...cardDataState, cardIndex: cardIndex, cardsLength: cardsLength }
  });
  const dndKitCardStyles = {
    transform: CSS.Translate.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : undefined
  };

  const updateCardDataState = () => {
    const newCardData = {
      ...cardDataState,
      cardTitle: cardTitleValue,
      cardLabels: cardLabelsArr,
      cardColorCover: cardCoverObj.coverColor,
      isFullSizeCover: cardCoverObj.isFullSize
    };
    setCardDataState(newCardData);
  };

  useEffect(() => {
    updateCardDataState();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cardTitleValue, cardLabelsArr, cardCoverObj]);

  const onClickOutsideSettingBox = e => {
    let isClickOutside =
      settingBoxRef.current &&
      titleInputRef.current &&
      saveBtnRef.current &&
      !settingBoxRef.current.contains(e.target) &&
      !titleInputRef.current.contains(e.target) &&
      !saveBtnRef.current.contains(e.target);
    if (cardLabelsArr.length > 0) {
      isClickOutside = isClickOutside && labelsRef.current && !labelsRef.current.contains(e.target);
    }
    if (isClickOutside) {
      setOpenSettingBox(false);
      setCardTitleValue(prevCardTitle.current);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', onClickOutsideSettingBox);
    return () => {
      document.removeEventListener('mousedown', onClickOutsideSettingBox);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const autoSelectFormValue = () => {
    let timer;
    if (openSettingBox && titleInputRef.current) {
      timer = setTimeout(() => {
        titleInputRef.current.select();
      }, 0);
    }
    return () => clearTimeout(timer);
  };

  useEffect(() => {
    autoSelectFormValue();
    if (!openSettingBox) {
      setOpenSettingSubBox(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [openSettingBox]);

  const onCLickEditCard = () => {
    setOpenSettingBox(true);
    prevCardTitle.current = cardTitleValue;
  };

  const handleUpdateCardTitle = () => {
    const newCardTitle = titleInputRef.current.value;
    setCardTitleValue(newCardTitle);

    const newCardData = { ...cardData, cardTitle: newCardTitle };
    const cardsListData = cardsListStorage.load();
    const newCardsListData = cardsListData.map(card =>
      card.cardId === cardId ? newCardData : card
    );
    cardsListStorage.save(newCardsListData);

    setOpenSettingBox(false);
  };

  const onEnterToSave = e => {
    if (e.key === 'Enter' && !e.shiftKey) {
      handleUpdateCardTitle(e);
    }
  };

  const handleUpdateLabels = labelsListArr => {
    setCardLabelArr(labelsListArr);
    const newCardData = { ...cardData, cardLabels: labelsListArr };
    const cardsListData = cardsListStorage.load();
    const newCardListData = cardsListData.map(card =>
      card.cardId === cardId ? newCardData : card
    );
    cardsListStorage.save(newCardListData);
  };

  const handleUpdateCover = (isFullSizeCover, coverColor) => {
    setCardCoverObj({ isFullSize: isFullSizeCover, coverColor: coverColor });
    const newCardData = {
      ...cardData,
      isFullSizeCover: isFullSizeCover,
      cardColorCover: coverColor
    };
    const cardsListData = cardsListStorage.load();
    const newCardListData = cardsListData.map(card =>
      card.cardId === cardId ? newCardData : card
    );
    cardsListStorage.save(newCardListData);
  };

  const settingBox = useMemo(
    () => (
      <div className={cx('setting-box')} ref={settingBoxRef}>
        <div className={cx('setting-part')}>
          <Button leftIcon={openIcon} className={cx('setting-item')}>
            Open card
          </Button>
        </div>
        <div className={cx('setting-part')}>
          <Button
            leftIcon={tagIcon}
            className={cx('setting-item')}
            onClick={() => setOpenSettingSubBox(CARD_SETTING_SUBBOX.EDIT_LABELS)}
          >
            Edit labels
          </Button>
          {openSettingSubBox === CARD_SETTING_SUBBOX.EDIT_LABELS && (
            <EditLabelSubBox
              data={cardLabelsArr}
              onClickX={() => setOpenSettingSubBox(null)}
              handleUpdateLabels={handleUpdateLabels}
            />
          )}
        </div>
        <Button leftIcon={userIcon} className={cx('setting-item')}>
          Change members
        </Button>
        <div className={cx('setting-part')}>
          <Button
            leftIcon={photoIcon}
            className={cx('setting-item')}
            onClick={() => setOpenSettingSubBox(CARD_SETTING_SUBBOX.CHANGE_COVER)}
          >
            Change cover
          </Button>
          {openSettingSubBox === CARD_SETTING_SUBBOX.CHANGE_COVER && (
            <ChangeCoverSubBox
              data={cardCoverObj}
              onClickX={() => setOpenSettingSubBox(null)}
              handleUpdateCover={handleUpdateCover}
            />
          )}
        </div>
        <Button leftIcon={arrowRightIcon} className={cx('setting-item')}>
          Move
        </Button>
        <Button leftIcon={copyIcon} className={cx('setting-item')}>
          Copy
        </Button>
        <Button leftIcon={clockIcon} className={cx('setting-item')}>
          Edit dates
        </Button>
        <Button
          leftIcon={trashIcon}
          className={cx('setting-item', 'remove-column-btn')}
          onClick={() => handleRemoveCard(cardId)}
        >
          Remove this card
        </Button>
      </div>
    ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [openSettingSubBox]
  );

  const labelsListElements = useMemo(
    () => (
      <div className={cx('card-labels-list')} ref={labelsRef}>
        {cardLabelsArr.length > 0 &&
          cardLabelsArr.map(label => (
            <span
              key={label}
              className={cx('label')}
              style={{ backgroundColor: label, height: extendLabels ? '16px' : undefined }}
              onClick={handleClickLabel}
            ></span>
          ))}
      </div>
    ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [openSettingBox, openSettingSubBox, cardLabelsArr, extendLabels]
  );

  const coverElements = useMemo(
    () => (
      <div
        className={cx('card-cover', {
          'card-cover__small':
            cardCoverObj.isFullSize && !openSettingBox && cardLabelsArr.length > 0
        })}
        style={{ backgroundColor: cardCoverObj.coverColor }}
      ></div>
    ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [cardCoverObj, openSettingBox, cardLabelsArr]
  );

  return (
    <div
      key={cardId}
      className={cx('card-wrap', { 'card-editing': openSettingBox })}
      ref={setNodeRef}
      style={dndKitCardStyles}
      {...attributes}
      {...listeners}
    >
      {openSettingBox && <div className={cx('black-overlay')}></div>}
      {openSettingBox && settingBox}
      {openSettingBox && (
        <button ref={saveBtnRef} className={cx('save-btn')} onClick={handleUpdateCardTitle}>
          Save
        </button>
      )}
      {openSettingBox && (
        <div className={cx('textares__wrap')}>
          {cardCoverObj.coverColor && coverElements}
          {cardLabelsArr.length > 0 && labelsListElements}
          <textarea
            ref={titleInputRef}
            className={cx('card-title')}
            style={{
              paddingTop: cardLabelsArr.length > 0 ? '0px' : undefined
            }}
            value={cardTitleValue}
            onChange={e => setCardTitleValue(e.target.value)}
            onKeyDown={onEnterToSave}
            rows={4}
          ></textarea>
        </div>
      )}
      {!openSettingBox && (
        <div
          className={cx('card-title')}
          style={{
            backgroundColor:
              cardCoverObj.isFullSize && cardCoverObj.coverColor
                ? cardCoverObj.coverColor
                : undefined
          }}
        >
          {cardCoverObj.coverColor && coverElements}
          {cardLabelsArr.length > 0 && labelsListElements}
          <p>{cardTitleValue}</p>
          <Button className={cx('edit-card-btn')} onClick={onCLickEditCard}>
            {editIcon}
          </Button>
        </div>
      )}
    </div>
  );
};

export default Card;
