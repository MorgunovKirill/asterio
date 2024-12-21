import { useReducer } from 'react'

import { SlideType } from '@/utils/types'
import { Nullable } from '@/utils/utils'

const initialState = {
  audio: null,
  audioIsPlaying: false,
  currentSlide: 0,
  isPlaying: false,
  isVolumeOn: true,
  slides: [],
}

type State = {
  audio: Nullable<HTMLAudioElement>
  audioIsPlaying: boolean
  currentSlide: number
  isPlaying: boolean
  isVolumeOn: boolean
  slides: SlideType[]
}

type Action =
  | { payload: Nullable<HTMLAudioElement>; type: 'SET_AUDIO' }
  | { payload: SlideType[]; type: 'SET_SLIDES' }
  | { payload: boolean; type: 'SET_AUDIO_IS_PLAYING' }
  | { payload: number; type: 'SET_CURRENT_SLIDE' }
  | { type: 'SET_NEXT_SLIDE' }
  | { type: 'TOGGLE_IS_PLAYING' }
  | { type: 'TOGGLE_VOLUME' }

const reducer = (state: State = initialState, action: Action): State => {
  switch (action.type) {
    case 'SET_SLIDES':
      return { ...state, slides: action.payload }
    case 'TOGGLE_IS_PLAYING':
      return { ...state, isPlaying: !state.isPlaying }
    case 'TOGGLE_VOLUME':
      return { ...state, isVolumeOn: !state.isVolumeOn }
    case 'SET_CURRENT_SLIDE':
      return { ...state, currentSlide: action.payload }
    case 'SET_NEXT_SLIDE':
      if (state.audio) {
        state.audio.pause()
        state.audio.currentTime = 0
      }

      return { ...state, currentSlide: state.currentSlide + 1 }
    case 'SET_AUDIO':
      return { ...state, audio: action.payload }
    case 'SET_AUDIO_IS_PLAYING':
      return { ...state, audioIsPlaying: action.payload }
  }
}

export const usePlayer = () => {
  const [state, dispatch] = useReducer(reducer, initialState)

  return { dispatch, state }
}
