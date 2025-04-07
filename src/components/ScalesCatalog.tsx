import { ChangeEvent, useState } from 'react';
import { Button, Col, Form, Row } from 'react-bootstrap';
import { Letter } from '../theory-utils/letter';
import { Note, n } from '../theory-utils/note';
import { getScaleFromUrlParams } from '../utils/url';
import Piano from './Piano';
import { ScaleInfo } from './ScaleInfo';
import { Scale, ScaleName } from '../theory-utils/scale';
import { useSearchParams } from 'wouter';
import { motion } from 'motion/react';

const allScaleNames: ScaleName[] = [
  'Major',
  'Natural Minor',
  'Harmonic Minor',
  'Melodic Minor',
  'Major Pentatonic',
  'Minor Pentatonic',
];

export function ScalesCatalog() {
  const [searchParams, setSearchParams] = useSearchParams();
  const scaleParam = searchParams.get('scale');
  const activeScale = scaleParam
    ? getScaleFromUrlParams(scaleParam)
    : new Scale(n('C'), 'Major');

  const [useFlat, setUseFlat] = useState(activeScale.tonic.accidental === 'b');

  function handleUseFlatChange(e: ChangeEvent<HTMLInputElement>) {
    const checked = e.target.checked;
    setUseFlat(checked);
    if (activeScale.tonic.accidental !== '') {
      const letters: Letter[][] = [
        ['C', 'D'],
        ['D', 'E'],
        ['F', 'G'],
        ['G', 'A'],
        ['A', 'B'],
      ];
      const newLetter = letters.filter(
        (x) => x[checked ? 0 : 1] === activeScale.tonic.letter,
      )[0][checked ? 1 : 0];
      setSearchParams({
        scale:
          new Note(newLetter, checked ? 'b' : '#').format(false) +
          ' ' +
          activeScale.name,
      });
    }
  }

  return (
    <>
      <h3>Scale info</h3>
      <Row>
        <Col md={6}>
          <p>Select root note and scale name</p>
          <Row>
            <Col>
              <Piano
                highlightedNotes={[activeScale.tonic]}
                useFlats={useFlat}
                onNoteClick={(note) =>
                  setSearchParams({
                    scale: note.format(false) + ' ' + activeScale.name,
                  })
                }
                playSounds={true}
              />
            </Col>
            <Col>
              {allScaleNames.map((scaleName) => (
                <Button
                  key={scaleName}
                  className="w-100 mb-1"
                  variant={scaleName.includes('Minor') ? 'info' : 'warning'}
                  disabled={activeScale.name === scaleName}
                  onClick={() =>
                    setSearchParams({
                      scale: activeScale.tonic.format(false) + ' ' + scaleName,
                    })
                  }
                >
                  {scaleName}
                </Button>
              ))}
            </Col>
          </Row>
          <div className="d-flex">
            <h6 className="me-3">{activeScale.format()}</h6>
            <Form.Check
              type="switch"
              label="Use flats (b)"
              className="mb-1"
              checked={useFlat}
              onChange={handleUseFlatChange}
            />
          </div>
        </Col>
        <Col md={6}>
          <motion.div
            key={activeScale.format()}
            initial={{ rotateY: 180 }}
            animate={{ rotateY: 0 }}
            transition={{
              duration: 0.3,
            }}
          >
            <ScaleInfo scale={activeScale} />
          </motion.div>
        </Col>
      </Row>
    </>
  );
}
