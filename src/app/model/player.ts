import { useReducer } from 'react'

import { imageOriginPath } from '@/utils/consts'
import { SlideType } from '@/utils/types'
import { Nullable } from '@/utils/utils'

type Portions = {
  slideNumber: number
  textPortions: string[]
}

type State = {
  audio: Nullable<HTMLAudioElement>
  audioIsPlaying: boolean
  currentSlide: number
  currentSlidePart: number
  currentTime: number
  isPlaying: boolean
  isVolumeOn: boolean
  slides: Array<Portions & SlideType>
  videoTimeLength: Nullable<number>
}

type Action =
  | { payload: Nullable<HTMLAudioElement>; type: 'SET_AUDIO' }
  | { payload: SlideType[]; type: 'SET_SLIDES' }
  | { payload: boolean; type: 'SET_AUDIO_IS_PLAYING' }
  | { payload: number; type: 'SET_CURRENT_SLIDE' }
  | { payload: number; type: 'SET_CURRENT_SLIDE_PART' }
  | { payload: number; type: 'SET_CURRENT_TIME' }
  | { type: 'SET_NEXT_SLIDE' }
  | { type: 'TOGGLE_IS_PLAYING' }
  | { type: 'TOGGLE_VOLUME' }

const initialState = {
  audio: null,
  audioIsPlaying: false,
  currentSlide: 0,
  currentSlidePart: 0,
  currentTime: 0,
  isPlaying: false,
  isVolumeOn: true,
  slides: [],
  videoTimeLength: null,
}

const reducer = (state: State = initialState, action: Action): State => {
  switch (action.type) {
    case 'SET_SLIDES':
      return {
        ...state,
        slides: action.payload.map((item, idx) => {
          return {
            ...item,
            slideNumber: idx,
            textPortions: item.text.split('\n'),
          }
        }, []),
        videoTimeLength: action.payload.reduce((acc, cur) => {
          return acc + cur.duration
        }, 0),
      }
    case 'TOGGLE_IS_PLAYING':
      if (state.audio && state.isPlaying) {
        state.audio.pause()
      } else if (state.audio) {
        state.audio.play()
      }

      return { ...state, isPlaying: !state.isPlaying }
    case 'TOGGLE_VOLUME':
      if (state.audio && state.isVolumeOn) {
        state.audio.volume = 0
      } else if (state.audio) {
        state.audio.volume = 1
      }

      return { ...state, isVolumeOn: !state.isVolumeOn }
    case 'SET_CURRENT_SLIDE':
      return { ...state, currentSlide: action.payload, currentSlidePart: 0 }
    case 'SET_CURRENT_SLIDE_PART':
      return { ...state, currentSlidePart: action.payload }
    case 'SET_NEXT_SLIDE':
      if (state.audio) {
        state.audio.setAttribute(
          'src',
          `${imageOriginPath}${state.slides[state.currentSlide + 1]?.voiceOver}`
        )
        state.audio.load()
        state.audio.play()
      }

      return {
        ...state,
        currentSlide: state.currentSlide + 1,
      }
    case 'SET_CURRENT_TIME':
      return { ...state, currentTime: action.payload }
    case 'SET_AUDIO':
      return { ...state, audio: action.payload }
    case 'SET_AUDIO_IS_PLAYING':
      if (state.audio) {
        state.audio.play()
      }

      return { ...state, audioIsPlaying: action.payload }
  }
}

export const usePlayer = () => {
  const [state, dispatch] = useReducer(reducer, initialState)

  return { dispatch, state }
}
