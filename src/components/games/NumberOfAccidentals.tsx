import _ from 'lodash';
import { useState } from 'react';
import { Button, ButtonGroup, Card, Form } from 'react-bootstrap';
import { BsArrowRight } from 'react-icons/bs';
import { Link } from 'react-router-dom';
import { AccidentalSign } from '../../theory-utils/accidental';
import { Note } from '../../theory-utils/note';
import { Scale } from '../../theory-utils/scale';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';

const questionsNumber = 10;

interface Question {
    scale: Scale;
    accidentalsNumber: number;
    accidentalsNumberAnswer: number;
    accidental: Extract<AccidentalSign, '#' | 'b' | ''>;
    accidentalAnswer: Extract<AccidentalSign, '#' | 'b' | ''>;
}

const allScales: Scale[] = [
    new Scale(new Note('C'), 'Major'),
    new Scale(new Note('G'), 'Major'),
    new Scale(new Note('D'), 'Major'),
    new Scale(new Note('A'), 'Major'),
    new Scale(new Note('E'), 'Major'),
    new Scale(new Note('B'), 'Major'),
    new Scale(new Note('G', 'b'), 'Major'),
    new Scale(new Note('D', 'b'), 'Major'),
    new Scale(new Note('A', 'b'), 'Major'),
    new Scale(new Note('E', 'b'), 'Major'),
    new Scale(new Note('B', 'b'), 'Major'),
    new Scale(new Note('F'), 'Major'),
    new Scale(new Note('A'), 'Natural Minor'),
    new Scale(new Note('E'), 'Natural Minor'),
    new Scale(new Note('B'), 'Natural Minor'),
    new Scale(new Note('F', '#'), 'Natural Minor'),
    new Scale(new Note('C', '#'), 'Natural Minor'),
    new Scale(new Note('G', '#'), 'Natural Minor'),
    new Scale(new Note('E', 'b'), 'Natural Minor'),
    new Scale(new Note('B', 'b'), 'Natural Minor'),
    new Scale(new Note('F'), 'Natural Minor'),
    new Scale(new Note('C'), 'Natural Minor'),
    new Scale(new Note('G'), 'Natural Minor'),
    new Scale(new Note('D'), 'Natural Minor'),
];

export function NumberOfAccidentals() {
    const [gameState, setGameState] = useState<
        'welcome' | 'started' | 'results'
    >('welcome');
    const [scalesToPlay, setScalesToPlay] = useState<
        'major' | 'minor' | 'both'
    >('both');
    const [questions, setQuestions] = useState<Question[]>([]);
    const [currentQuestion, setCurrentQuestion] = useState(0);

    function handleStartGameClick() {
        setCurrentQuestion(0);
        const newQuestions: Question[] = [];
        for (let i = 0; i < questionsNumber; i++) {
            const scale = _.sample(
                allScales.filter((scale) =>
                    scalesToPlay === 'major'
                        ? scale.name === 'Major'
                        : scalesToPlay === 'minor'
                        ? 'Natural Minor'
                        : true
                )
            )!;
            const question: Question = {
                scale,

                accidentalsNumber: scale.notes
                    .slice(0, scale.notes.length - 1)
                    .filter((note) => note.accidental.sign !== '').length,

                accidental:
                    (scale.notes.find((note) => note.accidental.sign !== '')
                        ?.accidental.sign as Extract<
                        AccidentalSign,
                        '#' | 'b'
                    >) || '',

                accidentalsNumberAnswer: 0,
                accidentalAnswer: '',
            };
            newQuestions.push(question);
        }
        setQuestions(newQuestions);
        setGameState('started');
    }

    function isRight(question: Question) {
        return (
            question.accidentalsNumberAnswer === question.accidentalsNumber &&
            question.accidentalAnswer === question.accidental
        );
    }

    function handleNextQuestionClick() {
        if (isRight(questions[currentQuestion])) {
            toast.success('Answer is correct', {
                position: 'bottom-center',
                theme: 'colored',
                autoClose: 500,
            });
        } else {
            toast.error('Answer is incorrect', {
                position: 'bottom-center',
                theme: 'colored',
                autoClose: 500,
            });
        }
        if (currentQuestion === questionsNumber - 1) {
            setGameState('results');
        } else {
            setCurrentQuestion(currentQuestion + 1);
        }
    }

    function handleNumberClick(number: number) {
        setQuestions(
            questions.map((x, i) =>
                i === currentQuestion
                    ? {
                          ...x,
                          accidentalsNumberAnswer: number,
                          accidentalAnswer:
                              number === 0
                                  ? ''
                                  : x.accidentalAnswer !== ''
                                  ? x.accidentalAnswer
                                  : '#',
                      }
                    : x
            )
        );
    }

    function handleAccidentalClick(
        accidental: Extract<AccidentalSign, '#' | 'b' | ''>
    ) {
        setQuestions(
            questions.map((x, i) =>
                i === currentQuestion
                    ? {
                          ...x,
                          accidentalAnswer: accidental,
                          accidentalsNumberAnswer:
                              accidental === '' ? 0 : x.accidentalsNumberAnswer,
                      }
                    : x
            )
        );
    }

    return (
        <div>
            {gameState === 'welcome' && (
                <div>
                    <h3>Number of accidentals game</h3>
                    <Form.Group className="mb-3">
                        <Form.Label>Select scales</Form.Label>
                        <Form.Check
                            type="radio"
                            label="Major"
                            checked={scalesToPlay === 'major'}
                            onChange={() => setScalesToPlay('major')}
                        />
                        <Form.Check
                            type="radio"
                            label="Minor"
                            checked={scalesToPlay === 'minor'}
                            onChange={() => setScalesToPlay('minor')}
                        />
                        <Form.Check
                            type="radio"
                            label="Both"
                            checked={scalesToPlay === 'both'}
                            onChange={() => setScalesToPlay('both')}
                        />
                    </Form.Group>
                    <Button onClick={handleStartGameClick} variant="success">
                        Start game <BsArrowRight />
                    </Button>
                </div>
            )}
            {gameState === 'started' && (
                <motion.div
                    key={currentQuestion}
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                >
                    <Card>
                        <Card.Header>
                            Question {currentQuestion + 1}
                        </Card.Header>
                        <Card.Body className="vstack gap-3">
                            <div>How many flats or sharps in the key of:</div>
                            <div className="fw-bold">
                                {questions[currentQuestion].scale.format()}
                            </div>
                            <div>
                                <ButtonGroup>
                                    {_.range(7).map((number) => (
                                        <Button
                                            key={number}
                                            disabled={
                                                questions[currentQuestion]
                                                    .accidentalsNumberAnswer ===
                                                number
                                            }
                                            onClick={() =>
                                                handleNumberClick(number)
                                            }
                                            variant="secondary"
                                        >
                                            {number}
                                        </Button>
                                    ))}
                                </ButtonGroup>
                            </div>
                            <div>
                                <ButtonGroup>
                                    {(
                                        ['', '#', 'b'] as Extract<
                                            AccidentalSign,
                                            '' | '#' | 'b'
                                        >[]
                                    ).map((accidental) => (
                                        <Button
                                            key={accidental}
                                            disabled={
                                                questions[currentQuestion]
                                                    .accidentalAnswer ===
                                                accidental
                                            }
                                            onClick={() =>
                                                handleAccidentalClick(
                                                    accidental
                                                )
                                            }
                                            variant="secondary"
                                        >
                                            {accidental === ''
                                                ? 'none'
                                                : accidental}
                                        </Button>
                                    ))}
                                </ButtonGroup>
                            </div>
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
                                    isRight(question)
                                        ? 'bg-success'
                                        : 'bg-danger'
                                }
                            >
                                Question:
                                {questionNumber + 1}
                            </Card.Header>
                            <Card.Body>
                                <div>
                                    <b>Scale: </b>{' '}
                                    <Link
                                        to={
                                            '/scales/' +
                                            encodeURIComponent(
                                                question.scale.format()
                                            )
                                        }
                                        target="_blank"
                                    >
                                        {question.scale.format()}
                                    </Link>
                                </div>
                                <div>
                                    <b>Right answer: </b>
                                    {question.accidentalsNumber}{' '}
                                    {question.accidental}
                                </div>
                                <div>
                                    <b>Your answer: </b>
                                    {question.accidentalsNumberAnswer}{' '}
                                    {question.accidentalAnswer}
                                </div>
                            </Card.Body>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
