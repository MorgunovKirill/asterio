import { useCallback, useEffect, useState } from 'react'

import { imageOriginPath } from '@/utils/consts'
import { SlideType } from '@/utils/types'

import s from './App.module.scss'

// import { getData } from '@/app/api/api'
import slidesData from '../../data/data.json'

export const App = () => {
  const [slides, setSlides] = useState<Array<SlideType>>([])
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
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
        <>
          <div className={s.imageContainer}>
            <img
              alt={'slide image'}
              src={`${imageOriginPath}${slides[currentSlide]?.image}`}
              style={{ height: 'auto', maxWidth: '100%' }}
            />
          </div>
          <p className={s.subTitle}>{slides[currentSlide]?.text}</p>
          <button className={s.playBtn} onClick={togglePlay}>
            {isPlaying ? 'Pause' : 'Play'}
          </button>
        </>
      ) : (
        <p>Loading slides...</p>
      )}
    </div>
  )
}
