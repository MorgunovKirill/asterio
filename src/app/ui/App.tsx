import { useCallback, useEffect, useState } from 'react'

import { imageOriginPath } from '@/utils/consts'
import { SlideType } from '@/utils/types'
import { Nullable } from '@/utils/utils'
import PauseCircleFilledIcon from '@mui/icons-material/PauseCircleFilled'
import PlayCircleFilledIcon from '@mui/icons-material/PlayCircleFilled'
import VolumeOffIcon from '@mui/icons-material/VolumeOff'
import VolumeUpIcon from '@mui/icons-material/VolumeUp'

import s from './App.module.scss'

// import { getData } from '@/app/api/api'
import slidesData from '../../data/data.json'

export const App = () => {
  const [slides, setSlides] = useState<Array<SlideType>>([])
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [audio, setAudio] = useState<Nullable<HTMLAudioElement>>(null)
  const [isVolumeOn, setIsVolumeOn] = useState(true)

  // CORS ошибка , поэтому использвую данные из файла
  // useEffect(() => {
  //   getData()
  //     .then(response => response.json())
  //     .then(data => setSlides(data.sentences))
  // }, [])

  const nextSlide = useCallback(() => {
    setCurrentSlide(prev => {
      return (prev + 1) % slides.length
    })
  }, [slides.length, currentSlide])

  const toggleVolume = () => {
    setIsVolumeOn(prev => !prev)
  }

  const playAudio = () => {
    if (audio) {
      audio.play()
    }
  }

  const pauseAudio = () => {
    if (audio) {
      audio.pause()
    }
  }

  const togglePlay = () => {
    setIsPlaying(prev => !prev)
    if (isPlaying) {
      pauseAudio()
    } else {
      playAudio()
    }
  }

  useEffect(() => {
    setSlides([...slidesData.sentences])
  }, [])

  useEffect(() => {
    if (slides.length > 0) {
      const newAudio = new Audio(`${imageOriginPath}${slides[currentSlide]?.voiceOver}`)

      setAudio(newAudio)
    }
  }, [currentSlide, slides])

  useEffect(() => {
    if (isPlaying && audio) {
      playAudio()
    }
  }, [currentSlide, isPlaying, audio])

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>

    if (isPlaying) {
      const duration = slides[currentSlide]?.duration || 3000

      interval = setTimeout(nextSlide, duration)
    }

    return () => clearTimeout(interval)
  }, [nextSlide, isPlaying, slides])

  return (
    <div className={s.container}>
      {slides.length > 0 ? (
        <div className={s.player}>
          <div className={s.imageContainer}>
            <img
              alt={'slide image'}
              src={`${imageOriginPath}${slides[currentSlide]?.image}`}
              style={{ height: 'auto', maxWidth: '100%' }}
            />
            {/*<audio className={s.audio} controls>*/}
            {/*  <source*/}
            {/*    src={`${imageOriginPath}${slides[currentSlide]?.voiceOver}`}*/}
            {/*    type={'audio/mp3'}*/}
            {/*  />*/}
            {/*</audio>*/}
          </div>
          <p className={s.subTitle}>{slides[currentSlide]?.text}</p>
          <div className={s.controls}>
            <div className={s.playBlock}>
              <button className={s.playBtn} onClick={togglePlay} type={'button'}>
                {isPlaying ? <PauseCircleFilledIcon /> : <PlayCircleFilledIcon />}
              </button>
            </div>
            <div className={s.optionsBlock}>
              <button className={s.volumeBtn} onClick={toggleVolume} type={'button'}>
                {isVolumeOn ? <VolumeUpIcon /> : <VolumeOffIcon />}
              </button>
            </div>
          </div>
        </div>
      ) : (
        <p>Loading video...</p>
      )}
    </div>
  )
}
