import { motion } from 'framer-motion';
import _ from 'lodash';
import { useState } from 'react';
import { Button, Col, Modal, Row } from 'react-bootstrap';
import { BsQuestionCircle } from 'react-icons/bs';
import { getScaleFormUrlParams } from '../utils/url';
import { ScaleInfo } from './ScaleInfo';
import { useLocation, useParams } from 'wouter';
import { CircleOfFifths } from './CircleOfFifths';

export function Circle() {
  const [showHelp, setShowHelp] = useState(false);
  const [, navigate] = useLocation();

  const urlParams = useParams<{ scale: string }>();

  const activeScale = getScaleFormUrlParams(urlParams.scale!);

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
            You can choose a key by clicking on the corresponding button in the
            circle.
          </p>
        </div>
        <CircleOfFifths
          onScaleClick={(scale) =>
            navigate('/circle/' + encodeURIComponent(scale.format()))
          }
          scale={activeScale}
          highlightNear
        />
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
          <ScaleInfo scale={activeScale} />
        </motion.div>
      </Col>
      <Modal show={showHelp} onHide={() => setShowHelp(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Help</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          On this page you can get detailed information about any key. For
          convenience, all keys are indicated on the interactive quarto-quint
          circle. The circle of fifths is a way of depicting major and minor
          keys. On the outer side of the circle are major keys, on the inner
          side are parallel minor ones. The note following the tonic clockwise
          on the circle is the dominant. And the subdominant is the next note on
          the circle counterclockwise.
        </Modal.Body>
      </Modal>
    </Row>
  );
}
