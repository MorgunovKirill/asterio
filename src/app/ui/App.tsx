import { useCallback, useEffect, useState } from 'react'

import { imageOriginPath } from '@/utils/consts'
import { SlideType } from '@/utils/types'
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
  const [isVolumeOn, setIsVolumeOn] = useState(true)
  const slideInterval = 3000

  // CORS ошибка , поэтому использвую данные из файла
  // useEffect(() => {
  //   getData()
  //     .then(response => response.json())
  //     .then(data => setSlides(data.sentences))
  // }, [])

  const nextSlide = useCallback(() => {
    setCurrentSlide(prev => (prev + 1) % slides.length)
    console.log('currentSlide', currentSlide)
  }, [slides.length, currentSlide])

  const togglePlay = () => {
    setIsPlaying(prev => !prev)
  }

  const toggleVolume = () => {
    setIsVolumeOn(prev => !prev)
  }

  // const playAudio = (text: string) => {
  //   const utterance = new SpeechSynthesisUtterance(text)
  //
  //   speechSynthesis.speak(utterance)
  // }

  useEffect(() => {
    setSlides([...slidesData.sentences])
  }, [])

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>

    if (isPlaying) {
      interval = setInterval(nextSlide, slideInterval)
      // if (slides.length > 0) {
      //   playAudio(slides[currentSlide]?.text)
      // }
    } else {
      clearInterval(interval)
    }

    return () => clearInterval(interval)
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
                {isVolumeOn ? <VolumeOffIcon /> : <VolumeUpIcon />}
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
