import { motion } from "framer-motion";
import _ from "lodash";
import { useState } from "react";
import { Button, Col, Modal, Row } from "react-bootstrap";
import { BsQuestionCircle } from "react-icons/bs";
import {
  Navigate,
  useNavigate,
  useParams,
  useRouteError,
} from "react-router-dom";
import { n } from "../theory-utils/note";
import { Scale, scale } from "../theory-utils/scale";
import { getScaleFormUrlParams, ScaleParamError } from "../utils/url";
import styles from "./Circle.module.scss";
import { ScaleInfo } from "./ScaleInfo";

const MotionButton = motion(Button);

const scalesInCircle: { scale: Scale; clickable: boolean }[][] = [
  [{ scale: scale(n("C"), "Major"), clickable: true }],
  [{ scale: scale(n("G"), "Major"), clickable: true }],
  [{ scale: scale(n("D"), "Major"), clickable: true }],
  [{ scale: scale(n("A"), "Major"), clickable: true }],
  [{ scale: scale(n("E"), "Major"), clickable: true }],
  [
    { scale: scale(n("B"), "Major"), clickable: true },
    { scale: scale(n("C", "b"), "Major"), clickable: false },
  ],
  [
    { scale: scale(n("F", "#"), "Major"), clickable: false },
    { scale: scale(n("G", "b"), "Major"), clickable: true },
  ],
  [
    { scale: scale(n("C", "#"), "Major"), clickable: false },
    { scale: scale(n("D", "b"), "Major"), clickable: true },
  ],
  [{ scale: scale(n("A", "b"), "Major"), clickable: true }],
  [{ scale: scale(n("E", "b"), "Major"), clickable: true }],
  [{ scale: scale(n("B", "b"), "Major"), clickable: true }],
  [{ scale: scale(n("F"), "Major"), clickable: true }],
  [{ scale: scale(n("A"), "Natural Minor"), clickable: true }],
  [{ scale: scale(n("E"), "Natural Minor"), clickable: true }],
  [{ scale: scale(n("B"), "Natural Minor"), clickable: true }],
  [
    {
      scale: scale(n("F", "#"), "Natural Minor"),
      clickable: true,
    },
  ],
  [
    {
      scale: scale(n("C", "#"), "Natural Minor"),
      clickable: true,
    },
  ],
  [
    {
      scale: scale(n("G", "#"), "Natural Minor"),
      clickable: true,
    },
    {
      scale: scale(n("A", "b"), "Natural Minor"),
      clickable: false,
    },
  ],
  [
    {
      scale: scale(n("D", "#"), "Natural Minor"),
      clickable: false,
    },
    {
      scale: scale(n("E", "b"), "Natural Minor"),
      clickable: true,
    },
  ],
  [
    {
      scale: scale(n("A", "#"), "Natural Minor"),
      clickable: false,
    },
    {
      scale: scale(n("B", "b"), "Natural Minor"),
      clickable: true,
    },
  ],
  [{ scale: scale(n("F"), "Natural Minor"), clickable: true }],
  [{ scale: scale(n("C"), "Natural Minor"), clickable: true }],
  [{ scale: scale(n("G"), "Natural Minor"), clickable: true }],
  [{ scale: scale(n("D"), "Natural Minor"), clickable: true }],
];

export function Circle() {
  const [showHelp, setShowHelp] = useState(false);

  const navigate = useNavigate();

  const urlParams = useParams<{ scale: string }>();

  const activeScale = getScaleFormUrlParams(urlParams.scale!);

  function formatCircleButtons(
    scalesInCircleButtons: { scale: Scale; clickable: boolean }[][],
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
            circleItem.filter((x) => x.clickable)[0].scale.format() ===
            activeScale.format()
              ? "danger"
              : _.intersection(
                    _.flatten(activeScale.chords).map((x) => x.format("short")),
                    circleItem.map((x) => x.scale.format("short")),
                  ).length > 0
                ? "secondary"
                : "light border border-2"
          }
          onClick={() =>
            navigate(
              "/circle/" +
                encodeURIComponent(
                  circleItem.filter((x) => x.clickable)[0].scale.format(),
                ),
            )
          }
          active={
            circleItem.filter((x) => x.clickable)[0].scale.format() ===
            activeScale.format()
          }
        >
          {circleItem.map((x, idx) => (
            <div key={idx}>{x.scale.format("short")}</div>
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
            You can choose a key by clicking on the corresponding button in the
            circle.
          </p>
        </div>
        <div className={styles.circleOfFifths}>
          <div className={styles.circle + " " + styles.majorCircle}>
            {formatCircleButtons(scalesInCircle.slice(0, 12))}
            <div className={styles.circle + " " + styles.minorCircle}>
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

export function CircleErrorElement() {
  const error = useRouteError();
  if (error instanceof ScaleParamError) {
    return <Navigate to="/circle" />;
  }
  return null;
}
