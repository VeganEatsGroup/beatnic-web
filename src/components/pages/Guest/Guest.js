import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { isBrowser } from 'react-device-detect'
import { Helmet } from 'react-helmet'
import styled from '@emotion/styled'
import {
  // selectAnnouncementsPage,
  fetchAnnouncementPage,
} from '@open-tender/redux'

import { selectConfig, closeModal, selectBrand } from '../../../slices'
import {
  Content,
  DealsSection,
  HeroSite,
  Main,
  PageContainer,
  HeaderSite,
} from '../..'

const GuestContent = styled('div')`
  line-height: ${(props) => props.theme.lineHeight};
  opacity: 0;
  animation: slide-up 0.25s ease-in-out 0.25s forwards;
  margin: 2.5rem 0;
  padding: 0 ${(props) => props.theme.layout.padding};
  @media (max-width: ${(props) => props.theme.breakpoints.tablet}) {
    margin: 2rem 0;
    padding: 0 ${(props) => props.theme.layout.paddingMobile};
    text-align: center;
  }

  p {
    margin: 0.5em 0;
    @media (max-width: ${(props) => props.theme.breakpoints.tablet}) {
      font-size: ${(props) => props.theme.fonts.sizes.small};
    }

    &:first-of-type {
      margin-top: 0;
    }

    &:last-of-type {
      margin-bottom: 0;
    }
  }
`

const Guest = () => {
  const dispatch = useDispatch()
  // const announcements = useSelector(selectAnnouncementsPage('HOME'))
  const brand = useSelector(selectBrand)
  const { has_deals } = brand
  const { home } = useSelector(selectConfig)
  const { background, mobile, content } = home
  const hasContent = !!(content && content.length && content[0].length)
  const hasPageContent = hasContent || has_deals

  useEffect(() => {
    dispatch(closeModal())
  }, [dispatch])

  useEffect(() => {
    dispatch(fetchAnnouncementPage('HOME'))
  }, [dispatch])

  return (
    <>
      <Helmet>
        <title>{brand.title}</title>
      </Helmet>
      <Content>
        <HeaderSite />
        <Main style={{ paddingTop: '0' }}>
          <HeroSite imageUrl={isBrowser ? background : mobile} />
          {hasPageContent && (
            <PageContainer>
              {has_deals && <DealsSection />}
              {hasContent && (
                <GuestContent hasDeals={has_deals}>
                  {content.map((i, index) => (
                    <p key={index}>{i}</p>
                  ))}
                </GuestContent>
              )}
            </PageContainer>
          )}
        </Main>
      </Content>
    </>
  )
}

Guest.displayName = 'Guest'
export default Guest
