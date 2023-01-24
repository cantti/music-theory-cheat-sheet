import {
  useEffect,
  useRef,
  useState,
} from 'react';

import { motion } from 'framer-motion';
import _ from 'lodash';
import {
  Button,
  Card,
  Col,
  Form,
  Row,
} from 'react-bootstrap';
import {
  BsArrowRight,
  BsClock,
} from 'react-icons/bs';
import { Vex } from 'vexflow';

import { LetterChar } from '../../theory-utils/letter';
import { Note } from '../../theory-utils/note';
import Piano from '../Piano';

type Clef = 'treble' | 'bass';

class Question {
    constructor(public note: Note, public clef: Clef) {}
    noteAnswer?: Note;
    get isRight() {
        return (
            this.noteAnswer &&
            this.note.letter.char === this.noteAnswer.letter.char
        );
    }
}

const allNotes: Note[] = [];

for (const letterChar of new Array<LetterChar>(
    'C',
    'D',
    'E',
    'F',
    'G',
    'A',
    'B'
)) {
    for (const octave of [2, 5]) {
        allNotes.push(new Note(letterChar, '', octave));
    }
}

function drawNote(elementId: string, note: Note, clef: string) {
    // clear
    const staff = document.getElementById(elementId);
    if (staff) {
        while (staff.hasChildNodes()) {
            if (staff.lastChild) {
                staff.removeChild(staff.lastChild);
            }
        }
    }
    // draw
    const { Factory } = Vex.Flow;
    const factory = new Factory({
        renderer: { elementId, width: 200, height: 200 },
    });
    const score = factory.EasyScore();
    factory
        .System()
        .addStave({
            voices: [
                score.voice(score.notes(note.format(true) + '/w', { clef })),
            ],
        })
        .addClef(clef);
    factory.draw();
    factory.getContext().scale(1.5, 1.5);
}

export function ReadingTrainerGame() {
    const [gameState, setGameState] = useState<
        'welcome' | 'started' | 'results'
    >('welcome');

    const [clefSetting, setClefSetting] = useState<Clef | 'both'>('both');

    const [questionsCountSetting, setQuestionsCountSetting] = useState(10);
    const [timeLimitSetting, setTimeLimitSetting] = useState(5);
    const [questions, setQuestions] = useState<Question[]>([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [remainingTime, setRemainingTime] = useState(timeLimitSetting);
    const [controlsDisabled, setControlsDisabled] = useState(false);
    const questionRef = useRef<HTMLDivElement>(null);

    const intervalId = useRef(0);
    const intervalCallback = useRef<() => void>();

    useEffect(() => {
        intervalCallback.current = () => {
            const newRemainingTime = remainingTime - 1;
            setRemainingTime(newRemainingTime);
            if (newRemainingTime === 0) {
                handleNextQuestionClick();
            }
        };
    });

    function startTimer() {
        if (timeLimitSetting > 0) {
            setRemainingTime(timeLimitSetting);
            intervalId.current = window.setInterval(() => {
                intervalCallback.current!();
            }, 1000);
        }
    }

    function stopTimer() {
        if (timeLimitSetting > 0) {
            window.clearInterval(intervalId.current);
        }
    }

    function handleStartGameClick() {
        setCurrentQuestionIndex(0);
        const notesSample = _.sampleSize(allNotes, questionsCountSetting);
        const questions = notesSample.map(
            (note) =>
                new Question(
                    note,
                    note.octave < 4
                        ? 'bass'
                        : note.octave > 4
                        ? 'treble'
                        : _.sample(['bass', 'treble'])!
                )
        );
        setQuestions(questions);
        setGameState('started');
        startTimer();
    }

    function handleNextQuestionClick() {
        stopTimer();
        setControlsDisabled(true);
        if (questions[currentQuestionIndex].isRight) {
            questionRef.current?.classList.add('bg-success');
        } else {
            questionRef.current?.classList.add('bg-danger');
        }
        setTimeout(() => {
            questionRef.current?.classList.remove('bg-success', 'bg-danger');
            setControlsDisabled(false);
            if (currentQuestionIndex === questionsCountSetting - 1) {
                setGameState('results');
            } else {
                setCurrentQuestionIndex(currentQuestionIndex + 1);
                startTimer();
            }
        }, 500);
    }

    function handleNoteClick(note: Note) {
        setQuestions(
            questions.map((question, index) => {
                if (currentQuestionIndex === index) {
                    note.accidental.sign = '';
                    question.noteAnswer = note;
                }
                return question;
            })
        );
    }

    useEffect(() => {
        if (gameState === 'started') {
            drawNote(
                'staff-question',
                questions[currentQuestionIndex].note,
                questions[currentQuestionIndex].clef
            );
        } else if (gameState === 'results') {
            for (let i = 0; i < questions.length; i++) {
                drawNote('staff-' + i, questions[i].note, questions[i].clef);
            }
        }
    }, [currentQuestionIndex, gameState, questions]);

    return (
        <div>
            <h3>Reading trainer game</h3>
            {gameState === 'welcome' && (
                <div className="vstack gap-3">
                    <Form.Group>
                        <Form.Label className="fw-bold">Clefs</Form.Label>
                        {new Array<Clef | 'both'>('treble', 'bass', 'both').map(
                            (option) => (
                                <Form.Check
                                    key={option}
                                    type="radio"
                                    label={_.startCase(option)}
                                    id={'radio-' + option}
                                    checked={clefSetting === option}
                                    onChange={() => setClefSetting(option)}
                                />
                            )
                        )}
                    </Form.Group>
                    <Form.Group>
                        <Form.Label className="fw-bold">
                            Number of questions
                        </Form.Label>
                        {[5, 10, 15, 20].map((option) => (
                            <Form.Check
                                key={option}
                                type="radio"
                                label={option}
                                id={'questions-number-' + option}
                                checked={questionsCountSetting === option}
                                onChange={() =>
                                    setQuestionsCountSetting(option)
                                }
                            />
                        ))}
                    </Form.Group>
                    <Form.Group>
                        <Form.Label className="fw-bold">Time Limit</Form.Label>
                        {[0, 3, 5, 10].map((option) => (
                            <Form.Check
                                key={option}
                                type="radio"
                                label={option === 0 ? 'No limit' : option}
                                id={'time-limit-' + option}
                                checked={timeLimitSetting === option}
                                onChange={() => setTimeLimitSetting(option)}
                            />
                        ))}
                    </Form.Group>
                    <div>
                        <Button
                            onClick={handleStartGameClick}
                            variant="success"
                        >
                            Start game <BsArrowRight />
                        </Button>
                    </div>
                </div>
            )}
            {gameState === 'started' && (
                <motion.div
                    key={currentQuestionIndex}
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                    style={{
                        pointerEvents: controlsDisabled ? 'none' : 'auto',
                    }}
                >
                    <Card ref={questionRef}>
                        <Card.Header className="hstack">
                            <div>
                                Question {currentQuestionIndex + 1} /{' '}
                                {questionsCountSetting}
                            </div>
                        </Card.Header>
                        <Card.Body className="vstack">
                            <div>Press the correct note</div>
                            <div id="staff-question"></div>
                            <Row>
                                <Col xs={12} md={4}>
                                    <Piano
                                        highlightedNotes={
                                            questions[currentQuestionIndex]
                                                .noteAnswer
                                                ? [
                                                      questions[
                                                          currentQuestionIndex
                                                      ].noteAnswer!,
                                                  ]
                                                : undefined
                                        }
                                        onNoteClick={(note) =>
                                            handleNoteClick(note)
                                        }
                                    />
                                </Col>
                            </Row>
                        </Card.Body>
                        <Card.Footer>
                            <Button
                                onClick={handleNextQuestionClick}
                                variant="dark"
                            >
                                Next{' '}
                                {timeLimitSetting > 0 && (
                                    <motion.span
                                        key={remainingTime}
                                        initial={{ opacity: 0, scale: 0.5 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        {remainingTime} <BsClock />
                                    </motion.span>
                                )}
                            </Button>
                        </Card.Footer>
                    </Card>
                </motion.div>
            )}
            {gameState === 'results' && (
                <div className="vstack gap-3 mb-3">
                    <div>
                        <Button
                            onClick={() => setGameState('welcome')}
                            variant="success"
                        >
                            Play again <BsArrowRight />
                        </Button>
                    </div>
                    {questions.map((question, questionIndex) => (
                        <Card key={questionIndex}>
                            <Card.Header
                                className={
                                    question.isRight
                                        ? 'bg-success'
                                        : 'bg-danger'
                                }
                            >
                                Question {questionIndex + 1}
                            </Card.Header>
                            <Card.Body>
                                <div>
                                    <b>Note: </b>
                                    <div id={'staff-' + questionIndex}></div>
                                </div>
                                <div>
                                    <b>Right answer: </b>
                                    {question.note.format()}
                                </div>
                                <div>
                                    <b>Your answer: </b>
                                    {question.noteAnswer
                                        ? question.noteAnswer.format()
                                        : ''}
                                </div>
                            </Card.Body>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
