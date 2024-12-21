import { useReducer } from 'react'

import { imageOriginPath } from '@/utils/consts'
import { SlideType } from '@/utils/types'
import { Nullable } from '@/utils/utils'

const initialState = {
  audio: null,
  audioIsPlaying: false,
  currentSlide: 0,
  currentTime: 0,
  isPlaying: false,
  isVolumeOn: true,
  slides: [],
  videoTimeLength: null,
}

type State = {
  audio: Nullable<HTMLAudioElement>
  audioIsPlaying: boolean
  currentSlide: number
  currentTime: number
  isPlaying: boolean
  isVolumeOn: boolean
  slides: SlideType[]
  videoTimeLength: Nullable<number>
}

type Action =
  | { payload: Nullable<HTMLAudioElement>; type: 'SET_AUDIO' }
  | { payload: SlideType[]; type: 'SET_SLIDES' }
  | { payload: boolean; type: 'SET_AUDIO_IS_PLAYING' }
  | { payload: number; type: 'SET_CURRENT_SLIDE' }
  | { payload: number; type: 'SET_CURRENT_TIME' }
  | { type: 'SET_NEXT_SLIDE' }
  | { type: 'TOGGLE_IS_PLAYING' }
  | { type: 'TOGGLE_VOLUME' }

const reducer = (state: State = initialState, action: Action): State => {
  switch (action.type) {
    case 'SET_SLIDES':
      return {
        ...state,
        slides: action.payload,
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
      return { ...state, currentSlide: action.payload }
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
