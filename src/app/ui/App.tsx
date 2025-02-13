import { ChangeEvent, useCallback, useEffect, useRef, useState } from 'react'

import { usePlayer } from '@/app/model/player'
import { imageOriginPath } from '@/utils/consts'
import { Nullable, convertTime } from '@/utils/utils'
import FullscreenIcon from '@mui/icons-material/Fullscreen'
import FullscreenExitIcon from '@mui/icons-material/FullscreenExit'
import PauseCircleFilledIcon from '@mui/icons-material/PauseCircleFilled'
import PlayCircleFilledIcon from '@mui/icons-material/PlayCircleFilled'
import VolumeOffIcon from '@mui/icons-material/VolumeOff'
import VolumeUpIcon from '@mui/icons-material/VolumeUp'
import clsx from 'clsx'

import s from './App.module.scss'

// import { getData } from '@/app/api/api'
import slidesData from '../../data/data.json'

export const App = () => {
  // CORS ошибка , поэтому использвую данные из файла
  // useEffect(() => {
  //   getData()
  //     .then(response => response.json())
  //     .then(data => setSlides(data.sentences))
  // }, [])
  const [isFullWindowModeActive, setIsFullWindowModeActive] = useState(false)
  const videoPlayIntervalRef = useRef<Nullable<number>>(null)

  const { dispatch, state } = usePlayer()

  const nextSlide = useCallback(() => {
    dispatch({ type: 'SET_NEXT_SLIDE' })
  }, [dispatch])

  const playerClickHandler = (evt: any) => {
    if (!evt.target.closest('.controls') && !evt.target.closest('.timeBar')) {
      togglePlay()
    }
  }

  const toggleVolume = () => {
    dispatch({ type: 'TOGGLE_VOLUME' })
  }

  const toggleScreen = () => {
    setIsFullWindowModeActive(prevState => !prevState)
  }

  const togglePlay = () => {
    dispatch({ type: 'TOGGLE_IS_PLAYING' })
    if (state.isPlaying && videoPlayIntervalRef.current) {
      clearInterval(videoPlayIntervalRef.current)
      videoPlayIntervalRef.current = null
    }
  }

  const handleSeek = (evt: ChangeEvent<HTMLInputElement>) => {
    const targetValue = +evt.target.value
    let newSlide = 0
    let slideTimeSeekValue = 0

    for (let i = 0; i < state.slides.length; i++) {
      newSlide = state.slides[i].slideNumber

      if (targetValue < state.slides[i].slideTimePeriod) {
        const passedSlidesTimeAmount = state.slides.slice(0, newSlide).reduce((acc, cur) => {
          return acc + cur.duration
        }, 0)

        slideTimeSeekValue = state.slides[newSlide]?.duration - targetValue + passedSlidesTimeAmount

        break
      }
    }

    dispatch({ payload: { slide: newSlide, time: slideTimeSeekValue }, type: 'SET_CURRENT_SLIDE' })
    dispatch({ payload: targetValue, type: 'SET_CURRENT_TIME' })
  }

  useEffect(() => {
    dispatch({ payload: [...slidesData.sentences], type: 'SET_SLIDES' })
  }, [dispatch])

  useEffect(() => {
    if (state.slides.length > 0) {
      dispatch({
        payload: new Audio(`${imageOriginPath}${state.slides[0]?.voiceOver}`),
        type: 'SET_AUDIO',
      })
    }
  }, [dispatch, state.slides])

  useEffect(() => {
    let interval: ReturnType<typeof setTimeout>

    if (state.isPlaying) {
      const passedSlidesTimeAmount = state.slides
        .slice(0, state.currentSlide)
        .reduce((acc, cur) => {
          return acc + cur.duration
        }, 0)

      const duration =
        state.slides[state.currentSlide]?.duration - state.currentTime + passedSlidesTimeAmount

      interval = setTimeout(nextSlide, duration)
    }

    return () => clearTimeout(interval)
  }, [nextSlide, state.currentTime, state.isPlaying, state.currentSlide, state.slides])

  useEffect(() => {
    if (state.isPlaying) {
      const passedSlidesTimeAmount = [...state.slides]
        .slice(0, state.currentSlide)
        .reduce((acc, cur) => {
          return acc + cur.duration
        }, 0)

      videoPlayIntervalRef.current = window.setInterval(() => {
        dispatch({ payload: state.currentTime + 1000, type: 'SET_CURRENT_TIME' })
        const slidePortions = state.slides[state.currentSlide]?.textPortions.length

        if (slidePortions) {
          const slidePortionSize = state.slides[state.currentSlide].duration / slidePortions
          const currentPortion = Math.floor(
            (state.currentTime + 1000 - passedSlidesTimeAmount) / slidePortionSize
          )

          dispatch({
            payload: currentPortion,
            type: 'SET_CURRENT_SLIDE_PART',
          })
        } else {
          dispatch({
            payload: 0,
            type: 'SET_CURRENT_SLIDE_PART',
          })
        }
      }, 1000)
    } else if (videoPlayIntervalRef.current) {
      clearInterval(videoPlayIntervalRef.current)
      videoPlayIntervalRef.current = null
    }

    return () => {
      if (videoPlayIntervalRef.current) {
        clearInterval(videoPlayIntervalRef.current)
        videoPlayIntervalRef.current = null
      }
    }
  }, [state.isPlaying, state.currentSlide, state.slides, state.currentTime, dispatch])

  return (
    <div className={s.container}>
      {state.slides.length > 0 ? (
        <div
          className={clsx(s.player, isFullWindowModeActive ? s.fullMode : '')}
          onClick={playerClickHandler}
        >
          <div className={s.imageContainer}>
            <img
              alt={'slide image'}
              src={`${imageOriginPath}${state.slides[state.currentSlide]?.image}`}
              style={{ height: 'auto', maxWidth: '100%' }}
            />
          </div>
          <p className={s.subTitle}>
            {state.slides[state.currentSlide]?.textPortions[state.currentSlidePart]}
          </p>
          <div className={clsx(s.controls, 'controls')}>
            <div className={s.playBlock}>
              <button className={s.playBtn} onClick={togglePlay} type={'button'}>
                {state.isPlaying ? <PauseCircleFilledIcon /> : <PlayCircleFilledIcon />}
              </button>
              {state.videoTimeLength && (
                <div className={s.timeBlock}>
                  <span className={s.currentTime}>{convertTime(state.currentTime)}</span>
                  <span>/</span>
                  <span className={s.timeAmount}>{convertTime(state.videoTimeLength)}</span>
                </div>
              )}
            </div>
            <div className={s.optionsBlock}>
              <button className={s.volumeBtn} onClick={toggleVolume} type={'button'}>
                {state.isVolumeOn ? <VolumeUpIcon /> : <VolumeOffIcon />}
              </button>
              <button className={s.screenBtn} onClick={toggleScreen} type={'button'}>
                {isFullWindowModeActive ? <FullscreenExitIcon /> : <FullscreenIcon />}
              </button>
            </div>
          </div>
          {state.videoTimeLength && (
            <input
              className={clsx(s.timeBar, 'timeBar')}
              max={state.videoTimeLength}
              min={'0'}
              onChange={handleSeek}
              step={'0.1'}
              type={'range'}
              value={state.currentTime}
            />
          )}
        </div>
      ) : (
        <p>Loading video...</p>
      )}
    </div>
  )
}
