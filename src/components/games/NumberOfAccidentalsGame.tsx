import { motion } from 'framer-motion';
import _ from 'lodash';
import { useRef, useState } from 'react';
import { Button, ButtonGroup, Card } from 'react-bootstrap';
import { BsArrowRight, BsFlag } from 'react-icons/bs';
import { Link } from 'react-router-dom';
import { AccidentalSign } from '../../theory-utils/accidental';
import { Note } from '../../theory-utils/note';
import { Scale } from '../../theory-utils/scale';

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

    type ScaleSetting = 'major' | 'minor' | 'both';

    const [scaleSetting, setScaleSetting] = useState<ScaleSetting>('both');

    const [questionsCountSetting, setQuestionsCountSetting] =
        useState<number>(10);
    const [questions, setQuestions] = useState<Question[]>([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

    const questionRef = useRef<HTMLDivElement>(null);

    function handleStartGameClick() {
        setCurrentQuestionIndex(0);
        const scalesSample = _.sampleSize(
            allScales.filter((scale) =>
                scaleSetting === 'major'
                    ? scale.name === 'Major'
                    : scaleSetting === 'minor'
                    ? 'Natural Minor'
                    : true
            ),
            questionsCountSetting
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
            if (currentQuestionIndex === questionsCountSetting - 1) {
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
            <h3>Number of accidentals game</h3>
            {gameState === 'welcome' && (
                <div className="vstack gap-3">
                    <div>
                        <p className="fw-bold">Select scales</p>
                        <ButtonGroup>
                            {new Array<ScaleSetting>(
                                'major',
                                'minor',
                                'both'
                            ).map((option) => (
                                <Button
                                    key={option}
                                    variant="outline-dark"
                                    active={scaleSetting === option}
                                    onClick={() => setScaleSetting(option)}
                                >
                                    {_.startCase(option)}
                                </Button>
                            ))}
                        </ButtonGroup>
                    </div>
                    <div>
                        <p className="fw-bold">Number of questions</p>
                        <ButtonGroup>
                            {[5, 10, 15, 20].map((option) => (
                                <Button
                                    key={option}
                                    variant="outline-dark"
                                    active={questionsCountSetting === option}
                                    onClick={() =>
                                        setQuestionsCountSetting(option)
                                    }
                                >
                                    {option}
                                </Button>
                            ))}
                        </ButtonGroup>
                    </div>
                    <div>
                        <Button onClick={handleStartGameClick} variant="dark">
                            <BsFlag /> Start
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
                            Question {currentQuestionIndex + 1} /{' '}
                            {questionsCountSetting}
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
                                            value={number}
                                            key={number}
                                            active={
                                                questions[currentQuestionIndex]
                                                    .accidentalsNumberAnswer ===
                                                number
                                            }
                                            onClick={(e) =>
                                                handleNumberClick(number)
                                            }
                                            variant="outline-dark"
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
                                        {new Array<
                                            Extract<AccidentalSign, '#' | 'b'>
                                        >('#', 'b').map((accidental) => (
                                            <Button
                                                key={accidental}
                                                active={
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
                                                variant="outline-dark"
                                            >
                                                {accidental}
                                            </Button>
                                        ))}
                                    </ButtonGroup>
                                </div>
                            )}
                        </Card.Body>
                        <Card.Footer>
                            <Button
                                onClick={handleNextQuestionClick}
                                variant="dark"
                            >
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
                                    <b>Scale: </b>
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
