import _ from 'lodash';
import { useRef, useState } from 'react';
import { Button, ButtonGroup, Card, Form } from 'react-bootstrap';
import { BsArrowRight } from 'react-icons/bs';
import { Link } from 'react-router-dom';
import { AccidentalSign } from '../../theory-utils/accidental';
import { Note } from '../../theory-utils/note';
import { Scale } from '../../theory-utils/scale';
import { motion } from 'framer-motion';

const QUESTIONS_NUMBER = 5;

class Question {
    constructor(public scale: Scale) {}

    get accidentalsNumber() {
        return this.scale.notes
            .slice(0, this.scale.notes.length - 1)
            .filter((note) => note.accidental.sign !== '').length;
    }

    accidentalsNumberAnswer: number = 0;

    get accidental(): Extract<AccidentalSign, '#' | 'b' | ''> {
        return (
            (this.scale.notes.find((note) => note.accidental.sign !== '')
                ?.accidental.sign as Extract<AccidentalSign, '#' | 'b'>) || ''
        );
    }

    accidentalAnswer: Extract<AccidentalSign, '#' | 'b' | ''> = '';

    get isRight() {
        return (
            this.accidentalsNumberAnswer === this.accidentalsNumber &&
            this.accidentalAnswer === this.accidental
        );
    }
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

export function NumberOfAccidentalsGame() {
    const [gameState, setGameState] = useState<
        'welcome' | 'started' | 'results'
    >('welcome');
    const [scalesToPlay, setScalesToPlay] = useState<
        'major' | 'minor' | 'both'
    >('both');
    const [questions, setQuestions] = useState<Question[]>([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

    const questionRef = useRef<HTMLDivElement>(null);

    function handleStartGameClick() {
        setCurrentQuestionIndex(0);
        const scalesSample = _.sampleSize(
            allScales.filter((scale) =>
                scalesToPlay === 'major'
                    ? scale.name === 'Major'
                    : scalesToPlay === 'minor'
                    ? 'Natural Minor'
                    : true
            ),
            QUESTIONS_NUMBER
        );
        setQuestions(scalesSample.map((scale) => new Question(scale)));
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
            if (currentQuestionIndex === QUESTIONS_NUMBER - 1) {
                setGameState('results');
            } else {
                setCurrentQuestionIndex(currentQuestionIndex + 1);
            }
        }, 500);
    }

    function handleNumberClick(number: number) {
        setQuestions(
            questions.map((question, index) => {
                if (currentQuestionIndex === index) {
                    question.accidentalsNumberAnswer = number;
                    question.accidentalAnswer =
                        number === 0
                            ? ''
                            : question.accidentalAnswer !== ''
                            ? question.accidentalAnswer
                            : '#';
                }
                return question;
            })
        );
    }

    function handleAccidentalClick(
        accidental: Extract<AccidentalSign, '#' | 'b' | ''>
    ) {
        setQuestions(
            questions.map((question, index) => {
                if (currentQuestionIndex === index) {
                    question.accidentalAnswer = accidental;
                }
                return question;
            })
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
                            id="major-radio"
                            checked={scalesToPlay === 'major'}
                            onChange={() => setScalesToPlay('major')}
                        />
                        <Form.Check
                            type="radio"
                            label="Minor"
                            id="minor-radio"
                            checked={scalesToPlay === 'minor'}
                            onChange={() => setScalesToPlay('minor')}
                        />
                        <Form.Check
                            type="radio"
                            label="Both"
                            id="both-radio"
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
                    key={currentQuestionIndex}
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                >
                    <Card ref={questionRef}>
                        <Card.Header>
                            Question {currentQuestionIndex + 1}
                        </Card.Header>
                        <Card.Body className="vstack gap-3">
                            <div>How many flats or sharps in the key of:</div>
                            <div className="fw-bold">
                                {questions[currentQuestionIndex].scale.format()}
                            </div>
                            <div>
                                <ButtonGroup>
                                    {_.range(7).map((number) => (
                                        <Button
                                            key={number}
                                            disabled={
                                                questions[currentQuestionIndex]
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
                            {questions[currentQuestionIndex]
                                .accidentalsNumberAnswer > 0 && (
                                <div>
                                    <ButtonGroup>
                                        {(
                                            ['#', 'b'] as Extract<
                                                AccidentalSign,
                                                '#' | 'b'
                                            >[]
                                        ).map((accidental) => (
                                            <Button
                                                key={accidental}
                                                disabled={
                                                    questions[
                                                        currentQuestionIndex
                                                    ].accidentalAnswer ===
                                                    accidental
                                                }
                                                onClick={() =>
                                                    handleAccidentalClick(
                                                        accidental
                                                    )
                                                }
                                                variant="secondary"
                                            >
                                                {accidental}
                                            </Button>
                                        ))}
                                    </ButtonGroup>
                                </div>
                            )}
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
