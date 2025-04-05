import { motion } from 'framer-motion';
import _ from 'lodash';
import { Button } from 'react-bootstrap';
import { n } from '../theory-utils/note';
import { Scale, scale } from '../theory-utils/scale';
import styles from './CircleOfFifths.module.scss';

const MotionButton = motion(Button);

const scalesInCircle: { scale: Scale; clickable: boolean }[][] = [
  [{ scale: scale(n('C'), 'Major'), clickable: true }],
  [{ scale: scale(n('G'), 'Major'), clickable: true }],
  [{ scale: scale(n('D'), 'Major'), clickable: true }],
  [{ scale: scale(n('A'), 'Major'), clickable: true }],
  [{ scale: scale(n('E'), 'Major'), clickable: true }],
  [
    { scale: scale(n('B'), 'Major'), clickable: true },
    { scale: scale(n('C', 'b'), 'Major'), clickable: false },
  ],
  [
    { scale: scale(n('F', '#'), 'Major'), clickable: false },
    { scale: scale(n('G', 'b'), 'Major'), clickable: true },
  ],
  [
    { scale: scale(n('C', '#'), 'Major'), clickable: false },
    { scale: scale(n('D', 'b'), 'Major'), clickable: true },
  ],
  [{ scale: scale(n('A', 'b'), 'Major'), clickable: true }],
  [{ scale: scale(n('E', 'b'), 'Major'), clickable: true }],
  [{ scale: scale(n('B', 'b'), 'Major'), clickable: true }],
  [{ scale: scale(n('F'), 'Major'), clickable: true }],
  [{ scale: scale(n('A'), 'Natural Minor'), clickable: true }],
  [{ scale: scale(n('E'), 'Natural Minor'), clickable: true }],
  [{ scale: scale(n('B'), 'Natural Minor'), clickable: true }],
  [
    {
      scale: scale(n('F', '#'), 'Natural Minor'),
      clickable: true,
    },
  ],
  [
    {
      scale: scale(n('C', '#'), 'Natural Minor'),
      clickable: true,
    },
  ],
  [
    {
      scale: scale(n('G', '#'), 'Natural Minor'),
      clickable: true,
    },
    {
      scale: scale(n('A', 'b'), 'Natural Minor'),
      clickable: false,
    },
  ],
  [
    {
      scale: scale(n('D', '#'), 'Natural Minor'),
      clickable: false,
    },
    {
      scale: scale(n('E', 'b'), 'Natural Minor'),
      clickable: true,
    },
  ],
  [
    {
      scale: scale(n('A', '#'), 'Natural Minor'),
      clickable: false,
    },
    {
      scale: scale(n('B', 'b'), 'Natural Minor'),
      clickable: true,
    },
  ],
  [{ scale: scale(n('F'), 'Natural Minor'), clickable: true }],
  [{ scale: scale(n('C'), 'Natural Minor'), clickable: true }],
  [{ scale: scale(n('G'), 'Natural Minor'), clickable: true }],
  [{ scale: scale(n('D'), 'Natural Minor'), clickable: true }],
];

interface CircleOfFifthsProps {
  scale?: Scale;
  highlightNear?: boolean;
  onScaleClick?: (scale: Scale) => void;
}

export function CircleOfFifths(props: CircleOfFifthsProps) {
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
            props.scale?.format()
              ? 'danger'
              : props.highlightNear &&
                  _.intersection(
                    _.flatten(props.scale?.chords).map((x) =>
                      x.format('short'),
                    ),
                    circleItem.map((x) => x.scale.format('short')),
                  ).length > 0
                ? 'secondary'
                : 'light border border-2'
          }
          onClick={() => {
            if (props.onScaleClick != null) {
              props.onScaleClick(
                circleItem.filter((x) => x.clickable)[0].scale,
              );
            }
          }}
          active={
            circleItem.filter((x) => x.clickable)[0].scale.format() ===
            props.scale?.format()
          }
        >
          {circleItem.map((x, idx) => (
            <div key={idx}>{x.scale.format('short')}</div>
          ))}
        </MotionButton>
      );
    });
  }

  return (
    <div className={styles.circleOfFifths}>
      <div className={styles.circle + ' ' + styles.majorCircle}>
        {formatCircleButtons(scalesInCircle.slice(0, 12))}
        <div className={styles.circle + ' ' + styles.minorCircle}>
          {formatCircleButtons(scalesInCircle.slice(12, 24))}
        </div>
      </div>
    </div>
  );
}
