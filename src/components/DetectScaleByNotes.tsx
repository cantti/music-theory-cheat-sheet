import React from 'react';
import { Button, Col, Form, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { Note } from '../theory-utils/note/Note';
import { getScalesByNotes } from '../theory-utils/utils/getScalesByNotes';
import { getScaleUrl } from '../utils/url';
import { AiOutlineClear } from 'react-icons/ai';

const optionsForInput: { note?: Note; display: string }[] = [
    { display: 'Не выбрана' },
    { note: new Note('C'), display: 'C' },
    { note: new Note('C', '#'), display: 'C#/Eb' },
    { note: new Note('D'), display: 'D' },
    { note: new Note('D', '#'), display: 'D#/Eb' },
    { note: new Note('E'), display: 'E' },
    { note: new Note('F'), display: 'F' },
    { note: new Note('F', '#'), display: 'F#/Gb' },
    { note: new Note('G'), display: 'G' },
    { note: new Note('G', '#'), display: 'G#/Ab' },
    { note: new Note('A'), display: 'A' },
    { note: new Note('A', '#'), display: 'A#/Bb' },
    { note: new Note('B'), display: 'B' },
];

const noteInputCount = 7;

export const DetectScaleByNotes = () => {
    const [inputsValues, setInputsValues] = React.useState(
        Array(noteInputCount)
            .fill(undefined)
            .map((_, i) => ({
                inputIndex: i,
                value: optionsForInput[0],
            }))
    );

    const possibleScales = getScalesByNotes(
        inputsValues
            .map((x) => x.value?.note)
            .filter((x): x is Note => x != null)
    );

    const handleInputsValueChange = (
        inputIndex: number,
        e: React.BaseSyntheticEvent
    ) => {
        setInputsValues(
            inputsValues.map((x) => {
                if (x.inputIndex === inputIndex) {
                    const newInputValue = { ...x };
                    newInputValue.value =
                        optionsForInput[parseInt(e.target.value)];
                    return newInputValue;
                }
                return x;
            })
        );
    };

    return (
        <div>
            <h1 className="display-4">Determine the key by the notes.</h1>
            <p>Here you can determine the key by the notes..</p>
            <p>Select notes.</p>

            <Row>
                {inputsValues.map((_inputValue, inputIndex) => (
                    <Col xs={12} md={3} key={inputIndex}>
                        <Form.Control
                            as="select"
                            custom
                            value={optionsForInput.indexOf(
                                inputsValues.find(
                                    (x) => x.inputIndex === inputIndex
                                )!.value
                            )}
                            onChange={(e) =>
                                handleInputsValueChange(inputIndex, e)
                            }
                            className="mb-3"
                        >
                            {optionsForInput.map((option, idx) => (
                                <option key={idx} value={idx}>
                                    {option.display}
                                </option>
                            ))}
                        </Form.Control>
                    </Col>
                ))}
            </Row>
            <div className="mb-3">
                <Button
                    variant="outline-secondary"
                    onClick={() =>
                        setInputsValues(
                            inputsValues.map((x) => {
                                const newInputValue = { ...x };
                                newInputValue.value = optionsForInput[0];
                                return newInputValue;
                            })
                        )
                    }
                >
                    <AiOutlineClear /> Очистить
                </Button>
            </div>
            {inputsValues.filter((x) => x.value.note == null).length !==
                noteInputCount && (
                <>
                    <p>Тональности с такими нотами:</p>
                    <ul>
                        {possibleScales.map((key, index) => (
                            <li key={index}>
                                <Link to={getScaleUrl(key)}>
                                    {key.format('long')}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </>
            )}
        </div>
    );
};
