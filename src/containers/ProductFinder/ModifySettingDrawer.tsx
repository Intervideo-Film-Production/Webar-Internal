import React, { useState, useEffect, useMemo, useRef, useCallback } from "react";
import {
  Grid,
  Typography,
  IconButton,
  ButtonGroup,
  SwipeableDrawer
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import { AppButton } from "src/components";
import { deepCopyObject } from "src/core/helpers";
import CloseIcon from "@mui/icons-material/Close";
import { ISearchCriteria, ISearchCriteriaValue } from "src/core/declarations/app";
import { isIOS } from "src/core/helpers";
import { useAppContext } from "src/core/events";
const iOS = isIOS();

const useAppToogleButtonStyles = makeStyles({
  root: {
    position: "relative",
    backgroundColor: "#ADADAD",
    "& button": {
      border: "none",
      whiteSpace: "nowrap",
      outline: "none",
      "&:focus": {
        border: "none",
        outline: "none",
      },
      "&:hover": {
        border: "none",
        outline: "none",
      }
    }
  },
  button: {
    transition: "all ease-in-out 300ms",
    border: "none",
    borderRight: "none !important"
  },
  placeholder: {
    opacity: 1,
    position: "absolute",
    top: 0,
    transition: "left ease-in-out 300ms",
    mixBlendMode: "overlay",
    boxShadow: `rgb(0 0 0 / 20%) 0px 3px 1px -2px, rgb(0 0 0 / 14%) 0px 2px 2px 0px, rgb(0 0 0 / 12%) 0px 1px 5px 0px`,
  }
});

interface IAppToggleButtonsProps {
  answers: ISearchCriteriaValue[] | undefined;
  selectedAnswers: string | string[] | undefined;
  isQuestionMultipleChoices: boolean | undefined;
  onChange?: (questionId: string, selectAnswerId: string) => void;
}

const AppToggleButtons = ({ answers, selectedAnswers, isQuestionMultipleChoices, onChange }: IAppToggleButtonsProps) => {
  const { appTheme } = useAppContext();
  const classes = useAppToogleButtonStyles();
  const containerRef = useRef<HTMLDivElement>(null);
  const [sliderSize, setSliderSize] = useState({ width: 0, height: 0 });
  const [currentButtonPos, setCurrentButtonPos] = useState(-1);


  const handleButtonClick = (questionId: string, selectAnswerId: string) => (event: React.SyntheticEvent) => {
    const clickButtonEl = event.currentTarget;
    setCurrentButtonPos((clickButtonEl as HTMLElement).offsetLeft - 1);
    if (onChange) onChange(questionId, selectAnswerId);
  }

  useEffect(() => {
    if (containerRef.current) {
      setSliderSize({
        width: containerRef.current.children[0].clientWidth + 1,
        height: containerRef.current.children[0].clientHeight,
      })
    }
  }, [])

  useEffect(() => {
    if (containerRef.current) {
      if (isQuestionMultipleChoices && Array.isArray(selectedAnswers)) {
        // nothing to do
      } else {
        if (!!selectedAnswers) {
          const selectedAnswerEl = containerRef.current.querySelector(`#answer-${selectedAnswers}`) as HTMLElement;
          if (selectedAnswerEl)
            setCurrentButtonPos(selectedAnswerEl.offsetLeft - 1);
        }
      }
    }

  }, [answers, selectedAnswers, isQuestionMultipleChoices])

  return (<ButtonGroup
    ref={containerRef}
    {...isQuestionMultipleChoices
      ? { variant: "contained" }
      : {}}
    className={isQuestionMultipleChoices ? "" : classes.root}
    sx={{
      borderRadius: `${sliderSize.height / 2}px/50%`
    }}
    fullWidth>
    {answers && answers.map((v, i) => (
      <AppButton
        key={`answer-${v.id}`}
        id={`answer-${v.id}`}
        disableRipple
        className={classes.button} //  ${isQuestionMultipleChoices && (selectedAnswers as string[]).includes(v.id) ? classes.buttonHighlight : "}
        sx={theme => {
          return ({
            ...theme.productFinderStyles?.settingTogglerButton,
            ...(isQuestionMultipleChoices && (selectedAnswers as string[]).includes(v.id) && theme.productFinderStyles?.settingTogglerButtonSelected)
          })
        }}
        onClick={handleButtonClick(v.criteriaRef, v.id)}
      >
        {v.answer}
      </AppButton>
    ))}
    {!isQuestionMultipleChoices && (<div
      className={classes.placeholder}
      style={{
        width: `${sliderSize.width}px`,
        height: `${sliderSize.height}px`,
        borderRadius: `${sliderSize.height / 2}px/50%`,
        left: currentButtonPos || -1,
        ...(appTheme.getValue().productFinderStyles?.settingSliderButtonPlaceholder)
      }}></div>)}
  </ButtonGroup >)
}

interface IModifySettingDrawerProps {
  open: boolean;
  questions: (ISearchCriteria & { answers: ISearchCriteriaValue[] })[] | null;
  selectedAnswers: { questionId: string, answerId: string | string[] }[];
  onClose?: (changedAnswers?: { questionId: string, answerId: string | string[] }[]) => void;
}

interface IAnswerData {
  questionId: string;
  answerId: string | string[];
  question: ISearchCriteria & { answers: ISearchCriteriaValue[] } | undefined;
}

const ModifySettingDrawer = ({ open, questions, selectedAnswers, onClose }: IModifySettingDrawerProps) => {
  const [changedAnswer, setChangedAnswer] = useState(selectedAnswers);
  const [isAnswerChanged, setIsAnswerChanged] = useState(false);
  const handleClose = () => {
    if (onClose) onClose(isAnswerChanged ? changedAnswer : undefined);
  }


  const handleValueChange = useCallback((questionId: string, selectAnswerId: string) => {
    const answerIdx = changedAnswer.findIndex(ca => ca.questionId === questionId);
    if (answerIdx >= 0) {
      let answer = changedAnswer[answerIdx].answerId;
      if (Array.isArray(answer)) {
        answer = answer.includes(selectAnswerId) ? answer.filter(a => a !== selectAnswerId) : answer.concat([selectAnswerId]);
        changedAnswer[answerIdx].answerId = answer;
      } else {
        changedAnswer[answerIdx].answerId = selectAnswerId;
      }
    }

    setIsAnswerChanged(true);
    setChangedAnswer(deepCopyObject(changedAnswer));
  }, [changedAnswer])


  const answersData: IAnswerData[] | null = useMemo(() => {
    return changedAnswer
      ? changedAnswer.map(sa => ({
        ...sa,
        question: questions?.find(q => q.id === sa.questionId)
      }))
      : null;
  }, [changedAnswer, questions]);


  return (
    <SwipeableDrawer
      anchor="bottom"
      hideBackdrop
      swipeAreaWidth={0}
      disableBackdropTransition={!iOS}
      disableDiscovery={iOS}
      ModalProps={{
        keepMounted: true,
      }}
      onClose={handleClose}
      onOpen={() => { }}

      open={open}
      PaperProps={{
        sx: {
          p: 1,
          mb: "20px",
          height: "calc(100% - 114px)",
          display: "flex",
        }
      }}
    >
      <Grid sx={{
        p: 1,
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#E2E2E2",
        borderRadius: "5px",
        flexGrow: 1,
        overflowY: "auto"
      }}>
        <Grid sx={{ display: "flex" }}>
          <IconButton
            aria-label="close"
            onClick={handleClose}
            sx={{
              marginLeft: "auto",
              color: "#fff",
            }}
          >
            <CloseIcon />
          </IconButton>
        </Grid>

        <Grid sx={{
          overflowY: "auto",
          px: 2,
          pb: 3
        }}>
          {answersData && answersData.map((ans, asIdx) => (
            <Grid key={`question-block-${asIdx}`}>
              <Typography variant="h5"
                color="primary"
                sx={{ whiteSpace: "pre-line", mt: 2, mb: 1, fontWeight: 700 }}
              >{ans.question?.question}</Typography>
              <AppToggleButtons
                answers={ans.question?.answers}
                selectedAnswers={ans.answerId}
                isQuestionMultipleChoices={ans.question?.isMultipleChoices}
                onChange={handleValueChange}
              />

            </Grid>
          ))}
        </Grid>
      </Grid>

    </SwipeableDrawer>)
}

export default ModifySettingDrawer;
