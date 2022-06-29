import propTypes from 'prop-types'
import styled from '@emotion/styled'
import { isMobile } from 'react-device-detect'
import { BackgroundLoading, Slider } from '../..'

const makeImageUrl = (images) => {
  return images.find(
    (i) => i.type === (isMobile ? 'SECONDARY_IMAGE' : 'FEATURED_IMAGE')
  ).url
}

const makeSlides = (items) => {
  if (!items || !items.length) return null
  return items.map((i) => ({
    ...i,
    imageUrl: makeImageUrl(i.images),
  }))
}

const GuestSliderView = styled.div`
  flex: 1;
  width: 100%;
  display: flex;
  padding: 0 ${(props) => props.theme.layout.padding};
  @media (max-width: ${(props) => props.theme.breakpoints.mobile}) {
    padding: 0 ${(props) => props.theme.layout.paddingMobile};
  }
`

const GuestSlider = ({ announcements, style }) => {
  const { settings, entities, loading, error } = announcements || {}
  const slides = error ? null : makeSlides(entities)
  const isLoading = loading === 'pending'

  if (!slides) return null

  return (
    <GuestSliderView style={style}>
      {isLoading ? (
        <BackgroundLoading />
      ) : slides ? (
        <Slider settings={settings} slides={slides} />
      ) : null}
    </GuestSliderView>
  )
}

GuestSlider.displayName = 'GuestSlider'
GuestSlider.propTypes = {
  announcements: propTypes.object,
  style: propTypes.object,
}

export default GuestSlider
