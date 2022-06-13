import { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { isBrowser } from 'react-device-detect'
import styled from '@emotion/styled'
import {
  selectAnnouncementsPage,
  fetchAnnouncementPage,
} from '@open-tender/redux'
import { BackgroundImage, BackgroundContent } from '../..'
import AccountSection from './AccountSection'
import AccountSectionHeader from './AccountSectionHeader'
import { selectContent } from '../../../slices'
import AccountHero from './AccountHero'

const makeImageUrl = (images, isBrowser) => {
  return images.find(
    (i) => i.type === (isBrowser ? 'FEATURED_IMAGE' : 'SECONDARY_IMAGE')
  ).url
}

const makeSlides = (items) => {
  if (!items || !items.length) return null
  return items.map((i) => ({
    ...i,
    imageUrl: makeImageUrl(i.images, isBrowser),
  }))
}

const AccountAnnouncementsView = styled.div`
  label: AccountAnnouncementsView;

  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  @media (max-width: ${(props) => props.theme.breakpoints.mobile}) {
    padding: 0 ${(props) => props.theme.layout.paddingMobile} 0 0;
  }
`

const AccountAnnouncement = styled.div`
  label: Announcement;

  display: flex;
  width: 100%;
  border-radius: ${(props) => props.theme.border.radius};
  overflow: hidden;
  height: 36rem;
  margin: 0 0 ${(props) => props.theme.layout.padding};
  @media (max-width: ${(props) => props.theme.breakpoints.mobile}) {
    height: 24rem;
    margin: 0 0 ${(props) => props.theme.layout.paddingMobile};
  }
`

const AccountAnnouncements = () => {
  const dispatch = useDispatch()
  const { account } = useSelector(selectContent)
  const imageUrl = account ? account.mobile : null
  const announcements = useSelector(selectAnnouncementsPage('ACCOUNT'))
  const { settings, entities, loading, error } = announcements || {}
  const { title } = settings || {}
  const isLoading = loading === 'pending'
  const slides = isLoading || error ? null : makeSlides(entities)

  useEffect(() => {
    dispatch(fetchAnnouncementPage('ACCOUNT'))
  }, [dispatch])

  return slides ? (
    <AccountSection>
      {title ? (
        <AccountSectionHeader title={title} style={{ marginBottom: 12 }} />
      ) : null}
      <AccountAnnouncementsView>
        {slides.map((slide) => {
          return (
            <AccountAnnouncement key={slide.imageUrl}>
              <BackgroundImage {...slide}>
                <BackgroundContent {...slide} />
              </BackgroundImage>
            </AccountAnnouncement>
          )
        })}
      </AccountAnnouncementsView>
    </AccountSection>
  ) : imageUrl ? (
    <AccountHero imageUrl={imageUrl} />
  ) : null
}

AccountAnnouncements.displayName = 'AccountAnnouncements'
export default AccountAnnouncements