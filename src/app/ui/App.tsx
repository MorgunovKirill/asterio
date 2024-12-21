import { useCallback, useEffect } from 'react'

import { usePlayer } from '@/app/model/player'
import { imageOriginPath } from '@/utils/consts'
import PauseCircleFilledIcon from '@mui/icons-material/PauseCircleFilled'
import PlayCircleFilledIcon from '@mui/icons-material/PlayCircleFilled'
import VolumeOffIcon from '@mui/icons-material/VolumeOff'
import VolumeUpIcon from '@mui/icons-material/VolumeUp'

import s from './App.module.scss'

// import { getData } from '@/app/api/api'
import slidesData from '../../data/data.json'

export const App = () => {
  // const [slides, setSlides] = useState<Array<SlideType>>([])
  // const [currentSlide, setCurrentSlide] = useState(0)
  // const [isPlaying, setIsPlaying] = useState(false)
  // const [audio, setAudio] = useState<Nullable<HTMLAudioElement>>(null)
  // const [isVolumeOn, setIsVolumeOn] = useState(true)

  // CORS ошибка , поэтому использвую данные из файла
  // useEffect(() => {
  //   getData()
  //     .then(response => response.json())
  //     .then(data => setSlides(data.sentences))
  // }, [])

  const { dispatch, state } = usePlayer()

  // const nextSlide = useCallback(() => {
  //   setCurrentSlide(prev => {
  //     return (prev + 1) % slides.length
  //   })
  // }, [slides.length])

  // const toggleVolume = () => {
  //   setIsVolumeOn(prev => !prev)
  // }

  // const playAudio = () => {
  //   if (audio) {
  //     audio.play()
  //   }
  // }
  //
  // const pauseAudio = () => {
  //   if (audio) {
  //     audio.pause()
  //   }
  // }

  // const togglePlay = () => {
  //   setIsPlaying(prev => !prev)
  //   if (isPlaying) {
  //     pauseAudio()
  //   } else {
  //     playAudio()
  //   }
  // }

  // useEffect(() => {
  //   setSlides([...slidesData.sentences])
  // }, [])
  //
  // useEffect(() => {
  //   if (slides.length > 0) {
  //     const newAudio = new Audio(`${imageOriginPath}${slides[currentSlide]?.voiceOver}`)
  //
  //     setAudio(newAudio)
  //   }
  // }, [currentSlide, slides])

  // useEffect(() => {
  //   if (isPlaying && audio) {
  //     playAudio()
  //   }
  // }, [currentSlide, isPlaying, audio])
  //
  // useEffect(() => {
  //   let interval: ReturnType<typeof setInterval>
  //
  //   if (isPlaying) {
  //     const duration = slides[currentSlide]?.duration || 3000
  //
  //     interval = setTimeout(nextSlide, duration)
  //   }
  //
  //   return () => clearTimeout(interval)
  // }, [nextSlide, isPlaying, slides])

  const nextSlide = useCallback(() => {
    dispatch({ type: 'SET_NEXT_SLIDE' })
  }, [dispatch])

  const toggleVolume = () => {
    dispatch({ type: 'TOGGLE_VOLUME' })
  }

  const playAudio = useCallback(() => {
    if (state.audio) {
      dispatch({ payload: true, type: 'SET_AUDIO_IS_PLAYING' })
      state.audio.play()
    }
  }, [dispatch, state.audio])

  const pauseAudio = () => {
    if (state.audio) {
      dispatch({ payload: false, type: 'SET_AUDIO_IS_PLAYING' })
      state.audio.pause()
    }
  }

  const togglePlay = () => {
    dispatch({ type: 'TOGGLE_IS_PLAYING' })
    if (state.isPlaying) {
      dispatch({ payload: false, type: 'SET_AUDIO_IS_PLAYING' })
      pauseAudio()
    } else {
      dispatch({ payload: true, type: 'SET_AUDIO_IS_PLAYING' })
      playAudio()
    }
  }

  useEffect(() => {
    // setSlides([...slidesData.sentences])
    dispatch({ payload: [...slidesData.sentences], type: 'SET_SLIDES' })
  }, [dispatch])

  useEffect(() => {
    if (state.slides.length > 0) {
      dispatch({
        payload: new Audio(`${imageOriginPath}${state.slides[state.currentSlide]?.voiceOver}`),
        type: 'SET_AUDIO',
      })
    }
  }, [dispatch, state.currentSlide, state.slides])

  useEffect(() => {
    if (state.isPlaying && state.audio) {
      playAudio()
    }
  }, [state.currentSlide, state.isPlaying, playAudio, state.audio])

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>

    if (state.isPlaying) {
      const duration = state.slides[state.currentSlide]?.duration || 3000

      interval = setTimeout(nextSlide, duration)
    }

    return () => clearTimeout(interval)
  }, [nextSlide, state.isPlaying, state.currentSlide, state.slides])

  return (
    <div className={s.container}>
      {state.slides.length > 0 ? (
        <div className={s.player}>
          <div className={s.imageContainer}>
            <img
              alt={'slide image'}
              src={`${imageOriginPath}${state.slides[state.currentSlide]?.image}`}
              style={{ height: 'auto', maxWidth: '100%' }}
            />
          </div>
          <p className={s.subTitle}>{state.slides[state.currentSlide]?.text}</p>
          <div className={s.controls}>
            <div className={s.playBlock}>
              <button className={s.playBtn} onClick={togglePlay} type={'button'}>
                {state.isPlaying ? <PauseCircleFilledIcon /> : <PlayCircleFilledIcon />}
              </button>
            </div>
            <div className={s.optionsBlock}>
              <button className={s.volumeBtn} onClick={toggleVolume} type={'button'}>
                {state.isVolumeOn ? <VolumeUpIcon /> : <VolumeOffIcon />}
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

//
// <div className={s.container}>
//   {slides.length > 0 ? (
//       <div className={s.player}>
//         <div className={s.imageContainer}>
//           <img
//               alt={'slide image'}
//               src={`${imageOriginPath}${slides[currentSlide]?.image}`}
//               style={{height: 'auto', maxWidth: '100%'}}
//           />
//         </div>
//         <p className={s.subTitle}>{slides[currentSlide]?.text}</p>
//         <div className={s.controls}>
//           <div className={s.playBlock}>
//             <button className={s.playBtn} onClick={togglePlay} type={'button'}>
//               {isPlaying ? <PauseCircleFilledIcon/> : <PlayCircleFilledIcon/>}
//             </button>
//           </div>
//           <div className={s.optionsBlock}>
//             <button className={s.volumeBtn} onClick={toggleVolume} type={'button'}>
//               {isVolumeOn ? <VolumeUpIcon/> : <VolumeOffIcon/>}
//             </button>
//           </div>
//         </div>
//       </div>
//   ) : (
//       <p>Loading video...</p>
//   )}
// </div>
