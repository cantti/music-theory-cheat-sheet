import { motion } from 'framer-motion';
import _ from 'lodash';
import { useState } from 'react';
import { Button, Card, Col, Modal, Row } from 'react-bootstrap';
import { BsQuestionCircle } from 'react-icons/bs';
import { useNavigate, useParams } from 'react-router-dom';
import { MajorScale } from '../theory-utils/scales/MajorScale';
import { NaturalMinorScale } from '../theory-utils/scales/NaturalMinorScale';
import { Scale } from '../theory-utils/scales/Scale';
import { getScaleFormUrlParams, getScaleUrl } from '../utils/url';
import Piano from './Piano';
import styles from './ScaleInfo.module.scss';
const MotionButton = motion(Button);

const scalesInCircle: { scale: Scale; clickable: boolean }[][] = [
    [{ scale: MajorScale.create('C'), clickable: true }],
    [{ scale: MajorScale.create('G'), clickable: true }],
    [{ scale: MajorScale.create('D'), clickable: true }],
    [{ scale: MajorScale.create('A'), clickable: true }],
    [{ scale: MajorScale.create('E'), clickable: true }],
    [
        { scale: MajorScale.create('B'), clickable: true },
        { scale: MajorScale.create('Cb'), clickable: false },
    ],
    [
        { scale: MajorScale.create('F#'), clickable: false },
        { scale: MajorScale.create('Gb'), clickable: true },
    ],
    [
        { scale: MajorScale.create('C#'), clickable: false },
        { scale: MajorScale.create('Db'), clickable: true },
    ],
    [{ scale: MajorScale.create('Ab'), clickable: true }],
    [{ scale: MajorScale.create('Eb'), clickable: true }],
    [{ scale: MajorScale.create('Bb'), clickable: true }],
    [{ scale: MajorScale.create('F'), clickable: true }],
    [{ scale: NaturalMinorScale.create('A'), clickable: true }],
    [{ scale: NaturalMinorScale.create('E'), clickable: true }],
    [{ scale: NaturalMinorScale.create('B'), clickable: true }],
    [{ scale: NaturalMinorScale.create('F#'), clickable: true }],
    [{ scale: NaturalMinorScale.create('C#'), clickable: true }],
    [
        { scale: NaturalMinorScale.create('G#'), clickable: true },
        { scale: NaturalMinorScale.create('Ab'), clickable: false },
    ],
    [
        { scale: NaturalMinorScale.create('D#'), clickable: false },
        { scale: NaturalMinorScale.create('Eb'), clickable: true },
    ],
    [
        { scale: NaturalMinorScale.create('A#'), clickable: false },
        { scale: NaturalMinorScale.create('Bb'), clickable: true },
    ],
    [{ scale: NaturalMinorScale.create('F'), clickable: true }],
    [{ scale: NaturalMinorScale.create('C'), clickable: true }],
    [{ scale: NaturalMinorScale.create('G'), clickable: true }],
    [{ scale: NaturalMinorScale.create('D'), clickable: true }],
];

export function ScaleInfo() {
    const [showHelp, setShowHelp] = useState(false);

    const navigate = useNavigate();

    const urlParams = useParams<{ scale: string }>();

    const activeScale = getScaleFormUrlParams(urlParams.scale!);

    function formatCircleButtons(
        scalesInCircleButtons: { scale: Scale; clickable: boolean }[][]
    ) {
        return scalesInCircleButtons.map((circleItem, idx) => {
            return (
                <MotionButton
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    className={styles.key}
                    key={idx}
                    variant={
                        circleItem
                            .filter((x) => x.clickable)[0]
                            .scale.format() === activeScale.format()
                            ? 'danger'
                            : _.intersection(
                                  _.flatten(activeScale.chords).map((x) =>
                                      x.format('short')
                                  ),
                                  circleItem.map((x) => x.scale.format('short'))
                              ).length > 0
                            ? 'secondary'
                            : 'light border border-2'
                    }
                    onClick={() =>
                        navigate(
                            getScaleUrl(
                                circleItem.filter((x) => x.clickable)[0].scale
                            )
                        )
                    }
                    active={
                        circleItem
                            .filter((x) => x.clickable)[0]
                            .scale.format() === activeScale.format()
                    }
                >
                    {circleItem.map((x, idx) => (
                        <div key={idx}>{x.scale.format()}</div>
                    ))}
                </MotionButton>
            );
        });
    }

    return (
        <Row>
            <h3 className="d-flex align-items-center">
                Circle of fifths
                <Button
                    variant="link"
                    className="p-0 ms-2"
                    onClick={() => setShowHelp(true)}
                >
                    <BsQuestionCircle size="1.5rem" />
                </Button>
            </h3>
            <Col xs={12} md={6}>
                <div className="mb-2">
                    <p>
                        You can choose a key by clicking on the corresponding
                        button in the circle.
                    </p>
                </div>
                <div className={styles.circleOfFifths}>
                    <div className={styles.circle + ' ' + styles.majorCircle}>
                        {formatCircleButtons(scalesInCircle.slice(0, 12))}
                        <div
                            className={styles.circle + ' ' + styles.minorCircle}
                        >
                            {formatCircleButtons(scalesInCircle.slice(12, 24))}
                        </div>
                    </div>
                </div>
            </Col>
            <Col xs={12} md={6}>
                <motion.div
                    key={activeScale.format()}
                    initial={{ rotateY: 180 }}
                    animate={{ rotateY: 0 }}
                    transition={{
                        duration: 0.3,
                    }}
                >
                    <p>Notes of the selected key on the keyboard.</p>
                    <div className="mb-3">
                        <Piano
                            highlightedNotes={activeScale.notes}
                            startOctave={activeScale == null ? 0 : undefined}
                            endOctave={activeScale == null ? 1 : undefined}
                        />
                    </div>

                    <div className="d-flex mb-3">
                        {activeScale.notes.map((note, index) => {
                            return (
                                <Card
                                    key={
                                        activeScale.format() + note.format(true)
                                    }
                                    className="flex-even"
                                >
                                    <Card.Header className="text-center">
                                        {index + 1}
                                    </Card.Header>
                                    <Card.Body className="text-center fw-bold text-truncate px-0">
                                        {note.format(false)}
                                    </Card.Body>
                                </Card>
                            );
                        })}
                    </div>

                    <p>The main chords of the selected key.</p>
                    <div className="d-flex mb-3">
                        {(activeScale instanceof MajorScale
                            ? ['I', 'ii', 'iii', 'IV', 'V', 'vi', 'vii']
                            : ['i', 'iidim', 'III', 'iv', 'v', 'VI', 'VII']
                        ).map((romanNum, idx) => (
                            <Card key={idx} className="flex-even">
                                <Card.Header className="text-center text-truncate">
                                    {romanNum}
                                </Card.Header>
                                <Card.Body className="text-center fw-bold text-truncate px-0">
                                    {activeScale.chords
                                        .map((x) => x[0])
                                        [idx].format()}
                                </Card.Body>
                            </Card>
                        ))}
                    </div>
                </motion.div>
            </Col>
            <Modal show={showHelp} onHide={() => setShowHelp(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Help</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    On this page you can get detailed information about any key.
                    For convenience, all keys are indicated on the interactive
                    quarto-quint circle. The circle of fifths is a way of
                    depicting major and minor keys. On the outer side of the
                    circle are major keys, on the inner side are parallel minor
                    ones. The note following the tonic clockwise on the circle
                    is the dominant. And the subdominant is the next note on the
                    circle counterclockwise.
                </Modal.Body>
            </Modal>
        </Row>
    );
}
