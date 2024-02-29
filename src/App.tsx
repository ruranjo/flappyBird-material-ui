import { Box, SxProps, Typography } from '@mui/material';

import React, { useEffect, useState } from 'react'
import { bgGagme, bird, pipe } from './utils/assets';
import { emojis } from './utils/emojis';


export interface styledApp {
  containerStyle: SxProps;
  background: SxProps;
  startboard: SxProps;
  obj: SxProps;
  bird: SxProps;
  score: SxProps;
  scoreContainer: SxProps;
}

const appStyle: styledApp = {
  containerStyle:{
      height: '100vh',
      
      display: 'flex',
      flexDirection:'column',
      justifyContent: 'center',
      alignItems: 'center',
    '@media screen and (max-width: 440px)': {
      
    },
  },
  background:{
    border: '2px solid black',
    backgroundImage: `url(${bgGagme})`,
    backgroundRepeat: 'no-repeat',
    position: 'relative',
    overflow: 'hidden',
    
    '@media screen and (max-width: 440px)': {
      
    },
  },
  startboard:{
    fontFamily: '"Bebas Neue", sans-serif',

    position: 'relative',
    top: '49%',
    backgroundColor: 'black',
    padding: '10px',
    width: '100px',
    left: '50%',
    marginLeft: '-50px',
    textAlign: 'center',
    fontSize: '20px',
    letterSpacing: '5px',
    borderRadius: '10px',
    color: '#fff',
    fontWeight: 600,
  },
  obj:{
    position: 'relative',
    backgroundImage: `url(${pipe})`,
  },

  bird:{
    position: 'absolute',
    backgroundImage: `url(${bird})`,
    backgroundRepeat: 'no-repeat',
   
  },
  score:{
    fontSize:'2rem',
    fontFamily: '"Bebas Neue", sans-serif',
  },
  scoreContainer:{
    display: 'flex',
    backgroundColor:'black',
    color:'white',
    justifyContent: 'space-around',
    alignItems: 'center',
    width:'400px',

  }

}


export interface Props {

}

const BIRD_HEIGHT = 40;
const BIRD_WIDTH = 40;
const WALL_HEIGHT = 600;
const WALL_WIDTH = 400;//400
const GRAVITY = 8;
const OBJ_WIDTH = 52;
const OBJ_SPEED = 6;
const OBJ_GAP = 200;



const App:React.FC<Props> = () => {
  const [isStart, setIsStart] = useState(false);
  const [birdpos, setBirspos] = useState(300);
  const [objHeight, setObjHeight] = useState(0);
  const [objPos, setObjPos] = useState(WALL_WIDTH);
  const [score, setScore] = useState(0);

  useEffect(() => {
    let intVal: number;

    if (isStart && birdpos < WALL_HEIGHT - BIRD_HEIGHT) {
      intVal = setInterval(() => {
        setBirspos((prevBirdpos) => prevBirdpos + GRAVITY);
      }, 24);
    }
    
    return () => clearInterval(intVal);
  });

  useEffect(() => {
    let objval: number;
    if (isStart && objPos >= -OBJ_WIDTH) {
      objval = setInterval(() => {
        setObjPos((objPos) => objPos - OBJ_SPEED);
      }, 24);

      return () => {
        clearInterval(objval);
      };

    } else {
      setObjPos(WALL_WIDTH);
      setObjHeight(Math.floor(Math.random() * (WALL_HEIGHT - OBJ_GAP)));
      if (isStart) setScore((score) => score + 1);
    }
  }, [isStart, objPos]);


  useEffect(() => {
    let topObj = birdpos >= 0 && birdpos < objHeight;
    let bottomObj =
      birdpos <= WALL_HEIGHT &&
      birdpos >=
        WALL_HEIGHT - (WALL_HEIGHT - OBJ_GAP - objHeight) - BIRD_HEIGHT;

    if (
      objPos >= OBJ_WIDTH &&
      objPos <= OBJ_WIDTH + 80 &&
      (topObj || bottomObj)
    ) {
      setIsStart(false);
      setBirspos(300);
      setScore(0);
    }
    if(score === 99){
      setScore(0);
    }
  }, [isStart, birdpos, objHeight, objPos]);
  
  
  const handler = () => {
    if (!isStart) setIsStart(true);
    else if (birdpos < BIRD_HEIGHT) setBirspos(0);
    else setBirspos((birdpos) => birdpos - 80);
  };

  return (
    <Box sx={appStyle.containerStyle} onClick={handler}>
      <Box sx={appStyle.scoreContainer} >
        <Typography sx={appStyle.score} > BY:RURANJO </Typography>
        
        <Typography sx={appStyle.score} >{emojis[score].code}</Typography>
        <Typography sx={appStyle.score} > Score: {score}</Typography>
      </Box>
      <Box sx={
        {...appStyle.background,
         backgroundSize: `${WALL_WIDTH}px ${WALL_HEIGHT}px`,
         width: `${WALL_WIDTH}px`, height: `${WALL_HEIGHT}px`
        }}
      >
        {!isStart ? <Box sx={appStyle.startboard} >Click To Start</Box> : null}
        
        <Box sx={{...appStyle.obj, height: `${objHeight}px`,width:`${OBJ_WIDTH}px`,left:objPos,top:0, transform: `rotate(${180}deg)` }}
        ></Box>

        <Box sx={{...appStyle.bird,
        backgroundSize: `${BIRD_HEIGHT}px ${BIRD_WIDTH}px`,
        height: `${BIRD_HEIGHT}px`,
        width:`${BIRD_WIDTH}px`,
        left:100,
        top:birdpos}}
        ></Box>

        <Box sx={{...appStyle.obj,
         height: `${WALL_HEIGHT - OBJ_GAP - objHeight}px`,
         width:`${OBJ_WIDTH}px`,
         left:objPos,
         top: WALL_HEIGHT - (objHeight + (WALL_HEIGHT - OBJ_GAP - objHeight)),
         transform: `rotate(${0}deg)`
        }}
        ></Box>
      </Box>
    </Box>
  )
}

export default App

