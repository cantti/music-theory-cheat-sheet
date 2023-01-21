import _ from 'lodash';
import { useEffect, useRef, useState } from 'react';
import { Button, Card, Col, Form, Row } from 'react-bootstrap';
import { BsArrowRight } from 'react-icons/bs';
import { Vex } from 'vexflow';
import { LetterChar } from '../../theory-utils/letter';
import { Note } from '../../theory-utils/note';
import Piano from '../Piano';
import { motion } from 'framer-motion';

class Question {
    constructor(public note: Note, public clef: string) {}
    noteAnswer?: Note;
    get isRight() {
        return (
            this.noteAnswer &&
            this.note.letter.char === this.noteAnswer.letter.char
        );
    }
}

const allNotes: Note[] = [];

for (const letterChar of ['C', 'D', 'E', 'F', 'G', 'A', 'B'] as LetterChar[]) {
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
        renderer: { elementId: elementId, width: 200, height: 200 },
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
    const [clefSetting, setClefSetting] = useState<'treble' | 'bass' | 'both'>(
        'both'
    );
    const [questionsNumberSetting, setQuestionsNumberSetting] =
        useState<number>(10);
    const [questions, setQuestions] = useState<Question[]>([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

    const questionRef = useRef<HTMLDivElement>(null);

    function handleStartGameClick() {
        setCurrentQuestionIndex(0);
        const notesSample = _.sampleSize(allNotes, questionsNumberSetting);
        setQuestions(
            notesSample.map(
                (note) =>
                    new Question(
                        note,
                        note.octave < 4
                            ? 'bass'
                            : note.octave > 4
                            ? 'treble'
                            : _.sample(['bass', 'treble'])!
                    )
            )
        );
        setGameState('started');
    }

    function handleNextQuestionClick() {
        if (questions[currentQuestionIndex].isRight) {
            questionRef.current?.classList.add('bg-success');
        } else {
            questionRef.current?.classList.add('bg-danger');
        }
        setTimeout(() => {
            questionRef.current?.classList.remove('bg-success', 'bg-danger');
            if (currentQuestionIndex === questionsNumberSetting - 1) {
                setGameState('results');
            } else {
                setCurrentQuestionIndex(currentQuestionIndex + 1);
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
            {gameState === 'welcome' && (
                <div className="vstack gap-3">
                    <Form.Group>
                        <Form.Label>Clefs</Form.Label>
                        <Form.Check
                            type="radio"
                            label="Treble"
                            id="treble-radio"
                            checked={clefSetting === 'treble'}
                            onChange={() => setClefSetting('treble')}
                        />
                        <Form.Check
                            type="radio"
                            label="Bass"
                            id="bass-radio"
                            checked={clefSetting === 'bass'}
                            onChange={() => setClefSetting('bass')}
                        />
                        <Form.Check
                            type="radio"
                            label="Both"
                            id="both-radio"
                            checked={clefSetting === 'both'}
                            onChange={() => setClefSetting('both')}
                        />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Number of questions</Form.Label>
                        {[5, 10, 15, 20].map((number) => (
                            <Form.Check
                                key={number}
                                type="radio"
                                label={number}
                                id={'questions-number-' + number}
                                checked={questionsNumberSetting === number}
                                onChange={() =>
                                    setQuestionsNumberSetting(number)
                                }
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
                >
                    <Card ref={questionRef}>
                        <Card.Header>
                            Question {currentQuestionIndex + 1}
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
                            <Button onClick={handleNextQuestionClick}>
                                Next <BsArrowRight />
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
                    {questions.map((question, questionNumber) => (
                        <Card>
                            <Card.Header
                                className={
                                    question.isRight
                                        ? 'bg-success'
                                        : 'bg-danger'
                                }
                            >
                                Question {questionNumber + 1}
                            </Card.Header>
                            <Card.Body>
                                <div>
                                    <b>Note: </b>
                                    <div id={'staff-' + questionNumber}></div>
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
