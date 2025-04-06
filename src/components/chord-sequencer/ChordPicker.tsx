import { Button, ButtonGroup, Col, Row } from 'react-bootstrap';
import { CircleOfFifths } from '../CircleOfFifths';
import { Chord } from '../../theory-utils/chord';
import { BsXLg } from 'react-icons/bs';
import { Scale } from '../../theory-utils/scale';
import _ from 'lodash';

interface ChordPickerProps {
  setShow?: (show: boolean) => void;
  editedChord?: Chord;
  onChordClick: (chord?: Chord) => void;
}

export function ChordPicker(props: ChordPickerProps) {
  function handleInvertClick(inversion: number) {
    if (props.editedChord != null) {
      const newChord = _.cloneDeep(props.editedChord);
      console.log(props.editedChord.tonic.octave, newChord.tonic.octave);
      newChord.inversion = inversion;
      props.onChordClick(newChord);
    }
  }
  function handleOctaveClick(octave: number) {
    if (props.editedChord != null) {
      const newChord = _.cloneDeep(props.editedChord);
      newChord.tonic.octave = octave;
      props.onChordClick(newChord);
    }
  }
  return (
    <div className="d-flex flex-column align-items-start gap-1">
      <div className="fw-bold">{props.editedChord?.format('long')}</div>
      <Button
        variant="outline-danger"
        onClick={() => {
          props.onChordClick(undefined);
        }}
        size="sm"
      >
        <BsXLg /> Clear chord
      </Button>
      <Row>
        <Col xs="auto">
          <CircleOfFifths
            scale={
              props.editedChord != null
                ? new Scale(
                    props.editedChord.tonic,
                    props.editedChord.name === 'Major'
                      ? 'Major'
                      : 'Natural Minor',
                  )
                : undefined
            }
            onScaleClick={(scale) => {
              props.onChordClick(
                new Chord(
                  scale.tonic,
                  scale.name === 'Major' ? 'Major' : 'Minor',
                ),
              );
            }}
            style={{ width: 400 }}
          />
        </Col>
        <Col className="d-flex flex-column align-items-start gap-3">
          <div>
            <div>Inversion</div>
            <ButtonGroup size="sm">
              {[-2, -1, 0, 1, 2].map((inversion) => (
                <Button
                  variant="outline-secondary"
                  className={`${props.editedChord != null && props.editedChord.inversion === inversion ? 'bg-secondary text-light' : ''}`}
                  onClick={() => handleInvertClick(inversion)}
                >
                  {inversion}
                </Button>
              ))}
            </ButtonGroup>
          </div>
          <div>
            <div>Octave</div>
            <ButtonGroup size="sm">
              {[2, 3, 4, 5, 6].map((octave) => (
                <Button
                  variant="outline-secondary"
                  className={`${props.editedChord != null && props.editedChord.tonic.octave === octave ? 'bg-secondary text-light' : ''}`}
                  onClick={() => handleOctaveClick(octave)}
                >
                  {octave}
                </Button>
              ))}
            </ButtonGroup>
          </div>
        </Col>
      </Row>
    </div>
  );
}
